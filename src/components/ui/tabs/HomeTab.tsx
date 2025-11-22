"use client";

import { useEffect, useState } from "react";
import { useMiniApp } from "@neynar/react";
import { useNeynarUser } from "~/hooks/useNeynarUser";
import { Button } from "../Button";
import { Sparkles, Mountain } from "lucide-react";
import { useRouter } from "next/navigation";
import sdk from "@farcaster/miniapp-sdk";

/**
 * HomeTab component displays the main squat tracking interface.
 *
 * Features:
 * - Beautiful sporty UI with animated squat figure
 * - User stats (total squats, jsqt points, rank)
 * - "Squat Off" button to start tracking
 * - Leaderboard preview
 */
export function HomeTab() {
  const miniApp = useMiniApp();
  const { context } = miniApp;
  const { user: neynarUser } = useNeynarUser(context || undefined);
  const router = useRouter();

  const [userStats, setUserStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user stats and leaderboard
  useEffect(() => {
    async function fetchData() {
      if (!context?.user?.fid) {
        setLoading(false);
        return;
      }

      try {
        const [statsRes, leaderboardRes] = await Promise.all([
          fetch(`/api/squats/user/${context.user.fid}`),
          fetch("/api/squats/leaderboard?limit=10"),
        ]);

        const statsData = await statsRes.json();
        const leaderboardData = await leaderboardRes.json();

        setUserStats(statsData);
        setLeaderboard(leaderboardData.leaderboard || []);
      } catch (error) {
        console.error("Error fetching squat data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [context?.user?.fid]);

  const handleSquatOff = () => {
    if (!context?.user?.fid || !neynarUser) {
      alert("Please wait for user data to load");
      return;
    }

    // Navigate to squat tracking page in same window
    const squatUrl = `/squat?fid=${
      context.user.fid
    }&username=${encodeURIComponent(neynarUser.username)}`;
    router.push(squatUrl);
  };

  const handleJoinClub = async () => {
    // Open the /jessesquats channel in external browser (SDK required for external URLs)
    const channelUrl = "https://farcaster.xyz/~/channel/jessesquats";

    try {
      await sdk.actions.openUrl(channelUrl);
    } catch (error) {
      console.error("Failed to open channel:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p>Loading your stats...</p>
        </div>
      </div>
    );
  }

  const stats = userStats?.stats;
  const rank = userStats?.rank;

  return (
    <div className="flex flex-col items-center px-4 py-6 min-h-screen overflow-y-auto pb-8">
      {/* Hero Section with Squat Animation */}
      <div className="text-center mb-8">
        <div className="relative w-48 h-48 mx-auto mb-6">
          {/* Animated jesse-alpha image - using CSS animation */}
          <div className="squat-animation">
            <img
              src="/jesse-alpha.png"
              alt="Jesse Squat Animation"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent rounded-full blur-3xl -z-10"></div>
        </div>

        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          JesseSquats
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your squats. Earn jsqt. Dominate the leaderboard.
        </p>
      </div>

      {/* User Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-6">
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 text-center border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-500">
              {stats.totalSquats}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Squats
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 text-center border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.jsqtPoints}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              jsqt Points
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-xl p-4 text-center border border-red-500/20">
            <div className="text-2xl font-bold text-red-500">
              #{rank || "—"}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rank</div>
          </div>
        </div>
      )}

      {/* Join the Channel Button */}
      <div className="w-full max-w-md mb-4">
        <Button
          onClick={handleJoinClub}
          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
        >
          <Sparkles className="h-5 w-5" />
          <span>Join /jessesquats Channel</span>
        </Button>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            Connect with the community
          </span>{" "}
          • Share your progress
        </p>
      </div>

      {/* Laputa Game Button */}
      <div className="w-full max-w-md mb-4">
        <Button
          onClick={() => router.push("/laputa")}
          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
        >
          <Mountain className="h-5 w-5" />
          <span>⛰️ Explore Laputa Cities</span>
        </Button>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            3D Floating Cities Game
          </span>{" "}
          • Navigate between islands
        </p>
      </div>

      {/* Squat Off Button */}
      <Button
        onClick={handleSquatOff}
        className="w-full max-w-md mb-8 h-16 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/50 transition-all duration-300 hover:scale-105"
      >
        💪 Squat Off
      </Button>

      {/* Leaderboard Preview */}
      {leaderboard.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-bold mb-3 text-center">Top Squatters</h3>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((user, index) => (
              <div
                key={user.fid}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                    : index === 1
                    ? "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30"
                    : index === 2
                    ? "bg-gradient-to-r from-orange-700/20 to-orange-800/20 border border-orange-700/30"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? "bg-yellow-500 text-white"
                        : index === 1
                        ? "bg-gray-400 text-white"
                        : index === 2
                        ? "bg-orange-700 text-white"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">@{user.username}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {user.jsqtPoints} jsqt
                    </div>
                  </div>
                </div>
                {index === 0 && <span className="text-2xl">🏆</span>}
                {index === 1 && <span className="text-2xl">🥈</span>}
                {index === 2 && <span className="text-2xl">🥉</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* First time user message */}
      {!stats && (
        <div className="text-center mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Welcome! Tap &quot;Squat Off&quot; to start your first session and
            earn jsqt points!
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes squat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(20px);
          }
        }

        .squat-animation {
          animation: squat 2s ease-in-out infinite;
        }

        .spinner {
          border: 3px solid rgba(255, 107, 53, 0.1);
          border-top-color: #ff6b35;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
