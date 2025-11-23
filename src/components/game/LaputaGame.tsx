"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  Float,
  Sky,
  Cloud,
  Stars,
  Sparkles,
} from "@react-three/drei";
import { useRef, useState, Suspense, useEffect } from "react";
import * as THREE from "three";
import { useMiniApp } from "@neynar/react";
import { Button } from "../ui/Button";
import { Zap, Hammer, MapPin, ArrowUpCircle } from "lucide-react";

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
        meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.15);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
      }

      if (type === "AETHER") {
        meshRef.current.rotation.y += 0.02;
        meshRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
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
        <>
          <mesh>
            <octahedronGeometry args={[0.6, 1]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={1.2}
              transparent
              opacity={0.9}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Sparkles around Aether */}
          <Sparkles
            count={20}
            scale={2}
            size={2}
            speed={0.5}
            color="#00ffff"
            opacity={0.6}
          />
        </>
      ) : (
        <mesh rotation={[Math.random(), Math.random(), Math.random()]}>
          <dodecahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial
            color="#94a3b8"
            roughness={0.8}
            metalness={0.3}
          />
        </mesh>
      )}

      {/* Label on hover */}
      {hovered && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-4 py-2 rounded-full whitespace-nowrap pointer-events-none shadow-xl border-2 border-white/30 backdrop-blur-sm font-bold animate-pulse">
            ✨ Click to Gather {type === "AETHER" ? "Aether" : "Stone"}
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
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Grass Platform with better texturing */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <cylinderGeometry args={[4.5, 3.5, 2.5, 16]} />
        <meshStandardMaterial color="#4ade80" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Grass edge detail */}
      <mesh receiveShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[4.5, 4.5, 0.1, 16]} />
        <meshStandardMaterial color="#22c55e" roughness={0.9} />
      </mesh>

      {/* Rocky Base with more detail */}
      <mesh position={[0, -2.2, 0]}>
        <coneGeometry args={[3.5, 2.5, 12]} />
        <meshStandardMaterial color="#57534e" roughness={1} metalness={0.1} />
      </mesh>

      {/* Floating rocks underneath */}
      <mesh position={[-2, -3.5, 1]} rotation={[0.3, 0.5, 0.2]}>
        <dodecahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#78716c" roughness={1} />
      </mesh>
      <mesh position={[2.5, -3.8, -0.5]} rotation={[0.5, 0.3, 0.4]}>
        <dodecahedronGeometry args={[0.4]} />
        <meshStandardMaterial color="#78716c" roughness={1} />
      </mesh>

      {/* House (Changes with level) */}
      <group position={[0, 0.8, 0]}>
        {/* Base House with better proportions */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[2, 1.2, 2]} />
          <meshStandardMaterial
            color="#fef3c7"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Windows */}
        <mesh position={[0, 0.6, 1.01]} castShadow>
          <boxGeometry args={[0.4, 0.5, 0.05]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0.6, 0.6, 1.01]} castShadow>
          <boxGeometry args={[0.4, 0.5, 0.05]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Roof */}
        <mesh position={[0, 1.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.5, 1.2, 4]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>

        {/* Level 2 Extension */}
        {houseLevel >= 2 && (
          <group position={[1.5, 0, 0]}>
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.6} />
            </mesh>
            <mesh position={[0, 1, 0]} castShadow>
              <coneGeometry args={[0.8, 0.8, 4]} />
              <meshStandardMaterial color="#dc2626" roughness={0.5} />
            </mesh>
          </group>
        )}

        {/* Level 3 Tower */}
        {houseLevel >= 3 && (
          <group position={[-1.5, 1.2, -0.5]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.4, 0.5, 2.5, 12]} />
              <meshStandardMaterial
                color="#cbd5e1"
                roughness={0.4}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <coneGeometry args={[0.6, 1, 12]} />
              <meshStandardMaterial
                color="#3b82f6"
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            {/* Flag */}
            <mesh position={[0, 2.2, 0]}>
              <boxGeometry args={[0.6, 0.4, 0.05]} />
              <meshStandardMaterial color="#ef4444" side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}
      </group>

      {/* Enhanced Trees */}
      <group position={[-2.5, 0.8, 1.5]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1, 0]}>
          <coneGeometry args={[0.5, 0.8, 8]} />
          <meshStandardMaterial color="#166534" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <coneGeometry args={[0.4, 0.6, 8]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
      </group>

      <group position={[2.8, 0.8, 0.8]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1, 0]}>
          <coneGeometry args={[0.5, 0.8, 8]} />
          <meshStandardMaterial color="#166534" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <coneGeometry args={[0.4, 0.6, 8]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
      </group>

      {/* Flowers */}
      <mesh position={[1.5, 0.8, 1.5]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#f472b6"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-1.2, 0.8, 1.8]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
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
      groupRef.current.position.y =
        neighbor.position[1] +
        Math.sin(state.clock.elapsedTime * 0.5 + neighbor.fid) * 0.6;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={neighbor.position}>
      {/* Distant Island Mesh */}
      <mesh>
        <cylinderGeometry args={[2.5, 1.5, 1.5, 8]} />
        <meshStandardMaterial
          color={neighbor.color}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Small house on neighbor island */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.6, 0.5, 4]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Username Label */}
      <Html position={[0, 3, 0]} center distanceFactor={15}>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white border-3 border-blue-500 overflow-hidden mb-2 shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm shadow-lg font-bold border-2 border-white/30">
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
      <PerspectiveCamera makeDefault position={[0, 6, 12]} />
      <OrbitControls
        minDistance={6}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2 - 0.1}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Enhanced Environment */}
      <Sky
        sunPosition={[100, 20, 100]}
        turbidity={0.3}
        rayleigh={0.8}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Atmospheric lighting */}
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#a5f3fc" />
      <hemisphereLight intensity={0.5} color="#87ceeb" groundColor="#8b7355" />

      {/* Clouds */}
      <Cloud opacity={0.4} speed={0.3} position={[-8, 12, -15]} />
      <Cloud opacity={0.3} speed={0.25} position={[12, 8, -20]} />
      <Cloud opacity={0.35} speed={0.2} position={[5, 15, -25]} />

      {/* Main Island */}
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.3}>
        <SkyIsland houseLevel={gameState.buildings.houseLevel} />

        {/* Resources with better positioning */}
        <ResourceNode
          type="AETHER"
          position={[2.5, 1.5, 0.5]}
          onClick={() => onGather("AETHER")}
        />
        <ResourceNode
          type="STONE"
          position={[-2, 0.8, -1.5]}
          onClick={() => onGather("STONE")}
        />
        <ResourceNode
          type="AETHER"
          position={[0, 1.2, 2.5]}
          onClick={() => onGather("AETHER")}
        />
      </Float>

      {/* Neighbors */}
      {MOCK_NEIGHBORS.map((neighbor) => (
        <NeighborIsland key={neighbor.fid} neighbor={neighbor} />
      ))}

      {/* Fog for depth */}
      <fog attach="fog" args={["#e0f2fe", 15, 50]} />
    </>
  );
}

/**
 * Main Game Component
 */
export default function LaputaGame() {
  const { context } = useMiniApp();
  const [gameState, setGameState] = useState<GameState>({
    resources: { aether: 0, stone: 0 },
    buildings: { houseLevel: 1, crystalLevel: 1 },
  });
  const [notification, setNotification] = useState<{
    text: string;
    id: number;
  } | null>(null);

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
        aether:
          type === "AETHER"
            ? prev.resources.aether + amount
            : prev.resources.aether,
        stone:
          type === "STONE"
            ? prev.resources.stone + amount
            : prev.resources.stone,
      },
    }));
    showNotification(
      `+${amount} ${type === "AETHER" ? "✨ Aether" : "🪨 Stone"}`
    );
  };

  const handleUpgradeHouse = () => {
    const cost = gameState.buildings.houseLevel * 50;
    if (gameState.resources.stone >= cost) {
      setGameState((prev) => ({
        ...prev,
        resources: { ...prev.resources, stone: prev.resources.stone - cost },
        buildings: {
          ...prev.buildings,
          houseLevel: prev.buildings.houseLevel + 1,
        },
      }));
      showNotification("🏠 House Upgraded!");
    } else {
      showNotification("❌ Not enough Stone!");
    }
  };

  const showNotification = (text: string) => {
    setNotification({ text, id: Date.now() });
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="w-full h-full relative">
      <Canvas shadows gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <GameScene gameState={gameState} onGather={handleGather} />
        </Suspense>
      </Canvas>

      {/* Enhanced HUD */}
      <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
        {/* Top Bar: Resources */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            {/* Aether Resource */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-2xl border-2 border-cyan-200/50 transform transition-all hover:scale-105">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2.5 rounded-xl shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-cyan-700 font-bold uppercase tracking-wider">
                  Aether
                </p>
                <p className="text-2xl font-black text-cyan-900">
                  {gameState.resources.aether}
                </p>
                <p className="text-xs text-cyan-600 font-semibold">
                  +{gameState.buildings.crystalLevel}/2s
                </p>
              </div>
            </div>

            {/* Stone Resource */}
            <div className="bg-gradient-to-br from-stone-50 to-slate-50 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-2xl border-2 border-stone-200/50 transform transition-all hover:scale-105">
              <div className="bg-gradient-to-br from-stone-400 to-slate-600 p-2.5 rounded-xl shadow-lg">
                <Hammer className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-stone-700 font-bold uppercase tracking-wider">
                  Stone
                </p>
                <p className="text-2xl font-black text-stone-900">
                  {gameState.resources.stone}
                </p>
                <p className="text-xs text-stone-600 font-semibold">
                  Building Material
                </p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-gradient-to-br from-white to-blue-50 backdrop-blur-xl rounded-full pl-3 pr-5 py-2.5 flex items-center gap-3 shadow-2xl border-2 border-blue-200/50">
            {context?.user?.pfpUrl ? (
              <img
                src={context.user.pfpUrl}
                alt="pfp"
                className="w-10 h-10 rounded-full border-3 border-blue-400 shadow-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg" />
            )}
            <div>
              <span className="font-black text-slate-800 text-sm">
                @{context?.user?.username || "Guest"}
              </span>
              <p className="text-xs text-blue-600 font-semibold">
                Level {gameState.buildings.houseLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Actions */}
        <div className="flex justify-center gap-4 pointer-events-auto pb-8">
          <Button
            onClick={handleUpgradeHouse}
            className="bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-blue-100 text-slate-800 border-3 border-blue-300 shadow-2xl rounded-2xl h-auto py-4 px-8 flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-300/50 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <ArrowUpCircle className="h-6 w-6 text-white" />
              </div>
              <span className="font-black text-lg">Upgrade House</span>
            </div>
            <span className="text-sm text-slate-600 font-bold bg-blue-100 px-3 py-1 rounded-full">
              💎 {gameState.buildings.houseLevel * 50} Stone
            </span>
          </Button>

          <Button className="bg-gradient-to-br from-white to-purple-50 hover:from-purple-50 hover:to-purple-100 text-slate-800 border-3 border-purple-300 shadow-2xl rounded-2xl h-auto py-4 px-8 flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-purple-300/50 group">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="font-black text-lg">Visit Neighbor</span>
            </div>
            <span className="text-sm text-slate-600 font-bold bg-purple-100 px-3 py-1 rounded-full">
              👥 {MOCK_NEIGHBORS.length} Online
            </span>
          </Button>
        </div>
      </div>

      {/* Enhanced Notification Toast */}
      {notification && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-white/50 backdrop-blur-sm animate-bounce">
            <p className="text-2xl font-black drop-shadow-lg">
              {notification.text}
            </p>
          </div>
        </div>
      )}

      {/* Ambient Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-ping opacity-30"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-30"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-30"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        />
      </div>
    </div>
  );
}


