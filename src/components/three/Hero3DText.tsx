"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { Studio3DScrollState } from "@/context/ShowreelContext";

interface Hero3DTextProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutBack(x: number) {
  const c1 = 1.9;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/**
 * Generates crisp, zero-network-dependency 1024x256 typography CanvasTextures
 * for multi-layer Z-extruded 3D words inside WebGL so LiquidGlassBar optically
 * refracts, magnifies, and chromatic-splits real 3D text in real time!
 */
function createWordTexture(
  word: string,
  fillTop: string,
  fillBottom: string,
  strokeColor: string
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 184px 'Arial Black', 'Impact', system-ui, sans-serif";

  const grad = ctx.createLinearGradient(0, 60, 0, 260);
  grad.addColorStop(0, fillTop);
  grad.addColorStop(1, fillBottom);

  ctx.lineWidth = 14;
  ctx.lineJoin = "round";
  ctx.strokeStyle = strokeColor;
  ctx.strokeText(word, 512, 166);

  ctx.fillStyle = grad;
  ctx.fillText(word, 512, 166);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

interface Word3DLayerSpec {
  word: string;
  xOffset: number;
  width: number;
  startP: number;
}

const WORDS: Word3DLayerSpec[] = [
  { word: "BUILD.", xOffset: -0.92, width: 0.88, startP: 0.72 },
  { word: "CODE.", xOffset: -0.02, width: 0.84, startP: 0.77 },
  { word: "CREATE.", xOffset: 0.92, width: 0.98, startP: 0.82 },
];

export function Hero3DText({ scrollRef }: Hero3DTextProps) {
  const { size } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  const wordRefs = useRef<(THREE.Group | null)[]>([]);

  const wordTextures = useMemo(() => {
    return WORDS.map((w) => ({
      front: createWordTexture(w.word, "#FFF08A", "#FACC15", "#581C87"),
      mid: createWordTexture(w.word, "#F59E0B", "#EA580C", "#4C1D95"),
      back: createWordTexture(w.word, "#4C1D95", "#2E1065", "#1E1B4B"),
    }));
  }, []);

  useFrame(({ clock }) => {
    const root = rootRef.current;
    if (!root) return;

    const p = scrollRef.current.progress;
    const t = clock.getElapsedTime();

    if (p < 0.71) {
      root.visible = false;
      return;
    }

    root.visible = true;
    const aspect = size.width / Math.max(1, size.height);
    const fitScale = aspect < 0.72 ? 0.76 : aspect < 1.05 ? 0.9 : 1.0;
    root.scale.setScalar(fitScale);
    // Gentle living 3D breath positioned cleanly behind LiquidGlassBar for crisp refraction
    root.position.set(0, 1.07 + Math.sin(t * 2.1) * 0.018, 0.84);
    root.rotation.y = Math.sin(t * 1.1) * 0.045;

    for (let i = 0; i < WORDS.length; i++) {
      const grp = wordRefs.current[i];
      if (!grp) continue;
      const spec = WORDS[i];
      const local = clamp01((p - spec.startP) / 0.095);

      if (local <= 0.005) {
        grp.visible = false;
        continue;
      }

      grp.visible = true;
      const spring = easeOutBack(local);
      const waveY = Math.sin(t * 2.8 + i * 1.15) * 0.028 * local;
      const waveTilt = Math.cos(t * 2.2 + i * 0.9) * 0.06 * local;

      grp.position.set(
        spec.xOffset,
        (1 - spring) * -0.45 + waveY,
        (1 - local) * -0.45
      );
      grp.scale.setScalar(Math.max(0.01, spring));
      // Expressive 3D X-axis kinetic flip-in + subtle alive wave
      grp.rotation.set((1 - spring) * -1.35 + waveTilt * 0.5, waveTilt, 0);
    }
  });

  return (
    <group ref={rootRef} visible={false}>
      {WORDS.map((spec, idx) => {
        const tex = wordTextures[idx];
        const height = spec.width * 0.3125;
        return (
          <group
            key={spec.word}
            ref={(el) => {
              wordRefs.current[idx] = el;
            }}
            visible={false}
          >
            {/* 5 Stacked Z-Extrusion Slices -> Real 3D Depth & Specular Bevel */}
            <mesh position={[0, -0.016, -0.095]}>
              <planeGeometry args={[spec.width, height]} />
              <meshBasicMaterial map={tex.back} transparent depthWrite={false} />
            </mesh>
            <mesh position={[0, -0.011, -0.065]}>
              <planeGeometry args={[spec.width, height]} />
              <meshBasicMaterial map={tex.back} transparent depthWrite={false} />
            </mesh>
            <mesh position={[0, -0.006, -0.036]}>
              <planeGeometry args={[spec.width, height]} />
              <meshBasicMaterial map={tex.mid} transparent depthWrite={false} />
            </mesh>
            <mesh position={[0, -0.003, -0.014]}>
              <planeGeometry args={[spec.width, height]} />
              <meshBasicMaterial map={tex.mid} transparent depthWrite={false} />
            </mesh>
            {/* Crisp Bright Metallic-Gold Front Face */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[spec.width, height]} />
              <meshBasicMaterial map={tex.front} transparent depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
