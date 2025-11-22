// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { FacilityCost, FacilityIncome } from "../src/codegen/index.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // Initialize facility costs and income rates
    // Note: These values match the client-side entity data

    // Gravity Hill (typeId: 1)
    // Cost: 500 lapu, Produces: gravity
    FacilityCost.set(1, 500);
    FacilityIncome.set(1, 25); // 25 coins per hour (gravity production)
    console.log("Initialized Gravity Hill: cost 500, income 25/hr");

    // Whirly Dynamo (typeId: 2)
    // Cost: 200 lapu, Produces: power
    FacilityCost.set(2, 200);
    FacilityIncome.set(2, 25); // 25 coins per hour (power production)
    console.log("Initialized Whirly Dynamo: cost 200, income 25/hr");

    // Residence (typeId: 3)
    // Cost: 100 lapu, Produces: population
    FacilityCost.set(3, 100);
    FacilityIncome.set(3, 15); // 15 coins per hour (population production)
    console.log("Initialized Residence: cost 100, income 15/hr");

    console.log("Facility costs and income rates initialized successfully!");

    vm.stopBroadcast();
  }
}
