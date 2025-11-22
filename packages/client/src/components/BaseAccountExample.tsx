/**
 * Base Account Example Component
 *
 * This component demonstrates how to use Base Account features:
 * - Batch transactions
 * - Gasless transactions with paymasters
 * - Wallet capabilities checking
 *
 * Note: This is an example component. You can integrate these patterns
 * into your existing components or remove this file if not needed.
 */

import { useState } from "react";
import { useMUD } from "../useMUD";
import { parseEther } from "viem";
import {
  supportsPaymaster,
  supportsAtomicBatch,
} from "../lib/baseAccountUtils";

export function BaseAccountExample() {
  const {
    network: { baseAccount },
  } = useMUD();

  const [isLoading, setIsLoading] = useState(false);
  const [lastBatchId, setLastBatchId] = useState<string | null>(null);

  // Check wallet capabilities
  const chainId = baseAccount.config.supportedChains[0]?.id ?? 8453; // Base mainnet
  const hasPaymasterSupport = supportsPaymaster(
    baseAccount.capabilities,
    chainId
  );
  const hasBatchSupport = supportsAtomicBatch(
    baseAccount.capabilities,
    chainId
  );

  /**
   * Example: Send a batch of value transfers
   */
  const handleBatchTransfer = async () => {
    if (!hasBatchSupport) {
      alert("Wallet does not support batch transactions");
      return;
    }

    setIsLoading(true);
    try {
      // Example batch: send small amounts to multiple addresses
      const batchId = await baseAccount.sendBatchCalls({
        account: baseAccount.accountAddress,
        chainId,
        calls: [
          {
            to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
            value: parseEther("0.001"),
          },
          {
            to: "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC",
            value: parseEther("0.001"),
          },
        ],
        usePaymaster: hasPaymasterSupport,
      });

      setLastBatchId(batchId);
      console.log("Batch transaction sent:", batchId);
      alert(`Batch transaction sent! ID: ${batchId}`);
    } catch (error) {
      console.error("Failed to send batch transaction:", error);
      alert(
        `Failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Example: Batch multiple contract writes
   * This can be used to batch MUD system calls
   */
  const handleBatchContractWrites = async () => {
    if (!hasBatchSupport) {
      alert("Wallet does not support batch transactions");
      return;
    }

    setIsLoading(true);
    try {
      // Example: Batch multiple system calls
      // Replace with your actual contract ABI and functions
      const batchId = await baseAccount.batchContractWrites(
        [
          {
            address: "0x..." as `0x${string}`, // Your contract address
            abi: [], // Your contract ABI
            functionName: "yourFunction",
            args: ["arg1", "arg2"],
          },
          // Add more contract writes here
        ],
        hasPaymasterSupport // Use paymaster if available
      );

      setLastBatchId(batchId);
      console.log("Batch contract writes sent:", batchId);
      alert(`Batch writes sent! ID: ${batchId}`);
    } catch (error) {
      console.error("Failed to send batch writes:", error);
      alert(
        `Failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gray-800 text-white max-w-md">
      <h2 className="text-xl font-bold mb-4">Base Account Example</h2>

      {/* Status Information */}
      <div className="mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Mini App:</span>
          <span
            className={
              baseAccount.isMiniApp ? "text-green-400" : "text-red-400"
            }
          >
            {baseAccount.isMiniApp ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Batch Support:</span>
          <span className={hasBatchSupport ? "text-green-400" : "text-red-400"}>
            {hasBatchSupport ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Paymaster:</span>
          <span
            className={hasPaymasterSupport ? "text-green-400" : "text-red-400"}
          >
            {hasPaymasterSupport ? "Yes" : "No"}
          </span>
        </div>
        {baseAccount.accountAddress && (
          <div className="flex justify-between">
            <span className="text-gray-400">Account:</span>
            <span className="font-mono text-xs">
              {baseAccount.accountAddress.slice(0, 6)}...
              {baseAccount.accountAddress.slice(-4)}
            </span>
          </div>
        )}
      </div>

      {/* Example Actions */}
      <div className="space-y-2">
        <button
          onClick={handleBatchTransfer}
          disabled={isLoading || !hasBatchSupport}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {isLoading ? "Sending..." : "Send Batch Transfer (Example)"}
        </button>

        <button
          onClick={handleBatchContractWrites}
          disabled={isLoading || !hasBatchSupport}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {isLoading ? "Sending..." : "Batch Contract Writes (Example)"}
        </button>
      </div>

      {/* Last Batch ID */}
      {lastBatchId && (
        <div className="mt-4 p-2 bg-gray-700 rounded text-xs">
          <div className="text-gray-400 mb-1">Last Batch ID:</div>
          <div className="font-mono break-all">{lastBatchId}</div>
        </div>
      )}

      {/* Warning */}
      {!baseAccount.isMiniApp && (
        <div className="mt-4 p-2 bg-yellow-900/50 border border-yellow-700 rounded text-xs">
          ⚠️ Base Account features work best when launched as a Mini App in the
          Base App
        </div>
      )}
    </div>
  );
}
