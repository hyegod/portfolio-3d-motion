"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, ContactShadows } from "@react-three/drei";
import type { Studio3DScrollState } from "@/context/ShowreelContext";

export const PORTAL_CUT_P = 0.355;

interface SceneRigAndFXProps {
  rawScrollRef: React.MutableRefObject<Studio3DScrollState>;
  twinScrollRef: React.MutableRefObject<Studio3DScrollState>;
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
 * PHASE 1 (rawP = 0.00 -> 0.355, mapped to roomP = 0.00 -> 1.00):
 * Cozy Golden-Hour Sunlit Retro Computer Room -> Smooth Dolly Dive Straight Into the CRT Screen!
 * CRT Screen glass center is at world [0.05, 0.57, 0.118].
 */
const RETRO_ROOM_KEYFRAMES: CameraKeyframe[] = [
  { p: 0.0, pos: [0.68, 0.76, 2.34], lookAt: [-0.26, 0.57, -0.08], roll: 0.012, fov: 45 },
  { p: 0.38, pos: [0.18, 0.65, 1.48], lookAt: [0.04, 0.57, 0.02], roll: 0.0, fov: 41 },
  { p: 0.72, pos: [0.05, 0.57, 0.72], lookAt: [0.05, 0.57, 0.08], roll: 0.0, fov: 39 },
  { p: 1.0, pos: [0.05, 0.57, 0.31], lookAt: [0.05, 0.57, -0.05], roll: 0.0, fov: 37 },
];

/**
 * PHASE 2 (rawP = 0.355 -> 1.00, mapped to twinP = 0.00 -> 1.00):
 * Inside the Computer — Full 3D Twin-Arch Bridge Digital Twin, Glider & Liquid Glass Finale!
 */
const TWIN_KEYFRAMES: CameraKeyframe[] = [
  { p: 0.0, pos: [-3.35, 1.72, 5.55], lookAt: [0.0, 0.82, 0.0], roll: 0.04, fov: 46 },
  { p: 0.2, pos: [1.55, 1.52, 5.15], lookAt: [0.0, 0.84, 0.0], roll: -0.04, fov: 42 },
  { p: 0.36, pos: [-2.35, 1.18, 2.95], lookAt: [0.3, 0.86, 0.0], roll: 0.12, fov: 47 },
  { p: 0.5, pos: [1.85, 1.62, 3.45], lookAt: [0.0, 0.88, 0.0], roll: -0.09, fov: 44 },
  { p: 0.62, pos: [0.0, 1.22, 4.65], lookAt: [0.0, 0.96, 0.0], roll: 0.0, fov: 46 },
  { p: 0.78, pos: [-0.24, 1.07, 4.15], lookAt: [0.0, 1.07, 0.84], roll: 0.02, fov: 38 },
  { p: 1.0, pos: [0.0, 1.07, 4.48], lookAt: [0.0, 1.07, 0.84], roll: 0.0, fov: 36 },
];

function evalKeyframes(list: CameraKeyframe[], p: number) {
  let a = list[0];
  let b = list[list.length - 1];
  for (let i = 0; i < list.length - 1; i++) {
    if (p >= list[i].p && p <= list[i + 1].p) {
      a = list[i];
      b = list[i + 1];
      break;
    }
  }
  const segT = smoothstep(a.p, b.p, p);
  return {
    px: THREE.MathUtils.lerp(a.pos[0], b.pos[0], segT),
    py: THREE.MathUtils.lerp(a.pos[1], b.pos[1], segT),
    pz: THREE.MathUtils.lerp(a.pos[2], b.pos[2], segT),
    lx: THREE.MathUtils.lerp(a.lookAt[0], b.lookAt[0], segT),
    ly: THREE.MathUtils.lerp(a.lookAt[1], b.lookAt[1], segT),
    lz: THREE.MathUtils.lerp(a.lookAt[2], b.lookAt[2], segT),
    roll: THREE.MathUtils.lerp(a.roll, b.roll, segT),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, segT),
  };
}

export function SceneRigAndFX({ rawScrollRef, twinScrollRef }: SceneRigAndFXProps) {
  const { camera, scene, size } = useThree();
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);
  const smoothLook = useMemo(() => new THREE.Vector3(-0.08, 0.56, -0.12), []);

  const roomBgColor = useMemo(() => new THREE.Color("#8B6E52"), []);
  const studioColor = useMemo(() => new THREE.Color("#07111E"), []);
  const skyColor = useMemo(() => new THREE.Color("#1E6FD9"), []);
  const currentBg = useMemo(() => new THREE.Color("#8B6E52"), []);

  const smoothRollRef = useRef(-0.015);
  const smoothFovRef = useRef(43);
  const lastInRoomRef = useRef<boolean | null>(null);

  const roomLightsRef = useRef<THREE.Group>(null);
  const twinLightsRef = useRef<THREE.Group>(null);
  const shadowGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);
    const { progress: rawP, mouseX, mouseY } = rawScrollRef.current;

    const inRetroRoom = rawP < PORTAL_CUT_P;
    const twinP = clamp01((rawP - PORTAL_CUT_P) / (1 - PORTAL_CUT_P));

    // Synchronize virtualized twinScrollRef BEFORE child components read it!
    twinScrollRef.current.progress = twinP;
    twinScrollRef.current.mouseX = mouseX;
    twinScrollRef.current.mouseY = mouseY;

    const aspect = size.width / Math.max(1, size.height);
    const portraitFactor = clamp01((1.28 - aspect) / 0.82);

    if (inRetroRoom) {
      const roomP = clamp01(rawP / PORTAL_CUT_P);
      const kf = evalKeyframes(RETRO_ROOM_KEYFRAMES, roomP);

      // Taper mobile pullback & mouse parallax to 0 as camera dives into CRT screen!
      const diveTaper = 1 - smoothstep(0.42, 0.82, roomP);
      const zRoomBoost = portraitFactor * 1.15 * diveTaper;
      const fovRoomBoost = portraitFactor * 7 * diveTaper;
      const mParallax = diveTaper * (1 - portraitFactor * 0.5);

      targetPos.set(
        kf.px + mouseX * 0.14 * mParallax,
        kf.py + mouseY * 0.08 * mParallax,
        kf.pz + zRoomBoost
      );
      targetLook.set(kf.lx, kf.ly, kf.lz);

      const targetRoll = kf.roll;
      const targetFov = kf.fov + fovRoomBoost;

      if (lastInRoomRef.current !== true) {
        lastInRoomRef.current = true;
        camera.position.copy(targetPos);
        smoothLook.copy(targetLook);
        smoothRollRef.current = targetRoll;
        smoothFovRef.current = targetFov;
      } else {
        const lambda = 9.5;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, lambda, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, lambda, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, lambda, dt);

        smoothLook.x = THREE.MathUtils.damp(smoothLook.x, targetLook.x, lambda, dt);
        smoothLook.y = THREE.MathUtils.damp(smoothLook.y, targetLook.y, lambda, dt);
        smoothLook.z = THREE.MathUtils.damp(smoothLook.z, targetLook.z, lambda, dt);
        smoothRollRef.current = THREE.MathUtils.damp(smoothRollRef.current, targetRoll, lambda, dt);
        smoothFovRef.current = THREE.MathUtils.damp(smoothFovRef.current, targetFov, lambda, dt);
      }

      currentBg.copy(roomBgColor);
      scene.background = currentBg;
    } else {
      const kf = evalKeyframes(TWIN_KEYFRAMES, twinP);
      const zBoost = portraitFactor * 3.55;
      const fovBoost = portraitFactor * 11;
      const parallaxFactor =
        (1 - smoothstep(0.72, 0.84, twinP)) * (1 - portraitFactor * 0.65);

      targetPos.set(
        kf.px + mouseX * 0.24 * parallaxFactor,
        kf.py + mouseY * 0.14 * parallaxFactor,
        kf.pz + zBoost
      );
      targetLook.set(kf.lx, kf.ly, kf.lz);

      const targetRoll = kf.roll;
      const targetFov = kf.fov + fovBoost;

      if (lastInRoomRef.current !== false) {
        lastInRoomRef.current = false;
        camera.position.copy(targetPos);
        smoothLook.copy(targetLook);
        smoothRollRef.current = targetRoll;
        smoothFovRef.current = targetFov;
      } else {
        const lambda = 8.5;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, lambda, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, lambda, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, lambda, dt);

        smoothLook.x = THREE.MathUtils.damp(smoothLook.x, targetLook.x, lambda, dt);
        smoothLook.y = THREE.MathUtils.damp(smoothLook.y, targetLook.y, lambda, dt);
        smoothLook.z = THREE.MathUtils.damp(smoothLook.z, targetLook.z, lambda, dt);
        smoothRollRef.current = THREE.MathUtils.damp(smoothRollRef.current, targetRoll, lambda, dt);
        smoothFovRef.current = THREE.MathUtils.damp(smoothFovRef.current, targetFov, lambda, dt);
      }

      const skyMix = smoothstep(0.52, 0.68, twinP);
      currentBg.copy(studioColor).lerp(skyColor, skyMix);
      scene.background = currentBg;
    }

    camera.up.set(0, 1, 0);
    camera.lookAt(smoothLook);
    camera.rotateZ(smoothRollRef.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      if (Math.abs(camera.fov - smoothFovRef.current) > 0.02) {
        camera.fov = smoothFovRef.current;
        camera.updateProjectionMatrix();
      }
    }

    if (roomLightsRef.current) roomLightsRef.current.visible = inRetroRoom;
    if (twinLightsRef.current) twinLightsRef.current.visible = !inRetroRoom;
    if (shadowGroupRef.current) {
      shadowGroupRef.current.visible = !inRetroRoom && twinP < 0.54;
    }
  });

  return (
    <>
      {/* ================================================================
          PHASE 1 LIGHTING: WARM GOLDEN-HOUR VENETIAN SUNLIGHT
         ================================================================ */}
      <group ref={roomLightsRef}>
        <ambientLight intensity={0.72} color="#FFEBD0" />
        <hemisphereLight args={["#FFF1D6", "#5C4028", 0.85]} />
        {/* Warm Morning Sun Raking Through Left Window onto Desk & CRT */}
        <directionalLight
          position={[-3.6, 2.8, 2.2]}
          intensity={3.1}
          color="#FFD188"
        />
        {/* Subtle Teal CRT Screen Fill Glow onto Keyboard */}
        <pointLight
          position={[0.05, 0.55, 0.35]}
          intensity={0.65}
          distance={1.6}
          color="#5EEAD4"
        />
      </group>

      {/* ================================================================
          PHASE 2 LIGHTING: DIGITAL TWIN STUDIO & ZERO-G SKY
         ================================================================ */}
      <group ref={twinLightsRef} visible={false}>
        <ambientLight intensity={0.72} color="#E0F2FE" />
        <hemisphereLight args={["#BAE6FD", "#0F172A", 0.9]} />
        <directionalLight position={[5.5, 7.5, 4.5]} intensity={2.5} color="#FFF7E6" />
        <directionalLight position={[-5.5, 3.5, 2.5]} intensity={1.25} color="#38BDF8" />

        <Sparkles
          count={56}
          scale={[7.8, 4.4, 5.5]}
          position={[0, 1.35, 0.2]}
          size={2.4}
          speed={0.38}
          opacity={0.6}
          color="#E0F2FE"
        />
      </group>

      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.8}
          color="#FFFBEB"
          scale={[8, 4, 1]}
          position={[4, 5, 4]}
          target={[0, 0.8, 0]}
        />
        <Lightformer
          form="ring"
          intensity={2.0}
          color="#38BDF8"
          scale={6}
          position={[-5, 3, 2]}
          target={[0, 0.8, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#FDE68A"
          scale={[6, 2, 1]}
          position={[0, -3, 3]}
          target={[0, 0.8, 0]}
        />
      </Environment>

      <group ref={shadowGroupRef} visible={false}>
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
