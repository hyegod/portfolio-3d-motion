"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";

export interface SkillsScrollState {
  progress: number;
  pointerX: number;
  pointerY: number;
  activeRow: number;
}

interface Skills3DStageProps {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
  active: boolean;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

function easeOutBack(x: number) {
  const c1 = 1.7;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

interface ChapterCamKeyframe {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  roll: number;
  fov: number;
}

/**
 * 4 RADICALLY DISTINCT CINEMA CAMERA PATHS (ZERO REPETITION!):
 * - Chapter 0 (Civil): Street-Level Upward Helicopter Spiral -> Rooftop Crane Flyover
 * - Chapter 1 (Software): Wide Isometric -> High-Speed FPV Z-Tunnel Dive Through Core + Barrel Bank
 * - Chapter 2 (Design): Extreme Left Profile -> Lateral S-Curve Slalom Weaving Past Glass UI Screens -> High 3/4 Overview
 * - Chapter 3 (Hobbies): Low Bridge Guitar String-Run Macro -> Sweeping Pan to Spinning Vinyl Turntable -> Wide Stage Pullback
 */
const CHAPTER_CAMERA_PATHS: ChapterCamKeyframe[][] = [
  // 01 CIVIL: Ground-up 160-deg helicopter spiral up to crane jib!
  [
    { t: 0.0, pos: [-3.15, -1.28, 3.85], look: [0.35, 0.15, 0.0], roll: 0.09, fov: 50 },
    { t: 0.38, pos: [0.35, -0.35, 4.45], look: [0.2, 0.35, 0.0], roll: -0.04, fov: 46 },
    { t: 0.72, pos: [2.85, 0.85, 3.65], look: [0.1, 0.55, 0.0], roll: -0.09, fov: 43 },
    { t: 1.0, pos: [0.95, 2.35, 3.05], look: [0.15, 0.55, 0.0], roll: 0.05, fov: 39 },
  ],
  // 02 SOFTWARE: Isometric -> High-Velocity FPV Center Tunnel Dive straight through the compute matrix!
  [
    { t: 0.0, pos: [3.35, 1.75, 5.65], look: [0.0, 0.0, 0.0], roll: -0.11, fov: 46 },
    { t: 0.42, pos: [0.42, 0.22, 2.55], look: [0.0, 0.0, -0.9], roll: 0.16, fov: 55 },
    { t: 0.74, pos: [-0.28, -0.18, 1.35], look: [0.0, 0.0, -2.2], roll: -0.14, fov: 57 },
    { t: 1.0, pos: [-2.35, 0.95, 3.45], look: [0.0, 0.0, -0.3], roll: 0.04, fov: 43 },
  ],
  // 03 UI/UX & 3D: Smooth Left-to-Right S-Curve Cinema Dolly Slalom!
  [
    { t: 0.0, pos: [-3.55, 0.22, 4.35], look: [0.15, 0.05, -0.35], roll: -0.06, fov: 42 },
    { t: 0.35, pos: [-0.85, 0.05, 3.65], look: [0.15, 0.08, -0.45], roll: 0.04, fov: 44 },
    { t: 0.7, pos: [2.45, 0.35, 3.65], look: [-0.15, 0.05, -0.45], roll: 0.07, fov: 43 },
    { t: 1.0, pos: [0.45, 1.85, 4.25], look: [0.0, 0.0, -0.45], roll: -0.02, fov: 40 },
  ],
  // 04 OFF-CLOCK HOBBIES: Low-angle macro guitar fretboard string-run -> turntable close-up -> stage pullback!
  [
    { t: 0.0, pos: [-1.55, -1.32, 2.25], look: [0.35, 0.65, 0.0], roll: -0.16, fov: 51 },
    { t: 0.4, pos: [0.25, 0.15, 2.65], look: [0.55, 0.48, 0.1], roll: -0.05, fov: 46 },
    { t: 0.72, pos: [2.05, 0.88, 2.55], look: [0.75, 0.35, 0.15], roll: 0.09, fov: 42 },
    { t: 1.0, pos: [0.15, 0.78, 4.85], look: [0.15, 0.05, 0.0], roll: 0.0, fov: 44 },
  ],
];

export function getActiveSkillChapter(p: number): {
  chapterIdx: number;
  local: number;
} {
  if (p < 0.315) {
    return { chapterIdx: 0, local: clamp01((p - 0.115) / 0.195) };
  }
  if (p < 0.51) {
    return { chapterIdx: 1, local: clamp01((p - 0.315) / 0.19) };
  }
  if (p < 0.705) {
    return { chapterIdx: 2, local: clamp01((p - 0.51) / 0.19) };
  }
  return { chapterIdx: 3, local: clamp01((p - 0.705) / 0.135) };
}

function sampleCameraPath(
  keyframes: ChapterCamKeyframe[],
  local: number
): {
  pos: [number, number, number];
  look: [number, number, number];
  roll: number;
  fov: number;
} {
  let a = keyframes[0];
  let b = keyframes[keyframes.length - 1];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (local >= keyframes[i].t && local <= keyframes[i + 1].t) {
      a = keyframes[i];
      b = keyframes[i + 1];
      break;
    }
  }
  const s = smoothstep(a.t, b.t, local);
  return {
    pos: [
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], s),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], s),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], s),
    ],
    look: [
      THREE.MathUtils.lerp(a.look[0], b.look[0], s),
      THREE.MathUtils.lerp(a.look[1], b.look[1], s),
      THREE.MathUtils.lerp(a.look[2], b.look[2], s),
    ],
    roll: THREE.MathUtils.lerp(a.roll, b.roll, s),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, s),
  };
}

/**
 * Multi-Style Act-2-Grade Cinema Camera & Studio Lighting Rig
 * Evaluates C1-continuous Catmull-Rom 3D splines so camera motion never stutters at intermediate keyframes!
 */
function SkillsCinemaRig({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
}) {
  const { camera, size } = useThree();
  const smoothPos = useMemo(() => new THREE.Vector3(-3.15, -1.28, 3.85), []);
  const smoothLook = useMemo(() => new THREE.Vector3(0.35, 0.15, 0), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempLook = useMemo(() => new THREE.Vector3(), []);
  const smoothRoll = useRef(0.09);
  const smoothFov = useRef(50);
  const lastChapterRef = useRef(-1);

  const chapterSplines = useMemo(
    () =>
      CHAPTER_CAMERA_PATHS.map((kfList) => ({
        posSpline: new THREE.CatmullRomCurve3(
          kfList.map((k) => new THREE.Vector3(...k.pos)),
          false,
          "catmullrom",
          0.45
        ),
        lookSpline: new THREE.CatmullRomCurve3(
          kfList.map((k) => new THREE.Vector3(...k.look)),
          false,
          "catmullrom",
          0.45
        ),
      })),
    []
  );

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);
    const { progress: p, pointerX, pointerY } = scrollRef.current;
    const { chapterIdx, local } = getActiveSkillChapter(p);

    const aspect = size.width / Math.max(1, size.height);
    const portraitFactor = clamp01((1.18 - aspect) / 0.72);
    const zPullback = portraitFactor * 2.15;
    const yLiftMobile = portraitFactor * -0.35;
    const fovBoost = portraitFactor * 8;

    const u = clamp01(local);
    const { posSpline, lookSpline } = chapterSplines[chapterIdx];
    posSpline.getPoint(u, tempPos);
    lookSpline.getPoint(u, tempLook);

    const sample = sampleCameraPath(CHAPTER_CAMERA_PATHS[chapterIdx], u);
    const tx = tempPos.x + pointerX * 0.35;
    const ty = tempPos.y + pointerY * -0.24 + yLiftMobile;
    const tz = tempPos.z + zPullback;

    const lx = tempLook.x + pointerX * 0.12;
    const ly = tempLook.y + yLiftMobile * 0.85;
    const lz = tempLook.z;

    const tRoll = sample.roll + pointerX * -0.025;
    const tFov = sample.fov + fovBoost;

    // Snap cleanly when switching chapters so each chapter starts on its exact signature framing!
    if (lastChapterRef.current !== chapterIdx) {
      lastChapterRef.current = chapterIdx;
      smoothPos.set(tx, ty, tz);
      smoothLook.set(lx, ly, lz);
      smoothRoll.current = tRoll;
      smoothFov.current = tFov;
    } else {
      const damp = 1 - Math.exp(-9.0 * dt);
      smoothPos.x = THREE.MathUtils.lerp(smoothPos.x, tx, damp);
      smoothPos.y = THREE.MathUtils.lerp(smoothPos.y, ty, damp);
      smoothPos.z = THREE.MathUtils.lerp(smoothPos.z, tz, damp);

      smoothLook.x = THREE.MathUtils.lerp(smoothLook.x, lx, damp);
      smoothLook.y = THREE.MathUtils.lerp(smoothLook.y, ly, damp);
      smoothLook.z = THREE.MathUtils.lerp(smoothLook.z, lz, damp);

      smoothRoll.current = THREE.MathUtils.lerp(smoothRoll.current, tRoll, damp);
      smoothFov.current = THREE.MathUtils.lerp(smoothFov.current, tFov, damp);
    }

    camera.position.copy(smoothPos);
    camera.up.set(0, 1, 0);
    camera.lookAt(smoothLook);
    camera.rotateZ(smoothRoll.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      if (Math.abs(camera.fov - smoothFov.current) > 0.04) {
        camera.fov = smoothFov.current;
        camera.updateProjectionMatrix();
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 8, 6]} intensity={2.35} color="#FFFFFF" />
      <directionalLight position={[-6, -3, 4]} intensity={1.4} color="#38BDF8" />
      <pointLight position={[2.5, 1.5, 3]} intensity={1.7} distance={16} color="#C6FF3D" />
      <pointLight position={[-2.5, -1, 3]} intensity={1.5} distance={16} color="#FF6B4A" />

      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={3.2}
          position={[4, 5, 4]}
          scale={[8, 4, 1]}
          color="#FFFFFF"
        />
        <Lightformer
          form="rect"
          intensity={2.1}
          position={[-5, 2, 2]}
          scale={[6, 6, 1]}
          color="#38BDF8"
        />
        <Lightformer
          form="rect"
          intensity={1.9}
          position={[2, -4, 3]}
          scale={[6, 3, 1]}
          color="#C6FF3D"
        />
      </Environment>
    </>
  );
}

/**
 * WORLD 01 // CIVIL & STRUCTURAL SKYLINE SITE
 * Heroic High-Rise Seismic Diagrid Tower + Slewing Crane + Neighboring Structural Frames + Ground Grid
 */
function CivilWorld3D({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const floorRefs = useRef<(THREE.Group | null)[]>([]);
  const braceMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const craneJibRef = useRef<THREE.Group>(null);

  const levels = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);
  const colPositions: [number, number][] = useMemo(
    () => [
      [-0.68, -0.68],
      [0.68, -0.68],
      [-0.68, 0.68],
      [0.68, 0.68],
    ],
    []
  );

  const colorLow = useMemo(() => new THREE.Color("#F59E0B"), []);
  const colorHigh = useMemo(() => new THREE.Color("#C6FF3D"), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { progress: p, activeRow } = scrollRef.current;
    const { chapterIdx, local } = getActiveSkillChapter(p);

    if (groupRef.current) {
      groupRef.current.visible = chapterIdx === 0;
      if (chapterIdx !== 0) return;
    }

    for (let i = 0; i < levels.length; i++) {
      const fg = floorRefs.current[i];
      if (!fg) continue;
      const buildT = easeOutBack(clamp01((local * 1.65 - i * 0.08) / 0.38));
      const baseH = -1.35 + i * 0.43;
      const dropOffset = (1 - buildT) * 1.9;
      const seismicSway = Math.sin(t * 3.1 - i * 0.42) * (0.013 * (i + 1));

      fg.position.y = baseH + dropOffset;
      fg.position.x = seismicSway;
      fg.scale.setScalar(Math.max(0.001, Math.min(1.06, buildT)));

      const mat = braceMatRefs.current[i];
      if (mat) {
        const wave = 0.5 + 0.5 * Math.sin(t * 3.6 - i * 0.65 + local * 2.8);
        tempColor.copy(colorLow).lerp(colorHigh, wave);
        mat.color.copy(tempColor);
        mat.emissive.copy(tempColor);
        mat.emissiveIntensity = 0.38 + wave * 0.52;
      }
    }

    if (craneJibRef.current) {
      craneJibRef.current.rotation.y = -0.5 + t * 0.45 + local * 2.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Wide 3D Structural Site Grid & Atmospheric Dust for Optical Flow */}
      <gridHelper args={[16, 24, "#F59E0B", "#261B10"]} position={[0, -1.68, 0]} />
      <Sparkles count={45} scale={[9, 6, 9]} size={2.4} speed={0.35} color="#FACC15" />

      {/* Surrounding Context Structural Pylons in 3D Depth (Enhances Camera Parallax!) */}
      {[
        [-2.8, -0.75, -2.2, 1.8],
        [2.9, -0.55, -2.5, 2.2],
        [-2.2, -0.95, 2.1, 1.4],
      ].map(([bx, by, bz, bh], idx) => (
        <RoundedBox
          key={idx}
          args={[0.62, bh, 0.62]}
          radius={0.07}
          smoothness={3}
          position={[bx, by, bz]}
        >
          <meshStandardMaterial
            color="#181310"
            metalness={0.75}
            roughness={0.32}
            transparent
            opacity={0.75}
          />
        </RoundedBox>
      ))}

      {/* Main Hero Diagrid Skyscraper at [0.25, 0, 0] */}
      <group position={[0.25, 0, 0]}>
        <RoundedBox
          args={[2.45, 0.18, 2.45]}
          radius={0.07}
          smoothness={4}
          position={[0, -1.58, 0]}
        >
          <meshStandardMaterial color="#111C2E" metalness={0.82} roughness={0.22} />
        </RoundedBox>

        <RoundedBox
          args={[0.58, 3.05, 0.58]}
          radius={0.08}
          smoothness={4}
          position={[0, -0.02, 0]}
        >
          <meshStandardMaterial color="#1E293B" metalness={0.75} roughness={0.28} />
        </RoundedBox>

        {levels.map((lvl) => (
          <group
            key={lvl}
            ref={(el) => {
              floorRefs.current[lvl] = el;
            }}
          >
            <RoundedBox args={[1.54, 0.065, 1.54]} radius={0.028} smoothness={3}>
              <meshStandardMaterial color="#253449" metalness={0.8} roughness={0.22} />
            </RoundedBox>

            {colPositions.map(([cx, cz], ci) => (
              <mesh key={ci} position={[cx, 0.215, cz]}>
                <cylinderGeometry args={[0.044, 0.044, 0.43, 12]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.18} />
              </mesh>
            ))}

            {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotY, fi) => (
              <group key={fi} rotation={[0, rotY, 0]}>
                <mesh position={[0, 0.215, 0.69]} rotation={[0, 0, 0.98]}>
                  <cylinderGeometry args={[0.019, 0.019, 1.58, 8]} />
                  <meshStandardMaterial
                    ref={
                      fi === 0
                        ? (m) => {
                            braceMatRefs.current[lvl] = m;
                          }
                        : undefined
                    }
                    color="#F59E0B"
                    emissive="#F59E0B"
                    emissiveIntensity={0.45}
                    metalness={0.7}
                    roughness={0.2}
                  />
                </mesh>
                <mesh position={[0, 0.215, 0.69]} rotation={[0, 0, -0.98]}>
                  <cylinderGeometry args={[0.019, 0.019, 1.58, 8]} />
                  <meshStandardMaterial
                    color="#F59E0B"
                    emissive="#F59E0B"
                    emissiveIntensity={0.4}
                    metalness={0.7}
                    roughness={0.2}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {/* Rooftop Slewing Tower Crane */}
        <group position={[0, 1.62, 0]}>
          <RoundedBox
            args={[0.16, 0.68, 0.16]}
            radius={0.035}
            smoothness={3}
            position={[0, 0.34, 0]}
          >
            <meshStandardMaterial color="#FACC15" metalness={0.65} roughness={0.26} />
          </RoundedBox>

          <group ref={craneJibRef} position={[0, 0.68, 0]}>
            <RoundedBox
              args={[2.1, 0.09, 0.11]}
              radius={0.03}
              smoothness={3}
              position={[0.66, 0, 0]}
            >
              <meshStandardMaterial color="#FACC15" metalness={0.7} roughness={0.24} />
            </RoundedBox>
            <RoundedBox
              args={[0.32, 0.18, 0.24]}
              radius={0.04}
              smoothness={3}
              position={[-0.48, -0.02, 0]}
            >
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </RoundedBox>
            <mesh position={[1.32, -0.36, 0]}>
              <cylinderGeometry args={[0.009, 0.009, 0.68, 8]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
            <RoundedBox
              args={[0.52, 0.085, 0.12]}
              radius={0.03}
              smoothness={3}
              position={[1.32, -0.72, 0]}
            >
              <meshStandardMaterial
                color="#C6FF3D"
                emissive="#C6FF3D"
                emissiveIntensity={0.65}
              />
            </RoundedBox>
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * WORLD 02 // SOFTWARE & SYSTEMS FPV COMPUTE TUNNEL
 * Exploding 3x3x3 Beveled Squircle Compute Matrix + Deep Z-Corridor Gates & Streaming Data Capsules
 */
function SoftwareWorld3D({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);

  const coords = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          list.push([x, y, z]);
        }
      }
    }
    return list;
  }, []);

  const packets = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        laneX: ((i % 5) - 2) * 0.72,
        laneY: (((i * 3) % 5) - 2) * 0.62,
        speed: 3.2 + (i % 4) * 0.9,
        phase: i * 0.55,
        isLime: i % 2 === 0,
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { progress: p } = scrollRef.current;
    const { chapterIdx, local } = getActiveSkillChapter(p);

    if (groupRef.current) {
      groupRef.current.visible = chapterIdx === 1;
      if (chapterIdx !== 1) return;
    }

    // Open wide tunnel corridor smoothly as FPV camera rockets through the matrix!
    const explode = 0.88 + Math.sin(local * Math.PI * 0.88) * 0.72;

    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 1.6;
      coreRef.current.rotation.x = t * 1.15;
      coreRef.current.position.z = -0.85;
      const pulse = 1 + Math.sin(t * 4.2) * 0.12;
      coreRef.current.scale.setScalar(pulse);
    }

    coords.forEach(([cx, cy, cz], idx) => {
      const m = nodeRefs.current[idx];
      if (!m) return;
      const wave = Math.sin(t * 2.8 + cx * 1.2 + cy * 1.5 + cz * 1.1) * 0.09;
      // Push center-lane blocks slightly outward so FPV camera flies cleanly through!
      const clearCenter = cx === 0 && cy === 0 ? 0.55 : 0;
      const dist = explode + wave;
      m.position.set(
        cx * dist + (cx === 0 ? clearCenter : 0),
        cy * dist,
        cz * dist * 1.25 - 0.6
      );
      m.rotation.x = t * 0.25 * cx;
      m.rotation.y = t * 0.3 * cy;
    });

    // High-speed Z-corridor streaming data capsules rushing past camera!
    packets.forEach((pk, idx) => {
      const pm = packetRefs.current[idx];
      if (!pm) return;
      const zTravel = 3.5 - ((t * pk.speed + pk.phase) % 9.5);
      pm.position.set(pk.laneX, pk.laneY, zTravel);
    });
  });

  return (
    <group ref={groupRef}>
      <gridHelper args={[18, 24, "#38BDF8", "#0A1936"]} position={[0, -2.25, -1]} />
      <Sparkles count={60} scale={[8, 6, 10]} size={2.5} speed={0.55} color="#38BDF8" />

      {/* Central Glowing Volt-Lime Solver Core */}
      <group ref={coreRef}>
        <RoundedBox args={[0.56, 0.56, 0.56]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color="#C6FF3D"
            emissive="#C6FF3D"
            emissiveIntensity={1.05}
            metalness={0.25}
            roughness={0.15}
          />
        </RoundedBox>
      </group>

      {/* Deep Z-Tunnel Portal Rings (Rounded Squircle Frames along Z = +1.5 .. -4.5) */}
      {[1.4, -0.6, -2.6, -4.6].map((rz, i) => (
        <group key={i} position={[0, 0, rz]}>
          <mesh position={[0, 1.95, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 4.4, 8]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.35} />
          </mesh>
          <mesh position={[0, -1.95, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 4.4, 8]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.35} />
          </mesh>
        </group>
      ))}

      {/* 26 Tactile Beveled Squircle 3D Compute Nodes */}
      {coords.map((pos, idx) => {
        const sum = Math.abs(pos[0]) + Math.abs(pos[1]) + Math.abs(pos[2]);
        const col =
          idx % 6 === 0
            ? "#2563EB"
            : sum === 3
              ? "#15325B"
              : "#0D1E3A";
        const emissiveCol = idx % 4 === 0 ? "#38BDF8" : "#1D4ED8";
        return (
          <group
            key={idx}
            ref={(el) => {
              nodeRefs.current[idx] = el;
            }}
          >
            <RoundedBox args={[0.44, 0.44, 0.44]} radius={0.11} smoothness={4}>
              <meshPhysicalMaterial
                color={col}
                emissive={emissiveCol}
                emissiveIntensity={idx % 4 === 0 ? 0.35 : 0.1}
                metalness={0.72}
                roughness={0.18}
                clearcoat={0.9}
                clearcoatRoughness={0.12}
              />
            </RoundedBox>
          </group>
        );
      })}

      {/* Z-Axis Streaming Data Capsules */}
      {packets.map((pk, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            packetRefs.current[idx] = el;
          }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <capsuleGeometry args={[0.034, 0.26, 6, 10]} />
          <meshStandardMaterial
            color={pk.isLime ? "#C6FF3D" : "#38BDF8"}
            emissive={pk.isLime ? "#C6FF3D" : "#38BDF8"}
            emissiveIntensity={1.35}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * WORLD 03 // UI/UX & 3D SPATIAL GALLERY
 * Staggered Frosted Rounded-2xl Glass UI Screens Arranged for S-Curve Lateral Dolly Slalom!
 */
function DesignWorld3D({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const planeRefs = useRef<(THREE.Group | null)[]>([]);
  const keyframeRefs = useRef<(THREE.Group | null)[]>([]);

  // Staggered X/Y/Z spatial gallery positions so lateral S-curve camera slaloms right past each screen!
  const cardAnchors: [number, number, number, number][] = useMemo(
    () => [
      [-1.35, 0.18, 1.15, 0.22],
      [1.25, -0.12, 0.25, -0.24],
      [-1.05, 0.22, -0.85, 0.18],
      [1.15, -0.05, -1.85, -0.2],
    ],
    []
  );

  const { curve, ribbonGeo } = useMemo(() => {
    // Routed cleanly in the open Z-corridors between cards (z = 1.15, 0.25, -0.85, -1.85) — zero mesh clipping!
    const c = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-2.65, -0.55, 1.58),
        new THREE.Vector3(-0.15, 0.78, 0.72),
        new THREE.Vector3(0.15, -0.62, -0.32),
        new THREE.Vector3(-0.1, 0.75, -1.35),
        new THREE.Vector3(2.25, -0.35, -2.25),
      ],
      false,
      "catmullrom",
      0.5
    );
    const geo = new THREE.TubeGeometry(c, 96, 0.052, 20, false);
    return { curve: c, ribbonGeo: geo };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { progress: p } = scrollRef.current;
    const { chapterIdx, local } = getActiveSkillChapter(p);

    if (groupRef.current) {
      groupRef.current.visible = chapterIdx === 2;
      if (chapterIdx !== 2) return;
    }

    for (let i = 0; i < 4; i++) {
      const pl = planeRefs.current[i];
      if (!pl) continue;
      const [ax, ay, az, rotY] = cardAnchors[i];
      // 100% smooth continuous scroll + breathing motion (ZERO discrete step jumps!)
      const scrollGlideY = (local - 0.5) * (i % 2 === 0 ? 0.18 : -0.18);
      const floatY = ay + scrollGlideY + Math.sin(t * 1.7 + i * 1.1) * 0.055;
      pl.position.set(ax, floatY, az);
      pl.rotation.y = rotY + (local - 0.5) * 0.26;
      pl.rotation.z = Math.sin(t * 1.2 + i) * 0.02;
    }

    for (let k = 0; k < 6; k++) {
      const km = keyframeRefs.current[k];
      if (!km) continue;
      const u = (t * 0.2 + k * (1 / 6)) % 1;
      const pt = curve.getPointAt(u);
      km.position.copy(pt);
      km.rotation.x = t * 1.8 + k;
      km.rotation.y = t * 1.4;
    }
  });

  const layerColors = ["#38BDF8", "#A855F7", "#C6FF3D", "#FF6B4A"];

  return (
    <group ref={groupRef}>
      <gridHelper args={[18, 24, "#A855F7", "#151936"]} position={[0, -1.85, -0.5]} />
      <Sparkles count={50} scale={[9, 5, 8]} size={2.2} speed={0.4} color="#C6FF3D" />

      {/* 4 Staggered Spatial Rounded-2xl Specular UI Screens (depthWrite prevents Z-sort pop!) */}
      {[0, 1, 2, 3].map((idx) => (
        <group
          key={idx}
          ref={(el) => {
            planeRefs.current[idx] = el;
          }}
        >
          <RoundedBox args={[2.1, 1.36, 0.055]} radius={0.14} smoothness={4}>
            <meshPhysicalMaterial
              color="#141E3B"
              metalness={0.35}
              roughness={0.15}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </RoundedBox>

          <RoundedBox
            args={[0.72, 0.15, 0.035]}
            radius={0.055}
            smoothness={3}
            position={[-0.52, 0.4, 0.036]}
          >
            <meshStandardMaterial
              color={layerColors[idx]}
              emissive={layerColors[idx]}
              emissiveIntensity={0.65}
            />
          </RoundedBox>

          <RoundedBox
            args={[0.82, 0.08, 0.03]}
            radius={0.035}
            smoothness={3}
            position={[0.4, 0.4, 0.034]}
          >
            <meshStandardMaterial color="#475569" roughness={0.3} />
          </RoundedBox>

          <RoundedBox
            args={[1.1, 0.52, 0.035]}
            radius={0.09}
            smoothness={4}
            position={[-0.32, -0.1, 0.036]}
          >
            <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.25} />
          </RoundedBox>

          <RoundedBox
            args={[0.52, 0.52, 0.04]}
            radius={0.11}
            smoothness={4}
            position={[0.58, -0.1, 0.038]}
          >
            <meshStandardMaterial
              color={layerColors[(idx + 2) % 4]}
              emissive={layerColors[(idx + 2) % 4]}
              emissiveIntensity={0.5}
            />
          </RoundedBox>
        </group>
      ))}

      {/* Smooth 3D Bezier Motion Spline Weaving Through Gallery */}
      <mesh geometry={ribbonGeo}>
        <meshStandardMaterial
          color="#C6FF3D"
          emissive="#C6FF3D"
          emissiveIntensity={0.68}
          metalness={0.35}
          roughness={0.18}
        />
      </mesh>

      {[0, 1, 2, 3, 4, 5].map((k) => (
        <group
          key={k}
          ref={(el) => {
            keyframeRefs.current[k] = el;
          }}
        >
          <RoundedBox args={[0.19, 0.19, 0.19]} radius={0.055} smoothness={3}>
            <meshStandardMaterial
              color={k % 2 === 0 ? "#FFFFFF" : "#38BDF8"}
              emissive={k % 2 === 0 ? "#C6FF3D" : "#38BDF8"}
              emissiveIntensity={0.95}
            />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

/**
 * WORLD 04 // OFF-CLOCK MIDNIGHT STUDIO STAGE
 * Angled 6-String Guitar Fretboard Runway + Spinning Walnut Vinyl Turntable + 112-BPM Curved EQ Stage
 */
function HobbiesWorld3D({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const eqBarRefs = useRef<(THREE.Group | null)[]>([]);
  const stringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const turntableRef = useRef<THREE.Group>(null);
  const vinylDiscRef = useRef<THREE.Mesh>(null);

  const frets = useMemo(() => Array.from({ length: 11 }, (_, i) => -1.55 + i * 0.31), []);
  const strings = useMemo(() => Array.from({ length: 6 }, (_, i) => -0.22 + i * 0.088), []);
  const eqBars = useMemo(() => Array.from({ length: 18 }, (_, i) => i), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { progress: p } = scrollRef.current;
    const { chapterIdx } = getActiveSkillChapter(p);

    if (groupRef.current) {
      groupRef.current.visible = chapterIdx === 3;
      if (chapterIdx !== 3) return;
    }

    const beatOmega = (112 / 60) * Math.PI * 2;
    for (let i = 0; i < eqBars.length; i++) {
      const bar = eqBarRefs.current[i];
      if (!bar) continue;
      const groove =
        0.35 +
        0.45 * Math.abs(Math.sin(t * beatOmega * 0.5 + i * 0.45)) +
        0.28 * Math.abs(Math.cos(t * beatOmega + i * 0.85));
      const h = Math.max(0.26, groove * 2.15);
      bar.scale.y = h;
      bar.position.y = -1.42 + h * 0.5;
    }

    for (let s = 0; s < strings.length; s++) {
      const sm = stringRefs.current[s];
      if (!sm) continue;
      const vib = Math.sin(t * (22 + s * 5)) * 0.013;
      sm.position.x = strings[s] + vib;
    }

    if (turntableRef.current) {
      turntableRef.current.position.y = 0.48 + Math.sin(t * 1.5) * 0.08;
    }
    if (vinylDiscRef.current) {
      vinylDiscRef.current.rotation.y = t * 2.6;
    }
  });

  const eqPalette = ["#FF6B4A", "#C084FC", "#FACC15", "#38BDF8", "#C6FF3D"];

  return (
    <group ref={groupRef}>
      <gridHelper args={[18, 24, "#FF6B4A", "#24102C"]} position={[0, -1.45, 0]} />
      <Sparkles count={50} scale={[9, 5, 8]} size={2.4} speed={0.45} color="#FF6B4A" />

      {/* Sweeping Angled 6-String Electric Guitar Fretboard Runway */}
      <group position={[-0.25, 0.02, 0.45]} rotation={[0.38, 0.22, -0.58]}>
        <RoundedBox args={[0.68, 3.55, 0.14]} radius={0.055} smoothness={4}>
          <meshStandardMaterial color="#1A1023" metalness={0.6} roughness={0.28} />
        </RoundedBox>

        <RoundedBox
          args={[0.74, 0.25, 0.15]}
          radius={0.05}
          smoothness={3}
          position={[0, -1.66, 0.075]}
        >
          <meshStandardMaterial color="#FACC15" metalness={0.9} roughness={0.16} />
        </RoundedBox>

        {frets.map((fy, fi) => (
          <group key={fi}>
            <mesh position={[0, fy, 0.078]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.012, 0.012, 0.62, 8]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
            </mesh>
            {(fi === 2 || fi === 4 || fi === 6 || fi === 8) && (
              <RoundedBox
                args={[0.14, 0.058, 0.015]}
                radius={0.02}
                smoothness={2}
                position={[-0.14, fy - 0.15, 0.074]}
              >
                <meshBasicMaterial color="#C6FF3D" />
              </RoundedBox>
            )}
          </group>
        ))}

        {strings.map((sx, si) => (
          <mesh
            key={si}
            ref={(el) => {
              stringRefs.current[si] = el;
            }}
            position={[sx, 0.04, 0.095]}
          >
            <cylinderGeometry args={[0.0065, 0.0065, 3.4, 6]} />
            <meshStandardMaterial
              color={si < 2 ? "#FACC15" : "#38BDF8"}
              emissive={si < 2 ? "#FACC15" : "#38BDF8"}
              emissiveIntensity={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* 18-Pillar Semicircular 112-BPM 3D Studio Equalizer Horizon */}
      <group position={[0, 0, -0.65]}>
        {eqBars.map((idx) => {
          const col = eqPalette[idx % eqPalette.length];
          const angle = ((idx / (eqBars.length - 1)) - 0.5) * 1.45;
          const rx = Math.sin(angle) * 3.1;
          const rz = -Math.cos(angle) * 1.45;
          return (
            <group
              key={idx}
              ref={(el) => {
                eqBarRefs.current[idx] = el;
              }}
              position={[rx, -0.8, rz]}
              rotation={[0, -angle, 0]}
            >
              <RoundedBox args={[0.17, 1, 0.17]} radius={0.055} smoothness={3}>
                <meshStandardMaterial
                  color={col}
                  emissive={col}
                  emissiveIntensity={0.58}
                  metalness={0.45}
                  roughness={0.22}
                />
              </RoundedBox>
            </group>
          );
        })}
      </group>

      {/* Hero Walnut 3D Vinyl Turntable Platter (Sleek Plinth + Visible Spinning Record & Tonearm!) */}
      <group
        ref={turntableRef}
        position={[1.28, 0.36, 0.25]}
        rotation={[0.52, -0.32, 0.1]}
      >
        <RoundedBox args={[1.16, 0.14, 1.16]} radius={0.048} smoothness={4}>
          <meshStandardMaterial color="#5C3A21" metalness={0.35} roughness={0.38} />
        </RoundedBox>
        <mesh ref={vinylDiscRef} position={[-0.05, 0.088, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.024, 36]} />
          <meshStandardMaterial color="#09090B" metalness={0.88} roughness={0.14} />
        </mesh>
        <mesh position={[-0.05, 0.103, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.026, 24]} />
          <meshStandardMaterial
            color="#FF6B4A"
            emissive="#FF6B4A"
            emissiveIntensity={0.65}
          />
        </mesh>
        {/* Brushed Silver Tonearm */}
        <mesh position={[0.42, 0.12, -0.34]}>
          <cylinderGeometry args={[0.065, 0.065, 0.06, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
        <mesh position={[0.31, 0.135, -0.02]} rotation={[Math.PI / 2, 0, 0.34]}>
          <cylinderGeometry args={[0.014, 0.014, 0.68, 10]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
      </group>
    </group>
  );
}

export default function Skills3DStage({ scrollRef, active }: Skills3DStageProps) {
  const [webglReady, setWebglReady] = useState(true);

  useEffect(() => {
    try {
      const test = document.createElement("canvas");
      const gl = test.getContext("webgl2") || test.getContext("webgl");
      if (!gl) setWebglReady(false);
    } catch {
      setWebglReady(false);
    }
  }, []);

  if (!webglReady) return null;

  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [-3.15, -1.28, 3.85], fov: 50, near: 0.1, far: 45 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      className="pointer-events-none h-full w-full"
    >
      <SkillsCinemaRig scrollRef={scrollRef} />
      <CivilWorld3D scrollRef={scrollRef} />
      <SoftwareWorld3D scrollRef={scrollRef} />
      <DesignWorld3D scrollRef={scrollRef} />
      <HobbiesWorld3D scrollRef={scrollRef} />
    </Canvas>
  );
}
