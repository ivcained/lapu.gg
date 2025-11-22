/*
 * The MUD client code is built on top of viem
 * (https://viem.sh/docs/getting-started.html).
 * This line imports the functions we need from it.
 */
import {
  ContractWrite,
  createBurnerAccount,
  getContract,
  transportObserver,
} from "@latticexyz/common";
import { createFaucetService } from "@latticexyz/services/faucet";
import { encodeEntity, syncToRecs } from "@latticexyz/store-sync/recs";
/*
 * Import our MUD config, which includes strong types for
 * our tables and other config options. We use this to generate
 * things like RECS components and get back strong types for them.
 *
 * See https://mud.dev/tutorials/walkthrough/minimal-onchain#mudconfigts
 * for the source of this information.
 */
import mudConfig from "contracts/mud.config";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";
import { share, Subject } from "rxjs";
import {
  ClientConfig,
  createPublicClient,
  createWalletClient,
  custom,
  fallback,
  Hex,
  http,
  parseEther,
  webSocket,
} from "viem";
import { sdk } from "@farcaster/miniapp-sdk";

import { getNetworkConfig } from "./getNetworkConfig";
import { world } from "./world";
import { isMiniAppSync } from "../farcaster";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {
  const networkConfig = await getNetworkConfig();

  /*
   * Create a viem public (read only) client
   * (https://viem.sh/docs/clients/public.html)
   */
  const clientOptions = {
    chain: networkConfig.chain,
    transport: transportObserver(fallback([webSocket(), http()])),
    pollingInterval: 1000,
  } as const satisfies ClientConfig;

  const publicClient = createPublicClient(clientOptions);

  /*
   * Create a wallet client - uses Farcaster provider in miniapp context,
   * otherwise falls back to burner wallet for development.
   * (see https://viem.sh/docs/clients/wallet.html).
   */
  let walletClient;
  let accountAddress: Hex;

  if (isMiniAppSync()) {
    // Use Farcaster wallet provider in miniapp context
    try {
      const provider = sdk.wallet.getEthereumProvider();
      walletClient = createWalletClient({
        chain: networkConfig.chain,
        transport: custom(provider),
      });
      // Get the connected account address
      const accounts = await walletClient.getAddresses();
      if (accounts.length > 0) {
        accountAddress = accounts[0];
        console.log("[Farcaster]: Connected wallet address ->", accountAddress);
      } else {
        // Fall back to burner wallet if no accounts available
        console.warn("[Farcaster]: No accounts available, falling back to burner wallet");
        const burnerAccount = createBurnerAccount(networkConfig.privateKey as Hex);
        walletClient = createWalletClient({
          ...clientOptions,
          account: burnerAccount,
        });
        accountAddress = burnerAccount.address;
      }
    } catch (error) {
      console.warn("[Farcaster]: Failed to get wallet provider, falling back to burner wallet", error);
      const burnerAccount = createBurnerAccount(networkConfig.privateKey as Hex);
      walletClient = createWalletClient({
        ...clientOptions,
        account: burnerAccount,
      });
      accountAddress = burnerAccount.address;
    }
  } else {
    // Use burner wallet for development
    const burnerAccount = createBurnerAccount(networkConfig.privateKey as Hex);
    walletClient = createWalletClient({
      ...clientOptions,
      account: burnerAccount,
    });
    accountAddress = burnerAccount.address;
  }

  /*
   * Create an observable for contract writes that we can
   * pass into MUD dev tools for transaction observability.
   */
  const write$ = new Subject<ContractWrite>();

  /*
   * Create an object for communicating with the deployed World.
   */
  const worldContract = getContract({
    address: networkConfig.worldAddress as Hex,
    abi: IWorldAbi,
    publicClient,
    walletClient,
    onWrite: (write) => write$.next(write),
  });

  /*
   * Sync on-chain state into RECS and keeps our client in sync.
   * Uses the MUD indexer if available, otherwise falls back
   * to the viem publicClient to make RPC calls to fetch MUD
   * events from the chain.
   */
  const { components, latestBlock$, storedBlockLogs$, waitForTransaction } =
    await syncToRecs({
      world,
      config: mudConfig,
      address: networkConfig.worldAddress as Hex,
      publicClient,
      startBlock: BigInt(networkConfig.initialBlockNumber),
    });

  /*
   * If there is a faucet, request (test) ETH if you have
   * less than 1 ETH. Repeat every 20 seconds to ensure you don't
   * run out.
   */
  if (networkConfig.faucetServiceUrl && !isMiniAppSync()) {
    const address = accountAddress;
    console.info("[Dev Faucet]: Player address -> ", address);

    const faucet = createFaucetService(networkConfig.faucetServiceUrl);

    const requestDrip = async () => {
      const balance = await publicClient.getBalance({ address });
      console.info(`[Dev Faucet]: Player balance -> ${balance}`);
      const lowBalance = balance < parseEther("1");
      if (lowBalance) {
        console.info("[Dev Faucet]: Balance is low, dripping funds to player");
        // Double drip
        await faucet.dripDev({ address });
        await faucet.dripDev({ address });
      }
    };

    requestDrip();
    // Request a drip every 20 seconds
    setInterval(requestDrip, 20000);
  }

  return {
    world,
    components,
    playerEntity: encodeEntity(
      { address: "address" },
      { address: accountAddress }
    ),
    publicClient,
    walletClient,
    latestBlock$,
    storedBlockLogs$,
    waitForTransaction,
    worldContract,
    write$: write$.asObservable().pipe(share()),
  };
}
