"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { Studio3DScrollState } from "@/context/ShowreelContext";
import { DeskEnvironment } from "./DeskEnvironment";
import { PaperPlanePath } from "./PaperPlanePath";
import { Hero3DText } from "./Hero3DText";
import { LiquidGlassBar } from "./LiquidGlassBar";
import { SceneRigAndFX } from "./SceneRigAndFX";

interface StudioSceneCanvasProps {
  scrollRef: React.MutableRefObject<Studio3DScrollState>;
  active: boolean;
}

export default function StudioSceneCanvas({
  scrollRef,
  active,
}: StudioSceneCanvasProps) {
  const [webglReady, setWebglReady] = useState(true);

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
      camera={{ position: [-3.4, 1.55, 5.4], fov: 49, near: 0.1, far: 45 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      }}
      className="h-full w-full"
    >
      <SceneRigAndFX scrollRef={scrollRef} />
      <DeskEnvironment scrollRef={scrollRef} />
      <PaperPlanePath scrollRef={scrollRef} />
      <Hero3DText scrollRef={scrollRef} />
      <LiquidGlassBar scrollRef={scrollRef} />
    </Canvas>
  );
}
