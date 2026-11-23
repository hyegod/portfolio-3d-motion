"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Studio3DScrollState } from "@/context/ShowreelContext";
import { PORTFOLIO_DATA } from "@/data/portfolio";

interface DeskEnvironmentProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutBack(x: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** Smooth rounded stadium/pill shape helper (zero harsh 90-deg corners!) */
function createPillShape(width: number, depth: number): THREE.Shape {
  const s = new THREE.Shape();
  const r = Math.min(width, depth) * 0.48;
  const hw = width / 2;
  const hd = depth / 2;
  s.moveTo(-hw + r, -hd);
  s.lineTo(hw - r, -hd);
  s.quadraticCurveTo(hw, -hd, hw, -hd + r);
  s.lineTo(hw, hd - r);
  s.quadraticCurveTo(hw, hd, hw - r, hd);
  s.lineTo(-hw + r, hd);
  s.quadraticCurveTo(-hw, hd, -hw, hd - r);
  s.lineTo(-hw, -hd + r);
  s.quadraticCurveTo(-hw, -hd, -hw + r, -hd);
  return s;
}

function createLaptopScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 1024, 640);
  bg.addColorStop(0, "#0A1628");
  bg.addColorStop(0.5, "#163570");
  bg.addColorStop(1, "#0284C7");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 640);

  // Curved parabolic bridge elevation diagram on screen
  ctx.strokeStyle = "#38BDF8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(85, 445);
  ctx.quadraticCurveTo(280, 250, 475, 445);
  ctx.stroke();

  ctx.strokeStyle = "rgba(198,255,61,0.8)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(75, 445);
  ctx.lineTo(485, 445);
  ctx.stroke();

  for (let x = 135; x <= 425; x += 36) {
    const u = (x - 280) / 195;
    const archY = 445 - (1 - u * u) * 98;
    ctx.strokeStyle = "rgba(186,230,253,0.75)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, archY);
    ctx.lineTo(x, 445);
    ctx.stroke();
  }

  // Right Code Panel (rounded pill window)
  ctx.fillStyle = "rgba(7,15,28,0.78)";
  ctx.beginPath();
  ctx.roundRect(535, 305, 415, 190, 26);
  ctx.fill();
  ctx.font = "600 22px monospace";
  ctx.textAlign = "left";
  ctx.fillStyle = "#38BDF8";
  ctx.fillText("const arch = solveSpan(280);", 565, 362);
  ctx.fillStyle = "#C6FF3D";
  ctx.fillText("export const drift = 0.009;", 565, 404);
  ctx.fillStyle = "#C084FC";
  ctx.fillText("streamTwin('curved-bim');", 565, 446);

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.font = "800 108px system-ui, -apple-system, sans-serif";
  ctx.fillText(PORTFOLIO_DATA.studio3D.laptopTime, 512, 195);

  ctx.font = "700 24px monospace";
  ctx.fillStyle = "#C6FF3D";
  ctx.fillText(PORTFOLIO_DATA.studio3D.laptopDate, 512, 242);

  // Frosted pill dock
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.roundRect(338, 542, 348, 56, 28);
  ctx.fill();
  const dockColors = ["#EF4444", "#2563EB", "#0284C7", "#FACC15", "#A855F7"];
  dockColors.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(386 + i * 62, 570, 17, 0, Math.PI * 2);
    ctx.fill();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createClockFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#F8FAFC";
  ctx.beginPath();
  ctx.arc(128, 128, 124, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const isMajor = i % 3 === 0;
    const r = 100;
    ctx.fillStyle = isMajor ? "#0F172A" : "#94A3B8";
    ctx.beginPath();
    ctx.arc(
      128 + Math.cos(angle) * r,
      128 + Math.sin(angle) * r,
      isMajor ? 6 : 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Curved Fluted Wooden Architectural Arc Backdrop (Instanced Cylinders — 0 Boxy Slats!)
 */
function CurvedFlutedBackdrop() {
  const instRef = useRef<THREE.InstancedMesh>(null);
  const count = 23;

  useEffect(() => {
    if (!instRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const u = i / (count - 1) - 0.5; // -0.5 .. +0.5
      const angle = u * 1.15;
      const radius = 4.6;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius + 2.65;
      dummy.position.set(x, 1.55, z);
      dummy.rotation.set(0, -angle, 0);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(i, dummy.matrix);
    }
    instRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      {/* Smooth curved studio cyclorama wall behind flutes */}
      <mesh position={[0, 1.5, 2.7]} rotation={[0, Math.PI, 0]}>
        <cylinderGeometry args={[4.85, 4.85, 7.2, 48, 1, true, -1.05, 2.1]} />
        <meshStandardMaterial color="#182230" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* 23 Smooth Cylindrical Walnut Architectural Flutes (1 Draw Call!) */}
      <instancedMesh ref={instRef} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.075, 0.075, 5.8, 12]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.48} metalness={0.08} />
      </instancedMesh>
    </group>
  );
}

/**
 * Signature Civil Engineering Sculpture (ZERO Boxes!):
 * Calatrava-inspired Curved Parabolic Arch Bridge Scale Model on Circular Travertine Pebble Base
 */
function CalatravaArchModel() {
  const { archGeo, deckGeo, hangers } = useMemo(() => {
    // Sweeping inclined parabolic steel arch
    const archPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      const x = (u - 0.5) * 0.92;
      const y = 0.07 + (1 - Math.pow((u - 0.5) * 2, 2)) * 0.46;
      const z = Math.sin(u * Math.PI) * -0.09;
      archPts.push(new THREE.Vector3(x, y, z));
    }
    const archCurve = new THREE.CatmullRomCurve3(archPts);

    // Subtle S-curved deck ribbon
    const deckPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 20; i++) {
      const u = i / 20;
      const x = (u - 0.5) * 0.98;
      const y = 0.14 + Math.sin(u * Math.PI) * 0.04;
      const z = Math.sin(u * Math.PI) * 0.06;
      deckPts.push(new THREE.Vector3(x, y, z));
    }
    const deckCurve = new THREE.CatmullRomCurve3(deckPts);

    // Delicate vertical/angled suspension cables
    const cableList: { pos: [number, number, number]; len: number; rotX: number }[] = [];
    for (let i = 2; i <= 10; i++) {
      const u = i / 12;
      const aPt = archCurve.getPoint(u);
      const dPt = deckCurve.getPoint(u);
      const mid = aPt.clone().add(dPt).multiplyScalar(0.5);
      const diff = aPt.clone().sub(dPt);
      const len = diff.length();
      const rotX = Math.atan2(diff.z, diff.y);
      cableList.push({ pos: [mid.x, mid.y, mid.z], len, rotX });
    }

    return {
      archGeo: new THREE.TubeGeometry(archCurve, 32, 0.022, 10, false),
      deckGeo: new THREE.TubeGeometry(deckCurve, 28, 0.018, 8, false),
      hangers: cableList,
    };
  }, []);

  return (
    <group>
      {/* Smooth Elliptical Travertine Pebble Plinth */}
      <mesh position={[0, 0.035, 0]} scale={[1.38, 1, 0.72]}>
        <cylinderGeometry args={[0.38, 0.42, 0.07, 32]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.42} metalness={0.12} />
      </mesh>
      {/* Subtle Glowing Cyan Datum Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.072, 0]} scale={[1.36, 0.7, 1]}>
        <ringGeometry args={[0.33, 0.36, 40]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.8} />
      </mesh>
      {/* Sweeping White Calatrava Arch */}
      <mesh geometry={archGeo}>
        <meshStandardMaterial color="#F8FAFC" roughness={0.22} metalness={0.45} />
      </mesh>
      {/* Curved Bridge Deck Ribbon */}
      <mesh geometry={deckGeo}>
        <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.75} />
      </mesh>
      {/* Delicate Glowing Tension Hangers */}
      {hangers.map((h, i) => (
        <mesh key={i} position={h.pos} rotation={[h.rotX, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, h.len, 6]} />
          <meshStandardMaterial color="#7DD3FC" emissive="#38BDF8" emissiveIntensity={0.75} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Signature Software × Design Sculpture (ZERO Boxes!):
 * Smooth Floating Metallic Torus-Knot Gyroscope over Circular Brushed Dock
 */
function ParametricKnotSculpture() {
  const knotRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!knotRef.current) return;
    const t = clock.getElapsedTime();
    knotRef.current.rotation.y = t * 0.65;
    knotRef.current.rotation.x = Math.sin(t * 0.9) * 0.35;
  });

  return (
    <group>
      {/* Smooth Circular Dark Anodized Base */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.26, 0.29, 0.06, 32]} />
        <meshStandardMaterial color="#1E293B" roughness={0.32} metalness={0.68} />
      </mesh>
      {/* Glowing Lime Orbit Ring on Dock */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.064, 0]}>
        <ringGeometry args={[0.18, 0.21, 36]} />
        <meshStandardMaterial color="#C6FF3D" emissive="#C6FF3D" emissiveIntensity={1.1} />
      </mesh>
      {/* Levitating Organic Torus-Knot Sculpture */}
      <mesh ref={knotRef} position={[0, 0.34, 0]}>
        <torusKnotGeometry args={[0.16, 0.044, 72, 16]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.35}
          metalness={0.82}
          roughness={0.14}
        />
      </mesh>
    </group>
  );
}

/** Smooth Arched Bauhaus / Flos Spherical Orb Lamp (ZERO sharp joints!) */
function CurvedOrbLamp() {
  const stemGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.06, 0),
      new THREE.Vector3(-0.14, 0.45, -0.04),
      new THREE.Vector3(-0.02, 0.88, 0.02),
      new THREE.Vector3(0.24, 0.96, 0.08),
    ]);
    return new THREE.TubeGeometry(curve, 28, 0.02, 10, false);
  }, []);

  return (
    <group>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.19, 0.23, 0.08, 28]} />
        <meshStandardMaterial color="#1D4ED8" roughness={0.28} metalness={0.45} />
      </mesh>
      <mesh geometry={stemGeo}>
        <meshStandardMaterial color="#93C5FD" metalness={0.78} roughness={0.2} />
      </mesh>
      {/* Frosted Glowing Glass Sphere Shade */}
      <mesh position={[0.28, 0.92, 0.09]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial
          color="#FFFBEB"
          emissive="#FEF08A"
          emissiveIntensity={1.35}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/** Organic Ceramic Planter with Curved Succulent Fronds */
function OrganicPlanter({ scale = 1 }: { scale?: number }) {
  const potGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.0, 0),
      new THREE.Vector2(0.14, 0),
      new THREE.Vector2(0.21, 0.14),
      new THREE.Vector2(0.22, 0.3),
      new THREE.Vector2(0.18, 0.39),
    ];
    return new THREE.LatheGeometry(pts, 24);
  }, []);

  const leafAngles = [0, 1.05, 2.1, 3.15, 4.2, 5.25];
  return (
    <group scale={scale}>
      <mesh geometry={potGeo}>
        <meshStandardMaterial color="#F1F5F9" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.04, 20]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
      {leafAngles.map((ang, i) => (
        <group
          key={i}
          position={[0, 0.38, 0]}
          rotation={[0.45 + (i % 2) * 0.18, ang, 0]}
        >
          <mesh position={[0, 0.22, 0.08]} scale={[0.11, 0.3, 0.03]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#22C55E" : "#15803D"}
              roughness={0.35}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 100% Sculptural Non-Boxy 3D Creator Studio (ZERO Kotak-Kotak!)
 * Curved oval walnut pebble desk, rounded pill desk mat, beveled unibody laptop,
 * Calatrava curved suspension arch bridge sculpture, metallic torus-knot gyroscope,
 * Bauhaus arched orb lamp, fluted curved backdrop, and dreamy Zero-G sky clouds.
 */
export function DeskEnvironment({ scrollRef }: DeskEnvironmentProps) {
  const roomGroupRef = useRef<THREE.Group>(null);
  const deskGroupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.Mesh>(null);
  const laptopGroupRef = useRef<THREE.Group>(null);
  const laptopLidRef = useRef<THREE.Group>(null);
  const clockRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Group>(null);
  const lampRef = useRef<THREE.Group>(null);
  const archRef = useRef<THREE.Group>(null);
  const cupRef = useRef<THREE.Group>(null);
  const plantRightRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);

  const screenTex = useMemo(() => createLaptopScreenTexture(), []);
  const clockTex = useMemo(() => createClockFaceTexture(), []);

  // Curved Sculpted Pebble Tabletop & Pill-Shaped Desk Mat Geometries (ZERO sharp boxes!)
  const { deskTopGeo, matPillGeo } = useMemo(() => {
    const deskShape = createPillShape(5.5, 2.25);
    const dGeo = new THREE.ExtrudeGeometry(deskShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.04,
      bevelSegments: 5,
    });
    dGeo.rotateX(Math.PI / 2);

    const matShape = createPillShape(2.55, 1.12);
    const mGeo = new THREE.ExtrudeGeometry(matShape, {
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.008,
      bevelSegments: 3,
    });
    mGeo.rotateX(Math.PI / 2);

    return { deskTopGeo: dGeo, matPillGeo: mGeo };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = scrollRef.current.progress;

    const assembleMat = clamp01(p / 0.14);
    const assembleLaptop = clamp01((p - 0.03) / 0.16);
    const assembleProps = clamp01((p - 0.07) / 0.17);

    const roomDrop = easeInOutCubic(clamp01((p - 0.52) / 0.13));
    const zeroG = easeInOutCubic(clamp01((p - 0.54) / 0.18));
    const heroFrame = easeInOutCubic(clamp01((p - 0.72) / 0.15));

    if (roomGroupRef.current) {
      roomGroupRef.current.position.z = -roomDrop * 12;
      roomGroupRef.current.position.y = -roomDrop * 8;
      roomGroupRef.current.visible = roomDrop < 0.85;
    }

    if (deskGroupRef.current) {
      deskGroupRef.current.position.y = -roomDrop * 6.5;
      deskGroupRef.current.rotation.x = roomDrop * 0.32;
      deskGroupRef.current.visible = roomDrop < 0.88;
    }

    if (matRef.current) {
      const matBounce = easeOutBack(assembleMat);
      matRef.current.scale.set(matBounce, 1, matBounce);
      matRef.current.position.set(
        0,
        0.022 + (1 - matBounce) * 0.42 - zeroG * 0.75 + Math.sin(t * 1.4) * 0.03 * zeroG,
        0.16 + zeroG * 0.25
      );
      matRef.current.rotation.set(
        zeroG * 0.24 + Math.sin(t * 1.1) * 0.03 * zeroG,
        zeroG * -0.1,
        zeroG * 0.05
      );
    }

    if (laptopGroupRef.current && laptopLidRef.current) {
      const drop = easeOutBack(assembleLaptop);
      const floatY = Math.sin(t * 1.6) * 0.03 * zeroG * (1 - heroFrame * 0.7);
      laptopGroupRef.current.position.set(
        0,
        0.04 + (1 - drop) * 1.35 + zeroG * 0.56 + floatY,
        -0.05 - heroFrame * 0.35
      );
      laptopGroupRef.current.rotation.set(
        (1 - drop) * -0.35 + zeroG * 0.04 * (1 - heroFrame),
        (1 - drop) * 0.4 + Math.cos(t * 0.9) * 0.02 * zeroG * (1 - heroFrame),
        Math.sin(t * 1.3) * 0.015 * zeroG * (1 - heroFrame)
      );
      laptopLidRef.current.rotation.x = THREE.MathUtils.lerp(
        Math.PI * 0.49,
        -0.15,
        clamp01((p - 0.04) / 0.16)
      );
    }

    if (clockRef.current) {
      const cScale = Math.max(0.001, easeOutBack(assembleProps));
      clockRef.current.scale.setScalar(cScale);
      clockRef.current.position.set(
        0 + zeroG * -1.45,
        1.88 + zeroG * 0.95,
        -1.65 - zeroG * 0.8
      );
      clockRef.current.rotation.z = zeroG * 0.28;
    }
    if (hourHandRef.current && minuteHandRef.current) {
      const spinBoost = p * 20;
      minuteHandRef.current.rotation.z = -t * 1.6 - spinBoost;
      hourHandRef.current.rotation.z = -t * 0.25 - spinBoost * 0.15;
    }

    // Right Sculpture: Floating Parametric Torus-Knot Gyroscope
    if (knotRef.current) {
      const rScale = Math.max(0.001, easeOutBack(assembleProps));
      knotRef.current.scale.setScalar(rScale);
      knotRef.current.position.set(
        1.55 + zeroG * 0.42 + heroFrame * 0.28,
        0.02 + zeroG * 0.76 + Math.sin(t * 1.8 + 1) * 0.06 * zeroG,
        0.22 + zeroG * 0.12
      );
      knotRef.current.rotation.set(zeroG * 0.2, -0.25 + zeroG * 0.4, zeroG * 0.15);
    }

    // Far-Left: Arched Bauhaus Orb Lamp
    if (lampRef.current) {
      const lScale = Math.max(0.001, easeOutBack(assembleProps));
      lampRef.current.scale.setScalar(lScale);
      lampRef.current.position.set(
        -2.18 - zeroG * 0.25,
        0.02 + zeroG * 1.18 + Math.sin(t * 1.4 + 2) * 0.05 * zeroG,
        -0.25 + zeroG * 0.2
      );
      lampRef.current.rotation.set(zeroG * 0.18, 0.35 - zeroG * 0.16, -zeroG * 0.3);
    }

    // Mid-Left: Calatrava Curved Parabolic Arch Bridge Model
    if (archRef.current) {
      const mScale = Math.max(0.001, easeOutBack(assembleProps));
      archRef.current.scale.setScalar(mScale * (1 + heroFrame * 0.08));
      archRef.current.position.set(
        -1.45 - zeroG * 0.45 - heroFrame * 0.25,
        0.02 + zeroG * 0.68 + Math.sin(t * 1.7) * 0.05 * zeroG,
        0.24 + zeroG * 0.22
      );
      archRef.current.rotation.set(
        zeroG * 0.15,
        0.35 + zeroG * (t * 0.3),
        zeroG * -0.12
      );
    }

    // Front-Left: Curved Ceramic Espresso Cup
    if (cupRef.current) {
      const gScale = Math.max(0.001, easeOutBack(assembleProps));
      cupRef.current.scale.setScalar(gScale);
      cupRef.current.position.set(
        -0.88 - zeroG * 0.92,
        0.11 + zeroG * 0.08 + Math.sin(t * 1.7 + 3) * 0.05 * zeroG,
        0.66 + zeroG * 0.12
      );
      cupRef.current.rotation.set(zeroG * 0.28, 0, zeroG * -0.35);
    }

    // Far-Right: Organic Lathe Ceramic Planter
    if (plantRightRef.current) {
      plantRightRef.current.position.set(
        2.18 - heroFrame * 0.12,
        0.02 + zeroG * 1.12 + Math.sin(t * 1.5 + 0.5) * 0.05 * zeroG,
        -0.24 + zeroG * 0.32
      );
      plantRightRef.current.rotation.set(zeroG * 0.18, -0.5 + zeroG * 0.25, zeroG * 0.2);
    }

    if (cloudsRef.current) {
      cloudsRef.current.visible = zeroG > 0.08;
      const cs = THREE.MathUtils.lerp(0.2, 1.05, zeroG);
      cloudsRef.current.scale.setScalar(cs);
      cloudsRef.current.position.x = Math.sin(t * 0.18) * 0.35;
      cloudsRef.current.position.y = 0.65 + zeroG * 0.35;
    }
  });

  return (
    <group>
      {/* Curved Fluted Architectural Studio Backdrop (Zero Boxy Walls!) */}
      <group ref={roomGroupRef}>
        <CurvedFlutedBackdrop />
        {/* Smooth Circular Studio Floor Rug */}
        <mesh position={[0, -1.04, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[7.5, 48]} />
          <meshStandardMaterial color="#252F3D" roughness={0.85} />
        </mesh>
      </group>

      {/* Curved Sculpted Pebble Walnut Studio Table (Zero Rectangular Box!) */}
      <group ref={deskGroupRef}>
        <mesh geometry={deskTopGeo} position={[0, 0.01, 0.08]} castShadow receiveShadow>
          <meshStandardMaterial color="#C8A27A" roughness={0.44} metalness={0.08} />
        </mesh>
        {/* Sleek Tapered Cylindrical Legs */}
        {[
          [-2.0, -0.56, -0.55, 0.12, 0.1],
          [2.0, -0.56, -0.55, -0.12, 0.1],
          [-2.0, -0.56, 0.72, 0.12, -0.1],
          [2.0, -0.56, 0.72, -0.12, -0.1],
        ].map(([x, y, z, rz, rx], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[rx, 0, rz]}>
            <cylinderGeometry args={[0.048, 0.03, 1.08, 16]} />
            <meshStandardMaterial color="#8F6741" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Rounded Pill-Shaped Architectural CAD Desk Mat */}
      <mesh ref={matRef} geometry={matPillGeo} position={[0, 0.022, 0.16]}>
        <meshStandardMaterial color="#1D4ED8" roughness={0.58} metalness={0.12} />
      </mesh>

      {/* Sculpted Beveled Unibody Laptop (RoundedBox — Zero Sharp Box Corners!) */}
      <group ref={laptopGroupRef} position={[0, 0.04, -0.05]}>
        <RoundedBox args={[1.4, 0.052, 0.96]} radius={0.024} smoothness={4} position={[0, 0.022, 0.05]}>
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <RoundedBox args={[1.18, 0.012, 0.44]} radius={0.005} smoothness={2} position={[0, 0.048, -0.05]}>
          <meshStandardMaterial color="#1E293B" roughness={0.5} />
        </RoundedBox>

        <group ref={laptopLidRef} position={[0, 0.044, -0.41]}>
          <RoundedBox args={[1.4, 0.94, 0.036]} radius={0.016} smoothness={4} position={[0, 0.46, 0]}>
            <meshStandardMaterial color="#E2E8F0" metalness={0.82} roughness={0.18} />
          </RoundedBox>
          <mesh position={[0, 0.46, 0.02]}>
            <planeGeometry args={[1.31, 0.85]} />
            <meshStandardMaterial color="#09090B" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.46, 0.024]}>
            <planeGeometry args={[1.24, 0.77]} />
            <meshStandardMaterial
              map={screenTex}
              emissive="#60A5FA"
              emissiveMap={screenTex}
              emissiveIntensity={0.48}
              roughness={0.15}
            />
          </mesh>
        </group>
      </group>

      {/* Sculpted Circular Wall Chronometer */}
      <group ref={clockRef} position={[0, 1.88, -1.65]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.41, 0.042, 16, 40]} />
          <meshStandardMaterial color="#1E293B" roughness={0.28} metalness={0.55} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.39, 36]} />
          <meshStandardMaterial map={clockTex} roughness={0.4} />
        </mesh>
        <mesh ref={hourHandRef} position={[0, 0, 0.03]}>
          <capsuleGeometry args={[0.014, 0.16, 4, 8]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh ref={minuteHandRef} position={[0, 0, 0.04]}>
          <capsuleGeometry args={[0.01, 0.25, 4, 8]} />
          <meshStandardMaterial color="#2563EB" />
        </mesh>
      </group>

      {/* Right Desk Sculpture: Levitating Parametric Torus-Knot */}
      <group ref={knotRef} position={[1.55, 0.02, 0.22]} rotation={[0, -0.25, 0]}>
        <ParametricKnotSculpture />
      </group>

      {/* Far-Left: Arched Bauhaus Orb Lamp */}
      <group ref={lampRef} position={[-2.18, 0.02, -0.25]} rotation={[0, 0.35, 0]}>
        <CurvedOrbLamp />
      </group>

      {/* Mid-Left: Calatrava Curved Parabolic Arch Bridge Scale Model */}
      <group ref={archRef} position={[-1.45, 0.02, 0.24]} rotation={[0, 0.35, 0]}>
        <CalatravaArchModel />
      </group>

      {/* Front-Left: Smooth Rounded Ceramic Cup & Saucer */}
      <group ref={cupRef} position={[-0.88, 0.11, 0.66]}>
        <mesh position={[0, -0.09, 0]}>
          <cylinderGeometry args={[0.14, 0.1, 0.025, 24]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.25} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.1, 0.075, 0.17, 24]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.088, 0.088, 0.02, 20]} />
          <meshStandardMaterial color="#7C2D12" roughness={0.2} />
        </mesh>
        <mesh position={[0.105, 0.01, 0]} rotation={[0, 0, -0.15]}>
          <torusGeometry args={[0.042, 0.012, 10, 20]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.25} />
        </mesh>
      </group>

      {/* Far-Right: Organic Lathe Ceramic Planter */}
      <group ref={plantRightRef} position={[2.18, 0.02, -0.24]}>
        <OrganicPlanter scale={1.12} />
      </group>

      {/* Dreamy Zero-Gravity Volumetric Clouds */}
      <group ref={cloudsRef} visible={false} position={[0, 1.0, -4.5]}>
        {[
          [-3.4, 1.2, -1.2, 1.3],
          [3.1, 1.4, -1.0, 1.35],
          [-0.4, 2.3, -2.4, 1.5],
          [1.6, -1.0, -1.8, 1.15],
          [-2.5, -1.1, -2.0, 1.1],
        ].map(([x, y, z, s], idx) => (
          <group key={idx} position={[x, y, z]} scale={s}>
            <mesh>
              <sphereGeometry args={[0.85, 14, 14]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.95} />
            </mesh>
            <mesh position={[0.62, -0.16, 0.1]}>
              <sphereGeometry args={[0.6, 12, 12]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.95} />
            </mesh>
            <mesh position={[-0.58, -0.2, -0.05]}>
              <sphereGeometry args={[0.56, 12, 12]} />
              <meshStandardMaterial color="#F1F5F9" roughness={0.95} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
