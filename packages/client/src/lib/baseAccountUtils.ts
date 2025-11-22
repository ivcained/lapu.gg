/**
 * Base Account Utilities
 *
 * Helper functions for interacting with Base Account features:
 * - Batch transactions (EIP-5792)
 * - Paymaster capabilities for gasless transactions
 * - Wallet capabilities checking
 */

import { type WalletClient, type Hash, type Address, type Hex } from "viem";
import { BASE_ACCOUNT_CONFIG } from "./baseAccountConfig";

/**
 * Call data for batch transactions
 */
export type Call = {
  to: Address;
  data?: Hex;
  value?: bigint;
};

/**
 * Wallet capabilities response
 * Based on EIP-5792
 */
export type WalletCapabilities = {
  [chainId: string]: {
    paymasterService?: {
      supported: boolean;
    };
    atomicBatch?: {
      supported: boolean;
    };
  };
};

/**
 * Get wallet capabilities using EIP-5792
 * Checks if the wallet supports paymaster and batch transactions
 */
export async function getWalletCapabilities(
  walletClient: WalletClient,
  account: Address
): Promise<WalletCapabilities> {
  try {
    const capabilities = await walletClient.request({
      method: "wallet_getCapabilities",
      params: [account],
    });
    return capabilities as WalletCapabilities;
  } catch (error) {
    console.warn("[Base Account]: Failed to get wallet capabilities", error);
    return {};
  }
}

/**
 * Check if the wallet supports paymaster on a specific chain
 */
export function supportsPaymaster(
  capabilities: WalletCapabilities,
  chainId: number
): boolean {
  const chainCapabilities = capabilities[chainId.toString()];
  return chainCapabilities?.paymasterService?.supported ?? false;
}

/**
 * Check if the wallet supports atomic batch transactions
 */
export function supportsAtomicBatch(
  capabilities: WalletCapabilities,
  chainId: number
): boolean {
  const chainCapabilities = capabilities[chainId.toString()];
  return chainCapabilities?.atomicBatch?.supported ?? false;
}

/**
 * Send batch transactions using EIP-5792 wallet_sendCalls
 * Optionally includes paymaster capabilities for gasless transactions
 */
export async function sendBatchCalls(
  walletClient: WalletClient,
  params: {
    account: Address;
    calls: Call[];
    chainId: number;
    capabilities?: WalletCapabilities;
    usePaymaster?: boolean;
  }
): Promise<Hash> {
  const {
    account,
    calls,
    chainId,
    capabilities,
    usePaymaster = false,
  } = params;

  // Prepare the calls
  const formattedCalls = calls.map((call) => ({
    to: call.to,
    data: call.data,
    value: call.value ? `0x${call.value.toString(16)}` : undefined,
  }));

  // Check if paymaster should be used
  const shouldUsePaymaster =
    usePaymaster &&
    BASE_ACCOUNT_CONFIG.usePaymaster &&
    capabilities &&
    supportsPaymaster(capabilities, chainId);

  // Prepare capabilities parameter
  const callCapabilities = shouldUsePaymaster
    ? {
        paymasterService: {
          url: BASE_ACCOUNT_CONFIG.paymasterUrl,
        },
      }
    : undefined;

  try {
    // Send the batch call using EIP-5792
    // @ts-expect-error - EIP-5792 wallet_sendCalls is not yet in viem's type definitions
    const id = await walletClient.request({
      method: "wallet_sendCalls",
      params: [
        {
          version: "1.0",
          from: account,
          calls: formattedCalls,
          capabilities: callCapabilities,
        },
      ],
    });

    console.log("[Base Account]: Batch transaction sent", {
      id,
      calls: calls.length,
      paymaster: shouldUsePaymaster,
    });

    return id as Hash;
  } catch (error) {
    console.error("[Base Account]: Failed to send batch calls", error);
    throw error;
  }
}

/**
 * Get the status of a batch call
 * Uses wallet_getCallsStatus to check the status
 */
export async function getBatchCallStatus(
  walletClient: WalletClient,
  batchId: Hash
): Promise<{
  status: "PENDING" | "CONFIRMED" | "FAILED";
  receipts?: Array<{
    logs: Array<{ address: Address; topics: Hex[]; data: Hex }>;
    status: "success" | "reverted";
    blockHash: Hash;
    blockNumber: bigint;
    gasUsed: bigint;
    transactionHash: Hash;
  }>;
}> {
  try {
    const status = await walletClient.request({
      method: "wallet_getCallsStatus",
      params: [batchId],
    });
    return status as any;
  } catch (error) {
    console.error("[Base Account]: Failed to get batch call status", error);
    throw error;
  }
}

/**
 * Wait for a batch transaction to be confirmed
 */
export async function waitForBatchTransaction(
  walletClient: WalletClient,
  batchId: Hash,
  options: {
    timeout?: number;
    pollingInterval?: number;
  } = {}
): Promise<void> {
  const { timeout = 30000, pollingInterval = 1000 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const status = await getBatchCallStatus(walletClient, batchId);

      if (status.status === "CONFIRMED") {
        console.log("[Base Account]: Batch transaction confirmed", batchId);
        return;
      }

      if (status.status === "FAILED") {
        throw new Error("Batch transaction failed");
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    } catch (error) {
      console.error(
        "[Base Account]: Error waiting for batch transaction",
        error
      );
      throw error;
    }
  }

  throw new Error("Batch transaction timeout");
}

/**
 * Helper to batch multiple contract writes
 * Useful for batching system calls in MUD
 */
export async function batchContractWrites(
  walletClient: WalletClient,
  params: {
    account: Address;
    chainId: number;
    writes: Array<{
      address: Address;
      abi: any;
      functionName: string;
      args?: any[];
      value?: bigint;
    }>;
    usePaymaster?: boolean;
  }
): Promise<Hash> {
  const { account, chainId, writes, usePaymaster = false } = params;

  // Get wallet capabilities
  const capabilities = await getWalletCapabilities(walletClient, account);

  // Check if batch transactions are supported
  if (!supportsAtomicBatch(capabilities, chainId)) {
    throw new Error("Wallet does not support atomic batch transactions");
  }

  // Encode the contract calls
  const calls: Call[] = writes.map((write) => {
    // Encode function data
    const { encodeFunctionData } = require("viem");
    const data = encodeFunctionData({
      abi: write.abi,
      functionName: write.functionName,
      args: write.args || [],
    });

    return {
      to: write.address,
      data,
      value: write.value,
    };
  });

  // Send batch calls
  return sendBatchCalls(walletClient, {
    account,
    calls,
    chainId,
    capabilities,
    usePaymaster,
  });
}
