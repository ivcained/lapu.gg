"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, PerspectiveCamera } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from "lucide-react";

/**
 * Floating Island component - represents a Laputa floating city
 */
function FloatingIsland({ position, texture, scale = 1 }: { position: [number, number, number]; texture: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Load texture
  const textureMap = useTexture(texture);

  // Animation in game loop
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;

      // Slow rotation
      meshRef.current.rotation.y += 0.003;

      // Scale on hover
      const targetScale = hovered ? scale * 1.1 : scale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[2 * scale, 0.5 * scale, 2 * scale]} />
      <meshStandardMaterial map={textureMap} />
    </mesh>
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
 * Sky background component
 */
function Sky() {
  const texture = useTexture("/textures/sunset.exr");

  return (
    <mesh>
      <sphereGeometry args={[50, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

/**
 * Game scene component containing all 3D elements
 */
function GameScene({ currentIsland }: { currentIsland: number }) {
  // Define islands with different textures and positions
  const islands = [
    { position: [0, 0, 0] as [number, number, number], texture: "/textures/rockface.webp", scale: 1.5 },
    { position: [5, -1, -2] as [number, number, number], texture: "/textures/box01.webp", scale: 1.2 },
    { position: [-4, 1, -3] as [number, number, number], texture: "/textures/rockface.webp", scale: 1.0 },
  ];

  // Define structures with images from art directory
  const structures = [
    { position: [0, 1.5, 0] as [number, number, number], image: "/art/house.webp" },
    { position: [5, 0.5, -2] as [number, number, number], image: "/art/turbine.webp" },
    { position: [-4, 2.5, -3] as [number, number, number], image: "/art/power.webp" },
    { position: [2, 0.3, 1] as [number, number, number], image: "/art/vault.webp" },
    { position: [-2, 0.3, 2] as [number, number, number], image: "/art/turbine2.webp" },
  ];

  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Animate camera to focus on current island
  useFrame(() => {
    if (cameraRef.current) {
      const targetIsland = islands[currentIsland];
      const targetPosition = new THREE.Vector3(
        targetIsland.position[0] + 3,
        targetIsland.position[1] + 2,
        targetIsland.position[2] + 5
      );

      cameraRef.current.position.lerp(targetPosition, 0.05);
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

      <Sky />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ffa500" />

      {/* Render all islands */}
      {islands.map((island, idx) => (
        <FloatingIsland
          key={`island-${idx}`}
          position={island.position}
          texture={island.texture}
          scale={island.scale}
        />
      ))}

      {/* Render all structures */}
      {structures.map((structure, idx) => (
        <Structure key={`structure-${idx}`} position={structure.position} image={structure.image} />
      ))}

      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  );
}

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="spinner h-8 w-8 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading Laputa...</p>
      </div>
    </div>
  );
}

/**
 * Main Laputa Game component with navigation and controls
 */
export default function LaputaGame() {
  const [currentIsland, setCurrentIsland] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalIslands = 3;

  const handlePrevIsland = () => {
    setCurrentIsland((prev) => (prev > 0 ? prev - 1 : totalIslands - 1));
  };

  const handleNextIsland = () => {
    setCurrentIsland((prev) => (prev < totalIslands - 1 ? prev + 1 : 0));
  };

  const handleReset = () => {
    setCurrentIsland(0);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Canvas container */}
      <div className="flex-1 relative bg-gradient-to-b from-blue-900 to-purple-900 rounded-lg overflow-hidden">
        <Canvas shadows>
          <Suspense fallback={<LoadingFallback />}>
            {!isPaused && <GameScene currentIsland={currentIsland} />}
          </Suspense>
        </Canvas>

        {/* Island indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
          <p className="text-white text-sm font-semibold">
            Island {currentIsland + 1} / {totalIslands}
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-3 mt-4 pb-4">
        <Button
          onClick={handlePrevIsland}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
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
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <style jsx>{`
        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
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
