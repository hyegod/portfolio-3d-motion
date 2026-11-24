"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { Studio3DScrollState } from "@/context/ShowreelContext";

interface DeskEnvironmentProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutBack(x: number) {
  const c1 = 1.65;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

const UP_VEC = new THREE.Vector3(0, 1, 0);

/**
 * High-DPI Procedural CAD Polar Compass & Structural Azimuth Dial Texture (1024x1024)
 */
function createCompassDialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  const cx = 512;
  const cy = 512;

  // Radial obsidian-titanium surface gradient
  const bg = ctx.createRadialGradient(cx, cy, 40, cx, cy, 512);
  bg.addColorStop(0, "#0F2238");
  bg.addColorStop(0.55, "#091524");
  bg.addColorStop(1, "#050B14");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 1024);

  // Concentric elevation & polar grid circles
  const radii = [120, 210, 300, 385, 455, 488];
  radii.forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle =
      idx === 4
        ? "rgba(198, 255, 61, 0.55)"
        : idx % 2 === 0
          ? "rgba(56, 189, 248, 0.38)"
          : "rgba(148, 163, 184, 0.18)";
    ctx.lineWidth = idx === 4 ? 3 : 1.8;
    if (idx === 2) ctx.setLineDash([8, 10]);
    else ctx.setLineDash([]);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Radial azimuth degree ticks (72 subdivisions = every 5 deg)
  for (let i = 0; i < 72; i++) {
    const ang = (i / 72) * Math.PI * 2;
    const isMajor = i % 6 === 0;
    const isCardinal = i % 18 === 0;
    const rInner = isCardinal ? 425 : isMajor ? 442 : 462;
    const rOuter = 484;

    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * rInner, cy + Math.sin(ang) * rInner);
    ctx.lineTo(cx + Math.cos(ang) * rOuter, cy + Math.sin(ang) * rOuter);
    ctx.strokeStyle = isCardinal
      ? "#C6FF3D"
      : isMajor
        ? "rgba(56, 189, 248, 0.75)"
        : "rgba(148, 163, 184, 0.35)";
    ctx.lineWidth = isCardinal ? 4 : isMajor ? 2.2 : 1.2;
    ctx.stroke();
  }

  // Subtle crosshairs
  ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 420, cy);
  ctx.lineTo(cx + 420, cy);
  ctx.moveTo(cx, cy - 420);
  ctx.lineTo(cx, cy + 420);
  ctx.stroke();

  // Engineering cardinal labels
  ctx.font = "700 22px monospace";
  ctx.fillStyle = "rgba(198, 255, 61, 0.85)";
  ctx.textAlign = "center";
  ctx.fillText("000° // STRUCTURAL FEA", cx, 96);
  ctx.fillText("180° // DIGITAL TWIN", cx, 942);

  ctx.save();
  ctx.translate(932, cy);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = "rgba(56, 189, 248, 0.85)";
  ctx.fillText("090° // FULL-STACK", 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(92, cy);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "rgba(56, 189, 248, 0.85)";
  ctx.fillText("270° // 3D MOTION", 0, 0);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Curved Holographic HUD Arc Texture (Civil FEA Mode vs Software Solver Mode)
 */
function createHologramHudTexture(variant: "fea" | "code"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 320;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 768, 320);

  // Translucent curved glass pill background
  const grad = ctx.createLinearGradient(0, 0, 768, 320);
  grad.addColorStop(0, "rgba(8, 25, 44, 0.86)");
  grad.addColorStop(1, "rgba(12, 38, 66, 0.72)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(14, 14, 740, 292, 44);
  ctx.fill();

  // Glowing rim border
  ctx.strokeStyle =
    variant === "fea" ? "rgba(56, 189, 248, 0.85)" : "rgba(198, 255, 61, 0.85)";
  ctx.lineWidth = 4;
  ctx.stroke();

  if (variant === "fea") {
    // Header
    ctx.fillStyle = "#38BDF8";
    ctx.font = "700 22px monospace";
    ctx.fillText("LIVE TWIN // SPAN 280M TIED-ARCH FEA", 54, 68);

    // Parabolic arch stress contour diagram
    ctx.strokeStyle = "#C6FF3D";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(64, 232);
    ctx.quadraticCurveTo(255, 76, 446, 232);
    ctx.stroke();

    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(52, 232);
    ctx.lineTo(458, 232);
    ctx.stroke();

    for (let x = 104; x <= 406; x += 34) {
      const u = (x - 255) / 191;
      const yTop = 232 - (1 - u * u) * 78;
      ctx.strokeStyle = "rgba(186, 230, 253, 0.75)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, yTop);
      ctx.lineTo(x, 232);
      ctx.stroke();
    }

    // Telemetry metrics on right
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 38px system-ui, sans-serif";
    ctx.fillText("99.4%", 505, 138);
    ctx.fillStyle = "#94A3B8";
    ctx.font = "600 19px monospace";
    ctx.fillText("LOAD EFFICIENCY", 505, 168);
    ctx.fillStyle = "#C6FF3D";
    ctx.fillText("DRIFT < 0.008 H", 505, 212);
    ctx.fillStyle = "#38BDF8";
    ctx.fillText("MODAL f1: 0.42Hz", 505, 246);
  } else {
    // Software / Computational Solver HUD
    ctx.fillStyle = "#C6FF3D";
    ctx.font = "700 22px monospace";
    ctx.fillText("SOLVER ENGINE // TYPESCRIPT × PYTHON", 54, 68);

    ctx.font = "600 24px monospace";
    ctx.fillStyle = "#38BDF8";
    ctx.fillText("const twin = solveArchFEA({", 54, 126);
    ctx.fillStyle = "#F8FAFC";
    ctx.fillText("  spanMeters: 280, cables: 28,", 54, 166);
    ctx.fillStyle = "#C6FF3D";
    ctx.fillText("  seismicZone: 'SNI-1726',", 54, 206);
    ctx.fillStyle = "#C084FC";
    ctx.fillText("}); // 120 FPS WebGL Stream", 54, 246);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

interface CableSpec {
  pos: THREE.Vector3;
  quat: THREE.Quaternion;
  len: number;
}

/**
 * Centerpiece Sculpture: Twin-Arch Calatrava Suspension Bridge + Flowing Deck Energy Pulses
 * 100% Curved Parametric Tubes & Lathe Piers — ZERO Boxy Primitives!
 */
function TwinArchBridgeCore() {
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);

  const {
    archAGeo,
    archBGeo,
    deckGeo,
    railFrontGeo,
    railBackGeo,
    pierGeo,
    crossStruts,
    cables,
    deckCurve,
  } = useMemo(() => {
    // Twin inclined basket-handle parabolic arches
    const ptsA: THREE.Vector3[] = [];
    const ptsB: THREE.Vector3[] = [];
    const steps = 36;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const sym = (u - 0.5) * 2; // -1 .. +1
      const parabola = 1 - sym * sym;
      const x = sym * 1.68;
      const y = 0.14 + parabola * 1.24;
      // Arches start wide apart at piers (z = ±0.34) and pinch gracefully toward crown (z = ±0.09)
      const zSpread = THREE.MathUtils.lerp(0.34, 0.085, parabola);
      ptsA.push(new THREE.Vector3(x, y, zSpread));
      ptsB.push(new THREE.Vector3(x, y, -zSpread));
    }
    const curveA = new THREE.CatmullRomCurve3(ptsA);
    const curveB = new THREE.CatmullRomCurve3(ptsB);

    // Sweeping cambered highway deck curve
    const deckPts: THREE.Vector3[] = [];
    const railFPts: THREE.Vector3[] = [];
    const railBPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 28; i++) {
      const u = i / 28;
      const sym = (u - 0.5) * 2;
      const camber = 1 - sym * sym;
      const x = sym * 1.85;
      const y = 0.34 + camber * 0.18;
      deckPts.push(new THREE.Vector3(x, y, 0));
      railFPts.push(new THREE.Vector3(x, y + 0.015, 0.19));
      railBPts.push(new THREE.Vector3(x, y + 0.015, -0.19));
    }
    const dCurve = new THREE.CatmullRomCurve3(deckPts);
    const rFCurve = new THREE.CatmullRomCurve3(railFPts);
    const rBCurve = new THREE.CatmullRomCurve3(railBPts);

    // 26 Mathematically Exact Diagonal Stay-Cables (13 per arch)
    const cableList: CableSpec[] = [];
    for (let i = 2; i <= 14; i++) {
      const u = i / 16;
      // Front arch to front deck edge
      const aTop = curveA.getPointAt(u);
      const aBot = rFCurve.getPointAt(u);
      const diffA = aTop.clone().sub(aBot);
      const quatA = new THREE.Quaternion().setFromUnitVectors(
        UP_VEC,
        diffA.clone().normalize()
      );
      cableList.push({
        pos: aBot.clone().add(aTop).multiplyScalar(0.5),
        quat: quatA,
        len: diffA.length(),
      });

      // Back arch to back deck edge
      const bTop = curveB.getPointAt(u);
      const bBot = rBCurve.getPointAt(u);
      const diffB = bTop.clone().sub(bBot);
      const quatB = new THREE.Quaternion().setFromUnitVectors(
        UP_VEC,
        diffB.clone().normalize()
      );
      cableList.push({
        pos: bBot.clone().add(bTop).multiplyScalar(0.5),
        quat: quatB,
        len: diffB.length(),
      });
    }

    // 5 Crown transverse wind-bracing struts linking Arch A & Arch B
    const struts: CableSpec[] = [];
    for (const u of [0.34, 0.42, 0.5, 0.58, 0.66]) {
      const pA = curveA.getPointAt(u);
      const pB = curveB.getPointAt(u);
      const diff = pA.clone().sub(pB);
      const quat = new THREE.Quaternion().setFromUnitVectors(
        UP_VEC,
        diff.clone().normalize()
      );
      struts.push({
        pos: pA.clone().add(pB).multiplyScalar(0.5),
        quat,
        len: diff.length(),
      });
    }

    // Sculpted Lathe Pier Foundation
    const pierProfile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.18, 0),
      new THREE.Vector2(0.14, 0.12),
      new THREE.Vector2(0.09, 0.28),
      new THREE.Vector2(0.12, 0.36),
      new THREE.Vector2(0, 0.36),
    ];

    return {
      archAGeo: new THREE.TubeGeometry(curveA, 64, 0.032, 14, false),
      archBGeo: new THREE.TubeGeometry(curveB, 64, 0.032, 14, false),
      deckGeo: new THREE.TubeGeometry(dCurve, 48, 0.038, 12, false),
      railFrontGeo: new THREE.TubeGeometry(rFCurve, 48, 0.012, 8, false),
      railBackGeo: new THREE.TubeGeometry(rBCurve, 48, 0.012, 8, false),
      pierGeo: new THREE.LatheGeometry(pierProfile, 24),
      crossStruts: struts,
      cables: cableList,
      deckCurve: dCurve,
    };
  }, []);

  const tmpPulsePos = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < 6; i++) {
      const mesh = pulseRefs.current[i];
      if (!mesh) continue;
      const u = (t * 0.22 + i / 6) % 1;
      deckCurve.getPointAt(u, tmpPulsePos);
      mesh.position.set(
        tmpPulsePos.x,
        tmpPulsePos.y + 0.032,
        i % 2 === 0 ? 0.08 : -0.08
      );
    }
  });

  return (
    <group>
      {/* Twin Sculpted Elliptical Abutment Piers */}
      <mesh geometry={pierGeo} position={[-1.62, 0.02, 0]} scale={[1.1, 1, 2.2]}>
        <meshStandardMaterial color="#CBD5E1" metalness={0.65} roughness={0.28} />
      </mesh>
      <mesh geometry={pierGeo} position={[1.62, 0.02, 0]} scale={[1.1, 1, 2.2]}>
        <meshStandardMaterial color="#CBD5E1" metalness={0.65} roughness={0.28} />
      </mesh>

      {/* Twin Sweeping Alabaster-Titanium Parabolic Arches */}
      <mesh geometry={archAGeo} castShadow>
        <meshStandardMaterial color="#F8FAFC" metalness={0.55} roughness={0.18} />
      </mesh>
      <mesh geometry={archBGeo} castShadow>
        <meshStandardMaterial color="#F8FAFC" metalness={0.55} roughness={0.18} />
      </mesh>

      {/* Crown Transverse Bracing Struts */}
      {crossStruts.map((s, i) => (
        <mesh key={i} position={s.pos} quaternion={s.quat}>
          <cylinderGeometry args={[0.012, 0.012, s.len, 8]} />
          <meshStandardMaterial
            color="#FDE047"
            emissive="#CA8A04"
            emissiveIntensity={0.45}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Aerodynamic Brushed-Titanium Twin Deck Girder Spines + Glowing Edge Rails (True Normals!) */}
      <mesh geometry={deckGeo} position={[0, 0, 0.075]} castShadow receiveShadow>
        <meshStandardMaterial color="#64748B" metalness={0.78} roughness={0.24} />
      </mesh>
      <mesh geometry={deckGeo} position={[0, 0, -0.075]} castShadow receiveShadow>
        <meshStandardMaterial color="#64748B" metalness={0.78} roughness={0.24} />
      </mesh>
      <mesh geometry={railFrontGeo}>
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#38BDF8"
          emissiveIntensity={1.15}
        />
      </mesh>
      <mesh geometry={railBackGeo}>
        <meshStandardMaterial
          color="#C6FF3D"
          emissive="#C6FF3D"
          emissiveIntensity={1.05}
        />
      </mesh>

      {/* 26 Luminous Optical-Fiber Stay Cables */}
      {cables.map((c, idx) => (
        <mesh key={idx} position={c.pos} quaternion={c.quat}>
          <cylinderGeometry args={[0.0045, 0.0045, c.len, 6]} />
          <meshStandardMaterial
            color="#BAE6FD"
            emissive={idx % 4 === 0 ? "#C6FF3D" : "#38BDF8"}
            emissiveIntensity={0.95}
          />
        </mesh>
      ))}

      {/* Live Flowing Data / Load Telemetry Pulses Gliding Across the Span */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            pulseRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#C6FF3D" : "#38BDF8"} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Curved Cylindrical Holographic BIM / Code Lens (Open Cylinder Arc — ZERO Flat Boxes!)
 */
function CurvedHologramArc({
  texture,
  accent,
}: {
  texture: THREE.CanvasTexture;
  accent: string;
}) {
  const { arcGeo, rimTopGeo, rimBotGeo } = useMemo(() => {
    const r = 2.35;
    const h = 0.64;
    const thetaLen = 0.62;
    const thetaStart = -thetaLen / 2;

    const topPts: THREE.Vector3[] = [];
    const botPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 20; i++) {
      const a = thetaStart + (i / 20) * thetaLen;
      const x = Math.sin(a) * r;
      const z = Math.cos(a) * r;
      topPts.push(new THREE.Vector3(x, h / 2, z));
      botPts.push(new THREE.Vector3(x, -h / 2, z));
    }

    return {
      arcGeo: new THREE.CylinderGeometry(
        r,
        r,
        h,
        32,
        1,
        true,
        thetaStart,
        thetaLen
      ),
      rimTopGeo: new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(topPts),
        24,
        0.007,
        8,
        false
      ),
      rimBotGeo: new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(botPts),
        24,
        0.007,
        8,
        false
      ),
    };
  }, []);

  // Shift local z by -2.35 so the arc's center sits cleanly at local [0, 0, 0]
  return (
    <group position={[0, 0, -2.35]}>
      <mesh geometry={arcGeo}>
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={rimTopGeo}>
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh geometry={rimBotGeo}>
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

/**
 * 100% Non-Boxy Kinetic Architectural Astrolabe & Digital Twin Core
 * Replaces the old desk & laptop with a museum-grade Civil × Software 3D centerpiece!
 */
export function DeskEnvironment({ scrollRef }: DeskEnvironmentProps) {
  const { size } = useThree();
  const domeGroupRef = useRef<THREE.Group>(null);
  const domeWireRef = useRef<THREE.Mesh>(null);
  const plinthGroupRef = useRef<THREE.Group>(null);
  const vernierRingRef = useRef<THREE.Mesh>(null);
  const bridgeWrapRef = useRef<THREE.Group>(null);

  const gimbalGroupRef = useRef<THREE.Group>(null);
  const gimbalOuterRef = useRef<THREE.Group>(null);
  const gimbalMidRef = useRef<THREE.Group>(null);
  const gimbalInnerRef = useRef<THREE.Mesh>(null);

  const hudLeftRef = useRef<THREE.Group>(null);
  const hudRightRef = useRef<THREE.Group>(null);

  const satLeftRef = useRef<THREE.Group>(null);
  const satRightRef = useRef<THREE.Group>(null);
  const satKnotMeshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Group>(null);

  const compassTex = useMemo(() => createCompassDialTexture(), []);
  const feaHudTex = useMemo(() => createHologramHudTexture("fea"), []);
  const codeHudTex = useMemo(() => createHologramHudTexture("code"), []);

  // Sculpted Multi-Tiered Circular Turntable Plinth (LatheGeometry — Zero Corners!)
  const plinthGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, -0.22),
      new THREE.Vector2(1.45, -0.22),
      new THREE.Vector2(1.88, -0.14),
      new THREE.Vector2(2.24, -0.03),
      new THREE.Vector2(2.28, 0.04),
      new THREE.Vector2(2.16, 0.11),
      new THREE.Vector2(0, 0.11),
    ];
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = scrollRef.current.progress;

    const assemblePlinth = clamp01(p / 0.14);
    const assembleBridge = clamp01((p - 0.02) / 0.18);
    const assembleOrbit = clamp01((p - 0.06) / 0.2);

    const skyTransition = easeInOutCubic(clamp01((p - 0.52) / 0.16));
    const zeroG = easeInOutCubic(clamp01((p - 0.54) / 0.18));
    const heroFrame = easeInOutCubic(clamp01((p - 0.71) / 0.15));

    // 1. Geodesic Architectural Planetarium Dome & Horizon Rings
    if (domeGroupRef.current) {
      domeGroupRef.current.position.y = -skyTransition * 5.5;
      domeGroupRef.current.visible = skyTransition < 0.92;
    }
    if (domeWireRef.current) {
      domeWireRef.current.rotation.y = t * 0.035 + p * 0.5;
    }

    // 2. Sculpted Circular CAD Compass Plinth
    if (plinthGroupRef.current) {
      const pSpring = Math.max(0.01, easeOutBack(assemblePlinth));
      plinthGroupRef.current.scale.set(pSpring, pSpring, pSpring);
      plinthGroupRef.current.position.y =
        -0.02 - skyTransition * 3.8 + (1 - pSpring) * -0.6;
      plinthGroupRef.current.rotation.y = p * 0.65;
      plinthGroupRef.current.visible = skyTransition < 0.9;
    }
    if (vernierRingRef.current) {
      vernierRingRef.current.rotation.z = -t * 0.18 - p * 2.4;
    }

    // 3. Central Twin-Arch Calatrava Bridge Digital Twin
    if (bridgeWrapRef.current) {
      const bSpring = Math.max(0.01, easeOutBack(assembleBridge));
      const hoverY = Math.sin(t * 1.5) * 0.035 * zeroG;
      // During Finale (p > 0.71), gently lower & recede bridge so 3D text has 100% clean sky contrast!
      const finaleDropY = heroFrame * -0.95;
      const finalePushZ = heroFrame * -1.35;
      const finaleScale = 1 - heroFrame * 0.22;

      bridgeWrapRef.current.scale.setScalar(bSpring * finaleScale);
      bridgeWrapRef.current.position.set(
        0,
        0.08 + (1 - bSpring) * 0.55 + zeroG * 0.34 + hoverY + finaleDropY,
        finalePushZ
      );
      bridgeWrapRef.current.rotation.set(
        zeroG * 0.05 * (1 - heroFrame),
        Math.sin(t * 0.45) * 0.08 * zeroG * (1 - heroFrame),
        0
      );
    }

    // 4. Three Equatorial-Inclined Orbital Halo Rings (Hovering Cleanly Above Plinth!)
    const aspect = size.width / Math.max(1, size.height);
    const isPortrait = aspect < 0.85;
    const gimbalFadeOut = 1 - clamp01((p - 0.68) / 0.08);

    if (gimbalGroupRef.current) {
      const gSpring = Math.max(0.001, easeOutBack(assembleOrbit) * gimbalFadeOut);
      gimbalGroupRef.current.visible = gSpring > 0.02;
      gimbalGroupRef.current.scale.setScalar(gSpring);
      gimbalGroupRef.current.position.set(
        0,
        0.74 + zeroG * 0.22 + Math.sin(t * 1.2) * 0.02,
        0
      );
    }
    if (gimbalOuterRef.current) {
      gimbalOuterRef.current.rotation.set(
        Math.PI / 2 + 0.16 + Math.sin(t * 0.45) * 0.04,
        0,
        t * 0.22 + p * 2.2
      );
    }
    if (gimbalMidRef.current) {
      gimbalMidRef.current.rotation.set(
        Math.PI / 2 - 0.18 + Math.cos(t * 0.5) * 0.04,
        0.12,
        -t * 0.3 - p * 2.6
      );
    }
    if (gimbalInnerRef.current) {
      gimbalInnerRef.current.rotation.set(
        Math.PI / 2 + 0.08,
        -0.1,
        t * 0.36 + p * 1.8
      );
    }

    // 5. Curved Cylindrical Holographic BIM & Code HUD Lenses (Aspect-Aware for Mobile!)
    const hudFadeOut = 1 - clamp01((p - 0.64) / 0.09);
    const hudScaleMult = isPortrait ? 0.68 : 1.0;
    const hudX = isPortrait ? 1.12 : 1.82;
    const hudY = isPortrait ? 1.48 : 1.18;

    if (hudLeftRef.current) {
      const hScale = Math.max(0.001, easeOutBack(assembleOrbit) * hudFadeOut * hudScaleMult);
      hudLeftRef.current.visible = hScale > 0.02;
      hudLeftRef.current.scale.setScalar(hScale);
      hudLeftRef.current.position.set(
        -hudX - zeroG * 0.35,
        hudY + Math.sin(t * 1.6) * 0.04,
        0.48
      );
      hudLeftRef.current.rotation.set(0, 0.44 + Math.sin(t * 0.8) * 0.04, 0);
    }
    if (hudRightRef.current) {
      const hScale = Math.max(0.001, easeOutBack(assembleOrbit) * hudFadeOut * hudScaleMult);
      hudRightRef.current.visible = hScale > 0.02;
      hudRightRef.current.scale.setScalar(hScale);
      hudRightRef.current.position.set(
        hudX + zeroG * 0.35,
        hudY + Math.cos(t * 1.5) * 0.04,
        0.48
      );
      hudRightRef.current.rotation.set(0, -0.44 + Math.cos(t * 0.8) * 0.04, 0);
    }

    // 6. Orbital Geodesic & Parametric Torus-Knot Satellites
    const satX = isPortrait ? 1.72 : 2.35;
    if (satLeftRef.current) {
      const sScale = Math.max(0.001, easeOutBack(assembleOrbit) * (isPortrait ? 0.82 : 1));
      satLeftRef.current.scale.setScalar(sScale * (1 - heroFrame * 0.25));
      satLeftRef.current.position.set(
        -satX - heroFrame * 0.65,
        0.68 + zeroG * 0.65 + Math.sin(t * 1.7) * 0.06,
        0.18 - heroFrame * 0.3
      );
      satLeftRef.current.rotation.set(t * 0.45, t * 0.6, 0);
    }
    if (satRightRef.current) {
      const sScale = Math.max(0.001, easeOutBack(assembleOrbit) * (isPortrait ? 0.82 : 1));
      satRightRef.current.scale.setScalar(sScale * (1 - heroFrame * 0.25));
      satRightRef.current.position.set(
        satX + heroFrame * 0.65,
        0.68 + zeroG * 0.65 + Math.cos(t * 1.6) * 0.06,
        0.18 - heroFrame * 0.3
      );
    }
    if (satKnotMeshRef.current) {
      satKnotMeshRef.current.rotation.set(t * 0.55, t * 0.8, 0);
    }

    // 7. Luminous Stratosphere Clouds during Zero-G & Liquid-Glass Finale
    if (cloudsRef.current) {
      cloudsRef.current.visible = zeroG > 0.06;
      const cs = THREE.MathUtils.lerp(0.3, 1.05, zeroG);
      cloudsRef.current.scale.setScalar(cs);
      cloudsRef.current.position.x = Math.sin(t * 0.16) * 0.32;
      cloudsRef.current.position.y = 0.55 + zeroG * 0.3;
    }
  });

  return (
    <group>
      {/* === ARCHITECTURAL PLANETARIUM DOME & CONCENTRIC HORIZON === */}
      <group ref={domeGroupRef}>
        <mesh ref={domeWireRef} position={[0, 1.2, 0]}>
          <icosahedronGeometry args={[9.2, 2]} />
          <meshBasicMaterial
            color="#38BDF8"
            wireframe
            transparent
            opacity={0.075}
          />
        </mesh>

        {/* Smooth Circular Obsidian Studio Floor */}
        <mesh position={[0, -0.24, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[9.5, 64]} />
          <meshStandardMaterial color="#091320" roughness={0.78} metalness={0.22} />
        </mesh>

        {/* Subtle Glowing Horizon Datum Rings */}
        {[2.85, 4.1, 5.6].map((r, idx) => (
          <mesh
            key={idx}
            position={[0, -0.232, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[r, r + 0.018, 72]} />
            <meshBasicMaterial
              color={idx === 0 ? "#C6FF3D" : "#38BDF8"}
              transparent
              opacity={0.26 - idx * 0.06}
            />
          </mesh>
        ))}
      </group>

      {/* === SCULPTED CIRCULAR TITANIUM & GOLD COMPASS PLINTH === */}
      <group ref={plinthGroupRef}>
        <mesh geometry={plinthGeo} receiveShadow>
          <meshStandardMaterial
            color="#111C2D"
            metalness={0.82}
            roughness={0.24}
          />
        </mesh>

        {/* High-DPI Procedural CAD Azimuth Compass Surface */}
        <mesh position={[0, 0.114, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[2.14, 64]} />
          <meshStandardMaterial
            map={compassTex}
            emissive="#38BDF8"
            emissiveMap={compassTex}
            emissiveIntensity={0.38}
            roughness={0.32}
            metalness={0.35}
          />
        </mesh>

        {/* Rotating Brushed Champagne-Gold Bezel Torus (Flat in XZ Plane!) */}
        <mesh ref={vernierRingRef} position={[0, 0.095, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.22, 0.026, 16, 96]} />
          <meshStandardMaterial
            color="#FDE047"
            emissive="#CA8A04"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.16}
          />
        </mesh>
      </group>

      {/* === CENTERPIECE: TWIN-ARCH CALATRAVA SUSPENSION BRIDGE === */}
      <group ref={bridgeWrapRef}>
        <TwinArchBridgeCore />
      </group>

      {/* === THREE INTERLOCKING GYROSCOPIC ASTROLABE GIMBAL RINGS === */}
      <group ref={gimbalGroupRef} position={[0, 0.86, 0]}>
        <group ref={gimbalOuterRef}>
          <mesh>
            <torusGeometry args={[2.32, 0.015, 16, 96]} />
            <meshStandardMaterial
              color="#FDE047"
              emissive="#CA8A04"
              emissiveIntensity={0.35}
              metalness={0.88}
              roughness={0.18}
            />
          </mesh>
          {/* 4 Glowing Cardinal Nodes on Outer Gimbal */}
          {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((ang, idx) => (
            <mesh
              key={idx}
              position={[Math.cos(ang) * 2.32, Math.sin(ang) * 2.32, 0]}
            >
              <sphereGeometry args={[0.042, 14, 14]} />
              <meshBasicMaterial color={idx % 2 === 0 ? "#C6FF3D" : "#38BDF8"} />
            </mesh>
          ))}
        </group>

        <group ref={gimbalMidRef}>
          <mesh>
            <torusGeometry args={[2.02, 0.012, 16, 96]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={0.65}
              metalness={0.78}
              roughness={0.2}
            />
          </mesh>
        </group>

        <mesh ref={gimbalInnerRef}>
          <torusGeometry args={[1.76, 0.009, 12, 84]} />
          <meshStandardMaterial
            color="#C6FF3D"
            emissive="#84CC16"
            emissiveIntensity={0.75}
            metalness={0.7}
            roughness={0.22}
          />
        </mesh>
      </group>

      {/* === CURVED CYLINDRICAL HOLOGRAPHIC BIM & CODE HUD ARCS === */}
      <group ref={hudLeftRef}>
        <CurvedHologramArc texture={feaHudTex} accent="#38BDF8" />
      </group>
      <group ref={hudRightRef}>
        <CurvedHologramArc texture={codeHudTex} accent="#C6FF3D" />
      </group>

      {/* === ORBITAL SATELLITE SCULPTURES (LEFT GEODESIC & RIGHT TORUS-KNOT) === */}
      <group ref={satLeftRef} position={[-2.55, 0.65, 0.15]}>
        <mesh>
          <icosahedronGeometry args={[0.26, 1]} />
          <meshStandardMaterial
            color="#FDE047"
            emissive="#CA8A04"
            emissiveIntensity={0.4}
            metalness={0.85}
            roughness={0.2}
            wireframe
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#0284C7"
            emissiveIntensity={0.95}
            roughness={0.15}
          />
        </mesh>
      </group>

      <group ref={satRightRef} position={[2.55, 0.65, 0.15]}>
        <mesh ref={satKnotMeshRef}>
          <torusKnotGeometry args={[0.19, 0.046, 84, 18]} />
          <meshStandardMaterial
            color="#C084FC"
            emissive="#7E22CE"
            emissiveIntensity={0.45}
            metalness={0.86}
            roughness={0.14}
          />
        </mesh>
      </group>

      {/* === LUMINOUS ZERO-GRAVITY STRATOSPHERE CLOUDS === */}
      <group ref={cloudsRef} visible={false} position={[0, 1.0, -4.6]}>
        {[
          [-3.5, 1.25, -1.2, 1.3],
          [3.2, 1.4, -1.0, 1.35],
          [-0.4, 2.35, -2.5, 1.5],
          [1.8, -1.05, -1.8, 1.15],
          [-2.5, -1.15, -2.0, 1.1],
        ].map(([x, y, z, s], idx) => (
          <group key={idx} position={[x, y, z]} scale={s}>
            <mesh>
              <sphereGeometry args={[0.85, 16, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.92} />
            </mesh>
            <mesh position={[0.62, -0.16, 0.1]}>
              <sphereGeometry args={[0.6, 14, 14]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.92} />
            </mesh>
            <mesh position={[-0.58, -0.2, -0.05]}>
              <sphereGeometry args={[0.56, 14, 14]} />
              <meshStandardMaterial color="#F1F5F9" roughness={0.92} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
