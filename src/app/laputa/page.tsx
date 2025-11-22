"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/Button";

// Dynamic import to avoid SSR issues with Three.js
const LaputaGame = dynamic(() => import("~/components/game/LaputaGame"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Loading Laputa Game...</p>
      </div>
    </div>
  ),
});

/**
 * Laputa Game Page
 *
 * Full-screen game experience with navigation and 3D floating cities
 */
export default function LaputaPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          ⛰️ Laputa: Floating Cities
        </h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Game Container */}
      <div className="flex-1 p-4">
        <LaputaGame />
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-black/30 backdrop-blur-sm text-center">
        <p className="text-sm text-gray-300">
          🎮 Use navigation buttons to explore different islands • Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}
