"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";

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
  const c1 = 1.75;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/**
 * Only the 4 separated discipline 3D stages live in WebGL space!
 * Zero 3D cubes or grid lines on Beat 0 (45+ Intro) or Beat 5 (STAND OUT Finale).
 */
const STATION_Y = {
  civil: 0,
  software: -10.0,
  design: -20.0,
  hobbies: -30.0,
};

interface CamStop {
  p: number;
  y: number;
  z: number;
  roll: number;
  fov: number;
}

const CAM_STOPS: CamStop[] = [
  { p: 0.0, y: STATION_Y.civil + 2.2, z: 7.0, roll: 0.02, fov: 43 },
  { p: 0.16, y: STATION_Y.civil, z: 6.45, roll: -0.02, fov: 43 },
  { p: 0.3, y: STATION_Y.civil - 0.25, z: 6.1, roll: 0.015, fov: 42 },
  { p: 0.36, y: STATION_Y.software, z: 6.4, roll: 0.025, fov: 43 },
  { p: 0.49, y: STATION_Y.software - 0.2, z: 6.0, roll: -0.02, fov: 42 },
  { p: 0.55, y: STATION_Y.design, z: 6.3, roll: -0.02, fov: 43 },
  { p: 0.68, y: STATION_Y.design - 0.2, z: 5.95, roll: 0.018, fov: 42 },
  { p: 0.74, y: STATION_Y.hobbies, z: 6.35, roll: 0.02, fov: 43 },
  { p: 0.88, y: STATION_Y.hobbies - 0.2, z: 6.05, roll: -0.015, fov: 42 },
  { p: 1.0, y: STATION_Y.hobbies - 2.0, z: 6.8, roll: 0.0, fov: 43 },
];

/**
 * Scroll-Choreographed 3D Camera & Soft Studio Lighting Rig
 */
function SkillsCameraRig({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
}) {
  const { camera, size } = useThree();
  const smoothPos = useMemo(() => new THREE.Vector3(0, 0, 6.5), []);
  const smoothLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const smoothRoll = useRef(0);
  const smoothFov = useRef(43);

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);
    const { progress: p, pointerX, pointerY } = scrollRef.current;

    const aspect = size.width / Math.max(1, size.height);
    const isPortrait = aspect < 1.05;
    const zBoost = isPortrait ? 1.85 : 0;

    let a = CAM_STOPS[0];
    let b = CAM_STOPS[CAM_STOPS.length - 1];
    for (let i = 0; i < CAM_STOPS.length - 1; i++) {
      if (p >= CAM_STOPS[i].p && p <= CAM_STOPS[i + 1].p) {
        a = CAM_STOPS[i];
        b = CAM_STOPS[i + 1];
        break;
      }
    }

    const t = smoothstep(a.p, b.p, p);
    const targetY = THREE.MathUtils.lerp(a.y, b.y, t) + pointerY * 0.26;
    const targetZ = THREE.MathUtils.lerp(a.z, b.z, t) + zBoost;
    const targetX = pointerX * 0.38;
    const targetRoll = THREE.MathUtils.lerp(a.roll, b.roll, t) + pointerX * -0.02;
    const targetFov = THREE.MathUtils.lerp(a.fov, b.fov, t) + (isPortrait ? 6 : 0);

    const damp = 1 - Math.exp(-8.5 * dt);
    smoothPos.x = THREE.MathUtils.lerp(smoothPos.x, targetX, damp);
    smoothPos.y = THREE.MathUtils.lerp(smoothPos.y, targetY, damp);
    smoothPos.z = THREE.MathUtils.lerp(smoothPos.z, targetZ, damp);

    smoothLook.x = THREE.MathUtils.lerp(smoothLook.x, pointerX * 0.14, damp);
    smoothLook.y = THREE.MathUtils.lerp(
      smoothLook.y,
      THREE.MathUtils.lerp(a.y, b.y, t),
      damp
    );
    smoothLook.z = 0;

    camera.position.copy(smoothPos);
    camera.up.set(0, 1, 0);
    camera.lookAt(smoothLook);

    smoothRoll.current = THREE.MathUtils.lerp(smoothRoll.current, targetRoll, damp);
    camera.rotateZ(smoothRoll.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      smoothFov.current = THREE.MathUtils.lerp(smoothFov.current, targetFov, damp);
      if (Math.abs(camera.fov - smoothFov.current) > 0.04) {
        camera.fov = smoothFov.current;
        camera.updateProjectionMatrix();
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 8, 6]} intensity={2.3} color="#FFFFFF" />
      <directionalLight position={[-6, -4, 4]} intensity={1.35} color="#38BDF8" />
      <pointLight position={[3, -10, 3]} intensity={1.6} distance={16} color="#C6FF3D" />
      <pointLight position={[3, -30, 3]} intensity={1.6} distance={16} color="#FF6B4A" />

      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={3.2}
          position={[4, 4, 4]}
          scale={[8, 4, 1]}
          color="#FFFFFF"
        />
        <Lightformer
          form="rect"
          intensity={2}
          position={[-5, 2, 2]}
          scale={[6, 6, 1]}
          color="#38BDF8"
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[2, -4, 3]}
          scale={[6, 3, 1]}
          color="#C6FF3D"
        />
      </Environment>
    </>
  );
}

/**
 * 01 // CIVIL & STRUCTURAL — Beveled Architectural Steel Diagrid Tower + Slewing Tower Crane
 */
function CivilSkyscraper3D({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
}) {
  const { size } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  const floorRefs = useRef<(THREE.Group | null)[]>([]);
  const braceMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const craneJibRef = useRef<THREE.Group>(null);

  const levels = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);
  const colPositions: [number, number][] = useMemo(
    () => [
      [-0.66, -0.66],
      [0.66, -0.66],
      [-0.66, 0.66],
      [0.66, 0.66],
    ],
    []
  );

  const colorLow = useMemo(() => new THREE.Color("#F59E0B"), []);
  const colorHigh = useMemo(() => new THREE.Color("#C6FF3D"), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { progress: p, pointerX, pointerY, activeRow } = scrollRef.current;
    const aspect = size.width / Math.max(1, size.height);
    const isDesktop = aspect >= 1.05;

    const local = clamp01((p - 0.11) / 0.21);

    if (rootRef.current) {
      const targetX = isDesktop ? 1.82 : 0;
      const targetY = STATION_Y.civil + (isDesktop ? -0.34 : 0.88);
      const scale = isDesktop ? 0.88 : 0.56;
      rootRef.current.position.set(targetX, targetY, 0);
      rootRef.current.scale.setScalar(scale);
      rootRef.current.rotation.y =
        -0.58 + local * 1.15 + Math.sin(t * 0.45) * 0.12 + pointerX * 0.35;
      rootRef.current.rotation.x = 0.14 + pointerY * -0.16;
    }

    for (let i = 0; i < levels.length; i++) {
      const fg = floorRefs.current[i];
      if (!fg) continue;
      const buildT = easeOutBack(clamp01((local * 1.55 - i * 0.09) / 0.42));
      const baseH = -1.35 + i * 0.42;
      const dropOffset = (1 - buildT) * 1.75;
      const seismicSway = Math.sin(t * 3.1 - i * 0.42) * (0.012 * (i + 1));

      fg.position.y = baseH + dropOffset;
      fg.position.x = seismicSway;
      fg.scale.setScalar(Math.max(0.001, Math.min(1.06, buildT)));

      const mat = braceMatRefs.current[i];
      if (mat) {
        const wave = 0.5 + 0.5 * Math.sin(t * 3.6 - i * 0.65 + activeRow * 0.9);
        tempColor.copy(colorLow).lerp(colorHigh, wave);
        mat.color.copy(tempColor);
        mat.emissive.copy(tempColor);
        mat.emissiveIntensity = 0.35 + wave * 0.5;
      }
    }

    if (craneJibRef.current) {
      craneJibRef.current.rotation.y = t * 0.55 + local * 1.8;
    }
  });

  return (
    <group ref={rootRef}>
      {/* Tactile Rounded Architectural Plinth */}
      <RoundedBox args={[2.35, 0.18, 2.35]} radius={0.07} smoothness={4} position={[0, -1.58, 0]}>
        <meshStandardMaterial color="#111C2E" metalness={0.8} roughness={0.22} />
      </RoundedBox>

      {/* Rounded Inner Structural Shear Core */}
      <RoundedBox args={[0.56, 2.95, 0.56]} radius={0.08} smoothness={4} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#1E293B" metalness={0.75} roughness={0.28} />
      </RoundedBox>

      {/* 7 Modular Diagrid Stories with Chamfered Slabs */}
      {levels.map((lvl) => (
        <group
          key={lvl}
          ref={(el) => {
            floorRefs.current[lvl] = el;
          }}
        >
          <RoundedBox args={[1.5, 0.065, 1.5]} radius={0.028} smoothness={3}>
            <meshStandardMaterial color="#253449" metalness={0.8} roughness={0.22} />
          </RoundedBox>

          {colPositions.map(([cx, cz], ci) => (
            <mesh key={ci} position={[cx, 0.21, cz]}>
              <cylinderGeometry args={[0.042, 0.042, 0.42, 12]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.18} />
            </mesh>
          ))}

          {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotY, fi) => (
            <group key={fi} rotation={[0, rotY, 0]}>
              <mesh position={[0, 0.21, 0.67]} rotation={[0, 0, 0.98]}>
                <cylinderGeometry args={[0.018, 0.018, 1.54, 8]} />
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
              <mesh position={[0, 0.21, 0.67]} rotation={[0, 0, -0.98]}>
                <cylinderGeometry args={[0.018, 0.018, 1.54, 8]} />
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

      {/* Top Tower Crane Mast & Slewing Jib */}
      <group position={[0, 1.56, 0]}>
        <RoundedBox args={[0.15, 0.66, 0.15]} radius={0.035} smoothness={3} position={[0, 0.33, 0]}>
          <meshStandardMaterial color="#FACC15" metalness={0.65} roughness={0.26} />
        </RoundedBox>

        <group ref={craneJibRef} position={[0, 0.66, 0]}>
          <RoundedBox args={[1.9, 0.085, 0.1]} radius={0.03} smoothness={3} position={[0.6, 0, 0]}>
            <meshStandardMaterial color="#FACC15" metalness={0.7} roughness={0.24} />
          </RoundedBox>
          <RoundedBox args={[0.3, 0.17, 0.22]} radius={0.04} smoothness={3} position={[-0.46, -0.02, 0]}>
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </RoundedBox>
          <mesh position={[1.18, -0.35, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.66, 8]} />
            <meshBasicMaterial color="#E2E8F0" />
          </mesh>
          <RoundedBox args={[0.48, 0.08, 0.11]} radius={0.03} smoothness={3} position={[1.18, -0.7, 0]}>
            <meshStandardMaterial
              color="#C6FF3D"
              emissive="#C6FF3D"
              emissiveIntensity={0.55}
            />
          </RoundedBox>
        </group>
      </group>
    </group>
  );
}

/**
 * 02 // SOFTWARE & SYSTEMS — Tactile Rounded-Squircle 3D Compute Cluster & Streaming Data Capsules
 */
function SoftwareComputeMatrix3D({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
}) {
  const { size } = useThree();
  const rootRef = useRef<THREE.Group>(null);
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
      Array.from({ length: 14 }, (_, i) => ({
        axis: i % 3,
        laneA: ((i % 5) - 2) * 0.48,
        laneB: (((i * 2) % 5) - 2) * 0.48,
        speed: 1.75 + (i % 4) * 0.5,
        phase: i * 0.65,
        isLime: i % 2 === 0,
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { progress: p, pointerX, pointerY, activeRow } = scrollRef.current;
    const aspect = size.width / Math.max(1, size.height);
    const isDesktop = aspect >= 1.05;

    const local = clamp01((p - 0.31) / 0.21);
    const explode = 0.62 + Math.sin(local * Math.PI * 0.9) * 0.4 + activeRow * 0.04;

    if (rootRef.current) {
      const targetX = isDesktop ? 1.85 : 0;
      const targetY = STATION_Y.software + (isDesktop ? 0 : 0.94);
      rootRef.current.position.set(targetX, targetY, 0);
      rootRef.current.scale.setScalar(isDesktop ? 0.98 : 0.6);
      rootRef.current.rotation.y = 0.68 + local * 1.6 + t * 0.28 + pointerX * 0.38;
      rootRef.current.rotation.x = 0.38 + Math.sin(t * 0.5) * 0.08 + pointerY * -0.2;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 1.4;
      coreRef.current.rotation.x = t * 1.0;
      const pulse = 1 + Math.sin(t * 4.0) * 0.1;
      coreRef.current.scale.setScalar(pulse);
    }

    coords.forEach(([cx, cy, cz], idx) => {
      const m = nodeRefs.current[idx];
      if (!m) return;
      const wave = Math.sin(t * 3.0 + cx * 1.2 + cy * 1.5 + cz * 1.1) * 0.08;
      const dist = explode + wave;
      m.position.set(cx * dist, cy * dist, cz * dist);
    });

    packets.forEach((pk, idx) => {
      const pm = packetRefs.current[idx];
      if (!pm) return;
      const travel = ((t * pk.speed + pk.phase) % 3.4) - 1.7;
      if (pk.axis === 0) pm.position.set(travel, pk.laneA, pk.laneB);
      else if (pk.axis === 1) pm.position.set(pk.laneA, travel, pk.laneB);
      else pm.position.set(pk.laneA, pk.laneB, travel);
    });
  });

  return (
    <group ref={rootRef}>
      {/* Soft-Beveled Glowing Volt-Lime Solver Core */}
      <group ref={coreRef}>
        <RoundedBox args={[0.52, 0.52, 0.52]} radius={0.14} smoothness={4}>
          <meshStandardMaterial
            color="#C6FF3D"
            emissive="#C6FF3D"
            emissiveIntensity={0.95}
            metalness={0.25}
            roughness={0.15}
          />
        </RoundedBox>
      </group>

      {/* Smooth Cylindrical Bus Conduits */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 3.4, 10]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.016, 0.016, 3.4, 10]} />
        <meshBasicMaterial color="#C6FF3D" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 3.4, 10]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} />
      </mesh>

      {/* 26 Tactile Beveled Squircle 3D Compute Blocks (Matches Act 1 Squircle Theme!) */}
      {coords.map((pos, idx) => {
        const sum = Math.abs(pos[0]) + Math.abs(pos[1]) + Math.abs(pos[2]);
        const col =
          idx % 7 === 0
            ? "#2563EB"
            : sum === 3
              ? "#15325B"
              : "#0D1E3A";
        const emissiveCol = idx % 5 === 0 ? "#38BDF8" : "#1D4ED8";
        return (
          <group
            key={idx}
            ref={(el) => {
              nodeRefs.current[idx] = el;
            }}
          >
            <RoundedBox args={[0.39, 0.39, 0.39]} radius={0.095} smoothness={4}>
              <meshPhysicalMaterial
                color={col}
                emissive={emissiveCol}
                emissiveIntensity={idx % 5 === 0 ? 0.32 : 0.08}
                metalness={0.72}
                roughness={0.18}
                clearcoat={0.9}
                clearcoatRoughness={0.12}
              />
            </RoundedBox>
          </group>
        );
      })}

      {/* Smooth Capsule Data Packets */}
      {packets.map((pk, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            packetRefs.current[idx] = el;
          }}
          rotation={
            pk.axis === 0
              ? [0, 0, Math.PI / 2]
              : pk.axis === 2
                ? [Math.PI / 2, 0, 0]
                : [0, 0, 0]
          }
        >
          <capsuleGeometry args={[0.032, 0.16, 6, 10]} />
          <meshStandardMaterial
            color={pk.isLime ? "#C6FF3D" : "#38BDF8"}
            emissive={pk.isLime ? "#C6FF3D" : "#38BDF8"}
            emissiveIntensity={1.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 03 // UI/UX & 3D MOTION — Exploded Rounded-2xl Frosted Glass UI Cards & Smooth 3D Spline
 */
function DesignSpatialStack3D({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
}) {
  const { size } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  const planeRefs = useRef<(THREE.Group | null)[]>([]);
  const keyframeRefs = useRef<(THREE.Group | null)[]>([]);

  // Silky smooth 3D Bezier Motion Ribbon (radialSegments = 20 -> smooth organic flow!)
  const { curve, ribbonGeo } = useMemo(() => {
    const c = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-1.65, -0.95, -0.9),
        new THREE.Vector3(-0.75, 0.85, -0.35),
        new THREE.Vector3(0.15, -0.62, 0.25),
        new THREE.Vector3(0.95, 0.88, 0.75),
        new THREE.Vector3(1.65, -0.35, 1.15),
      ],
      false,
      "catmullrom",
      0.5
    );
    const geo = new THREE.TubeGeometry(c, 84, 0.055, 20, false);
    return { curve: c, ribbonGeo: geo };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { progress: p, pointerX, pointerY, activeRow } = scrollRef.current;
    const aspect = size.width / Math.max(1, size.height);
    const isDesktop = aspect >= 1.05;

    const local = clamp01((p - 0.5) / 0.21);
    const spread = 0.24 + easeOutBack(clamp01(local * 1.4)) * 0.42;

    if (rootRef.current) {
      const targetX = isDesktop ? 1.82 : 0;
      const targetY = STATION_Y.design + (isDesktop ? 0 : 0.94);
      rootRef.current.position.set(targetX, targetY, 0);
      rootRef.current.scale.setScalar(isDesktop ? 0.96 : 0.6);
      rootRef.current.rotation.y =
        -0.48 + local * 0.65 + Math.sin(t * 0.6) * 0.1 + pointerX * 0.36;
      rootRef.current.rotation.x = 0.18 + pointerY * -0.22;
    }

    for (let i = 0; i < 4; i++) {
      const pl = planeRefs.current[i];
      if (!pl) continue;
      const zTarget = (i - 1.5) * spread * 1.45;
      const floatY = Math.sin(t * 2.1 + i * 0.9) * 0.06 + (activeRow === i ? 0.12 : 0);
      pl.position.z = zTarget;
      pl.position.y = floatY;
      pl.rotation.z = Math.sin(t * 1.2 + i) * 0.025;
    }

    for (let k = 0; k < 5; k++) {
      const km = keyframeRefs.current[k];
      if (!km) continue;
      const u = (t * 0.22 + k * 0.2) % 1;
      const pt = curve.getPointAt(u);
      km.position.copy(pt);
      km.rotation.x = t * 1.8 + k;
      km.rotation.y = t * 1.4;
    }
  });

  const layerColors = ["#38BDF8", "#A855F7", "#C6FF3D", "#FF6B4A"];

  return (
    <group ref={rootRef}>
      {/* 4 Exploded Spatial Rounded-2xl Frosted UI Cards */}
      {[0, 1, 2, 3].map((idx) => (
        <group
          key={idx}
          ref={(el) => {
            planeRefs.current[idx] = el;
          }}
        >
          <RoundedBox args={[2.18, 1.4, 0.055]} radius={0.14} smoothness={4}>
            <meshPhysicalMaterial
              color="#131C36"
              transparent
              opacity={0.78}
              metalness={0.3}
              roughness={0.14}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </RoundedBox>

          {/* Rounded UI Pill Header */}
          <RoundedBox
            args={[0.74, 0.15, 0.035]}
            radius={0.055}
            smoothness={3}
            position={[-0.54, 0.42, 0.036]}
          >
            <meshStandardMaterial
              color={layerColors[idx]}
              emissive={layerColors[idx]}
              emissiveIntensity={0.6}
            />
          </RoundedBox>

          {/* Rounded Secondary Bar */}
          <RoundedBox
            args={[0.84, 0.08, 0.03]}
            radius={0.035}
            smoothness={3}
            position={[0.42, 0.42, 0.034]}
          >
            <meshStandardMaterial color="#475569" roughness={0.3} />
          </RoundedBox>

          {/* Rounded Content Widget */}
          <RoundedBox
            args={[1.14, 0.54, 0.035]}
            radius={0.09}
            smoothness={4}
            position={[-0.34, -0.1, 0.036]}
          >
            <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.25} />
          </RoundedBox>

          {/* Rounded Accent Swatch Squircle */}
          <RoundedBox
            args={[0.54, 0.54, 0.04]}
            radius={0.11}
            smoothness={4}
            position={[0.62, -0.1, 0.038]}
          >
            <meshStandardMaterial
              color={layerColors[(idx + 2) % 4]}
              emissive={layerColors[(idx + 2) % 4]}
              emissiveIntensity={0.45}
            />
          </RoundedBox>
        </group>
      ))}

      {/* Smooth Glowing 3D Bezier Motion Spline */}
      <mesh geometry={ribbonGeo}>
        <meshStandardMaterial
          color="#C6FF3D"
          emissive="#C6FF3D"
          emissiveIntensity={0.65}
          metalness={0.35}
          roughness={0.18}
        />
      </mesh>

      {/* Rounded Tactile Squircle Keyframe Nodes Gliding Along Curve */}
      {[0, 1, 2, 3, 4].map((k) => (
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
 * 04 // OFF-CLOCK HOBBIES — Rounded 3D Guitar Neck + Soft-Top 112 BPM EQ Pillars + 3D Vinyl Turntable Deck
 */
function HobbiesSynthGuitar3D({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<SkillsScrollState>;
}) {
  const { size } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  const eqBarRefs = useRef<(THREE.Group | null)[]>([]);
  const stringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const turntableRef = useRef<THREE.Group>(null);
  const vinylDiscRef = useRef<THREE.Mesh>(null);

  const frets = useMemo(() => Array.from({ length: 10 }, (_, i) => -1.28 + i * 0.28), []);
  const strings = useMemo(() => Array.from({ length: 6 }, (_, i) => -0.2 + i * 0.08), []);
  const eqBars = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { progress: p, pointerX, pointerY } = scrollRef.current;
    const aspect = size.width / Math.max(1, size.height);
    const isDesktop = aspect >= 1.05;

    const local = clamp01((p - 0.69) / 0.19);

    if (rootRef.current) {
      const targetX = isDesktop ? 1.82 : 0;
      const targetY = STATION_Y.hobbies + (isDesktop ? -0.05 : 0.92);
      rootRef.current.position.set(targetX, targetY, 0);
      rootRef.current.scale.setScalar(isDesktop ? 0.96 : 0.58);
      rootRef.current.rotation.y =
        -0.36 + local * 0.72 + Math.sin(t * 0.55) * 0.1 + pointerX * 0.35;
      rootRef.current.rotation.x = 0.2 + pointerY * -0.18;
    }

    const beatOmega = (112 / 60) * Math.PI * 2;
    for (let i = 0; i < eqBars.length; i++) {
      const bar = eqBarRefs.current[i];
      if (!bar) continue;
      const groove =
        0.35 +
        0.42 * Math.abs(Math.sin(t * beatOmega * 0.5 + i * 0.55)) +
        0.26 * Math.abs(Math.cos(t * beatOmega + i * 0.9));
      const h = Math.max(0.24, groove * 1.9);
      bar.scale.y = h;
      bar.position.y = -1.22 + h * 0.5;
    }

    for (let s = 0; s < strings.length; s++) {
      const sm = stringRefs.current[s];
      if (!sm) continue;
      const vib = Math.sin(t * (22 + s * 5)) * 0.012;
      sm.position.x = strings[s] + vib;
    }

    if (turntableRef.current) {
      turntableRef.current.position.y = 0.68 + Math.sin(t * 1.6) * 0.09;
      turntableRef.current.rotation.y = Math.sin(t * 0.7) * 0.22;
    }
    if (vinylDiscRef.current) {
      vinylDiscRef.current.rotation.y = t * 2.4;
    }
  });

  const eqPalette = ["#FF6B4A", "#C084FC", "#FACC15", "#38BDF8", "#C6FF3D"];

  return (
    <group ref={rootRef}>
      {/* Rounded 3D Electric Guitar Fretboard & Bridge */}
      <group position={[-0.28, 0.08, 0.28]} rotation={[0.18, 0.15, -0.5]}>
        <RoundedBox args={[0.64, 3.1, 0.13]} radius={0.055} smoothness={4}>
          <meshStandardMaterial color="#1A1023" metalness={0.6} roughness={0.28} />
        </RoundedBox>

        <RoundedBox
          args={[0.7, 0.24, 0.14]}
          radius={0.05}
          smoothness={3}
          position={[0, -1.44, 0.07]}
        >
          <meshStandardMaterial color="#FACC15" metalness={0.88} roughness={0.18} />
        </RoundedBox>

        {frets.map((fy, fi) => (
          <group key={fi}>
            <mesh position={[0, fy, 0.072]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.011, 0.011, 0.58, 8]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
            </mesh>
            {(fi === 2 || fi === 4 || fi === 6 || fi === 8) && (
              <RoundedBox
                args={[0.13, 0.055, 0.015]}
                radius={0.02}
                smoothness={2}
                position={[-0.13, fy - 0.14, 0.068]}
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
            position={[sx, 0.04, 0.088]}
          >
            <cylinderGeometry args={[0.006, 0.006, 2.96, 6]} />
            <meshStandardMaterial
              color={si < 2 ? "#FACC15" : "#38BDF8"}
              emissive={si < 2 ? "#FACC15" : "#38BDF8"}
              emissiveIntensity={0.65}
            />
          </mesh>
        ))}
      </group>

      {/* 12 Tactile Rounded-Squircle 112-BPM 3D Studio Spectrum Equalizer Pillars */}
      <group position={[0.08, 0, -0.45]}>
        {eqBars.map((idx) => {
          const col = eqPalette[idx % eqPalette.length];
          return (
            <group
              key={idx}
              ref={(el) => {
                eqBarRefs.current[idx] = el;
              }}
              position={[-1.32 + idx * 0.24, -0.6, (idx % 2) * -0.18]}
            >
              <RoundedBox args={[0.15, 1, 0.15]} radius={0.05} smoothness={3}>
                <meshStandardMaterial
                  color={col}
                  emissive={col}
                  emissiveIntensity={0.55}
                  metalness={0.45}
                  roughness={0.22}
                />
              </RoundedBox>
            </group>
          );
        })}
      </group>

      {/* Floating Tactile Rounded-Squircle 3D Vinyl Turntable Deck (Matches Act 1 Prop!) */}
      <group
        ref={turntableRef}
        position={[1.08, 0.68, 0.36]}
        rotation={[0.48, -0.32, 0.16]}
      >
        <RoundedBox args={[0.92, 0.13, 0.92]} radius={0.14} smoothness={4}>
          <meshStandardMaterial color="#5C3A21" metalness={0.35} roughness={0.42} />
        </RoundedBox>
        <mesh ref={vinylDiscRef} position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.37, 0.37, 0.024, 32]} />
          <meshStandardMaterial color="#09090B" metalness={0.85} roughness={0.16} />
        </mesh>
        <mesh position={[0, 0.095, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.026, 24]} />
          <meshStandardMaterial
            color="#FF6B4A"
            emissive="#FF6B4A"
            emissiveIntensity={0.5}
          />
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
      camera={{ position: [0, 0, 6.45], fov: 43, near: 0.1, far: 42 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      className="pointer-events-none h-full w-full"
    >
      <SkillsCameraRig scrollRef={scrollRef} />
      <CivilSkyscraper3D scrollRef={scrollRef} />
      <SoftwareComputeMatrix3D scrollRef={scrollRef} />
      <DesignSpatialStack3D scrollRef={scrollRef} />
      <HobbiesSynthGuitar3D scrollRef={scrollRef} />
    </Canvas>
  );
}
