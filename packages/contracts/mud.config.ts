import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      valueSchema: "uint32",
    },
    Position: {
      valueSchema: {
        x: "int32",
        y: "int32",
        z: "int32",
      },
    },
    Orientation: {
      valueSchema: {
        yaw: "int32",
      },
    },
    EntityType: {
      valueSchema: {
        typeId: "uint32",
      },
    },
    OwnedBy: {
      valueSchema: {
        owner: "address",
      },
    },
    PlayerResources: {
      keySchema: {
        player: "address",
      },
      valueSchema: {
        coins: "uint256",
        lastClaimTime: "uint256",
      },
    },
    FacilityCost: {
      keySchema: {
        typeId: "uint32",
      },
      valueSchema: {
        coinCost: "uint256",
      },
    },
    FacilityIncome: {
      keySchema: {
        typeId: "uint32",
      },
      valueSchema: {
        coinsPerHour: "uint256",
      },
    },
    BuiltAt: {
      keySchema: {
        entityKey: "bytes32",
      },
      valueSchema: {
        timestamp: "uint256",
      },
    },
  },
  modules: [
    {
      name: "KeysInTableModule",
      root: true,
      args: [resolveTableId("Position")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("Position")],
    },
  ],
});
