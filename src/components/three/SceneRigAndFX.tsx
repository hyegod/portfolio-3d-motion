"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, ContactShadows } from "@react-three/drei";
import type { Studio3DScrollState } from "@/context/ShowreelContext";

interface SceneRigAndFXProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

interface CameraKeyframe {
  p: number;
  pos: [number, number, number];
  lookAt: [number, number, number];
  roll: number;
  fov: number;
}

/**
 * Cinema Camera Choreography for the Architectural Astrolabe & Twin-Arch Bridge:
 * 0.00 - 0.20: Sweeping 3/4 orbital reveal of the CAD Compass Plinth & Bridge Core
 * 0.20 - 0.50: Dynamic chase angle watching the Aero-Glider thread through the Bridge Span
 * 0.50 - 0.70: Zero-G Stratosphere ascension framed by gyroscopic gimbal rings
 * 0.72 - 1.00: Crystal-clear Liquid Glass refraction over 3D "BUILD. CODE. CREATE."
 */
const KEYFRAMES: CameraKeyframe[] = [
  { p: 0.0, pos: [-3.35, 1.72, 5.55], lookAt: [0.0, 0.82, 0.0], roll: 0.04, fov: 46 },
  { p: 0.2, pos: [1.55, 1.52, 5.15], lookAt: [0.0, 0.84, 0.0], roll: -0.04, fov: 42 },
  { p: 0.36, pos: [-2.35, 1.18, 2.95], lookAt: [0.3, 0.86, 0.0], roll: 0.12, fov: 47 },
  { p: 0.5, pos: [1.85, 1.62, 3.45], lookAt: [0.0, 0.88, 0.0], roll: -0.09, fov: 44 },
  { p: 0.62, pos: [0.0, 1.22, 4.65], lookAt: [0.0, 0.96, 0.0], roll: 0.0, fov: 46 },
  { p: 0.78, pos: [-0.24, 1.07, 4.15], lookAt: [0.0, 1.07, 0.84], roll: 0.02, fov: 38 },
  { p: 1.0, pos: [0.0, 1.07, 4.48], lookAt: [0.0, 1.07, 0.84], roll: 0.0, fov: 36 },
];

export function SceneRigAndFX({ scrollRef }: SceneRigAndFXProps) {
  const { camera, scene, size } = useThree();
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);
  const smoothLook = useMemo(() => new THREE.Vector3(0, 0.82, 0), []);
  const studioColor = useMemo(() => new THREE.Color("#07111E"), []);
  const skyColor = useMemo(() => new THREE.Color("#1E6FD9"), []);
  const currentBg = useMemo(() => new THREE.Color("#07111E"), []);
  const smoothRollRef = useRef(0);
  const smoothFovRef = useRef(46);
  const shadowGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);
    const { progress: p, mouseX, mouseY } = scrollRef.current;

    // Aspect-aware pullback for portrait phones (0.46) & portrait tablets (0.75)
    const aspect = size.width / Math.max(1, size.height);
    const portraitFactor = clamp01((1.28 - aspect) / 0.82);
    const zBoost = portraitFactor * 3.55;
    const fovBoost = portraitFactor * 11;

    let a = KEYFRAMES[0];
    let b = KEYFRAMES[KEYFRAMES.length - 1];
    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      if (p >= KEYFRAMES[i].p && p <= KEYFRAMES[i + 1].p) {
        a = KEYFRAMES[i];
        b = KEYFRAMES[i + 1];
        break;
      }
    }

    const segT = smoothstep(a.p, b.p, p);
    const parallaxFactor = (1 - smoothstep(0.72, 0.84, p)) * (1 - portraitFactor * 0.65);

    targetPos.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], segT) + mouseX * 0.24 * parallaxFactor,
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], segT) + mouseY * 0.14 * parallaxFactor,
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], segT) + zBoost
    );
    targetLook.set(
      THREE.MathUtils.lerp(a.lookAt[0], b.lookAt[0], segT),
      THREE.MathUtils.lerp(a.lookAt[1], b.lookAt[1], segT),
      THREE.MathUtils.lerp(a.lookAt[2], b.lookAt[2], segT)
    );
    const targetRoll = THREE.MathUtils.lerp(a.roll, b.roll, segT);
    const targetFov = THREE.MathUtils.lerp(a.fov, b.fov, segT) + fovBoost;

    const lambda = 8.5;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, lambda, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, lambda, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, lambda, dt);

    smoothLook.x = THREE.MathUtils.damp(smoothLook.x, targetLook.x, lambda, dt);
    smoothLook.y = THREE.MathUtils.damp(smoothLook.y, targetLook.y, lambda, dt);
    smoothLook.z = THREE.MathUtils.damp(smoothLook.z, targetLook.z, lambda, dt);

    smoothRollRef.current = THREE.MathUtils.damp(smoothRollRef.current, targetRoll, lambda, dt);

    if (camera instanceof THREE.PerspectiveCamera) {
      const nextFov = THREE.MathUtils.damp(smoothFovRef.current, targetFov, lambda, dt);
      if (Math.abs(nextFov - smoothFovRef.current) > 0.01) {
        smoothFovRef.current = nextFov;
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }

    camera.lookAt(smoothLook);
    camera.rotateZ(smoothRollRef.current);

    const skyMix = smoothstep(0.52, 0.68, p);
    currentBg.copy(studioColor).lerp(skyColor, skyMix);
    scene.background = currentBg;

    if (shadowGroupRef.current) {
      shadowGroupRef.current.visible = p < 0.54;
    }
  });

  return (
    <>
      <ambientLight intensity={0.72} color="#E0F2FE" />
      <hemisphereLight args={["#BAE6FD", "#0F172A", 0.9]} />
      <directionalLight position={[5.5, 7.5, 4.5]} intensity={2.5} color="#FFF7E6" />
      <directionalLight position={[-5.5, 3.5, 2.5]} intensity={1.25} color="#38BDF8" />

      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={3.0}
          color="#FFFBEB"
          scale={[8, 4, 1]}
          position={[4, 5, 4]}
          target={[0, 0.8, 0]}
        />
        <Lightformer
          form="ring"
          intensity={2.4}
          color="#38BDF8"
          scale={6}
          position={[-5, 3, 2]}
          target={[0, 0.8, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color="#C6FF3D"
          scale={[6, 2, 1]}
          position={[0, -3, 3]}
          target={[0, 0.8, 0]}
        />
      </Environment>

      <Sparkles
        count={56}
        scale={[7.8, 4.4, 5.5]}
        position={[0, 1.35, 0.2]}
        size={2.4}
        speed={0.38}
        opacity={0.6}
        color="#E0F2FE"
      />

      <group ref={shadowGroupRef}>
        <ContactShadows
          position={[0, -0.235, 0]}
          opacity={0.45}
          scale={8.2}
          blur={2.2}
          far={2.6}
          frames={1}
        />
      </group>
    </>
  );
}
