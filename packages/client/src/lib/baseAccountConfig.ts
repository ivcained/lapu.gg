/**
 * Base Account Configuration
 *
 * This file contains configuration for Base Account integration,
 * including app metadata and paymaster settings.
 */

import { base } from "viem/chains";

/**
 * App metadata for Base Account
 * Used to identify the app in the Base Account UI
 */
export const APP_METADATA = {
  name: "Lapu.gg",
  description: "Onchain game powered by MUD and Base",
  iconImageUrl: "https://lapu.gg/icon.png", // Update with your actual icon URL
  url: "https://lapu.gg", // Update with your actual app URL
};

/**
 * Base Account configuration
 */
export const BASE_ACCOUNT_CONFIG = {
  /**
   * Supported chains for Base Account
   * Base Account primarily works on Base mainnet
   */
  supportedChains: [base],

  /**
   * Paymaster configuration
   * Set your Coinbase Developer Platform API key here to enable gasless transactions
   * Get your key from: https://docs.cdp.coinbase.com/paymaster/introduction/welcome
   */
  paymasterUrl: process.env.VITE_PAYMASTER_URL || "",

  /**
   * Whether to use paymaster for gasless transactions
   * Set to true to sponsor gas fees for your users
   */
  usePaymaster: Boolean(process.env.VITE_PAYMASTER_URL),
} as const;

/**
 * Helper to check if we're on a Base Account supported chain
 */
export function isSupportedChain(chainId: number): boolean {
  return BASE_ACCOUNT_CONFIG.supportedChains.some(
    (chain) => chain.id === chainId
  );
}
