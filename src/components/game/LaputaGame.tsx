"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, PerspectiveCamera, Html, Stars, Environment } from "@react-three/drei";
import { useRef, useState, Suspense, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, Zap } from "lucide-react";

/**
 * Particle Cloud system for ambient atmosphere
 */
function ParticleCloud({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = Math.random() * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        positions[i * 3] += particles.velocities[i * 3];
        positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
        positions[i * 3 + 2] += particles.velocities[i * 3 + 2];

        // Wrap particles around
        if (positions[i * 3] > 10) positions[i * 3] = -10;
        if (positions[i * 3] < -10) positions[i * 3] = 10;
        if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = -5;
        if (positions[i * 3 + 2] > 10) positions[i * 3 + 2] = -10;
        if (positions[i * 3 + 2] < -10) positions[i * 3 + 2] = 10;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/**
 * Energy Crystal component - collectible items
 */
function EnergyCrystal({ position, onCollect }: { position: [number, number, number]; onCollect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);

  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += 0.05;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const handleClick = () => {
    if (!collected) {
      setCollected(true);
      onCollect();
    }
  };

  if (collected) return null;

  return (
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial
        color="#ffdd00"
        emissive="#ffaa00"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

/**
 * Floating Island component - represents a Laputa floating city
 */
function FloatingIsland({
  position,
  texture,
  scale = 1,
  isActive = false
}: {
  position: [number, number, number];
  texture: string;
  scale?: number;
  isActive?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Load texture
  const textureMap = useTexture(texture);

  // Animation in game loop with enhanced physics
  useFrame((state) => {
    if (meshRef.current) {
      // Advanced floating animation with sine waves
      const time = state.clock.elapsedTime;
      meshRef.current.position.y =
        position[1] +
        Math.sin(time + position[0]) * 0.2 +
        Math.sin(time * 0.5 + position[0] * 2) * 0.1;

      // Slow rotation with slight wobble
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
      meshRef.current.rotation.z = Math.cos(time * 0.3) * 0.05;

      // Scale on hover or when active
      const targetScale = (hovered || isActive) ? scale * 1.15 : scale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2 * scale, 0.5 * scale, 2 * scale]} />
        <meshStandardMaterial
          map={textureMap}
          emissive={isActive ? "#4488ff" : "#000000"}
          emissiveIntensity={isActive ? 0.2 : 0}
        />
      </mesh>

      {/* Glow ring when active */}
      {isActive && (
        <mesh position={[position[0], position[1] - 0.3, position[2]]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[scale * 1.5, 0.05, 16, 32]} />
          <meshBasicMaterial color="#4488ff" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

/**
 * Structure component - represents buildings/structures on islands
 */
function Structure({ position, image }: { position: [number, number, number]; image: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(image);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle bobbing
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

/**
 * Game scene component containing all 3D elements
 */
function GameScene({
  currentIsland,
  onCrystalCollect,
  gameTime: _gameTime
}: {
  currentIsland: number;
  onCrystalCollect: () => void;
  gameTime: number;
}) {
  // Define islands with different textures and positions
  const islands = [
    { position: [0, 0, 0] as [number, number, number], texture: "/textures/rockface.webp", scale: 1.5 },
    { position: [5, -1, -2] as [number, number, number], texture: "/textures/box01.webp", scale: 1.2 },
    { position: [-4, 1, -3] as [number, number, number], texture: "/textures/rockface.webp", scale: 1.0 },
    { position: [6, 2, 3] as [number, number, number], texture: "/textures/box01.webp", scale: 1.3 },
    { position: [-6, -2, 2] as [number, number, number], texture: "/textures/rockface.webp", scale: 1.1 },
  ];

  // Define structures with images from art directory
  const structures = [
    { position: [0, 1.5, 0] as [number, number, number], image: "/art/house.webp" },
    { position: [5, 0.5, -2] as [number, number, number], image: "/art/turbine.webp" },
    { position: [-4, 2.5, -3] as [number, number, number], image: "/art/power.webp" },
    { position: [2, 0.3, 1] as [number, number, number], image: "/art/vault.webp" },
    { position: [-2, 0.3, 2] as [number, number, number], image: "/art/turbine2.webp" },
    { position: [6, 3, 3] as [number, number, number], image: "/art/turbine3.webp" },
    { position: [-6, -1, 2] as [number, number, number], image: "/art/vault2.webp" },
    { position: [1, 1, -1] as [number, number, number], image: "/art/couple.webp" },
    { position: [-3, 1.5, 0] as [number, number, number], image: "/art/friends.webp" },
  ];

  // Define collectible crystals
  const crystals = [
    { position: [1, 1.5, 0.5] as [number, number, number] },
    { position: [5.5, 0.8, -1.5] as [number, number, number] },
    { position: [-3.5, 2.8, -2.5] as [number, number, number] },
    { position: [6.5, 3.2, 3.5] as [number, number, number] },
    { position: [-5.5, -0.8, 2.5] as [number, number, number] },
  ];

  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Enhanced camera animation with smooth transitions
  useFrame((state) => {
    if (cameraRef.current) {
      const targetIsland = islands[currentIsland % islands.length];
      const time = state.clock.elapsedTime;

      // Camera orbit around island
      const radius = 5;
      const angle = time * 0.1;
      const targetPosition = new THREE.Vector3(
        targetIsland.position[0] + Math.cos(angle) * radius,
        targetIsland.position[1] + 2 + Math.sin(time * 0.3) * 0.5,
        targetIsland.position[2] + Math.sin(angle) * radius
      );

      cameraRef.current.position.lerp(targetPosition, 0.02);
      cameraRef.current.lookAt(
        targetIsland.position[0],
        targetIsland.position[1],
        targetIsland.position[2]
      );
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[3, 2, 5]} />

      {/* Enhanced lighting */}
      <Environment files="/textures/sunset.exr" background />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.7} color="#ffa500" />
      <pointLight position={[5, -5, 5]} intensity={0.4} color="#4488ff" />

      {/* Fog for depth */}
      <fog attach="fog" args={["#1a0633", 10, 50]} />

      {/* Particle systems */}
      <ParticleCloud count={200} />

      {/* Render all islands */}
      {islands.map((island, idx) => (
        <FloatingIsland
          key={`island-${idx}`}
          position={island.position}
          texture={island.texture}
          scale={island.scale}
          isActive={idx === currentIsland % islands.length}
        />
      ))}

      {/* Render all structures */}
      {structures.map((structure, idx) => (
        <Structure key={`structure-${idx}`} position={structure.position} image={structure.image} />
      ))}

      {/* Render energy crystals */}
      {crystals.map((crystal, idx) => (
        <EnergyCrystal
          key={`crystal-${idx}`}
          position={crystal.position}
          onCollect={onCrystalCollect}
        />
      ))}

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading Laputa...</p>
        </div>
      </div>
    </Html>
  );
}

/**
 * Main Laputa Game component with navigation and controls
 */
export default function LaputaGame() {
  const [currentIsland, setCurrentIsland] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [crystalsCollected, setCrystalsCollected] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [showCollectNotification, setShowCollectNotification] = useState(false);
  const totalIslands = 5;
  const totalCrystals = 5;

  // Game loop timer
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const handlePrevIsland = () => {
    setCurrentIsland((prev) => (prev > 0 ? prev - 1 : totalIslands - 1));
  };

  const handleNextIsland = () => {
    setCurrentIsland((prev) => (prev < totalIslands - 1 ? prev + 1 : 0));
  };

  const handleReset = () => {
    setCurrentIsland(0);
    setGameTime(0);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleCrystalCollect = () => {
    setCrystalsCollected((prev) => prev + 1);
    setShowCollectNotification(true);
    setTimeout(() => setShowCollectNotification(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Canvas container */}
      <div className="flex-1 relative bg-gradient-to-b from-blue-900 to-purple-900 rounded-lg overflow-hidden">
        <Canvas shadows gl={{ antialias: true, alpha: false }}>
          <Suspense fallback={<LoadingFallback />}>
            {!isPaused && (
              <GameScene
                currentIsland={currentIsland}
                onCrystalCollect={handleCrystalCollect}
                gameTime={gameTime}
              />
            )}
          </Suspense>
        </Canvas>

        {/* HUD - Top left: Game stats */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-white text-sm font-semibold">
              ⏱️ Time: {formatTime(gameTime)}
            </p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <p className="text-white text-sm font-semibold">
              Crystals: {crystalsCollected}/{totalCrystals}
            </p>
          </div>
        </div>

        {/* HUD - Top center: Island indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
          <p className="text-white text-sm font-semibold">
            Island {currentIsland + 1} / {totalIslands}
          </p>
        </div>

        {/* Collection notification */}
        {showCollectNotification && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500/90 backdrop-blur-sm px-6 py-3 rounded-lg animate-bounce">
            <p className="text-white text-lg font-bold">⚡ Crystal Collected! ⚡</p>
          </div>
        )}

        {/* Pause overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <p className="text-white text-4xl font-bold mb-4">⏸️ PAUSED</p>
              <p className="text-gray-300 text-lg">Click Play to resume</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-3 mt-4 pb-4">
        <Button
          onClick={handlePrevIsland}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          disabled={isPaused}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          onClick={handleReset}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        <Button
          onClick={togglePause}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2"
        >
          {isPaused ? (
            <>
              <Play className="h-4 w-4" />
              Play
            </>
          ) : (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          )}
        </Button>

        <Button
          onClick={handleNextIsland}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          disabled={isPaused}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        .animate-bounce {
          animation: bounce 0.5s ease-in-out 3;
        }
      `}</style>
    </div>
  );
}
