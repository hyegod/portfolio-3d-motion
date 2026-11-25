"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import type { Studio3DScrollState } from "@/context/ShowreelContext";
import { detectWebGLSupport, isCompactViewport } from "@/lib/webgl";
import { DeskEnvironment } from "./DeskEnvironment";
import { PaperPlanePath } from "./PaperPlanePath";
import { Hero3DText } from "./Hero3DText";
import { LiquidGlassBar } from "./LiquidGlassBar";
import { SceneRigAndFX, TWIN_START_P } from "./SceneRigAndFX";
import { RetroComputerRoom } from "./RetroComputerRoom";

interface StudioSceneCanvasProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
  active: boolean;
  onReady?: () => void;
}

export default function StudioSceneCanvas({
  scrollRef,
  active,
  onReady,
}: StudioSceneCanvasProps) {
  const [webglReady] = useState<boolean>(() => detectWebGLSupport());
  const [compact] = useState<boolean>(() => isCompactViewport());
  const [warmingUp, setWarmingUp] = useState(true);
  const readyFiredRef = useRef(false);

  const roomGroupRef = useRef<THREE.Group>(null);
  const twinGroupRef = useRef<THREE.Group>(null);
  const crtShaderMatRef = useRef<THREE.ShaderMaterial>(null);

  const twinScrollRef = useRef<Studio3DScrollState>({
    progress: TWIN_START_P,
    mouseX: 0,
    mouseY: 0,
    inView: true,
  });

  // If WebGL is unavailable, notify preloader immediately so it never stalls
  useEffect(() => {
    if (!webglReady && !readyFiredRef.current) {
      readyFiredRef.current = true;
      onReady?.();
    }
  }, [webglReady, onReady]);

  if (!webglReady) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#1E3A8A] via-[#2563EB] to-[#7DD3FC] p-8 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/75">
            3D Engineering Studio
          </p>
          <p className="mt-2 font-display text-4xl font-extrabold text-[#FFD13B]">
            BUILD. CODE. CREATE.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      shadows={compact ? false : "percentage"}
      dpr={compact ? [1, 1.1] : [1, 1.6]}
      frameloop={active || warmingUp ? "always" : "demand"}
      camera={{ position: [-0.48, 0.72, 1.88], fov: 46, near: 0.04, far: 45 }}
      gl={{
        antialias: !compact,
        powerPreference: "high-performance",
        alpha: false,
      }}
      onCreated={() => {
        // Allow 2 rendered frames for shader compilation + CRT FBO warmup, then sleep until scrolled near!
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setWarmingUp(false);
            if (!readyFiredRef.current) {
              readyFiredRef.current = true;
              onReady?.();
            }
          });
        });
      }}
      className="h-full w-full"
    >
      {/* Mount DigitalTwin & RetroRoom BEFORE SceneRigAndFX so their useFrame updates run BEFORE crtFbo renders! */}
      <group ref={twinGroupRef} visible={false}>
        <DeskEnvironment scrollRef={twinScrollRef} />
        <PaperPlanePath scrollRef={twinScrollRef} />
        <Hero3DText scrollRef={twinScrollRef} />
        <LiquidGlassBar scrollRef={twinScrollRef} />
      </group>

      <group ref={roomGroupRef}>
        <RetroComputerRoom
          scrollRef={scrollRef}
          crtShaderMatRef={crtShaderMatRef}
        />
      </group>

      <SceneRigAndFX
        rawScrollRef={scrollRef}
        twinScrollRef={twinScrollRef}
        roomGroupRef={roomGroupRef}
        twinGroupRef={twinGroupRef}
        crtShaderMatRef={crtShaderMatRef}
      />
    </Canvas>
  );
}
