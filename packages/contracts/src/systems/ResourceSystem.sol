// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { System } from "@latticexyz/world/src/System.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";

import { PlayerResources, FacilityIncome, OwnedBy, EntityType, BuiltAt } from "../codegen/index.sol";

contract ResourceSystem is System {
  uint256 constant STARTING_COINS = 1000; // Players start with 1000 coins
  uint256 constant HOURLY_BASE_INCOME = 10; // Base income per hour for players

  /**
   * @dev Initialize a new player with starting resources
   */
  function initializePlayer() public {
    address player = _msgSender();
    require(player != address(0), "Invalid sender address");

    // Only initialize if player hasn't been initialized yet
    if (PlayerResources.getCoins(player) == 0 && PlayerResources.getLastClaimTime(player) == 0) {
      PlayerResources.set(player, STARTING_COINS, block.timestamp);
    }
  }

  /**
   * @dev Claim accumulated resources from all owned facilities
   * @return The amount of coins claimed
   */
  function claimIncome() public returns (uint256) {
    address player = _msgSender();
    require(player != address(0), "Invalid sender address");

    uint256 currentCoins = PlayerResources.getCoins(player);
    uint256 lastClaimTime = PlayerResources.getLastClaimTime(player);

    // Calculate time elapsed since last claim
    uint256 timeElapsed = block.timestamp - lastClaimTime;

    // Calculate base income (hourly rate)
    uint256 baseIncome = (HOURLY_BASE_INCOME * timeElapsed) / 3600;

    // Calculate facility income
    uint256 facilityIncome = calculateFacilityIncome(player, timeElapsed);

    // Total income to claim
    uint256 totalIncome = baseIncome + facilityIncome;

    // Update player resources
    PlayerResources.set(player, currentCoins + totalIncome, block.timestamp);

    return totalIncome;
  }

  /**
   * @dev Calculate total income from all facilities owned by a player
   * @param player The player address
   * @param timeElapsed Time elapsed since last claim in seconds
   * @return Total income from facilities
   */
  function calculateFacilityIncome(address player, uint256 timeElapsed) internal view returns (uint256) {
    // Get all entities owned by the player
    bytes32[] memory ownedEntities = getKeysWithValue(
      OwnedBy._tableId,
      OwnedBy.encodeStatic(player)
    );

    uint256 totalIncome = 0;

    for (uint256 i = 0; i < ownedEntities.length; i++) {
      bytes32 entityKey = ownedEntities[i];
      uint32 typeId = EntityType.get(entityKey);
      uint256 buildTime = BuiltAt.get(entityKey);

      // Only count income from when the facility was built
      uint256 facilityTimeElapsed = timeElapsed;
      if (buildTime > 0 && buildTime > (block.timestamp - timeElapsed)) {
        facilityTimeElapsed = block.timestamp - buildTime;
      }

      // Get income rate for this facility type
      uint256 coinsPerHour = FacilityIncome.get(typeId);

      // Calculate income for this facility
      if (coinsPerHour > 0) {
        totalIncome += (coinsPerHour * facilityTimeElapsed) / 3600;
      }
    }

    return totalIncome;
  }

  /**
   * @dev Get pending income for a player without claiming
   * @param player The player address
   * @return Pending income amount
   */
  function getPendingIncome(address player) public view returns (uint256) {
    uint256 lastClaimTime = PlayerResources.getLastClaimTime(player);
    uint256 timeElapsed = block.timestamp - lastClaimTime;

    uint256 baseIncome = (HOURLY_BASE_INCOME * timeElapsed) / 3600;
    uint256 facilityIncome = calculateFacilityIncome(player, timeElapsed);

    return baseIncome + facilityIncome;
  }

  /**
   * @dev Add coins to a player (admin function for rewards/bonuses)
   * @param player The player to give coins to
   * @param amount Amount of coins to add
   */
  function addCoins(address player, uint256 amount) public {
    require(player != address(0), "Invalid player address");

    uint256 currentCoins = PlayerResources.getCoins(player);
    uint256 lastClaimTime = PlayerResources.getLastClaimTime(player);

    // If player hasn't been initialized, set claim time
    if (lastClaimTime == 0) {
      lastClaimTime = block.timestamp;
    }

    PlayerResources.set(player, currentCoins + amount, lastClaimTime);
  }
}
