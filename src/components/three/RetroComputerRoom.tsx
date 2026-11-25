"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Sparkles } from "@react-three/drei";
import type { Studio3DScrollState } from "@/context/ShowreelContext";
import { isCompactViewport } from "@/lib/webgl";

interface RetroComputerRoomProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
  crtShaderMatRef: React.RefObject<THREE.ShaderMaterial | null>;
}

/**
 * High-Res Sunlit Plaster Wall Texture with Feathered Golden-Hour Venetian Blind Stripes!
 */
function createSunlitWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  const baseGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
  baseGrad.addColorStop(0, "#B89978");
  baseGrad.addColorStop(0.5, "#9E8060");
  baseGrad.addColorStop(1, "#7B6147");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.save();
  ctx.beginPath();
  ctx.rect(50, 60, 680, 880);
  ctx.clip();

  ctx.translate(180, 120);
  ctx.rotate(0.46);

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

  for (let i = 0; i < 90; i++) {
    const y = (i / 90) * 512;
    ctx.fillStyle =
      i % 2 === 0 ? "rgba(32, 16, 6, 0.16)" : "rgba(168, 118, 68, 0.09)";
    ctx.fillRect(0, y, 1024, 2.5 + (i % 3));
  }

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
 * Framed Geometric Sunset × Suspension-Bridge Wall Poster
 */
function createWallPosterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#EAE0CF";
  ctx.fillRect(0, 0, 512, 640);

  const px = 38;
  const py = 38;
  const pw = 436;
  const ph = 564;

  ctx.fillStyle = "#1B4D5C";
  ctx.fillRect(px, py, pw, ph);

  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();

  ctx.fillStyle = "#E09F3E";
  ctx.beginPath();
  ctx.arc(256, 235, 106, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1B4D5C";
  [262, 286, 308].forEach((sy, idx) => {
    ctx.fillRect(130, sy, 252, 6 + idx * 3);
  });

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
 * Translucent Retro CRT Top-Bar OSD Overlay (Fades cleanly to 0 before portal entry!)
 */
function createCrtOsdOverlayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 768);

  // Sleek Retro Workstation Top Menu Bar
  ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
  ctx.fillRect(0, 0, 1024, 44);
  ctx.fillStyle = "#C6FF3D";
  ctx.fillRect(0, 42, 1024, 2);

  ctx.fillStyle = "#F8FAFC";
  ctx.font = "bold 20px monospace";
  ctx.fillText("  AxisOS 2.6 // WELCOME", 18, 29);

  ctx.fillStyle = "#C6FF3D";
  ctx.textAlign = "right";
  ctx.fillText("LIVE 3D TWIN ● 120 FPS", 1000, 29);
  ctx.textAlign = "left";

  // Bottom subtle terminal prompt
  ctx.fillStyle = "rgba(7, 17, 30, 0.62)";
  ctx.fillRect(24, 704, 460, 40);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 704, 460, 40);
  ctx.fillStyle = "#38BDF8";
  ctx.font = "bold 18px monospace";
  ctx.fillText("> executing digital_twin_bridge.3d_", 40, 730);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const CRT_PORTAL_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CRT_PORTAL_FRAG = /* glsl */ `
  uniform sampler2D uFboTex;
  uniform vec2 uResolution;
  uniform float uCanvasAspect;
  uniform float uPortalBlend;
  varying vec2 vUv;

  void main() {
    float planeAspect = 0.58 / 0.44;
    vec2 centered = vUv - 0.5;
    if (uCanvasAspect > planeAspect) {
      centered.x *= planeAspect / uCanvasAspect;
    } else {
      centered.y *= uCanvasAspect / planeAspect;
    }

    // Subtle vintage CRT barrel curvature from afar -> flattens to 0.0 on portal entry!
    float crtCurve = (1.0 - uPortalBlend) * 0.07;
    centered *= 1.0 + dot(centered, centered) * crtCurve;
    vec2 monitorUv = clamp(centered + 0.5, 0.002, 0.998);

    // Exact screen-space UV so at uPortalBlend = 1.0 every pixel matches direct Phase 2 render 1:1!
    vec2 screenUv = gl_FragCoord.xy / max(vec2(1.0), uResolution);
    vec2 finalUv = mix(monitorUv, screenUv, uPortalBlend);

    vec4 texel = texture2D(uFboTex, finalUv);
    vec3 col = texel.rgb;

    float crtFx = 1.0 - uPortalBlend;
    if (crtFx > 0.001) {
      float scan = sin(vUv.y * 230.0) * 0.026 * crtFx;
      col = max(vec3(0.0), col - scan);
      vec2 vigUv = vUv * (1.0 - vUv.yx);
      float vig = pow(clamp(vigUv.x * vigUv.y * 18.0, 0.0, 1.0), 0.2);
      col *= mix(1.0, vig, crtFx * 0.3);
      float rim = smoothstep(0.475, 0.5, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
      col += vec3(0.22, 0.74, 0.97) * rim * 0.32 * crtFx;
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createRoundedMatGeometry(
  width: number,
  depth: number,
  cornerRadius: number,
  thickness: number
): THREE.ExtrudeGeometry {
  const hw = width / 2;
  const hd = depth / 2;
  const r = Math.min(cornerRadius, hw * 0.45, hd * 0.45);
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hd);
  shape.lineTo(hw - r, -hd);
  shape.quadraticCurveTo(hw, -hd, hw, -hd + r);
  shape.lineTo(hw, hd - r);
  shape.quadraticCurveTo(hw, hd, hw - r, hd);
  shape.lineTo(-hw + r, hd);
  shape.quadraticCurveTo(-hw, hd, -hw, hd - r);
  shape.lineTo(-hw, -hd + r);
  shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.001,
    bevelSize: 0.0012,
    bevelSegments: 2,
    curveSegments: 10,
  });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

/**
 * Phase 1 of Act 2:
 * Cozy Golden-Hour Sunlit Retro Computer Room with LIVE 3D RenderTarget Portal Screen,
 * Authentic Full-Size Sculpted Mechanical Keyboard, Thin Desk Mat, Steaming Mug & Window Cactus!
 */
export function RetroComputerRoom({
  scrollRef,
  crtShaderMatRef,
}: RetroComputerRoomProps) {
  const keyRefs = useRef<(THREE.Group | null)[]>([]);
  const steamRefs = useRef<(THREE.Mesh | null)[]>([]);
  const osdMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const mouseMeshRef = useRef<THREE.Group>(null);
  const isCompactGpu = useMemo(() => isCompactViewport(), []);

  const initialUniforms = useMemo(
    () => ({
      uFboTex: { value: null as THREE.Texture | null },
      uResolution: { value: new THREE.Vector2(1440, 900) },
      uCanvasAspect: { value: 1.6 },
      uPortalBlend: { value: 0 },
    }),
    []
  );

  const wallTex = useMemo(() => createSunlitWallTexture(), []);
  const deskTex = useMemo(() => createWalnutDeskTexture(), []);
  const posterTex = useMemo(() => createWallPosterTexture(), []);
  const osdTex = useMemo(() => createCrtOsdOverlayTexture(), []);
  const deskMatGeo = useMemo(
    () => createRoundedMatGeometry(1.18, 0.48, 0.032, 0.0038),
    []
  );

  const keycaps = useMemo(() => {
    const caps: { x: number; z: number; w: number; col: string }[] = [];
    const ALABASTER = "#F4F0E6";
    const MOD_GREY = "#C7BFB0";
    const ESC_CORAL = "#E06D53";
    const ENTER_MINT = "#5AB6A2";

    // Row 0: Function Row (ESC + F1-F4 + F5-F8 + F9-F12)
    const zF = -0.082;
    caps.push({ x: -0.28, z: zF, w: 0.026, col: ESC_CORAL });
    for (let i = 0; i < 4; i++) {
      caps.push({ x: -0.224 + i * 0.029, z: zF, w: 0.025, col: ALABASTER });
    }
    for (let i = 0; i < 4; i++) {
      caps.push({ x: -0.092 + i * 0.029, z: zF, w: 0.025, col: MOD_GREY });
    }
    for (let i = 0; i < 4; i++) {
      caps.push({ x: 0.04 + i * 0.029, z: zF, w: 0.025, col: ALABASTER });
    }

    // Row 1: Number Row (~ to = + Backspace)
    const z1 = -0.044;
    for (let i = 0; i < 13; i++) {
      caps.push({
        x: -0.28 + i * 0.029,
        z: z1,
        w: 0.025,
        col: i === 0 ? MOD_GREY : ALABASTER,
      });
    }
    caps.push({ x: 0.113, z: z1, w: 0.052, col: MOD_GREY });

    // Row 2: QWERTY Row (Tab + 12 alphas + \)
    const z2 = -0.012;
    caps.push({ x: -0.274, z: z2, w: 0.038, col: MOD_GREY });
    for (let i = 0; i < 12; i++) {
      caps.push({ x: -0.233 + i * 0.029, z: z2, w: 0.025, col: ALABASTER });
    }
    caps.push({ x: 0.121, z: z2, w: 0.036, col: MOD_GREY });

    // Row 3: ASDF Home Row (Caps + 11 alphas + Mint Enter)
    const z3 = 0.02;
    caps.push({ x: -0.27, z: z3, w: 0.046, col: MOD_GREY });
    for (let i = 0; i < 11; i++) {
      caps.push({ x: -0.225 + i * 0.029, z: z3, w: 0.025, col: ALABASTER });
    }
    caps.push({ x: 0.111, z: z3, w: 0.056, col: ENTER_MINT });

    // Row 4: ZXCV Shift Row (LShift + 10 alphas + RShift)
    const z4 = 0.052;
    caps.push({ x: -0.264, z: z4, w: 0.058, col: MOD_GREY });
    for (let i = 0; i < 10; i++) {
      caps.push({ x: -0.213 + i * 0.029, z: z4, w: 0.025, col: ALABASTER });
    }
    caps.push({ x: 0.105, z: z4, w: 0.068, col: MOD_GREY });

    // Row 5: Bottom Row (Ctrl, Win, Alt, Spacebar, Alt, Fn, Ctrl)
    const z5 = 0.084;
    caps.push({ x: -0.276, z: z5, w: 0.034, col: MOD_GREY });
    caps.push({ x: -0.237, z: z5, w: 0.032, col: MOD_GREY });
    caps.push({ x: -0.199, z: z5, w: 0.032, col: MOD_GREY });
    caps.push({ x: -0.072, z: z5, w: 0.205, col: "#EFEBE0" });
    caps.push({ x: 0.054, z: z5, w: 0.032, col: MOD_GREY });
    caps.push({ x: 0.09, z: z5, w: 0.03, col: MOD_GREY });
    caps.push({ x: 0.123, z: z5, w: 0.032, col: MOD_GREY });

    // Right Numpad / Nav Block (4 columns × 5 rows aligned cleanly to chassis right edge)
    const numRows = [z1, z2, z3, z4, z5];
    for (let r = 0; r < numRows.length; r++) {
      for (let c = 0; c < 4; c++) {
        // Wide '0' key on bottom row
        if (r === 4 && c === 1) continue;
        const isZero = r === 4 && c === 0;
        caps.push({
          x: isZero ? 0.1945 : 0.18 + c * 0.029,
          z: numRows[r],
          w: isZero ? 0.054 : 0.025,
          col: r === 0 || c === 3 ? MOD_GREY : ALABASTER,
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
    if (p >= 0.45) return;

    const t = clock.getElapsedTime();

    // 1. Fade out the retro CRT OSD top bar cleanly before camera crosses the glass!
    if (osdMatRef.current) {
      const fadeOsd = 1 - Math.max(0, Math.min(1, (p - 0.22) / 0.1));
      osdMatRef.current.opacity = fadeOsd * 0.92;
      osdMatRef.current.visible = fadeOsd > 0.01;
    }

    // 2. Live Tactile Mechanical Keycap Typing Cadence (visible during low macro desk skim!)
    const activeKeyIdx = Math.floor(t * 9.5) % keycaps.length;
    const activeKeyIdx2 = (activeKeyIdx * 7 + 13) % keycaps.length;
    for (let i = 0; i < keycaps.length; i++) {
      const kg = keyRefs.current[i];
      if (!kg) continue;
      const pressed = i === activeKeyIdx || i === activeKeyIdx2 ? 1 : 0;
      kg.position.y = THREE.MathUtils.lerp(
        kg.position.y,
        0.02 - pressed * 0.0085,
        0.35
      );
    }

    // 3. Subtle Retro Mouse Micro-Glide on the Teal Mat
    if (mouseMeshRef.current) {
      mouseMeshRef.current.position.x = 0.45 + Math.sin(t * 1.4) * 0.016;
      mouseMeshRef.current.position.z = 0.38 + Math.cos(t * 1.1) * 0.014;
    }

    // 4. Rising Curling Coffee Steam Wisps Above Ceramic Mug!
    for (let s = 0; s < 3; s++) {
      const sm = steamRefs.current[s];
      if (!sm) continue;
      const cycle = (t * 0.45 + s * 0.33) % 1;
      sm.position.y = 0.14 + cycle * 0.22;
      sm.position.x = 0.78 + Math.sin(t * 2.2 + s * 2.0) * 0.018;
      sm.scale.setScalar(0.65 + cycle * 0.75);
      const mat = sm.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(cycle * Math.PI) * 0.26;
    }
  });

  return (
    <group>
      {/* Back Wall with Feathered Venetian Blind Sunbeams */}
      <mesh position={[0.2, 0.78, -0.72]}>
        <planeGeometry args={[5.8, 4.0]} />
        <meshStandardMaterial map={wallTex} roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Left Window Wall + Recessed Sunlit Window Frame & Potted Cactus */}
      <group position={[-1.34, 0.78, 0.25]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[3.6, 4.0]} />
          <meshStandardMaterial color="#AD9071" roughness={0.92} />
        </mesh>

        <mesh position={[0.18, 0.34, -0.02]}>
          <planeGeometry args={[1.18, 1.12]} />
          <meshBasicMaterial color="#FFF3D1" />
        </mesh>

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

        {/* Potted Green Cactus on Windowsill */}
        <group position={[0.28, -0.19, 0.07]}>
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[0.062, 0.046, 0.11, 20]} />
            <meshStandardMaterial color="#9E472A" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.105, 0]}>
            <cylinderGeometry args={[0.068, 0.065, 0.024, 20]} />
            <meshStandardMaterial color="#B35334" roughness={0.72} />
          </mesh>
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

      {/* Solid Walnut Engineer's Desk & Teal Desk Mat */}
      <group position={[0.02, 0, 0.08]}>
        <RoundedBox
          args={[2.45, 0.075, 1.26]}
          radius={0.022}
          smoothness={4}
          position={[0, -0.038, 0]}
        >
          <meshStandardMaterial map={deskTex} roughness={0.52} metalness={0.08} />
        </RoundedBox>

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

        <mesh
          geometry={deskMatGeo}
          position={[0.08, 0.001, 0.28]}
        >
          <meshStandardMaterial color="#1F8A7E" roughness={0.74} metalness={0.04} />
        </mesh>
      </group>

      {/* ================================================================
          VINTAGE BEIGE CPU + CRT MONITOR WITH LIVE 3D RENDERTARGET PORTAL!
         ================================================================ */}
      <group position={[0.05, 0, -0.14]}>
        <RoundedBox
          args={[0.76, 0.17, 0.58]}
          radius={0.026}
          smoothness={4}
          position={[0, 0.085, 0]}
        >
          <meshStandardMaterial color="#D8CEBC" roughness={0.48} metalness={0.06} />
        </RoundedBox>
        <mesh position={[-0.16, 0.095, 0.292]}>
          <boxGeometry args={[0.24, 0.016, 0.01]} />
          <meshStandardMaterial color="#3F3A34" />
        </mesh>
        <mesh position={[0.17, 0.095, 0.292]}>
          <boxGeometry args={[0.24, 0.016, 0.01]} />
          <meshStandardMaterial color="#3F3A34" />
        </mesh>
        <mesh position={[-0.31, 0.125, 0.293]}>
          <boxGeometry args={[0.026, 0.016, 0.008]} />
          <meshBasicMaterial color="#4ADE80" />
        </mesh>
        <mesh position={[0.31, 0.055, 0.292]}>
          <boxGeometry args={[0.035, 0.035, 0.012]} />
          <meshStandardMaterial color="#B8AE9C" />
        </mesh>

        <mesh position={[0, 0.205, -0.02]}>
          <cylinderGeometry args={[0.16, 0.2, 0.07, 24]} />
          <meshStandardMaterial color="#C8BEAC" roughness={0.5} />
        </mesh>

        {/* Main CRT Monitor Housing */}
        <group position={[0, 0.55, 0]}>
          <RoundedBox
            args={[0.74, 0.62, 0.34]}
            radius={0.048}
            smoothness={4}
            position={[0, 0, 0.08]}
          >
            <meshStandardMaterial color="#E2D9C6" roughness={0.44} metalness={0.05} />
          </RoundedBox>

          <RoundedBox
            args={[0.56, 0.46, 0.32]}
            radius={0.055}
            smoothness={4}
            position={[0, 0.01, -0.18]}
          >
            <meshStandardMaterial color="#D2C8B4" roughness={0.5} />
          </RoundedBox>

          <RoundedBox
            args={[0.62, 0.48, 0.025]}
            radius={0.011}
            smoothness={3}
            position={[0, 0.02, 0.244]}
          >
            <meshStandardMaterial color="#181C22" roughness={0.55} />
          </RoundedBox>

          {/* LIVE 3D BABAK 2 PORTAL SCREEN — Raw RGBA8 sRGB pass-through for exact 1:1 color match! */}
          <mesh position={[0, 0.02, 0.258]}>
            <planeGeometry args={[0.58, 0.44]} />
            <shaderMaterial
              ref={crtShaderMatRef}
              vertexShader={CRT_PORTAL_VERT}
              fragmentShader={CRT_PORTAL_FRAG}
              uniforms={initialUniforms}
              toneMapped={false}
            />
          </mesh>

          {/* Subtle Retro OSD Top Bar ("AxisOS 2.6 // WELCOME") — Fades cleanly before entering! */}
          <mesh position={[0, 0.02, 0.26]}>
            <planeGeometry args={[0.58, 0.44]} />
            <meshBasicMaterial
              ref={osdMatRef}
              map={osdTex}
              transparent
              opacity={0.92}
              depthWrite={false}
            />
          </mesh>

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

      {/* Authentic Full-Size Sculpted Mechanical Keyboard Sitting Cleanly on Desk Mat */}
      <group position={[-0.03, 0.028, 0.34]} rotation={[0.075, 0.035, 0]}>
        {/* Sculpted Beige Keyboard Case */}
        <RoundedBox args={[0.65, 0.024, 0.24]} radius={0.009} smoothness={3}>
          <meshStandardMaterial color="#DFD6C5" roughness={0.46} metalness={0.04} />
        </RoundedBox>

        {/* Rear Ergonomic Flip-Out Riser Feet Grounding Keyboard on Mat */}
        {[-0.26, 0.26].map((fx, fi) => (
          <mesh key={fi} position={[fx, -0.015, -0.095]}>
            <boxGeometry args={[0.042, 0.012, 0.024]} />
            <meshStandardMaterial color="#3A3632" roughness={0.8} />
          </mesh>
        ))}

        {/* Recessed Dark Charcoal Switch Wells (Main Alpha + Numpad) */}
        <mesh position={[-0.072, 0.0122, 0.002]}>
          <boxGeometry args={[0.456, 0.003, 0.204]} />
          <meshStandardMaterial color="#232220" roughness={0.85} />
        </mesh>
        <mesh position={[0.224, 0.0122, 0.02]}>
          <boxGeometry args={[0.118, 0.003, 0.168]} />
          <meshStandardMaterial color="#232220" roughness={0.85} />
        </mesh>

        {/* 3 Classic Lock Status LEDs (NUM / CAPS / SCRL) on Top-Right Bezel */}
        {[0.19, 0.22, 0.25].map((lx, li) => (
          <mesh key={li} position={[lx, 0.013, -0.084]}>
            <boxGeometry args={[0.014, 0.003, 0.007]} />
            <meshBasicMaterial color={li < 2 ? "#4ADE80" : "#52525B"} />
          </mesh>
        ))}

        {/* Individual Sculpted Mechanical Keycaps (lightweight boxGeometry on mobile/tablet saves ~80 ExtrudeGeometries!) */}
        {keycaps.map((kc, idx) => (
          <group
            key={idx}
            ref={(el) => {
              keyRefs.current[idx] = el;
            }}
            position={[kc.x, 0.019, kc.z]}
          >
            {isCompactGpu ? (
              <mesh>
                <boxGeometry args={[kc.w, 0.014, 0.025]} />
                <meshStandardMaterial color={kc.col} roughness={0.4} />
              </mesh>
            ) : (
              <RoundedBox
                args={[kc.w, 0.014, 0.025]}
                radius={0.0035}
                smoothness={2}
              >
                <meshStandardMaterial color={kc.col} roughness={0.4} />
              </RoundedBox>
            )}
          </group>
        ))}
      </group>

      {/* Sculpted Two-Button Retro Mouse Sitting Flush on Top of Teal Mat */}
      <group
        ref={mouseMeshRef}
        position={[0.45, 0.021, 0.37]}
        rotation={[0, -0.12, 0]}
      >
        <RoundedBox args={[0.082, 0.03, 0.128]} radius={0.011} smoothness={3}>
          <meshStandardMaterial color="#E2DAC9" roughness={0.44} />
        </RoundedBox>
        <mesh position={[-0.018, 0.016, -0.035]}>
          <boxGeometry args={[0.032, 0.004, 0.044]} />
          <meshStandardMaterial color="#CBC2B2" roughness={0.42} />
        </mesh>
        <mesh position={[0.018, 0.016, -0.035]}>
          <boxGeometry args={[0.032, 0.004, 0.044]} />
          <meshStandardMaterial color="#CBC2B2" roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.017, -0.035]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.004, 12]} />
          <meshStandardMaterial color="#2B2927" roughness={0.7} />
        </mesh>
      </group>

      {/* Left & Right Vintage Bookshelf Studio Speakers */}
      {[
        [-0.46, 0.135, -0.12, 0.18],
        [0.58, 0.135, -0.06, -0.22],
      ].map(([sx, sy, sz, sRot], idx) => (
        <group key={idx} position={[sx, sy, sz]} rotation={[0, sRot, 0]}>
          <RoundedBox args={[0.17, 0.27, 0.18]} radius={0.018} smoothness={3}>
            <meshStandardMaterial color="#DDD3C1" roughness={0.48} />
          </RoundedBox>
          <RoundedBox
            args={[0.135, 0.19, 0.015]}
            radius={0.005}
            smoothness={2}
            position={[0, 0.02, 0.088]}
          >
            <meshStandardMaterial color="#2B2927" roughness={0.85} />
          </RoundedBox>
          <mesh position={[0.04, -0.1, 0.092]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.012, 12]} />
            <meshStandardMaterial color="#57534E" />
          </mesh>
        </group>
      ))}

      {/* Desk Sketchpad on Left + Steaming Coffee Mug on Right */}
      <group position={[-0.64, 0.009, 0.24]} rotation={[0, 0.24, 0]}>
        <RoundedBox args={[0.14, 0.014, 0.21]} radius={0.004} smoothness={2}>
          <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0.0076, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.118, 0.186]} />
          <meshStandardMaterial color="#F8F4EC" roughness={0.8} />
        </mesh>
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

      {/* 3 Rising Translucent Coffee Steam Curls */}
      {[0, 1, 2].map((sIdx) => (
        <mesh
          key={sIdx}
          ref={(el) => {
            steamRefs.current[sIdx] = el;
          }}
          position={[0.78, 0.16, 0.22]}
        >
          <torusGeometry args={[0.022, 0.0045, 8, 16, Math.PI * 1.3]} />
          <meshBasicMaterial
            color="#FFF7ED"
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Floating Golden Sunbeam Dust Motes */}
      <Sparkles
        count={isCompactGpu ? 26 : 68}
        scale={[2.6, 1.9, 2.2]}
        position={[-0.45, 0.78, 0.25]}
        size={2.6}
        speed={0.24}
        opacity={0.85}
        color="#FFE7A3"
      />
    </group>
  );
}
