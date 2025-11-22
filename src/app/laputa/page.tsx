"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "~/components/ui/Button";

// Dynamic import to avoid SSR issues with Three.js
const LaputaGame = dynamic(() => import("~/components/game/LaputaGame"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-black text-cyan-500 font-mono">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-xl tracking-widest animate-pulse">INITIALIZING NEURAL LINK...</p>
      </div>
    </div>
  ),
});

/**
 * Laputa: Cyber-Link Game Page
 * 
 * A futuristic, immersive 3D experience.
 */
export default function LaputaPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono selection:bg-cyan-500/30 selection:text-cyan-100">
      {/* Background Grid Effect (CSS) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10"></div>

      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Button
            onClick={() => router.back()}
            className="bg-black/40 hover:bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            DISCONNECT
          </Button>
        </div>

        <div className="flex items-center gap-2 text-cyan-500/50 text-xs tracking-[0.2em]">
          <Terminal className="h-3 w-3" />
          <span>SYSTEM.V.2.0.4 // ONLINE</span>
        </div>
      </div>

      {/* Game Container */}
      <div className="absolute inset-0 z-0">
        <LaputaGame />
      </div>

      {/* Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[size:100%_4px]"></div>
    </div>
  );
}
