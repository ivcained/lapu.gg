import { useEffect, useState } from "react";
import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import { ResourceIcons } from "../../game/data/resources";
import { HiTicket } from "react-icons/hi";

export function ResourcePanel() {
  const {
    components: { PlayerResources },
    systemCalls: { claimIncome, getPendingIncome, initializePlayer },
    network: { playerEntity, walletClient },
  } = useMUD();

  const [pendingIncome, setPendingIncome] = useState<bigint>(0n);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const playerResources = useComponentValue(PlayerResources, playerEntity);
  const playerAddress = walletClient?.account?.address;

  // Poll for pending income every 10 seconds
  useEffect(() => {
    if (!playerAddress) return;

    const updatePendingIncome = async () => {
      try {
        const pending = await getPendingIncome(playerAddress);
        setPendingIncome(pending as bigint);
      } catch (error) {
        console.error("Error fetching pending income:", error);
      }
    };

    updatePendingIncome();
    const interval = setInterval(updatePendingIncome, 10000);

    return () => clearInterval(interval);
  }, [playerAddress, getPendingIncome]);

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      await claimIncome();
      setPendingIncome(0n);
    } catch (error) {
      console.error("Error claiming income:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializePlayer();
    } catch (error) {
      console.error("Error initializing player:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  const coins = playerResources?.coins || 0n;
  const isInitialized = playerResources?.coins !== undefined && playerResources?.lastClaimTime !== undefined;

  return (
    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg min-w-[250px]">
      <div className="flex flex-col gap-3">
        {/* Coin Balance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiTicket className="text-yellow-400 text-xl" />
            <span className="font-bold">Lapu Coins</span>
          </div>
          <span className="text-xl font-bold text-yellow-400">
            {coins.toLocaleString()}
          </span>
        </div>

        {/* Pending Income */}
        {isInitialized && pendingIncome > 0n && (
          <div className="border-t border-white/20 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">Pending Income:</span>
              <span className="text-lg font-semibold text-green-400">
                +{pendingIncome.toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
            >
              {isClaiming ? "Claiming..." : "Claim Income"}
            </button>
          </div>
        )}

        {/* Initialize Player Button (if not initialized) */}
        {!isInitialized && (
          <div className="border-t border-white/20 pt-3">
            <p className="text-sm text-white/70 mb-2">Start building your city!</p>
            <button
              onClick={handleInitialize}
              disabled={isInitializing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
            >
              {isInitializing ? "Starting..." : "Start Playing"}
            </button>
          </div>
        )}

        {/* Income Info */}
        {isInitialized && (
          <div className="border-t border-white/20 pt-3 text-xs text-white/60">
            <p>Earn coins from facilities every hour</p>
            <p>Base income: 10 coins/hour</p>
          </div>
        )}
      </div>
    </div>
  );
}
