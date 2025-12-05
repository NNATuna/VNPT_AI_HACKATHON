"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";

function RobotBody({ expression }: { expression: string }) {
  const colors: Record<string, string> = {
    happy: "#22d3ee",
    sad: "#64748b",
    neutral: "#a855f7",
    stress: "#ef4444",
    tired: "#f59e0b",
  };
  const eyeColor = colors[expression] || "#a855f7";
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 1.2, 32]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.5, 1.2, 0.81]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial emissive={eyeColor} emissiveIntensity={1.5} color="#111827" />
      </mesh>
      <mesh position={[0.5, 1.2, 0.81]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial emissive={eyeColor} emissiveIntensity={1.5} color="#111827" />
      </mesh>
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>
    </group>
  );
}

export function RobotScene({ expression }: { expression: string }) {
  return (
    <Canvas camera={{ position: [2.2, 2.5, 4], fov: 60 }} style={{ height: "100%", minHeight: "420px" }}>
      <color attach="background" args={["#0b1120"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 5]} intensity={1} />
      <Suspense fallback={null}>
        <RobotBody expression={expression} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
