"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

type VoiceState = "idle" | "listening" | "processing" | "speaking";

function SciFiSphere({ expression, voiceState }: { expression: string; voiceState: VoiceState }) {
  const group = useRef<THREE.Group>(null);
  const colors: Record<string, string> = {
    happy: "#22d3ee",
    sad: "#64748b",
    neutral: "#0ea5e9",
    stress: "#f43f5e",
    tired: "#f59e0b",
  };
  const glowColor = colors[expression] || "#22d3ee";

  const emissiveTarget = useMemo(() => {
    if (voiceState === "speaking") return 2.5;
    if (voiceState === "listening") return 1.8;
    if (voiceState === "processing") return 1.5;
    return 1.1;
  }, [voiceState]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetScale =
      voiceState === "speaking" ? 1.1 : voiceState === "listening" ? 1.05 : voiceState === "processing" ? 1.03 : 1;
    const currentScale = group.current.scale.x;
    const lerpedScale = THREE.MathUtils.lerp(currentScale, targetScale, 2 * delta);
    group.current.scale.setScalar(lerpedScale);
    group.current.rotation.y += 0.2 * delta;
    group.current.rotation.x += 0.08 * delta;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.4, 128, 128]} />
        <meshStandardMaterial
          color="#0b1f2a"
          emissive={glowColor}
          emissiveIntensity={emissiveTarget}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshBasicMaterial color="#67e8f9" wireframe opacity={0.35} transparent />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.05, 32, 128]} />
        <meshBasicMaterial color={glowColor} opacity={0.55} transparent />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[1, 0.03, 16, 64]} />
        <meshBasicMaterial color="#22d3ee" opacity={0.4} transparent />
      </mesh>
    </group>
  );
}

export function RobotScene({ expression, voiceState = "idle" }: { expression: string; voiceState?: VoiceState }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ height: "100%", minHeight: "420px" }}>
      <color attach="background" args={["#0b1120"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 4]} intensity={1} color="#a855f7" />
      <Suspense fallback={null}>
        <SciFiSphere expression={expression} voiceState={voiceState} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
