"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";

gsap.registerPlugin(ScrollTrigger);

const StudioSceneCanvas = dynamic(
  () => import("@/components/three/StudioSceneCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#07111E]">
        <div className="flex flex-col items-center gap-3">
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-[#C6FF3D]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
            Initializing 3D Digital Twin Core...
          </span>
        </div>
      </div>
    ),
  }
);

export function Act2Studio3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  const editorialRef = useRef<HTMLDivElement>(null);
  const zeroGLabelsRef = useRef<HTMLDivElement>(null);
  const leftLabelRef = useRef<HTMLSpanElement>(null);
  const rightLabelRef = useRef<HTMLSpanElement>(null);
  const entryHazeRef = useRef<HTMLDivElement>(null);
  const exitFlashRef = useRef<HTMLDivElement>(null);

  const { setActiveChapter, setLetterboxActive, studio3DRef } = useShowreel();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        studio3DRef.current.inView = entry.isIntersecting;
      },
      { rootMargin: "250px 0px" }
    );
    observer.observe(section);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onEnter: () => {
          setActiveChapter("act-2");
          setLetterboxActive(true);
        },
        onEnterBack: () => {
          setActiveChapter("act-2");
          setLetterboxActive(true);
        },
        onUpdate: (self) => {
          const p = self.progress;
          studio3DRef.current.progress = p;

          // 1. Editorial telemetry captions glide cleanly in/out during Digital Twin reveal
          if (editorialRef.current) {
            const edOp =
              p > 0.04 && p < 0.3
                ? Math.min(1, (p - 0.04) * 14, (0.3 - p) * 14)
                : 0;
            editorialRef.current.style.opacity = edOp.toFixed(3);
            editorialRef.current.style.transform = `translate3d(0, ${((1 - edOp) * 14).toFixed(1)}px, 0)`;
          }

          // 2. Kinetic Zero-G Labels sweep inward safely within all screen widths
          if (zeroGLabelsRef.current && leftLabelRef.current && rightLabelRef.current) {
            const zgOp =
              p > 0.56 && p < 0.74
                ? Math.min(1, (p - 0.56) * 18, (0.74 - p) * 18)
                : 0;
            const local = Math.max(0, Math.min(1, (p - 0.56) / 0.18));
            zeroGLabelsRef.current.style.opacity = zgOp.toFixed(3);
            leftLabelRef.current.style.transform = `translate3d(${(-22 + local * 34).toFixed(1)}px, ${(Math.sin(local * Math.PI) * -12).toFixed(1)}px, 0) rotate(-6deg) scale(${(0.88 + local * 0.2).toFixed(3)})`;
            rightLabelRef.current.style.transform = `translate3d(${(22 - local * 34).toFixed(1)}px, ${(Math.sin(local * Math.PI) * 12).toFixed(1)}px, 0) rotate(6deg) scale(${(0.88 + local * 0.2).toFixed(3)})`;
          }

          // 3. Entry & exit lens flashes
          if (entryHazeRef.current) {
            const eh = Math.max(0, Math.min(1, 1 - p / 0.05));
            entryHazeRef.current.style.opacity = eh.toFixed(3);
          }
          if (exitFlashRef.current) {
            const ef = Math.max(0, Math.min(1, (p - 0.94) / 0.06));
            exitFlashRef.current.style.opacity = ef.toFixed(3);
          }
        },
      });
    }, section);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, [setActiveChapter, setLetterboxActive, studio3DRef]);

  return (
    <section
      id="act-2"
      ref={sectionRef}
      className="relative h-[430vh] w-full bg-[#07111E]"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* === SINGLE REAL-TIME R3F WEBGL CANVAS (ASTROLABE TWIN + LIQUID GLASS!) === */}
        <StudioSceneCanvas scrollRef={studio3DRef} active={inView} />

        {/* Screen-reader accessible mirror of the real 3D WebGL headline */}
        <h2 className="sr-only">{PORTFOLIO_DATA.studio3D.heroGlassHeadline}</h2>

        {/* === SAFE-AREA EDITORIAL TELEMETRY OVERLAY === */}
        <div
          ref={editorialRef}
          className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-[1440px] flex-col justify-between px-6 py-[9.5dvh] sm:px-14 opacity-0 will-change-transform"
        >
          <div className="max-w-[270px] sm:max-w-sm rounded-2xl border border-white/10 bg-[#07111E]/65 px-4 py-3 backdrop-blur-md">
            <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#38BDF8]">
              02.A // STRUCTURAL DIGITAL TWIN
            </span>
            <p className="mt-1 font-sans text-[11px] sm:text-xs leading-relaxed text-slate-100">
              {PORTFOLIO_DATA.studio3D.editorialTopLeft}
            </p>
          </div>

          <div className="ml-auto max-w-[270px] sm:max-w-sm rounded-2xl border border-white/10 bg-[#07111E]/65 px-4 py-3 text-right backdrop-blur-md">
            <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#C6FF3D]">
              02.B // COMPUTATIONAL SOLVER
            </span>
            <p className="mt-1 font-sans text-[11px] sm:text-xs leading-relaxed text-slate-100">
              {PORTFOLIO_DATA.studio3D.editorialBottomRight}
            </p>
          </div>
        </div>

        {/* === KINETIC FLOATING ZERO-G LABELS === */}
        <div
          ref={zeroGLabelsRef}
          className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-[1440px] items-center justify-between px-7 sm:px-16 md:px-24 opacity-0 will-change-[opacity]"
        >
          <span
            ref={leftLabelRef}
            className="font-display text-[clamp(1.25rem,5vw,3rem)] font-black tracking-tight text-[#C6FF3D] drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] will-change-transform"
          >
            {PORTFOLIO_DATA.studio3D.floatingLeftLabel}
          </span>
          <span
            ref={rightLabelRef}
            className="font-display text-[clamp(1.25rem,5vw,3rem)] font-black tracking-tight text-amber-300 drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] will-change-transform"
          >
            {PORTFOLIO_DATA.studio3D.floatingRightLabel}
          </span>
        </div>

        {/* Entry Haze from Act 1 */}
        <div
          ref={entryHazeRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 bg-white opacity-0 will-change-[opacity]"
        />

        {/* Exit White Chromatic Flash into Act 3 */}
        <div
          ref={exitFlashRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 bg-white opacity-0 will-change-[opacity]"
        />
      </div>
    </section>
  );
}
