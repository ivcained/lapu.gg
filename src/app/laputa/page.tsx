"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, Cloud } from "lucide-react";
import { Button } from "~/components/ui/Button";

// Dynamic import to avoid SSR issues with Three.js
const LaputaGame = dynamic(() => import("~/components/game/LaputaGame"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-sky-200 text-blue-600 font-sans">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-white rounded-full animate-spin mx-auto"></div>
        <p className="text-xl font-bold animate-bounce">Ascending to the Skies...</p>
      </div>
    </div>
  ),
});

/**
 * Laputa: Floating Worlds
 * 
 * A serene, multiplayer sky-building experience.
 */
export default function LaputaPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-white overflow-hidden font-sans selection:bg-blue-200 selection:text-blue-800">

      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Button
            onClick={() => router.back()}
            className="bg-white/80 hover:bg-white text-blue-600 border border-blue-200 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 rounded-full px-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Earth
          </Button>
        </div>

        <div className="flex items-center gap-2 text-blue-600/80 font-bold bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
          <Cloud className="h-5 w-5" />
          <span>LAPUTA NETWORK ONLINE</span>
        </div>
      </div>

      {/* Game Container */}
      <div className="absolute inset-0 z-0">
        <LaputaGame />
      </div>
    </div>
  );
}
