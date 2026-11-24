"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Sparkles } from "@react-three/drei";
import type { Studio3DScrollState } from "@/context/ShowreelContext";

interface RetroComputerRoomProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/**
 * High-Res Sunlit Plaster Wall Texture with Feathered Golden-Hour Venetian Blind Stripes!
 * Recreates the exact warm diagonal sunbeam shadows across the wall from the reference.
 */
function createSunlitWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Warm shadowed plaster base
  const baseGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
  baseGrad.addColorStop(0, "#B89978");
  baseGrad.addColorStop(0.5, "#9E8060");
  baseGrad.addColorStop(1, "#7B6147");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Diagonal Golden-Hour Venetian Blind Sunbeams raking from upper-left window!
  ctx.save();
  ctx.beginPath();
  ctx.rect(50, 60, 680, 880);
  ctx.clip();

  ctx.translate(180, 120);
  ctx.rotate(0.46); // ~26.5 deg diagonal sun rake

  for (let i = -4; i < 18; i++) {
    const y = i * 44;
    const beamGrad = ctx.createLinearGradient(0, y, 640, y + 24);
    beamGrad.addColorStop(0, "rgba(255, 241, 204, 0.72)");
    beamGrad.addColorStop(0.55, "rgba(255, 232, 178, 0.42)");
    beamGrad.addColorStop(1, "rgba(255, 224, 160, 0.0)");
    ctx.fillStyle = beamGrad;
    ctx.fillRect(-120, y, 780, 23);
  }
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Walnut Wood Grain Desk Surface Texture + Warm Diagonal Venetian Blind Sun Stripes
 */
function createWalnutDeskTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const woodGrad = ctx.createLinearGradient(0, 0, 1024, 512);
  woodGrad.addColorStop(0, "#6E4726");
  woodGrad.addColorStop(0.5, "#5A381D");
  woodGrad.addColorStop(1, "#432813");
  ctx.fillStyle = woodGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle walnut plank grain lines
  for (let i = 0; i < 90; i++) {
    const y = (i / 90) * 512;
    ctx.fillStyle =
      i % 2 === 0 ? "rgba(32, 16, 6, 0.16)" : "rgba(168, 118, 68, 0.09)";
    ctx.fillRect(0, y, 1024, 2.5 + (i % 3));
  }

  // Diagonal Venetian-Blind Golden Sunlight Stripes Cast Across Left/Center Desk!
  ctx.save();
  ctx.translate(40, 0);
  ctx.rotate(0.42);
  for (let s = -4; s < 15; s++) {
    const sy = s * 38;
    const g = ctx.createLinearGradient(0, sy, 680, sy + 18);
    g.addColorStop(0, "rgba(255, 226, 158, 0.34)");
    g.addColorStop(0.65, "rgba(255, 215, 135, 0.16)");
    g.addColorStop(1, "rgba(255, 215, 135, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(-100, sy, 760, 19);
  }
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Framed Geometric Sunset × Suspension-Bridge Wall Poster (Civil × Aesthetic Easter Egg!)
 */
function createWallPosterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  // Cream mat board border
  ctx.fillStyle = "#EAE0CF";
  ctx.fillRect(0, 0, 512, 640);

  // Inner poster canvas
  const px = 38;
  const py = 38;
  const pw = 436;
  const ph = 564;

  // Deep retro petrol-teal sky
  ctx.fillStyle = "#1B4D5C";
  ctx.fillRect(px, py, pw, ph);

  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();

  // Warm golden-amber retro sun disc
  ctx.fillStyle = "#E09F3E";
  ctx.beginPath();
  ctx.arc(256, 235, 106, 0, Math.PI * 2);
  ctx.fill();

  // Horizontal sunset slice cutouts across lower sun
  ctx.fillStyle = "#1B4D5C";
  [262, 286, 308].forEach((sy, idx) => {
    ctx.fillRect(130, sy, 252, 6 + idx * 3);
  });

  // Diagonal Terracotta, Ochre & Forest-Green Bauhaus Stripes (Matches Reference!)
  const stripes: [string, number][] = [
    ["#C85A32", 340],
    ["#E07A48", 398],
    ["#2A6F4E", 456],
    ["#1F543B", 515],
  ];
  stripes.forEach(([col, yOff]) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(px - 20, yOff - 35);
    ctx.lineTo(px + pw + 20, yOff + 65);
    ctx.lineTo(px + pw + 20, py + ph + 20);
    ctx.lineTo(px - 20, py + ph + 20);
    ctx.closePath();
    ctx.fill();
  });

  // Subtle Golden Suspension-Bridge Arch Silhouette Spanning the Horizon (Civil × Code Touch!)
  ctx.strokeStyle = "#FDE68A";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(px + 20, 338);
  ctx.quadraticCurveTo(256, 210, px + pw - 20, 338);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(px, 338);
  ctx.lineTo(px + pw, 338);
  ctx.stroke();

  for (let hx = px + 56; hx < px + pw - 40; hx += 36) {
    const norm = (hx - 256) / 200;
    const archY = 274 + norm * norm * 64;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(hx, archY);
    ctx.lineTo(hx, 338);
    ctx.stroke();
  }

  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Draws the Live Retro CRT OS Screen ("WELCOME|" -> Launching Digital Twin Portal!)
 * Only redrawn when discrete stage changes — zero per-frame CPU overhead!
 */
function drawCrtScreenStage(
  ctx: CanvasRenderingContext2D,
  typedLen: number,
  portalLaunch: number,
  cursorBlink: boolean
) {
  const w = 1024;
  const h = 768;

  // Classic Vintage Teal OS Desktop Background (Matches Reference!)
  const bg = ctx.createRadialGradient(512, 384, 80, 512, 384, 620);
  bg.addColorStop(0, "#4BA3B5");
  bg.addColorStop(1, "#2D7788");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Top Retro OS Menu Bar
  ctx.fillStyle = "#EAE4D7";
  ctx.fillRect(0, 0, w, 40);
  ctx.fillStyle = "#1E293B";
  ctx.font = "bold 20px monospace";
  ctx.fillText("  AxisOS 2.6   File   StructFEA   Code   Render3D", 16, 27);
  ctx.fillText("120 FPS", w - 115, 27);

  // Left Desktop Retro Icons (Civil x Software Touch!)
  const icons = [
    { y: 78, col: "#F59E0B", label: "BRIDGE.CAD" },
    { y: 184, col: "#38BDF8", label: "SOLVER.PY" },
    { y: 290, col: "#C6FF3D", label: "TWIN_3D.EXE" },
  ];
  icons.forEach((ic) => {
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(42, ic.y, 52, 42);
    ctx.fillStyle = ic.col;
    ctx.fillRect(46, ic.y + 6, 44, 30);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 15px monospace";
    ctx.fillText(ic.label, 24, ic.y + 62);
  });

  // Center Classic "WELCOME" Window (Matches Reference Image!)
  const winW = 580;
  const winH = 330;
  const wx = (w - winW) / 2 + 24;
  const wy = (h - winH) / 2 - 10;

  // Retro Window Drop Shadow
  ctx.fillStyle = "rgba(8, 28, 38, 0.35)";
  ctx.fillRect(wx + 12, wy + 12, winW, winH);

  // Window Body
  ctx.fillStyle = "#F4F1EA";
  ctx.fillRect(wx, wy, winW, winH);
  ctx.strokeStyle = "#1E293B";
  ctx.lineWidth = 4;
  ctx.strokeRect(wx, wy, winW, winH);

  // Classic Blue Title Bar
  ctx.fillStyle = "#0F5C8C";
  ctx.fillRect(wx + 6, wy + 6, winW - 12, 42);

  // Window Control Squares
  ctx.fillStyle = "#F4F1EA";
  ctx.fillRect(wx + winW - 40, wy + 15, 24, 24);
  ctx.fillRect(wx + winW - 72, wy + 15, 24, 24);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 20px monospace";
  ctx.fillText("AXIS._ // WORKSTATION", wx + 20, wy + 34);

  // Typed "WELCOME" Headline Inside Window
  const fullMsg = "WELCOME";
  const shown = fullMsg.slice(0, typedLen);
  ctx.fillStyle = "#1E293B";
  ctx.font = "bold 64px monospace";
  ctx.textAlign = "center";
  ctx.fillText(
    `${shown}${cursorBlink ? "|" : " "}`,
    wx + winW / 2,
    wy + 178
  );

  ctx.fillStyle = "#475569";
  ctx.font = "bold 20px monospace";
  ctx.fillText(
    "CIVIL ENGINEER × SOFTWARE ENGINEER",
    wx + winW / 2,
    wy + 236
  );
  ctx.fillStyle = "#0F5C8C";
  ctx.font = "bold 17px monospace";
  ctx.fillText(
    "[ SCROLL TO ENTER 3D DIGITAL TWIN ]",
    wx + winW / 2,
    wy + 282
  );
  ctx.textAlign = "left";

  // Expanding Dark Digital-Twin Portal Window as Camera Zooms Into the CRT!
  if (portalLaunch > 0.02) {
    const pEase = portalLaunch * portalLaunch * (3 - 2 * portalLaunch);
    const pw = THREE.MathUtils.lerp(240, w, pEase);
    const ph = THREE.MathUtils.lerp(160, h, pEase);
    const px = (w - pw) / 2;
    const py = (h - ph) / 2;

    ctx.fillStyle = "#07111E";
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 4;
    ctx.strokeRect(px + 2, py + 2, pw - 4, ph - 4);

    // Glowing Twin-Arch Bridge Wireframe Preview Inside Expanding CRT Portal!
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();

    const cx = w / 2;
    const cy = h / 2 + 48;
    const span = pw * 0.68;

    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 1.5;
    for (let gx = -5; gx <= 5; gx++) {
      ctx.beginPath();
      ctx.moveTo(cx + gx * 85, py);
      ctx.lineTo(cx + gx * 85, py + ph);
      ctx.stroke();
    }

    // Golden Parabolic Bridge Arch
    ctx.strokeStyle = "#FACC15";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx - span / 2, cy);
    ctx.quadraticCurveTo(cx, cy - ph * 0.48, cx + span / 2, cy);
    ctx.stroke();

    // Cyan Deck & Stay Cables
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - span * 0.56, cy);
    ctx.lineTo(cx + span * 0.56, cy);
    ctx.stroke();

    ctx.strokeStyle = "#C6FF3D";
    ctx.lineWidth = 2;
    for (let i = -5; i <= 5; i++) {
      const rx = (i / 6) * (span / 2);
      const norm = i / 6;
      const topY = cy - ph * 0.24 * (1 - norm * norm);
      ctx.beginPath();
      ctx.moveTo(cx + rx, topY);
      ctx.lineTo(cx + rx, cy);
      ctx.stroke();
    }

    ctx.fillStyle = "#C6FF3D";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText("LAUNCHING 3D DIGITAL TWIN CORE...", cx, py + 58);
    ctx.textAlign = "left";
    ctx.restore();
  }

  // Subtle CRT Scanlines & Rounded Corner Vignette
  ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
  for (let sy = 0; sy < h; sy += 6) {
    ctx.fillRect(0, sy, w, 2);
  }
}

/**
 * Phase 1 of Act 2 (p = 0.00 -> 0.36):
 * Cozy Golden-Hour Sunlit Retro Computer Room!
 * Zooming straight into the CRT screen portals seamlessly into Phase 2 (The 3D Digital Twin)!
 */
export function RetroComputerRoom({ scrollRef }: RetroComputerRoomProps) {
  const rootRef = useRef<THREE.Group>(null);
  const lastStateKeyRef = useRef("");

  const wallTex = useMemo(() => createSunlitWallTexture(), []);
  const deskTex = useMemo(() => createWalnutDeskTexture(), []);
  const posterTex = useMemo(() => createWallPosterTexture(), []);

  const { crtCanvas, crtTex } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext("2d")!;
    drawCrtScreenStage(ctx, 7, 0, true);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return { crtCanvas: canvas, crtTex: tex };
  }, []);

  // Precompute 62 Sculpted Mechanical Keycap Coordinates (Main Block + Right Numpad)
  const keycaps = useMemo(() => {
    const caps: { x: number; z: number; w: number; col: string }[] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 11; col++) {
        // Spacebar row handling
        if (row === 3 && col >= 3 && col <= 7) {
          if (col === 5) {
            caps.push({
              x: -0.09 + 5 * 0.036 - 0.18,
              z: -0.06 + row * 0.038,
              w: 0.165,
              col: "#EFECE4",
            });
          }
          continue;
        }
        const isEsc = row === 0 && col === 0;
        const isEnter = row === 1 && col === 10;
        caps.push({
          x: -0.265 + col * 0.036,
          z: -0.06 + row * 0.038,
          w: isEnter ? 0.044 : 0.028,
          col: isEsc
            ? "#E06D53"
            : isEnter
              ? "#5BB5A2"
              : col === 0 || col === 10
                ? "#C8C0B0"
                : "#F2EFE7",
        });
      }
    }
    // Right Numpad Block
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        caps.push({
          x: 0.175 + col * 0.035,
          z: -0.06 + row * 0.038,
          w: 0.028,
          col: "#EAE5D9",
        });
      }
    }
    return caps;
  }, []);

  const blindSlats = useMemo(
    () => Array.from({ length: 13 }, (_, i) => 0.68 + i * 0.072),
    []
  );

  useFrame(({ clock }) => {
    const p = scrollRef.current.progress;
    const grp = rootRef.current;
    if (!grp) return;

    // Hide completely once inside the Digital Twin (zero GPU cost for p >= 0.36!)
    if (p >= 0.362) {
      grp.visible = false;
      return;
    }
    grp.visible = true;

    const t = clock.getElapsedTime();
    const blink = Math.floor(t * 2.2) % 2 === 0;
    const typedLen = Math.min(7, Math.max(4, Math.floor(4 + (p / 0.08) * 4)));
    const portalStep = Math.round(clamp01((p - 0.15) / 0.17) * 24);
    const stateKey = `${typedLen}-${portalStep}-${blink ? 1 : 0}`;

    if (stateKey !== lastStateKeyRef.current) {
      lastStateKeyRef.current = stateKey;
      const ctx = crtCanvas.getContext("2d");
      if (ctx) {
        drawCrtScreenStage(ctx, typedLen, portalStep / 24, blink);
        crtTex.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={rootRef}>
      {/* ================================================================
          1. SUNLIT COZY STUDIO WALLS, WINDOW BLINDS & CACTUS
         ================================================================ */}
      {/* Back Wall with Feathered Venetian Blind Sunbeams */}
      <mesh position={[0.2, 0.78, -0.72]}>
        <planeGeometry args={[5.4, 3.8]} />
        <meshStandardMaterial map={wallTex} roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Left Window Wall + Recessed Sunlit Window Frame (Right Beside Desk Like Reference!) */}
      <group position={[-1.34, 0.78, 0.25]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[3.4, 3.8]} />
          <meshStandardMaterial color="#AD9071" roughness={0.92} />
        </mesh>

        {/* Bright Warm Morning Sky Outside Window */}
        <mesh position={[0.18, 0.34, -0.02]}>
          <planeGeometry args={[1.18, 1.12]} />
          <meshBasicMaterial color="#FFF3D1" />
        </mesh>

        {/* Molded Cream Window Trim & Windowsill */}
        <RoundedBox
          args={[1.34, 0.055, 0.16]}
          radius={0.018}
          smoothness={3}
          position={[0.18, -0.22, 0.05]}
        >
          <meshStandardMaterial color="#E6D5BE" roughness={0.65} />
        </RoundedBox>
        <RoundedBox
          args={[1.3, 0.06, 0.1]}
          radius={0.015}
          smoothness={3}
          position={[0.18, 0.92, 0.03]}
        >
          <meshStandardMaterial color="#E6D5BE" roughness={0.65} />
        </RoundedBox>
        <RoundedBox
          args={[0.07, 1.16, 0.09]}
          radius={0.015}
          smoothness={3}
          position={[-0.43, 0.35, 0.02]}
        >
          <meshStandardMaterial color="#DECBB2" roughness={0.7} />
        </RoundedBox>
        <RoundedBox
          args={[0.07, 1.16, 0.09]}
          radius={0.015}
          smoothness={3}
          position={[0.79, 0.35, 0.02]}
        >
          <meshStandardMaterial color="#DECBB2" roughness={0.7} />
        </RoundedBox>

        {/* 13 Cream Venetian Blind Slats + Pull Cords */}
        {blindSlats.map((sy, idx) => (
          <mesh
            key={idx}
            position={[0.18, sy - 0.82, 0.02]}
            rotation={[0.42, 0, 0]}
          >
            <boxGeometry args={[1.16, 0.008, 0.048]} />
            <meshStandardMaterial color="#F3E5CE" roughness={0.55} />
          </mesh>
        ))}

        {/* Cute Potted Green Cactus on the Sunlit Windowsill! */}
        <group position={[0.28, -0.19, 0.07]}>
          {/* Terra-Cotta Pot */}
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[0.062, 0.046, 0.11, 20]} />
            <meshStandardMaterial color="#9E472A" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.105, 0]}>
            <cylinderGeometry args={[0.068, 0.065, 0.024, 20]} />
            <meshStandardMaterial color="#B35334" roughness={0.72} />
          </mesh>
          {/* Green Saguaro Cactus Stem + Side Arm */}
          <mesh position={[0, 0.18, 0]}>
            <capsuleGeometry args={[0.036, 0.11, 8, 16]} />
            <meshStandardMaterial color="#2D5A36" roughness={0.65} />
          </mesh>
          <mesh position={[0.042, 0.185, 0]} rotation={[0, 0, -0.55]}>
            <capsuleGeometry args={[0.02, 0.055, 6, 12]} />
            <meshStandardMaterial color="#356940" roughness={0.65} />
          </mesh>
        </group>
      </group>

      {/* Framed Sunset × Bridge Art Print on Back Wall */}
      <group position={[-0.14, 1.18, -0.69]}>
        <RoundedBox args={[0.68, 0.84, 0.035]} radius={0.012} smoothness={3}>
          <meshStandardMaterial color="#2C2520" roughness={0.5} metalness={0.2} />
        </RoundedBox>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.61, 0.77]} />
          <meshStandardMaterial map={posterTex} roughness={0.65} />
        </mesh>
      </group>

      {/* ================================================================
          2. SOLID WALNUT ENGINEER'S DESK & TEAL DESK MAT
         ================================================================ */}
      <group position={[0.02, 0, 0.08]}>
        {/* Beveled Walnut Tabletop */}
        <RoundedBox
          args={[2.45, 0.075, 1.26]}
          radius={0.022}
          smoothness={4}
          position={[0, -0.038, 0]}
        >
          <meshStandardMaterial map={deskTex} roughness={0.52} metalness={0.08} />
        </RoundedBox>

        {/* 4 Tapered Mid-Century Walnut Legs */}
        {[
          [-1.06, -0.62, -0.48],
          [1.06, -0.62, -0.48],
          [-1.06, -0.62, 0.48],
          [1.06, -0.62, 0.48],
        ].map(([lx, ly, lz], idx) => (
          <mesh key={idx} position={[lx, ly, lz]}>
            <cylinderGeometry args={[0.038, 0.024, 1.15, 14]} />
            <meshStandardMaterial color="#4A2E18" roughness={0.6} />
          </mesh>
        ))}

        {/* Teal Desk Mat Under Keyboard & Mouse (Matches Reference!) */}
        <RoundedBox
          args={[1.18, 0.01, 0.48]}
          radius={0.02}
          smoothness={3}
          position={[0.08, 0.005, 0.28]}
        >
          <meshStandardMaterial color="#1F8A7E" roughness={0.72} />
        </RoundedBox>
      </group>

      {/* ================================================================
          3. VINTAGE BEIGE HORIZONTAL CPU + CRT MONITOR ("WELCOME" PORTAL!)
         ================================================================ */}
      <group position={[0.05, 0, -0.14]}>
        {/* Horizontal Dual-Floppy Desktop CPU Unit */}
        <RoundedBox
          args={[0.76, 0.17, 0.58]}
          radius={0.026}
          smoothness={4}
          position={[0, 0.085, 0]}
        >
          <meshStandardMaterial color="#D8CEBC" roughness={0.48} metalness={0.06} />
        </RoundedBox>
        {/* Front Bezel Groove & Floppy Drives */}
        <mesh position={[-0.16, 0.095, 0.292]}>
          <boxGeometry args={[0.24, 0.016, 0.01]} />
          <meshStandardMaterial color="#3F3A34" />
        </mesh>
        <mesh position={[0.17, 0.095, 0.292]}>
          <boxGeometry args={[0.24, 0.016, 0.01]} />
          <meshStandardMaterial color="#3F3A34" />
        </mesh>
        {/* Power LED & Retro Badge */}
        <mesh position={[-0.31, 0.125, 0.293]}>
          <boxGeometry args={[0.026, 0.016, 0.008]} />
          <meshBasicMaterial color="#4ADE80" />
        </mesh>
        <mesh position={[0.31, 0.055, 0.292]}>
          <boxGeometry args={[0.035, 0.035, 0.012]} />
          <meshStandardMaterial color="#B8AE9C" />
        </mesh>

        {/* Monitor Swivel Pedestal Neck */}
        <mesh position={[0, 0.205, -0.02]}>
          <cylinderGeometry args={[0.16, 0.2, 0.07, 24]} />
          <meshStandardMaterial color="#C8BEAC" roughness={0.5} />
        </mesh>

        {/* Main Vintage Beige CRT Monitor Housing (Centered at y = 0.55) */}
        <group position={[0, 0.55, 0]}>
          {/* Front Sculpted CRT Bezel */}
          <RoundedBox
            args={[0.74, 0.62, 0.34]}
            radius={0.048}
            smoothness={4}
            position={[0, 0, 0.08]}
          >
            <meshStandardMaterial color="#E2D9C6" roughness={0.44} metalness={0.05} />
          </RoundedBox>

          {/* Tapered Rear CRT Cathode Tube Housing */}
          <RoundedBox
            args={[0.56, 0.46, 0.32]}
            radius={0.055}
            smoothness={4}
            position={[0, 0.01, -0.18]}
          >
            <meshStandardMaterial color="#D2C8B4" roughness={0.5} />
          </RoundedBox>

          {/* Recessed Dark Inner Screen Frame */}
          <RoundedBox
            args={[0.62, 0.48, 0.025]}
            radius={0.028}
            smoothness={3}
            position={[0, 0.02, 0.244]}
          >
            <meshStandardMaterial color="#26292E" roughness={0.55} />
          </RoundedBox>

          {/* LIVE GLOWING CRT GLASS SCREEN (Exact Zoom-In Target at world [0.05, 0.57, 0.12]!) */}
          <mesh position={[0, 0.02, 0.258]}>
            <planeGeometry args={[0.58, 0.44]} />
            <meshBasicMaterial map={crtTex} toneMapped={false} />
          </mesh>

          {/* Subtle Specular Curved Glass Glint Layer */}
          <mesh position={[0, 0.02, 0.261]}>
            <planeGeometry args={[0.58, 0.44]} />
            <meshPhysicalMaterial
              color="#FFFFFF"
              transparent
              opacity={0.07}
              roughness={0.08}
              clearcoat={1}
              depthWrite={false}
            />
          </mesh>

          {/* Monitor Front Green Power LED & Adjustment Knobs */}
          <mesh position={[0.26, -0.255, 0.253]}>
            <boxGeometry args={[0.022, 0.012, 0.008]} />
            <meshBasicMaterial color="#4ADE80" />
          </mesh>
          {[-0.08, -0.02, 0.04].map((kx, ki) => (
            <mesh key={ki} position={[kx, -0.255, 0.252]}>
              <boxGeometry args={[0.032, 0.012, 0.01]} />
              <meshStandardMaterial color="#B5AC9A" />
            </mesh>
          ))}
        </group>
      </group>

      {/* ================================================================
          4. SCULPTED MECHANICAL KEYBOARD, RETRO MOUSE & STEREO SPEAKERS
         ================================================================ */}
      {/* Full Vintage Mechanical Keyboard on Teal Desk Mat */}
      <group position={[-0.02, 0.024, 0.34]} rotation={[0.08, 0.05, 0]}>
        <RoundedBox args={[0.66, 0.032, 0.22]} radius={0.014} smoothness={3}>
          <meshStandardMaterial color="#DDD4C3" roughness={0.46} />
        </RoundedBox>
        {keycaps.map((kc, idx) => (
          <RoundedBox
            key={idx}
            args={[kc.w, 0.018, 0.028]}
            radius={0.005}
            smoothness={2}
            position={[kc.x, 0.02, kc.z]}
          >
            <meshStandardMaterial color={kc.col} roughness={0.42} />
          </RoundedBox>
        ))}
      </group>

      {/* Two-Button Retro Mouse */}
      <group position={[0.45, 0.024, 0.38]} rotation={[0, -0.12, 0]}>
        <RoundedBox args={[0.085, 0.032, 0.13]} radius={0.014} smoothness={3}>
          <meshStandardMaterial color="#DED6C6" roughness={0.44} />
        </RoundedBox>
        <mesh position={[-0.018, 0.017, -0.038]}>
          <boxGeometry args={[0.032, 0.004, 0.042]} />
          <meshStandardMaterial color="#C5BCB0" />
        </mesh>
        <mesh position={[0.018, 0.017, -0.038]}>
          <boxGeometry args={[0.032, 0.004, 0.042]} />
          <meshStandardMaterial color="#C5BCB0" />
        </mesh>
      </group>

      {/* Left & Right Vintage Bookshelf Studio Speakers (Matches Reference!) */}
      {[
        [-0.46, 0.135, -0.12, 0.18],
        [0.58, 0.135, -0.06, -0.22],
      ].map(([sx, sy, sz, sRot], idx) => (
        <group key={idx} position={[sx, sy, sz]} rotation={[0, sRot, 0]}>
          <RoundedBox args={[0.17, 0.27, 0.18]} radius={0.018} smoothness={3}>
            <meshStandardMaterial color="#DDD3C1" roughness={0.48} />
          </RoundedBox>
          {/* Dark Acoustic Fabric Grille */}
          <RoundedBox
            args={[0.135, 0.19, 0.015]}
            radius={0.008}
            smoothness={2}
            position={[0, 0.02, 0.088]}
          >
            <meshStandardMaterial color="#2B2927" roughness={0.85} />
          </RoundedBox>
          {/* Tiny Volume Knob */}
          <mesh position={[0.04, -0.1, 0.092]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.012, 12]} />
            <meshStandardMaterial color="#57534E" />
          </mesh>
        </group>
      ))}

      {/* Desk Accessories: Sketchpad/Device on Left Wood + Ceramic Mug on Right */}
      <group position={[-0.64, 0.012, 0.24]} rotation={[0, 0.24, 0]}>
        <RoundedBox args={[0.12, 0.012, 0.2]} radius={0.012} smoothness={2}>
          <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.25} />
        </RoundedBox>
      </group>

      <group position={[0.78, 0.065, 0.22]}>
        <mesh>
          <cylinderGeometry args={[0.058, 0.05, 0.13, 24]} />
          <meshStandardMaterial color="#F5EFE6" roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.058, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.05, 20]} />
          <meshStandardMaterial color="#3B2314" roughness={0.25} />
        </mesh>
      </group>

      {/* ================================================================
          5. FLOATING GOLDEN SUNBEAM DUST MOTES (MATCHES REFERENCE!)
         ================================================================ */}
      <Sparkles
        count={68}
        scale={[2.6, 1.9, 2.2]}
        position={[-0.55, 0.78, 0.25]}
        size={2.6}
        speed={0.24}
        opacity={0.85}
        color="#FFE7A3"
      />
    </group>
  );
}
