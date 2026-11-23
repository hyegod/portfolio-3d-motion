"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import type { Studio3DScrollState } from "@/context/ShowreelContext";

interface LiquidGlassBarProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutExpo(x: number) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/**
 * Wide Refractive Liquid-Glass Pill Capsule positioned directly IN FRONT of Hero3DText
 * (z = 1.18 vs text at z = 0.52) so real-time WebGL refraction optically bends the 3D letters!
 */
export function LiquidGlassBar({ scrollRef }: LiquidGlassBarProps) {
  const { size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const rimRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    const p = scrollRef.current.progress;
    const t = clock.getElapsedTime();

    const enter = easeOutExpo(clamp01((p - 0.72) / 0.14));
    if (enter <= 0.005) {
      group.visible = false;
      return;
    }

    group.visible = true;
    const aspect = size.width / Math.max(1, size.height);
    const fitScale = aspect < 0.72 ? 0.76 : aspect < 1.05 ? 0.9 : 1.0;

    const sweepX = THREE.MathUtils.lerp(-2.2, 0.0, enter);
    const scaleX = THREE.MathUtils.lerp(0.22, 1.0, enter) * fitScale;
    const scaleY = THREE.MathUtils.lerp(0.55, 1.0, enter) * fitScale;

    group.position.set(sweepX, 1.07 + Math.sin(t * 2.0) * 0.02, 1.18);
    group.scale.set(scaleX, scaleY, fitScale);
    group.rotation.set(
      Math.sin(t * 1.4) * 0.045,
      Math.cos(t * 1.1) * 0.03,
      Math.sin(t * 1.2) * 0.015
    );

    if (rimRef.current) {
      rimRef.current.rotation.z = Math.PI / 2;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.26, 2.55, 16, 32]} />
        <MeshTransmissionMaterial
          backside={false}
          samples={4}
          resolution={256}
          transmission={0.96}
          thickness={0.22}
          roughness={0.03}
          ior={1.09}
          chromaticAberration={0.07}
          anisotropy={0.18}
          distortion={0.045}
          distortionScale={0.25}
          temporalDistortion={0.12}
          color="#F5EEFF"
          attenuationColor="#A855F7"
          attenuationDistance={3.2}
        />
      </mesh>

      <mesh ref={rimRef} scale={[1.03, 1.012, 0.4]}>
        <capsuleGeometry args={[0.265, 2.57, 8, 24]} />
        <meshBasicMaterial
          color="#C084FC"
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
