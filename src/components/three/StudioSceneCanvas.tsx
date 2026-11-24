"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Studio3DScrollState } from "@/context/ShowreelContext";
import { DeskEnvironment } from "./DeskEnvironment";
import { PaperPlanePath } from "./PaperPlanePath";
import { Hero3DText } from "./Hero3DText";
import { LiquidGlassBar } from "./LiquidGlassBar";
import { PORTAL_CUT_P, SceneRigAndFX } from "./SceneRigAndFX";
import { RetroComputerRoom } from "./RetroComputerRoom";

interface StudioSceneCanvasProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
  active: boolean;
}

/**
 * Toggles the Digital Twin world group ON only after zooming into the CRT Monitor!
 */
function DigitalTwinPortalGroup({
  rawScrollRef,
  twinScrollRef,
}: {
  rawScrollRef: React.MutableRefObject<Studio3DScrollState>;
  twinScrollRef: React.MutableRefObject<Studio3DScrollState>;
}) {
  const twinWorldRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!twinWorldRef.current) return;
    twinWorldRef.current.visible = rawScrollRef.current.progress >= PORTAL_CUT_P;
  });

  return (
    <group ref={twinWorldRef} visible={false}>
      <DeskEnvironment scrollRef={twinScrollRef} />
      <PaperPlanePath scrollRef={twinScrollRef} />
      <Hero3DText scrollRef={twinScrollRef} />
      <LiquidGlassBar scrollRef={twinScrollRef} />
    </group>
  );
}

export default function StudioSceneCanvas({
  scrollRef,
  active,
}: StudioSceneCanvasProps) {
  const [webglReady, setWebglReady] = useState(true);
  const twinScrollRef = useRef<Studio3DScrollState>({
    progress: 0,
    mouseX: 0,
    mouseY: 0,
    inView: true,
  });

  useEffect(() => {
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) setWebglReady(false);
    } catch {
      setWebglReady(false);
    }
  }, []);

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
      shadows="percentage"
      dpr={[1, 1.65]}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [0.68, 0.76, 2.34], fov: 45, near: 0.08, far: 45 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      }}
      className="h-full w-full"
    >
      <SceneRigAndFX
        rawScrollRef={scrollRef}
        twinScrollRef={twinScrollRef}
      />
      <RetroComputerRoom scrollRef={scrollRef} />
      <DigitalTwinPortalGroup
        rawScrollRef={scrollRef}
        twinScrollRef={twinScrollRef}
      />
    </Canvas>
  );
}
