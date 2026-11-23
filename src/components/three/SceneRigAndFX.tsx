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
 * All-Platform Responsive Cinema Camera Rig
 * Dynamically adapts camera Z-distance & FOV to viewport aspect ratio so small phones (320px-390px),
 * portrait tablets (768x1024), and desktop widescreens (1440px+) all frame the entire 3D studio
 * AND full horizontal "BUILD. CODE. CREATE." without ever clipping left/right edges!
 */
const KEYFRAMES: CameraKeyframe[] = [
  { p: 0.0, pos: [-3.3, 1.55, 5.45], lookAt: [0.0, 0.78, 0.0], roll: 0.06, fov: 48 },
  { p: 0.22, pos: [1.35, 1.68, 5.25], lookAt: [0.0, 0.75, 0.0], roll: -0.03, fov: 41 },
  { p: 0.36, pos: [1.35, 3.9, 2.35], lookAt: [0.15, 0.18, 0.16], roll: -0.26, fov: 53 },
  { p: 0.48, pos: [-1.6, 0.96, 2.85], lookAt: [0.08, 0.75, 0.2], roll: 0.1, fov: 36 },
  { p: 0.58, pos: [0.2, 1.18, 3.7], lookAt: [0.0, 0.92, 0.0], roll: -0.05, fov: 46 },
  { p: 0.7, pos: [0.22, 1.38, 4.95], lookAt: [0.0, 1.07, 0.15], roll: -0.04, fov: 48 },
  { p: 0.82, pos: [-0.36, 1.07, 3.55], lookAt: [-0.06, 1.07, 0.84], roll: 0.02, fov: 38 },
  { p: 1.0, pos: [0.0, 1.07, 4.2], lookAt: [0.0, 1.07, 0.84], roll: 0.0, fov: 36 },
];

export function SceneRigAndFX({ scrollRef }: SceneRigAndFXProps) {
  const { camera, scene, size } = useThree();
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);
  const smoothLook = useMemo(() => new THREE.Vector3(0, 0.78, 0), []);
  const studioColor = useMemo(() => new THREE.Color("#141E2B"), []);
  const skyColor = useMemo(() => new THREE.Color("#7EC8FF"), []);
  const currentBg = useMemo(() => new THREE.Color("#141E2B"), []);
  const smoothRollRef = useRef(0);
  const smoothFovRef = useRef(44);
  const shadowGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);
    const { progress: p, mouseX, mouseY } = scrollRef.current;

    // Aspect-aware pullback for portrait phones (0.46) & portrait tablets (0.75)
    const aspect = size.width / Math.max(1, size.height);
    const portraitFactor = clamp01((1.28 - aspect) / 0.82);
    const zBoost = portraitFactor * 2.95;
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
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], segT) + mouseX * 0.22 * parallaxFactor,
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], segT) + mouseY * 0.13 * parallaxFactor,
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

    const skyMix = smoothstep(0.52, 0.66, p);
    currentBg.copy(studioColor).lerp(skyColor, skyMix);
    scene.background = currentBg;

    if (shadowGroupRef.current) {
      shadowGroupRef.current.visible = p < 0.54;
    }
  });

  return (
    <>
      <ambientLight intensity={0.78} color="#FFF8EB" />
      <hemisphereLight args={["#BAE6FD", "#78350F", 0.85]} />
      <directionalLight position={[5.5, 7.5, 4.5]} intensity={2.45} color="#FFF3D6" />
      <directionalLight position={[-5, 3.5, 2]} intensity={0.95} color="#93C5FD" />

      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.8}
          color="#FFF7E6"
          scale={[8, 4, 1]}
          position={[4, 5, 4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={1.9}
          color="#7DD3FC"
          scale={6}
          position={[-5, 3, 2]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#C084FC"
          scale={[6, 2, 1]}
          position={[0, -3, 3]}
          target={[0, 0, 0]}
        />
      </Environment>

      <Sparkles
        count={48}
        scale={[7.5, 4.2, 5.2]}
        position={[0, 1.3, 0.2]}
        size={2.5}
        speed={0.4}
        opacity={0.55}
        color="#FFFBEB"
      />

      <group ref={shadowGroupRef}>
        <ContactShadows
          position={[0, 0.008, 0.1]}
          opacity={0.34}
          scale={6.4}
          blur={2.0}
          far={2.2}
          frames={1}
        />
      </group>
    </>
  );
}
