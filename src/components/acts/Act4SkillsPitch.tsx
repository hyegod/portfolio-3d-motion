"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Music } from "lucide-react";
import { PORTFOLIO_DATA, type ToolId } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";
import { ToolBadge } from "@/components/ui/ToolBadges";
import {
  CodeCreatorPortrait,
  CodeMotionScene,
  type CodeScenePreset,
} from "@/components/ui/CodeMotionAssets";

gsap.registerPlugin(ScrollTrigger);

const CORE_TOOLS: ToolId[] = ["autocad", "revit", "typescript", "python", "figma"];

const FLOATING_LENSES: {
  id: string;
  label: string;
  preset: CodeScenePreset;
  shape: "circle" | "pill";
  posClass: string;
  accent: string;
}[] = [
  {
    id: "lens-bridge",
    label: "280m Cable-Stayed FEA",
    preset: "bridge-fea",
    shape: "pill",
    posClass: "left-[3%] sm:left-[5%] top-[12%] sm:top-[14%] w-40 h-24 sm:w-80 sm:h-44",
    accent: "#38BDF8",
  },
  {
    id: "lens-bim",
    label: "BIM-to-Web 120 FPS",
    preset: "bim-web-engine",
    shape: "circle",
    posClass: "right-[4%] sm:right-[6%] top-[10%] sm:top-[12%] w-28 h-28 sm:w-52 sm:h-52",
    accent: "#C6FF3D",
  },
  {
    id: "lens-tower",
    label: "42F Seismic Core",
    preset: "seismic-tower",
    shape: "circle",
    posClass: "left-[6%] sm:left-[10%] bottom-[10%] sm:bottom-[12%] w-26 h-26 sm:w-48 sm:h-48",
    accent: "#FF6B4A",
  },
  {
    id: "lens-calc",
    label: "ACI 318 Solver API",
    preset: "autospec-calc",
    shape: "pill",
    posClass: "right-[3%] sm:right-[5%] bottom-[10%] sm:bottom-[13%] w-40 h-24 sm:w-80 sm:h-44",
    accent: "#4ADE80",
  },
];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/**
 * ZERO-CARD Full-Bleed Kinetic Motion Showreel for Chapter 04 (Skills & Craft)
 *   Stage 1 (0.00 - 0.36): Monumental typographic stage + colossal 45+ numeral + floating tool orbit (NO cards!)
 *   Stage 2 (0.32 - 0.72): Diagonal rushing typography bands + frameless circular/pill 4K motion lenses
 *   Stage 3 (0.68 - 1.00): White circular iris sunburst + illustrated portrait + cursor-clicked STAND OUT
 * Driven 100% via direct DOM refs (0 React re-renders during scroll).
 */
export function Act4SkillsPitch() {
  const sectionRef = useRef<HTMLElement>(null);

  // Stage 1 refs
  const stage1Ref = useRef<HTMLDivElement>(null);
  const giantNumRef = useRef<HTMLSpanElement>(null);
  const s1Line1Ref = useRef<HTMLDivElement>(null);
  const s1Line2Ref = useRef<HTMLDivElement>(null);
  const s1Line3Ref = useRef<HTMLDivElement>(null);
  const s1OrbitRef = useRef<HTMLDivElement>(null);

  // Stage 2 refs
  const stage2Ref = useRef<HTMLDivElement>(null);
  const diag1Ref = useRef<HTMLDivElement>(null);
  const diag2Ref = useRef<HTMLDivElement>(null);
  const diag3Ref = useRef<HTMLDivElement>(null);
  const lensRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Stage 3 (Iris Sunburst + STAND OUT) refs
  const stage3Ref = useRef<HTMLDivElement>(null);
  const s3PortraitRef = useRef<HTMLDivElement>(null);
  const s3Line1Ref = useRef<HTMLParagraphElement>(null);
  const s3Line2Ref = useRef<HTMLParagraphElement>(null);
  const [standOutActive, setStandOutActive] = useState(false);
  const wasStandOutRef = useRef(false);

  const { setActiveChapter, setLetterboxActive, setContactOpen } =
    useShowreel();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let counterPlayed = false;

    const ctx = gsap.context(() => {
      // Trigger counter smoothly right when Act 4 enters viewport (not late at "top top"!)
      ScrollTrigger.create({
        trigger: section,
        start: "top 82%",
        once: true,
        onEnter: () => {
          if (!counterPlayed && giantNumRef.current) {
            counterPlayed = true;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: PORTFOLIO_DATA.skillsSection.primaryStatTarget,
              duration: 1.3,
              ease: "power3.out",
              onUpdate: () => {
                if (giantNumRef.current) {
                  giantNumRef.current.textContent = `${Math.round(obj.val)}+`;
                }
              },
            });
          }
        },
      });

      if (giantNumRef.current) {
        giantNumRef.current.style.transform = "scale(0.95)";
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onEnter: () => {
          setActiveChapter("act-4");
          setLetterboxActive(false);
        },
        onEnterBack: () => {
          setActiveChapter("act-4");
          setLetterboxActive(false);
        },
        onUpdate: (self) => {
          const p = self.progress;

          // === STAGE 1 (0.00 -> 0.37): Kinetic Split Typography ===
          const s1Split = clamp01((p - 0.22) / 0.14);
          if (stage1Ref.current) {
            stage1Ref.current.style.opacity = (1 - s1Split).toFixed(3);
            stage1Ref.current.style.pointerEvents = s1Split > 0.6 ? "none" : "auto";
          }
          if (giantNumRef.current) {
            giantNumRef.current.style.transform = `scale(${(0.95 + p * 0.75).toFixed(3)})`;
          }
          if (s1Line1Ref.current) {
            s1Line1Ref.current.style.transform = `translate3d(${(-s1Split * 280).toFixed(1)}px, 0, 0) skewX(${(-s1Split * 12).toFixed(1)}deg)`;
          }
          if (s1Line2Ref.current) {
            s1Line2Ref.current.style.transform = `translate3d(${(s1Split * 280).toFixed(1)}px, 0, 0) skewX(${(s1Split * 12).toFixed(1)}deg)`;
          }
          if (s1Line3Ref.current) {
            s1Line3Ref.current.style.transform = `translate3d(${(-s1Split * 200).toFixed(1)}px, ${(s1Split * 70).toFixed(1)}px, 0)`;
          }
          if (s1OrbitRef.current) {
            s1OrbitRef.current.style.transform = `scale(${(1 + s1Split * 0.45).toFixed(3)}) rotate(${(p * 32).toFixed(1)}deg)`;
          }

          // === STAGE 2 (0.31 -> 0.74): Diagonal Kinetic Ribbons + Frameless Lenses ===
          const s2In = clamp01((p - 0.31) / 0.09);
          const s2Out = clamp01((p - 0.66) / 0.1);
          const s2Vis = s2In * (1 - s2Out);
          const local2 = clamp01((p - 0.31) / 0.42);

          if (stage2Ref.current) {
            stage2Ref.current.style.opacity = s2Vis.toFixed(3);
            stage2Ref.current.style.clipPath = `circle(${(s2In * 145).toFixed(1)}% at 50% 50%)`;
          }
          if (diag1Ref.current) {
            diag1Ref.current.style.transform = `translate3d(${(180 - local2 * 760).toFixed(1)}px, 0, 0)`;
          }
          if (diag2Ref.current) {
            diag2Ref.current.style.transform = `translate3d(${(-520 + local2 * 760).toFixed(1)}px, 0, 0)`;
          }
          if (diag3Ref.current) {
            diag3Ref.current.style.transform = `translate3d(${(100 - local2 * 640).toFixed(1)}px, 0, 0)`;
          }

          for (let i = 0; i < FLOATING_LENSES.length; i++) {
            const el = lensRefs.current[i];
            if (!el) continue;
            const dirX = i % 2 === 0 ? 1 : -1;
            const dirY = i < 2 ? 1 : -1;
            const driftX = (local2 - 0.5) * 140 * dirX;
            const driftY = (local2 - 0.5) * 65 * dirY;
            const sc = 0.78 + Math.sin(local2 * Math.PI) * 0.28;
            el.style.transform = `translate3d(${driftX.toFixed(1)}px, ${driftY.toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
          }

          // === STAGE 3 (0.68 -> 1.00): White Circular Iris Sunburst + STAND OUT ===
          const irisP = clamp01((p - 0.68) / 0.16);
          if (stage3Ref.current) {
            const rad = irisP * 145;
            stage3Ref.current.style.clipPath = `circle(${rad.toFixed(1)}% at 50% 92%)`;
            stage3Ref.current.style.opacity = irisP > 0.01 ? "1" : "0";
            stage3Ref.current.style.pointerEvents = irisP > 0.45 ? "auto" : "none";
          }
          if (s3PortraitRef.current) {
            const pScale = 0.72 + irisP * 0.28;
            s3PortraitRef.current.style.transform = `scale(${pScale.toFixed(3)})`;
          }
          if (s3Line1Ref.current) {
            const show1 = p > 0.76;
            s3Line1Ref.current.style.opacity = show1 ? "1" : "0.2";
            s3Line1Ref.current.style.transform = show1 ? "translate3d(0,0,0)" : "translate3d(0,18px,0)";
          }
          if (s3Line2Ref.current) {
            const show2 = p > 0.81;
            s3Line2Ref.current.style.opacity = show2 ? "1" : "0.2";
            s3Line2Ref.current.style.transform = show2 ? "translate3d(0,0,0)" : "translate3d(0,18px,0)";
          }

          const nextStandOut = p > 0.85;
          if (nextStandOut !== wasStandOutRef.current) {
            wasStandOutRef.current = nextStandOut;
            setStandOutActive(nextStandOut);
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [setActiveChapter, setLetterboxActive]);

  return (
    <section
      id="act-4"
      ref={sectionRef}
      className="relative h-[340vh] w-full bg-[#F4F7FB] text-[#07131C]"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#F4F7FB]">
        <div className="dot-grid-light pointer-events-none absolute inset-0" />

        {/* ================================================================
            STAGE 1 (0.00 -> 0.36): CARDLESS FULL-BLEED KINETIC TYPOGRAPHY STAGE
           ================================================================ */}
        <div
          ref={stage1Ref}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden px-4 sm:px-5 text-center"
        >
          {/* Colossal Watermark Counter behind Typography */}
          <span
            ref={giantNumRef}
            aria-hidden="true"
            className="pointer-events-none absolute font-display text-[36vw] sm:text-[26vw] font-black leading-none tracking-tighter text-[#1D4ED8]/[0.08] select-none will-change-transform"
          >
            0+
          </span>

          {/* Frameless Floating Tool Emblems in Open Space */}
          <div
            ref={s1OrbitRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mx-auto max-w-5xl hidden md:block will-change-transform"
          >
            <div className="animate-float-gentle absolute left-[7%] top-[20%] -rotate-12">
              <ToolBadge tool="autocad" size="lg" />
            </div>
            <div className="animate-float-reverse absolute left-[12%] bottom-[22%] rotate-12">
              <ToolBadge tool="revit" size="md" />
            </div>
            <div className="animate-float-reverse absolute right-[8%] top-[18%] rotate-10">
              <ToolBadge tool="typescript" size="lg" />
            </div>
            <div className="animate-float-gentle absolute right-[13%] bottom-[22%] -rotate-12">
              <ToolBadge tool="python" size="md" />
            </div>
            <div className="animate-float-gentle absolute right-[24%] top-[12%] rotate-6">
              <ToolBadge tool="figma" size="sm" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-[92vw]">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#1D4ED8]">
              Hello, I&apos;m {PORTFOLIO_DATA.brand.fullName} — {PORTFOLIO_DATA.skillsSection.experienceLabel}
            </span>

            <h2 className="mt-3 sm:mt-4 flex flex-col items-center leading-[0.9] select-none">
              <div
                ref={s1Line1Ref}
                className="font-display text-[clamp(2.3rem,10.5vw,6.8rem)] font-black uppercase tracking-tight text-[#07131C] will-change-transform"
              >
                CIVIL ENGINEER
              </div>
              <div
                ref={s1Line2Ref}
                className="flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-4 font-display text-[clamp(2.1rem,9.5vw,6.2rem)] font-black uppercase tracking-tight text-[#1D4ED8] will-change-transform"
              >
                <span className="font-serif italic font-normal text-[#07131C]">×</span>
                <span>SOFTWARE</span>
              </div>
              <div
                ref={s1Line3Ref}
                className="mt-2 font-mono text-[clamp(0.65rem,2.2vw,0.85rem)] font-bold uppercase tracking-[0.2em] text-slate-600 will-change-transform"
              >
                45+ Structures &amp; Full-Stack Apps Shipped • UI/UX &amp; 3D Design
              </div>
            </h2>

            {/* Mobile compact tool row */}
            <div className="mt-4 flex items-center justify-center gap-1.5 sm:gap-2 md:hidden">
              {CORE_TOOLS.map((t) => (
                <ToolBadge key={t} tool={t} size="sm" />
              ))}
            </div>

            {/* Subtle Unboxed Hobby Footnote (Music belongs cleanly here!) */}
            <p className="mt-5 sm:mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <Music className="h-3.5 w-3.5 text-[#FF6B4A]" />
              <span>{PORTFOLIO_DATA.brand.hobbyLine}</span>
            </p>
          </div>
        </div>

        {/* ================================================================
            STAGE 2 (0.32 -> 0.74): DIAGONAL KINETIC BANDS + FRAMELESS 4K LENSES
           ================================================================ */}
        <div
          ref={stage2Ref}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#07131C] text-white opacity-0 pointer-events-none"
          style={{ clipPath: "circle(0% at 50% 50%)" }}
        >
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30" />

          {/* Tilted Rushing Kinetic Typography Bands */}
          <div className="pointer-events-none flex -rotate-6 flex-col gap-5 select-none">
            <div
              ref={diag1Ref}
              className="whitespace-nowrap font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white/90 will-change-transform"
            >
              STRUCTURAL FEA • CABLE-STAYED BRIDGES • SEISMIC BIM • ETABS •
            </div>
            <div
              ref={diag2Ref}
              className="whitespace-nowrap font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#C6FF3D] will-change-transform"
            >
              TYPESCRIPT • NEXT.JS • PYTHON SOLVERS • 120 FPS WEBGL •
            </div>
            <div
              ref={diag3Ref}
              className="whitespace-nowrap font-serif italic text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#38BDF8]/90 will-change-transform"
            >
              Interactive UI/UX • Motion Choreography • Digital Twins •
            </div>
          </div>

          {/* Frameless Floating Circular & Pill 4K Vector Apertures (NO rectangular cards!) */}
          <div className="pointer-events-none absolute inset-0 mx-auto max-w-6xl">
            {FLOATING_LENSES.map((lens, idx) => (
              <div
                key={lens.id}
                ref={(el) => {
                  lensRefs.current[idx] = el;
                }}
                className={`absolute overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.65)] will-change-transform ${
                  lens.shape === "circle" ? "rounded-full" : "rounded-full"
                } ${lens.posClass}`}
                style={{
                  boxShadow: `0 0 0 2px ${lens.accent}88, 0 24px 65px rgba(0,0,0,0.65)`,
                }}
              >
                <CodeMotionScene preset={lens.preset} compact />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/75 px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                  {lens.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================
            STAGE 3 (0.68 -> 1.00): WHITE IRIS SUNBURST + POINTER CLICK "STAND OUT"
           ================================================================ */}
        <div
          ref={stage3Ref}
          className="absolute inset-0 z-30 flex items-center justify-center bg-white text-[#07131C] opacity-0 pointer-events-none"
          style={{ clipPath: "circle(0% at 50% 92%)" }}
        >
          <div className="relative mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-4 sm:gap-6 px-4 sm:px-6 py-6 sm:py-12 md:grid-cols-12">
            {/* LEFT: Circular Rotating Blueprint Sunburst + Illustrated Character */}
            <div className="relative flex items-center justify-center md:col-span-5">
              <div
                ref={s3PortraitRef}
                className="relative flex h-[160px] w-[160px] sm:h-[300px] sm:w-[300px] md:h-[390px] md:w-[390px] items-end justify-center overflow-hidden rounded-full shadow-[0_24px_65px_rgba(29,78,216,0.18)] will-change-transform"
              >
                <div
                  aria-hidden="true"
                  className="animate-slow-spin pointer-events-none absolute inset-[-20%]"
                  style={{
                    background:
                      "repeating-conic-gradient(from 0deg, rgba(56,189,248,0.3) 0deg 10deg, transparent 10deg 20deg)",
                  }}
                />
                <CodeCreatorPortrait className="relative z-10 h-[92%] w-auto drop-shadow-[0_14px_24px_rgba(0,0,0,0.22)]" />
              </div>
            </div>

            {/* RIGHT: Kinetic Pitch Copy + Pointer Clicking "STAND OUT" */}
            <div className="relative z-20 flex flex-col items-center text-center md:col-span-7 md:items-start md:text-left">
              <p
                ref={s3Line1Ref}
                className="font-display text-[clamp(1.5rem,5.5vw,3.5rem)] font-bold tracking-tight text-[#07131C] leading-tight transition-all duration-300"
              >
                I engineer structures &amp; apps
              </p>
              <p
                ref={s3Line2Ref}
                className="font-display text-[clamp(1.5rem,5.5vw,3.5rem)] font-bold tracking-tight text-[#07131C] leading-tight transition-all duration-300"
              >
                built to
              </p>

              <div className="relative mt-2 sm:mt-3 inline-flex items-center">
                <button
                  type="button"
                  onMouseEnter={() => setStandOutActive(true)}
                  onClick={() => setContactOpen(true)}
                  style={{ color: standOutActive ? "#FFFFFF" : "#07131C" }}
                  className={`relative rounded-xl sm:rounded-2xl px-4 sm:px-6 py-1 sm:py-1.5 font-display text-[clamp(2rem,8.5vw,4.5rem)] font-black uppercase tracking-tight transition-all duration-300 cursor-pointer ${
                    standOutActive
                      ? "bg-[#1D4ED8] shadow-[0_20px_50px_rgba(29,78,216,0.5)] -rotate-1 scale-105 ring-4 ring-[#C6FF3D]/80"
                      : "bg-transparent"
                  }`}
                >
                  STAND OUT
                </button>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -bottom-4 sm:-right-9 sm:-bottom-6 z-30 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{
                    transform: standOutActive
                      ? "translate3d(-10px, -8px, 0) scale(0.85)"
                      : "translate3d(18px, 14px, 0) scale(1.05)",
                  }}
                >
                  <svg
                    viewBox="0 0 36 36"
                    className="h-9 w-9 sm:h-15 sm:w-15 drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)]"
                  >
                    <path
                      d="M5 3L30 18L18 21L23 32L17 34L12 23L5 29V3Z"
                      fill="#FFFFFF"
                      stroke="#07131C"
                      strokeWidth="2.8"
                      strokeLinejoin="miter"
                    />
                  </svg>
                </div>
              </div>

              <p className="mt-4 sm:mt-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-slate-500">
                Keep scrolling to enter the Full-Screen Works Reel ↓
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
