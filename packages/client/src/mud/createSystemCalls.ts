/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { getComponentValue } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   * - Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/react/packages/client/src/mud/setupNetwork.ts#L31).
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/react/packages/client/src/mud/setupNetwork.ts#L39).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs (https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/react/packages/client/src/mud/setupNetwork.ts#L39).
   */
  { worldContract, waitForTransaction, baseAccount }: SetupNetworkResult,
  { Counter }: ClientComponents
) {
  const increment = async () => {
    /*
     * Because IncrementSystem
     * (https://mud.dev/tutorials/walkthrough/minimal-onchain#incrementsystemsol)
     * is in the root namespace, `.increment` can be called directly
     * on the World contract.
     */
    const tx = await worldContract.write.increment();
    await waitForTransaction(tx);
    return getComponentValue(Counter, singletonEntity);
  };

  const mudBuildFacility = async (
    entityTypeId: number = 10,
    x: number = 1,
    y: number = 1,
    z: number = 1,
    yaw: number = 0
  ) => {
    const tx = await worldContract.write.buildFacility([
      entityTypeId,
      x,
      y,
      z,
      yaw,
    ]);
    await waitForTransaction(tx);
  };

  /**
   * Example: Batch multiple facilities using Base Account
   * This demonstrates how to use Base Account's batch transaction feature
   * to build multiple facilities in a single atomic transaction
   *
   * @param facilities - Array of facility configurations to build
   * @param usePaymaster - Whether to use paymaster for gasless transactions
   * @returns The batch transaction ID
   */
  const batchBuildFacilities = async (
    facilities: Array<{
      entityTypeId: number;
      x: number;
      y: number;
      z: number;
      yaw: number;
    }>,
    usePaymaster = false
  ) => {
    if (!baseAccount.isMiniApp) {
      throw new Error(
        "Batch transactions require Base Account (Mini App context)"
      );
    }

    // Import the ABI from the workspace
    const IWorldAbi = (
      await import("../../../../contracts/out/IWorld.sol/IWorld.abi.json")
    ).default;

    // Prepare batch writes
    const writes = facilities.map((facility) => ({
      address: worldContract.address,
      abi: IWorldAbi,
      functionName: "buildFacility",
      args: [
        facility.entityTypeId,
        facility.x,
        facility.y,
        facility.z,
        facility.yaw,
      ],
    }));

    // Send as batch transaction
    const batchId = await baseAccount.batchContractWrites(writes, usePaymaster);

    console.log(
      `[Base Account]: Batched ${facilities.length} facility builds`,
      batchId
    );

    return batchId;
  };

  /**
   * Example: Batch multiple increments
   * Demonstrates batching multiple calls to the increment function
   */
  const batchIncrement = async (count: number, usePaymaster = false) => {
    if (!baseAccount.isMiniApp) {
      throw new Error(
        "Batch transactions require Base Account (Mini App context)"
      );
    }

    const IWorldAbi = (
      await import("../../../../contracts/out/IWorld.sol/IWorld.abi.json")
    ).default;

    // Create array of increment calls
    const writes = Array.from({ length: count }, () => ({
      address: worldContract.address,
      abi: IWorldAbi,
      functionName: "increment",
      args: [],
    }));

    const batchId = await baseAccount.batchContractWrites(writes, usePaymaster);

    console.log(`[Base Account]: Batched ${count} increments`, batchId);

    return batchId;
  };

  return {
    increment,
    mudBuildFacility,
    // Base Account batch functions
    batchBuildFacilities,
    batchIncrement,
  };
}
