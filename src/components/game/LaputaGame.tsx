"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  Stars,
  Float,
  Text,
  MeshTransmissionMaterial,
  Trail,
} from "@react-three/drei";
import { useRef, useState, Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Button } from "../ui/Button";
import { Play, Pause, RotateCcw, Zap, Activity, Cpu, ShieldCheck } from "lucide-react";

// --- Game Constants ---
const TOTAL_LEVELS = 5;
const INITIAL_TIME = 60;

// --- Types ---
type GameState = "MENU" | "PLAYING" | "PAUSED" | "COMPLETED" | "GAMEOVER";

interface UplinkNodeProps {
  position: [number, number, number];
  isActive: boolean;
  onActivate: () => void;
}

// --- Components ---

/**
 * UplinkNode: The interactive target the player must click.
 */
function UplinkNode({ position, isActive, onActivate }: UplinkNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse animation
      const scale = hovered ? 1.2 : 1;
      const pulse = isActive ? 1 : Math.sin(state.clock.elapsedTime * 5) * 0.1 + 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale * pulse, scale * pulse, scale * pulse), 0.1);

      // Rotation
      meshRef.current.rotation.x += 0.02;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          if (!isActive) onActivate();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={isActive ? "#00ffff" : "#ff0055"}
          emissive={isActive ? "#00ffff" : "#ff0055"}
          emissiveIntensity={isActive ? 2 : 0.5}
          toneMapped={false}
        />
      </mesh>
      {/* Connection Line to center */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, -position[0], -position[1], -position[2]])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={isActive ? "#00ffff" : "#330011"} transparent opacity={0.3} />
      </line>
    </group>
  );
}

/**
 * DataCluster: The central procedural object representing a level.
 */
function DataCluster({
  level,
  nodes,
  activeNodes,
  onNodeActivate,
}: {
  level: number;
  nodes: [number, number, number][];
  activeNodes: boolean[];
  onNodeActivate: (index: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation of the entire cluster
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  // Procedural geometry based on level
  const CoreGeometry = useMemo(() => {
    if (level % 3 === 0) return <icosahedronGeometry args={[1.5, 0]} />;
    if (level % 3 === 1) return <dodecahedronGeometry args={[1.5, 0]} />;
    return <octahedronGeometry args={[1.5, 0]} />;
  }, [level]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Central Core */}
        <mesh>
          {CoreGeometry}
          <meshPhysicalMaterial
            color="#000000"
            roughness={0.2}
            metalness={1}
            emissive="#001133"
            emissiveIntensity={0.2}
            wireframe
          />
        </mesh>

        {/* Inner Glowing Core */}
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.1} />
        </mesh>

        {/* Orbiting Rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[3, 0.02, 16, 100]} />
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.2} />
        </mesh>

        {/* Interactive Nodes */}
        {nodes.map((pos, idx) => (
          <UplinkNode
            key={idx}
            position={pos}
            isActive={activeNodes[idx]}
            onActivate={() => onNodeActivate(idx)}
          />
        ))}
      </group>
    </Float>
  );
}

/**
 * GameScene: Manages the 3D world.
 */
function GameScene({
  gameState,
  level,
  nodes,
  activeNodes,
  onNodeActivate,
}: {
  gameState: GameState;
  level: number;
  nodes: [number, number, number][];
  activeNodes: boolean[];
  onNodeActivate: (index: number) => void;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={15} autoRotate={gameState === "MENU"} autoRotateSpeed={0.5} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />

      {/* Environment */}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      {/* Game Object */}
      <DataCluster
        level={level}
        nodes={nodes}
        activeNodes={activeNodes}
        onNodeActivate={onNodeActivate}
      />

      {/* Background Grid (Visual only) */}
      <gridHelper args={[50, 50, 0x111111, 0x050505]} position={[0, -5, 0]} />
    </>
  );
}

/**
 * Loading Fallback
 */
function LoadingFallback() {
  return (
    <Html center>
      <div className="text-cyan-500 font-mono text-sm animate-pulse">LOADING ASSETS...</div>
    </Html>
  );
}

/**
 * Main Game Component
 */
export default function LaputaGame() {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>("MENU");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

  // Level Data
  const [nodes, setNodes] = useState<[number, number, number][]>([]);
  const [activeNodes, setActiveNodes] = useState<boolean[]>([]);

  // --- Audio (Simulated) ---
  const playSound = (type: "click" | "success" | "fail") => {
    // In a real app, use Audio API. Here we just log or use visual feedback.
    // console.log(`Audio: ${type}`);
  };

  // --- Game Logic ---

  // Generate Level
  const generateLevel = (lvl: number) => {
    const nodeCount = 3 + lvl; // Increase difficulty
    const newNodes: [number, number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      // Random points on a sphere surface
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const r = 2; // Radius from center

      newNodes.push([
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      ]);
    }
    setNodes(newNodes);
    setActiveNodes(new Array(nodeCount).fill(false));
  };

  // Start Game
  const startGame = () => {
    setGameState("PLAYING");
    setLevel(1);
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    generateLevel(1);
  };

  // Next Level
  const nextLevel = () => {
    if (level >= TOTAL_LEVELS) {
      setGameState("COMPLETED");
    } else {
      setLevel((prev) => prev + 1);
      setTimeLeft((prev) => prev + 15); // Bonus time
      generateLevel(level + 1);
      playSound("success");
    }
  };

  // Node Activation
  const handleNodeActivate = (index: number) => {
    if (gameState !== "PLAYING") return;

    const newActive = [...activeNodes];
    newActive[index] = true;
    setActiveNodes(newActive);
    setScore((prev) => prev + 100);
    playSound("click");

    // Check if level complete
    if (newActive.every((n) => n)) {
      setTimeout(nextLevel, 500); // Delay for effect
    }
  };

  // Timer
  useEffect(() => {
    if (gameState === "PLAYING") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("GAMEOVER");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  // --- UI Components ---

  const MenuOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <div className="text-center space-y-6 p-8 border border-cyan-500/30 bg-black/50 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.2)] max-w-md w-full">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tighter">
          CYBER-LINK
        </h1>
        <p className="text-cyan-100/70 text-sm">
          Synchronize the data nodes before the system crashes.
          <br />
          Click <span className="text-red-400">RED</span> nodes to stabilize them.
        </p>
        <Button
          onClick={startGame}
          className="w-full h-14 text-lg font-bold bg-cyan-600 hover:bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
        >
          <Play className="mr-2 h-5 w-5" /> INITIALIZE LINK
        </Button>
      </div>
    </div>
  );

  const GameOverOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-red-950/80 backdrop-blur-sm z-50">
      <div className="text-center space-y-6 p-8 border border-red-500/30 bg-black/50 rounded-lg">
        <h2 className="text-3xl font-bold text-red-500 tracking-widest">CONNECTION LOST</h2>
        <div className="text-2xl font-mono text-white">SCORE: {score}</div>
        <Button
          onClick={startGame}
          className="w-full h-12 bg-red-600 hover:bg-red-500 text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> REBOOT SYSTEM
        </Button>
      </div>
    </div>
  );

  const CompletedOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-green-950/80 backdrop-blur-sm z-50">
      <div className="text-center space-y-6 p-8 border border-green-500/30 bg-black/50 rounded-lg">
        <h2 className="text-3xl font-bold text-green-400 tracking-widest">SYSTEM SYNCHRONIZED</h2>
        <div className="text-2xl font-mono text-white">FINAL SCORE: {score}</div>
        <Button
          onClick={startGame}
          className="w-full h-12 bg-green-600 hover:bg-green-500 text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> NEW SESSION
        </Button>
      </div>
    </div>
  );

  const HUD = () => (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-40">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-400 bg-black/40 backdrop-blur-md px-4 py-2 rounded border border-cyan-500/20">
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="font-mono text-xl font-bold">{score.toString().padStart(6, "0")}</span>
          </div>
          <div className="text-xs text-cyan-500/50 tracking-widest">DATA INTEGRITY</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded border backdrop-blur-md ${timeLeft < 10 ? "bg-red-900/40 border-red-500/50 text-red-400 animate-pulse" : "bg-black/40 border-cyan-500/20 text-cyan-400"}`}>
            <span className="font-mono text-2xl font-bold">{timeLeft}s</span>
            <Zap className="h-4 w-4" />
          </div>
          <div className="text-xs text-cyan-500/50 tracking-widest">TIME REMAINING</div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2 text-cyan-600/50">
          <Cpu className="h-4 w-4" />
          <span className="text-xs tracking-widest">LEVEL {level} / {TOTAL_LEVELS}</span>
        </div>

        <div className="flex gap-1">
          {/* Progress Indicators */}
          {Array.from({ length: TOTAL_LEVELS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 w-8 rounded-full ${i < level ? "bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-gray-800"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full relative bg-black">
      <Canvas gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
        <Suspense fallback={<LoadingFallback />}>
          <GameScene
            gameState={gameState}
            level={level}
            nodes={nodes}
            activeNodes={activeNodes}
            onNodeActivate={handleNodeActivate}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      {gameState === "MENU" && <MenuOverlay />}
      {gameState === "GAMEOVER" && <GameOverOverlay />}
      {gameState === "COMPLETED" && <CompletedOverlay />}
      {gameState === "PLAYING" && <HUD />}

      {/* Pause Button */}
      {gameState === "PLAYING" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-50">
          <Button
            onClick={() => setGameState("PAUSED")}
            className="rounded-full w-12 h-12 bg-black/40 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/30 backdrop-blur-md"
          >
            <Pause className="h-5 w-5" />
          </Button>
        </div>
      )}

      {gameState === "PAUSED" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <Button
            onClick={() => setGameState("PLAYING")}
            className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-8 py-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <Play className="mr-2 h-5 w-5" /> RESUME
          </Button>
        </div>
      )}
    </div>
  );
}
