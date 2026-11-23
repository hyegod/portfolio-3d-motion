"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Studio3DScrollState } from "@/context/ShowreelContext";

interface PaperPlanePathProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function PaperPlanePath({ scrollRef }: PaperPlanePathProps) {
  const planeRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0.42,
      -0.28, 0.04, -0.28,
      -0.03, 0.01, -0.24,
      0, 0, 0.42,
      0.03, 0.01, -0.24,
      0.28, 0.04, -0.28,
      0, 0, 0.42,
      -0.03, 0.01, -0.24,
      0, -0.1, -0.2,
      0, 0, 0.42,
      0, -0.1, -0.2,
      0.03, 0.01, -0.24,
    ]);
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const flightCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.55, 0.09, 0.42),
        new THREE.Vector3(1.55, 0.85, 0.95),
        new THREE.Vector3(0.85, 1.55, 1.85),
        new THREE.Vector3(-1.35, 1.05, 1.55),
        new THREE.Vector3(-0.35, 0.72, 1.25),
        new THREE.Vector3(1.42, 1.28, 1.05),
        new THREE.Vector3(1.22, 1.65, 0.35),
      ]),
    []
  );

  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpNext = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const plane = planeRef.current;
    if (!plane) return;

    const p = scrollRef.current.progress;
    const t = clock.getElapsedTime();

    if (p < 0.28) {
      plane.position.set(0.55, 0.09, 0.42);
      plane.rotation.set(0.05, -0.65, 0.04);
      plane.scale.setScalar(clamp01((p - 0.1) / 0.14));
      if (trailRef.current) trailRef.current.visible = false;
      return;
    }

    plane.scale.setScalar(1);
    const flightT = clamp01((p - 0.28) / 0.48);
    flightCurve.getPointAt(flightT, tmpPos);
    flightCurve.getPointAt(Math.min(1, flightT + 0.025), tmpNext);

    if (flightT > 0.95) {
      tmpPos.y += Math.sin(t * 2.2) * 0.08;
      tmpPos.x += Math.cos(t * 1.4) * 0.05;
    }

    plane.position.copy(tmpPos);
    plane.lookAt(tmpNext);
    plane.rotateZ(Math.sin(flightT * Math.PI * 3) * 0.52);

    if (trailRef.current) {
      trailRef.current.visible = flightT > 0.02 && flightT < 0.96;
    }
  });

  return (
    <group ref={planeRef}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial
          color="#6366F1"
          emissive="#4F46E5"
          emissiveIntensity={0.35}
          metalness={0.82}
          roughness={0.16}
          iridescence={1}
          iridescenceIOR={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={trailRef} position={[0, 0, -0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.65, 8]} />
        <meshBasicMaterial
          color="#A855F7"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
