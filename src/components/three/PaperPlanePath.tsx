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

/**
 * Autonomous Sculptural Aero-Glider & Luminous Ion Trail
 * - Starts high in the upper-left orbital sky (NEVER sitting on or clipping any object!)
 * - Banks wide around the West abutment and threads straight down the illuminated
 *   Twin-Arch Bridge span before ascending into the Zero-G stratosphere!
 */
export function PaperPlanePath({ scrollRef }: PaperPlanePathProps) {
  const craftRef = useRef<THREE.Group>(null);
  const haloRingRef = useRef<THREE.Mesh>(null);
  const wakeBeadRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pathTubeMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Sculpted Biomimetic Teardrop Fuselage + Swept Crescent Wing (100% Curved — Zero Boxes!)
  const { fuselageGeo, wingGeo } = useMemo(() => {
    // Streamlined aerodynamic Lathe fuselage oriented along +Z (lookAt forward axis)
    const bodyPts = [
      new THREE.Vector2(0.0, -0.26),
      new THREE.Vector2(0.028, -0.18),
      new THREE.Vector2(0.052, -0.02),
      new THREE.Vector2(0.056, 0.1),
      new THREE.Vector2(0.036, 0.22),
      new THREE.Vector2(0.0, 0.3),
    ];
    const fGeo = new THREE.LatheGeometry(bodyPts, 24);
    fGeo.rotateX(Math.PI / 2);

    // Smooth Swept-Back Crescent Manta Wing Profile
    const wShape = new THREE.Shape();
    wShape.moveTo(0, 0.18);
    wShape.quadraticCurveTo(0.24, 0.08, 0.44, -0.16);
    wShape.quadraticCurveTo(0.47, -0.21, 0.41, -0.22);
    wShape.quadraticCurveTo(0.19, -0.06, 0, -0.08);
    wShape.quadraticCurveTo(-0.19, -0.06, -0.41, -0.22);
    wShape.quadraticCurveTo(-0.47, -0.21, -0.44, -0.16);
    wShape.quadraticCurveTo(-0.24, 0.08, 0, 0.18);

    const wGeo = new THREE.ExtrudeGeometry(wShape, {
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.01,
      bevelSegments: 4,
    });
    wGeo.rotateX(Math.PI / 2);
    wGeo.translate(0, 0.006, 0);

    return { fuselageGeo: fGeo, wingGeo: wGeo };
  }, []);

  // Precision 3D Flight Spline:
  // Starts in high upper-left sky -> banks outside West pier -> threads straight down
  // the open Twin-Arch Bridge corridor (y = 0.86, z = 0) -> climbs into Zero-G sky!
  const { flightCurve, guideTubeGeo } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.55, 1.82, 0.95),
      new THREE.Vector3(-2.65, 1.32, 0.48),
      new THREE.Vector3(-1.92, 0.84, 0.0),
      new THREE.Vector3(0.0, 0.88, 0.0),
      new THREE.Vector3(1.96, 0.94, 0.0),
      new THREE.Vector3(2.35, 1.58, 1.05),
      new THREE.Vector3(1.38, 1.66, 0.35),
    ]);
    const tGeo = new THREE.TubeGeometry(curve, 96, 0.0045, 6, false);
    return { flightCurve: curve, guideTubeGeo: tGeo };
  }, []);

  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpNext = useMemo(() => new THREE.Vector3(), []);
  const tmpBead = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const craft = craftRef.current;
    if (!craft) return;

    const p = scrollRef.current.progress;
    const t = clock.getElapsedTime();

    // Smooth progress from high-altitude sky entry through bridge fly-through to Zero-G orbit
    const flightT = clamp01((p - 0.12) / 0.62);

    flightCurve.getPointAt(flightT, tmpPos);
    flightCurve.getPointAt(Math.min(1, flightT + 0.022), tmpNext);

    // Gentle living hover when cruising at start or settled in Zero-G sky
    const idleBlend = flightT < 0.03 ? 1 : flightT > 0.95 ? 1 : 0.25;
    tmpPos.y += Math.sin(t * 2.3) * 0.045 * idleBlend;
    tmpPos.x += Math.cos(t * 1.6) * 0.03 * idleBlend;

    craft.position.copy(tmpPos);
    craft.lookAt(tmpNext);

    // Dynamic aerodynamic banking roll into turns
    const bankAngle = Math.sin(flightT * Math.PI * 2.5) * 0.48 * (1 - clamp01((p - 0.72) / 0.1));
    craft.rotateZ(bankAngle);

    const enterScale = clamp01((p - 0.02) / 0.1);
    craft.scale.setScalar(Math.max(0.001, enterScale * 0.92));

    if (haloRingRef.current) {
      haloRingRef.current.rotation.z = t * 3.5;
    }

    // Trailing Luminous Wake Pearls along the flight path behind the glider
    for (let i = 0; i < 7; i++) {
      const bead = wakeBeadRefs.current[i];
      if (!bead) continue;
      const lagT = flightT - (i + 1) * 0.018;
      if (lagT <= 0.005 || p > 0.78) {
        bead.visible = false;
        continue;
      }
      bead.visible = true;
      flightCurve.getPointAt(lagT, tmpBead);
      bead.position.copy(tmpBead);
      const s = (1 - i / 7) * 0.9;
      bead.scale.setScalar(s);
    }

    // Subtle flight-corridor filament visibility during active fly-through
    if (pathTubeMatRef.current) {
      const lineOp =
        p > 0.14 && p < 0.7
          ? Math.min(0.24, (p - 0.14) * 1.8, (0.7 - p) * 1.8)
          : 0;
      pathTubeMatRef.current.opacity = lineOp;
    }
  });

  return (
    <>
      {/* Delicate Luminous Flight-Corridor Filament */}
      <mesh geometry={guideTubeGeo}>
        <meshBasicMaterial
          ref={pathTubeMatRef}
          color="#38BDF8"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Sculptural Biomimetic Aero-Glider */}
      <group ref={craftRef}>
        {/* Champagne-Titanium Streamlined Fuselage Pod */}
        <mesh geometry={fuselageGeo} castShadow>
          <meshStandardMaterial
            color="#F8FAFC"
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>

        {/* Swept-Crescent Iridescent Aerofoil Wing */}
        <mesh geometry={wingGeo} castShadow>
          <meshPhysicalMaterial
            color="#E0F2FE"
            emissive="#0284C7"
            emissiveIntensity={0.32}
            metalness={0.75}
            roughness={0.16}
            iridescence={1}
            iridescenceIOR={1.45}
          />
        </mesh>

        {/* Cockpit Glowing Canopy Dome */}
        <mesh position={[0, 0.036, 0.08]} scale={[0.75, 0.65, 1.6]}>
          <sphereGeometry args={[0.042, 16, 16]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>

        {/* Spinning Ion-Ring Stabilizer Halo at Tail */}
        <mesh ref={haloRingRef} position={[0, 0, -0.22]}>
          <torusGeometry args={[0.085, 0.009, 12, 32]} />
          <meshBasicMaterial color="#C6FF3D" />
        </mesh>

        {/* Ion Thruster Core Glow */}
        <mesh position={[0, 0, -0.26]}>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshBasicMaterial color="#C6FF3D" />
        </mesh>
      </group>

      {/* 7 Trailing Luminous Wake Pearls */}
      {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            wakeBeadRefs.current[idx] = el;
          }}
          visible={false}
        >
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshBasicMaterial color={idx % 2 === 0 ? "#C6FF3D" : "#38BDF8"} />
        </mesh>
      ))}
    </>
  );
}
