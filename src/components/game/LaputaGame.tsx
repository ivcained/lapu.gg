"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  Float,
  Text,
  useTexture,
  Sky,
  Cloud,
  Stars,
} from "@react-three/drei";
import { useRef, useState, Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useMiniApp } from "@neynar/react";
import { Button } from "../ui/Button";
import { Zap, Hammer, Users, MapPin, Plus, ArrowUpCircle } from "lucide-react";

// --- Types ---
type ResourceType = "AETHER" | "STONE";

interface GameState {
  resources: {
    aether: number;
    stone: number;
  };
  buildings: {
    houseLevel: number;
    crystalLevel: number;
  };
}

interface Neighbor {
  fid: number;
  username: string;
  position: [number, number, number];
  color: string;
}

// --- Mock Data ---
const MOCK_NEIGHBORS: Neighbor[] = [
  { fid: 1, username: "dwr.eth", position: [-15, 2, -10], color: "#ff8888" },
  { fid: 2, username: "v", position: [15, -3, -12], color: "#88ff88" },
  { fid: 3, username: "horsefacts", position: [0, 8, -20], color: "#8888ff" },
];

// --- Components ---

/**
 * ResourceNode: Interactive object to gather resources
 */
function ResourceNode({
  type,
  position,
  onClick,
}: {
  type: ResourceType;
  position: [number, number, number];
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }

      if (type === "AETHER") {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      }
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {type === "AETHER" ? (
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      ) : (
        <mesh rotation={[Math.random(), Math.random(), Math.random()]}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#888888" roughness={0.9} />
        </mesh>
      )}

      {/* Label on hover */}
      {hovered && (
        <Html position={[0, 1, 0]} center>
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap pointer-events-none">
            Click to Gather {type === "AETHER" ? "Aether" : "Stone"}
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * SkyIsland: The player's main base
 */
function SkyIsland({ houseLevel }: { houseLevel: number }) {
  return (
    <group>
      {/* Main Grass Platform */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <cylinderGeometry args={[4, 3, 2, 8]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>

      {/* Rocky Base */}
      <mesh position={[0, -2, 0]}>
        <coneGeometry args={[3, 2, 8]} />
        <meshStandardMaterial color="#57534e" roughness={1} />
      </mesh>

      {/* House (Changes with level) */}
      <group position={[0, 0.5, 0]}>
        {/* Base House */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 1, 1.5]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <coneGeometry args={[1.2, 1, 4]} rotation={[0, Math.PI / 4, 0]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>

        {/* Level 2 Extension */}
        {houseLevel >= 2 && (
          <mesh position={[1, 0.25, 0]} castShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
        )}

        {/* Level 3 Tower */}
        {houseLevel >= 3 && (
          <group position={[-1, 1, -0.5]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <coneGeometry args={[0.5, 0.8, 8]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
          </group>
        )}
      </group>

      {/* Decor: Trees */}
      <group position={[-2, 0.5, 1]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 0.5]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <dodecahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#166534" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * NeighborIsland: Represents other players in the distance
 */
function NeighborIsland({ neighbor }: { neighbor: Neighbor }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = neighbor.position[1] + Math.sin(state.clock.elapsedTime + neighbor.fid) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={neighbor.position}>
      {/* Distant Island Mesh */}
      <mesh>
        <cylinderGeometry args={[2, 1, 1, 6]} />
        <meshStandardMaterial color={neighbor.color} />
      </mesh>

      {/* Username Label */}
      <Html position={[0, 2, 0]} center distanceFactor={15}>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-500 overflow-hidden mb-1">
            {/* Placeholder Avatar */}
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400" />
          </div>
          <div className="bg-black/50 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">
            @{neighbor.username}
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * GameScene: The main 3D environment
 */
function GameScene({
  gameState,
  onGather,
}: {
  gameState: GameState;
  onGather: (type: ResourceType) => void;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <OrbitControls minDistance={5} maxDistance={20} maxPolarAngle={Math.PI / 2 - 0.1} />

      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 10, -10]} />
      <Cloud opacity={0.3} speed={0.3} width={10} depth={1.5} segments={20} position={[10, 5, -15]} />

      {/* Main Island */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <SkyIsland houseLevel={gameState.buildings.houseLevel} />

        {/* Resources */}
        <ResourceNode type="AETHER" position={[2, 1, 0]} onClick={() => onGather("AETHER")} />
        <ResourceNode type="STONE" position={[-1.5, 0.5, -1.5]} onClick={() => onGather("STONE")} />
      </Float>

      {/* Neighbors */}
      {MOCK_NEIGHBORS.map((neighbor) => (
        <NeighborIsland key={neighbor.fid} neighbor={neighbor} />
      ))}
    </>
  );
}

/**
 * Main Game Component
 */
export default function LaputaGame() {
  const { user } = useMiniApp(); // Get Farcaster User
  const [gameState, setGameState] = useState<GameState>({
    resources: { aether: 0, stone: 0 },
    buildings: { houseLevel: 1, crystalLevel: 1 },
  });
  const [notification, setNotification] = useState<{ text: string; id: number } | null>(null);

  // Passive Resource Generation
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        resources: {
          ...prev.resources,
          aether: prev.resources.aether + prev.buildings.crystalLevel,
        },
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Actions
  const handleGather = (type: ResourceType) => {
    const amount = type === "AETHER" ? 5 : 3;
    setGameState((prev) => ({
      ...prev,
      resources: {
        ...prev.resources,
        aether: type === "AETHER" ? prev.resources.aether + amount : prev.resources.aether,
        stone: type === "STONE" ? prev.resources.stone + amount : prev.resources.stone,
      },
    }));
    showNotification(`+${amount} ${type === "AETHER" ? "Aether" : "Stone"}`);
  };

  const handleUpgradeHouse = () => {
    const cost = gameState.buildings.houseLevel * 50;
    if (gameState.resources.stone >= cost) {
      setGameState((prev) => ({
        ...prev,
        resources: { ...prev.resources, stone: prev.resources.stone - cost },
        buildings: { ...prev.buildings, houseLevel: prev.buildings.houseLevel + 1 },
      }));
      showNotification("House Upgraded!");
    } else {
      showNotification("Not enough Stone!");
    }
  };

  const showNotification = (text: string) => {
    setNotification({ text, id: Date.now() });
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="w-full h-full relative">
      <Canvas shadows gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <GameScene gameState={gameState} onGather={handleGather} />
        </Suspense>
      </Canvas>

      {/* HUD */}
      <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
        {/* Top Bar: Resources */}
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 shadow-lg border border-blue-100">
              <div className="bg-cyan-100 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Aether</p>
                <p className="text-xl font-black text-slate-800">{gameState.resources.aether}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 shadow-lg border border-blue-100">
              <div className="bg-stone-200 p-2 rounded-lg">
                <Hammer className="h-5 w-5 text-stone-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Stone</p>
                <p className="text-xl font-black text-slate-800">{gameState.resources.stone}</p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-white/80 backdrop-blur-md rounded-full pl-2 pr-4 py-2 flex items-center gap-3 shadow-lg border border-blue-100">
            {user?.pfpUrl ? (
              <img src={user.pfpUrl} alt="pfp" className="w-8 h-8 rounded-full border-2 border-blue-400" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-400" />
            )}
            <span className="font-bold text-slate-700">@{user?.username || "Guest"}</span>
          </div>
        </div>

        {/* Bottom Bar: Actions */}
        <div className="flex justify-center gap-4 pointer-events-auto pb-6">
          <Button
            onClick={handleUpgradeHouse}
            className="bg-white hover:bg-blue-50 text-slate-700 border-2 border-blue-200 shadow-xl rounded-2xl h-auto py-3 px-6 flex flex-col items-center gap-1 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-blue-500" />
              <span className="font-bold">Upgrade House</span>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Cost: {gameState.buildings.houseLevel * 50} Stone
            </span>
          </Button>

          <Button
            className="bg-white hover:bg-purple-50 text-slate-700 border-2 border-purple-200 shadow-xl rounded-2xl h-auto py-3 px-6 flex flex-col items-center gap-1 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              <span className="font-bold">Visit Neighbor</span>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              {MOCK_NEIGHBORS.length} Online
            </span>
          </Button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border-2 border-yellow-300 animate-bounce">
            <p className="text-lg font-bold text-slate-800">{notification.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}
