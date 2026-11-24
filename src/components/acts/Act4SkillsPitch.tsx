"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA, type ToolId } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";
import { ToolBadge } from "@/components/ui/ToolBadges";
import {
  CodeCreatorPortrait,
  CodeEspressoProp,
  CodeTurntableProp,
} from "@/components/ui/CodeMotionAssets";

gsap.registerPlugin(ScrollTrigger);

const CORE_TOOLS: ToolId[] = ["autocad", "revit", "typescript", "python", "figma"];

interface LedgerSkillRow {
  code: string;
  title: string;
  spec: string;
  metric: string;
  fill: number;
}

const CIVIL_ROWS: LedgerSkillRow[] = [
  {
    code: "CIV-01",
    title: "Long-Span Bridge & Arch FEA",
    spec: "ETABS • SAP2000 • Nonlinear Stay-Cable Tension",
    metric: "280m+ Span",
    fill: 0.96,
  },
  {
    code: "CIV-02",
    title: "High-Rise Seismic Core Design",
    spec: "Modal Response Spectrum • SNI 1726 & ACI 318-19",
    metric: "42 Stories",
    fill: 0.94,
  },
  {
    code: "CIV-03",
    title: "BIM LOD 400 & Rebar Detailing",
    spec: "Autodesk Revit • Clash Detection & Bar Schedules",
    metric: "Zero-Clash",
    fill: 0.95,
  },
  {
    code: "CIV-04",
    title: "Corridor & Site Infrastructure",
    spec: "AutoCAD • Civil 3D Alignments & Earthwork Volumes",
    metric: "18.4 km",
    fill: 0.9,
  },
];

const SOFTWARE_ROWS: LedgerSkillRow[] = [
  {
    code: "SWE-01",
    title: "Full-Stack Web Architecture",
    spec: "TypeScript Strict • Next.js 16 • React 19 • Node",
    metric: "Production",
    fill: 0.96,
  },
  {
    code: "SWE-02",
    title: "Computational Engineering Solvers",
    spec: "Python • FastAPI • NumPy/SciPy Structural APIs",
    metric: "< 18ms API",
    fill: 0.94,
  },
  {
    code: "SWE-03",
    title: "Real-Time 3D & WebGL Engines",
    spec: "Three.js • React Three Fiber • Custom GLSL Shaders",
    metric: "120 FPS",
    fill: 0.95,
  },
  {
    code: "SWE-04",
    title: "BIM & CAD Pipeline Automation",
    spec: "Revit API • pyRevit • IFC-to-WebGL Mesh Streaming",
    metric: "-75% Time",
    fill: 0.92,
  },
];

const DESIGN_ROWS: LedgerSkillRow[] = [
  {
    code: "UXD-01",
    title: "Design Systems & Token Architecture",
    spec: "Figma Variables • Multi-Brand Libraries • WCAG AA",
    metric: "80+ Tokens",
    fill: 0.95,
  },
  {
    code: "UXD-02",
    title: "Scroll & Kinetic Motion Direction",
    spec: "GSAP ScrollTrigger • Lenis Physics • Bezier Timing",
    metric: "60-120 FPS",
    fill: 0.96,
  },
  {
    code: "UXD-03",
    title: "Sculptural 3D & Refractive UI",
    spec: "Procedural 3D Forms • Studio Lighting • Glass IOR",
    metric: "WebGL2",
    fill: 0.92,
  },
  {
    code: "UXD-04",
    title: "Zero-Handoff Design-to-Code",
    spec: "Direct Figma Concept → Live Responsive Production",
    metric: "2× Faster",
    fill: 0.97,
  },
];

const HOBBY_TRACKS = [
  {
    code: "SIDE A-01",
    title: "Electric Guitar & Riff Sessions",
    detail: "Neo-soul Maj9 chord voicings, pedalboard tone crafting & late-night improvisation",
    tag: "FENDER / MAJ9",
  },
  {
    code: "SIDE A-02",
    title: "Analog Synth & DAW Beatmaking",
    detail: "112 BPM instrumental synth layering, drum programming & arrangement",
    tag: "112 BPM • D MIN",
  },
  {
    code: "SIDE B-01",
    title: "Specialty V60 & Espresso Dialing",
    detail: "Single-origin pour-over extraction ratios & double-ristretto morning ritual",
    tag: "1:15 RATIO • 93°C",
  },
  {
    code: "SIDE B-02",
    title: "Urban Architectural Sketching",
    detail: "Fine-liner structural perspective studies of bridges, trusses & cityscapes",
    tag: "0.1MM INK",
  },
];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

const STAND_LIT = [
  "bg-[#1D4ED8]",
  "text-white",
  "shadow-[0_20px_50px_rgba(29,78,216,0.5)]",
  "-rotate-1",
  "scale-105",
];
const STAND_UNLIT = ["bg-transparent", "text-[#07131C]"];

/**
 * 6-Beat Architectural Full-Screen Discipline Showreel (Chapter 04 — 580vh)
 * Zero boxy cards AND zero round bubble/pill soup!
 * Every discipline commands its own dedicated 100vw x 100dvh Swiss-Architectural stage:
 *   Beat 0 (0.00 - 0.16): Monumental 45+ Intro Stage
 *   Beat 1 (0.14 - 0.34): 01 // CIVIL & STRUCTURAL ENGINEERING (Dedicated Full-Screen)
 *   Beat 2 (0.32 - 0.52): 02 // SOFTWARE & COMPUTATIONAL SYSTEMS (Dedicated Full-Screen)
 *   Beat 3 (0.50 - 0.70): 03 // UI/UX & INTERACTIVE 3D MOTION (Dedicated Full-Screen)
 *   Beat 4 (0.68 - 0.86): 04 // OFF-CLOCK HOBBIES & ANALOG FUEL (Dedicated Full-Screen)
 *   Beat 5 (0.84 - 1.00): Finale Pitch ("STAND OUT")
 */
export function Act4SkillsPitch() {
  const sectionRef = useRef<HTMLElement>(null);

  // Top progress indicator bar & chapter counter
  const chapterCodeRef = useRef<HTMLSpanElement>(null);
  const segBarRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Beat 0: Intro Monument refs
  const stage0Ref = useRef<HTMLDivElement>(null);
  const giantNumRef = useRef<HTMLSpanElement>(null);
  const s0Line1Ref = useRef<HTMLDivElement>(null);
  const s0Line2Ref = useRef<HTMLDivElement>(null);

  // Beat 1: Civil Engineering refs
  const stage1CivilRef = useRef<HTMLDivElement>(null);
  const civilContentRef = useRef<HTMLDivElement>(null);
  const civilDiagramRef = useRef<HTMLDivElement>(null);
  const civilBarRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Beat 2: Software Engineering refs
  const stage2SoftRef = useRef<HTMLDivElement>(null);
  const softContentRef = useRef<HTMLDivElement>(null);
  const softDiagramRef = useRef<HTMLDivElement>(null);
  const softBarRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Beat 3: UI/UX & 3D Design refs
  const stage3DesignRef = useRef<HTMLDivElement>(null);
  const designContentRef = useRef<HTMLDivElement>(null);
  const designDiagramRef = useRef<HTMLDivElement>(null);
  const designBezierRef = useRef<SVGPathElement>(null);
  const designBarRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Beat 4: Off-Clock Hobbies refs
  const stage4HobbyRef = useRef<HTMLDivElement>(null);
  const hobbyContentRef = useRef<HTMLDivElement>(null);
  const hobbyVisualRef = useRef<HTMLDivElement>(null);

  // Beat 5: Stand Out Finale refs
  const stage5FinaleRef = useRef<HTMLDivElement>(null);
  const finalePortraitRef = useRef<HTMLDivElement>(null);
  const standOutBtnRef = useRef<HTMLButtonElement>(null);
  const standCursorRef = useRef<HTMLDivElement>(null);
  const isStandLitRef = useRef(false);

  const { setActiveChapter, setLetterboxActive, setContactOpen } =
    useShowreel();

  const setStandOutDOM = (lit: boolean) => {
    if (isStandLitRef.current === lit) return;
    isStandLitRef.current = lit;
    const btn = standOutBtnRef.current;
    if (btn) {
      if (lit) {
        btn.classList.remove(...STAND_UNLIT);
        btn.classList.add(...STAND_LIT);
      } else {
        btn.classList.remove(...STAND_LIT);
        btn.classList.add(...STAND_UNLIT);
      }
    }
    if (standCursorRef.current) {
      standCursorRef.current.style.transform = lit
        ? "translate3d(-10px, -8px, 0) scale(0.86)"
        : "translate3d(20px, 16px, 0) scale(1.06)";
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let counterPlayed = false;
    let lastLabel = "";

    const ctx = gsap.context(() => {
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
              duration: 1.25,
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

      const applyProgress = (p: number) => {
        // Update top-left architectural index readout
        const nextLabel =
          p < 0.14
            ? "04.00 // OVERVIEW"
            : p < 0.32
              ? "04.01 // CIVIL ENGINEERING"
              : p < 0.5
                ? "04.02 // SOFTWARE ENGINEERING"
                : p < 0.68
                  ? "04.03 // UI/UX & 3D DESIGN"
                  : p < 0.84
                    ? "04.04 // OFF-CLOCK HOBBIES"
                    : "04.05 // THE PITCH";

        if (nextLabel !== lastLabel && chapterCodeRef.current) {
          lastLabel = nextLabel;
          chapterCodeRef.current.textContent = nextLabel;
          const isLightBg = p < 0.15 || (p >= 0.51 && p < 0.69) || p >= 0.85;
          chapterCodeRef.current.style.color = isLightBg ? "#07131C" : "#C6FF3D";
        }

        // Update 4 discipline timeline dashes
        const ranges = [
          [0.14, 0.32],
          [0.32, 0.5],
          [0.5, 0.68],
          [0.68, 0.84],
        ];
        ranges.forEach(([s, e], i) => {
          const bar = segBarRefs.current[i];
          if (!bar) return;
          const fill = clamp01((p - s) / (e - s));
          bar.style.transform = `scaleX(${Math.max(0.08, fill).toFixed(3)})`;
        });

        // ====================================================================
        // BEAT 0 (0.00 -> 0.16): INTRO MONUMENT
        // ====================================================================
        const s0Split = clamp01((p - 0.1) / 0.06);
        if (stage0Ref.current) {
          stage0Ref.current.style.opacity = (1 - s0Split).toFixed(3);
        }
        if (giantNumRef.current) {
          giantNumRef.current.style.transform = `scale(${(0.95 + p * 1.1).toFixed(3)})`;
        }
        if (s0Line1Ref.current) {
          s0Line1Ref.current.style.transform = `translate3d(${(-s0Split * 220).toFixed(1)}px, 0, 0) skewX(${(-s0Split * 10).toFixed(1)}deg)`;
        }
        if (s0Line2Ref.current) {
          s0Line2Ref.current.style.transform = `translate3d(${(s0Split * 220).toFixed(1)}px, 0, 0) skewX(${(s0Split * 10).toFixed(1)}deg)`;
        }

        // ====================================================================
        // BEAT 1 (0.14 -> 0.34): 01 // CIVIL & STRUCTURAL (Horizontal Shutter Wipe!)
        // ====================================================================
        const w1 = easeInOutCubic(clamp01((p - 0.14) / 0.055));
        const l1 = clamp01((p - 0.15) / 0.18);
        if (stage1CivilRef.current) {
          stage1CivilRef.current.style.clipPath = `inset(0% 0% 0% ${((1 - w1) * 100).toFixed(2)}%)`;
          stage1CivilRef.current.style.visibility = w1 > 0.005 ? "visible" : "hidden";
        }
        if (w1 > 0.005) {
          const enter1 = clamp01(l1 * 3.2);
          if (civilContentRef.current) {
            civilContentRef.current.style.transform = `translate3d(${((1 - enter1) * -40).toFixed(1)}px, 0, 0)`;
          }
          if (civilDiagramRef.current) {
            civilDiagramRef.current.style.transform = `translate3d(${((1 - enter1) * 45).toFixed(1)}px, ${(l1 * -14).toFixed(1)}px, 0)`;
          }
          CIVIL_ROWS.forEach((row, idx) => {
            const bar = civilBarRefs.current[idx];
            if (!bar) return;
            const bf = clamp01((l1 - idx * 0.05) * 3.5) * row.fill;
            bar.style.transform = `scaleX(${bf.toFixed(3)})`;
          });
        }

        // ====================================================================
        // BEAT 2 (0.32 -> 0.52): 02 // SOFTWARE & COMPUTATIONAL (Vertical Shutter Wipe!)
        // ====================================================================
        const w2 = easeInOutCubic(clamp01((p - 0.32) / 0.055));
        const l2 = clamp01((p - 0.33) / 0.18);
        if (stage2SoftRef.current) {
          stage2SoftRef.current.style.clipPath = `inset(${((1 - w2) * 100).toFixed(2)}% 0% 0% 0%)`;
          stage2SoftRef.current.style.visibility = w2 > 0.005 ? "visible" : "hidden";
        }
        if (w2 > 0.005) {
          const enter2 = clamp01(l2 * 3.2);
          if (softContentRef.current) {
            softContentRef.current.style.transform = `translate3d(${((1 - enter2) * 40).toFixed(1)}px, 0, 0)`;
          }
          if (softDiagramRef.current) {
            softDiagramRef.current.style.transform = `translate3d(${((1 - enter2) * -45).toFixed(1)}px, ${(l2 * -12).toFixed(1)}px, 0)`;
          }
          SOFTWARE_ROWS.forEach((row, idx) => {
            const bar = softBarRefs.current[idx];
            if (!bar) return;
            const bf = clamp01((l2 - idx * 0.05) * 3.5) * row.fill;
            bar.style.transform = `scaleX(${bf.toFixed(3)})`;
          });
        }

        // ====================================================================
        // BEAT 3 (0.50 -> 0.70): 03 // UI/UX & 3D MOTION (Horizontal Shutter Wipe!)
        // ====================================================================
        const w3 = easeInOutCubic(clamp01((p - 0.5) / 0.055));
        const l3 = clamp01((p - 0.51) / 0.18);
        if (stage3DesignRef.current) {
          stage3DesignRef.current.style.clipPath = `inset(0% ${((1 - w3) * 100).toFixed(2)}% 0% 0%)`;
          stage3DesignRef.current.style.visibility = w3 > 0.005 ? "visible" : "hidden";
        }
        if (w3 > 0.005) {
          const enter3 = clamp01(l3 * 3.2);
          if (designContentRef.current) {
            designContentRef.current.style.transform = `translate3d(${((1 - enter3) * -40).toFixed(1)}px, 0, 0)`;
          }
          if (designDiagramRef.current) {
            designDiagramRef.current.style.transform = `translate3d(${((1 - enter3) * 45).toFixed(1)}px, 0, 0)`;
          }
          if (designBezierRef.current) {
            const dash = 460 * (1 - clamp01(l3 * 2.2));
            designBezierRef.current.style.strokeDashoffset = dash.toFixed(1);
          }
          DESIGN_ROWS.forEach((row, idx) => {
            const bar = designBarRefs.current[idx];
            if (!bar) return;
            const bf = clamp01((l3 - idx * 0.05) * 3.5) * row.fill;
            bar.style.transform = `scaleX(${bf.toFixed(3)})`;
          });
        }

        // ====================================================================
        // BEAT 4 (0.68 -> 0.86): 04 // OFF-CLOCK HOBBIES (Vertical Shutter Wipe!)
        // ====================================================================
        const w4 = easeInOutCubic(clamp01((p - 0.68) / 0.055));
        const l4 = clamp01((p - 0.69) / 0.16);
        if (stage4HobbyRef.current) {
          stage4HobbyRef.current.style.clipPath = `inset(${((1 - w4) * 100).toFixed(2)}% 0% 0% 0%)`;
          stage4HobbyRef.current.style.visibility = w4 > 0.005 ? "visible" : "hidden";
        }
        if (w4 > 0.005) {
          const enter4 = clamp01(l4 * 3.2);
          if (hobbyContentRef.current) {
            hobbyContentRef.current.style.transform = `translate3d(${((1 - enter4) * -36).toFixed(1)}px, 0, 0)`;
          }
          if (hobbyVisualRef.current) {
            hobbyVisualRef.current.style.transform = `translate3d(${((1 - enter4) * 36).toFixed(1)}px, 0, 0)`;
          }
        }

        // ====================================================================
        // BEAT 5 (0.84 -> 1.00): FINALE PITCH ("STAND OUT")
        // ====================================================================
        const w5 = easeInOutCubic(clamp01((p - 0.84) / 0.06));
        if (stage5FinaleRef.current) {
          stage5FinaleRef.current.style.clipPath = `inset(0% 0% 0% ${((1 - w5) * 100).toFixed(2)}%)`;
          stage5FinaleRef.current.style.visibility = w5 > 0.005 ? "visible" : "hidden";
          stage5FinaleRef.current.style.pointerEvents = w5 > 0.6 ? "auto" : "none";
        }
        if (finalePortraitRef.current) {
          const pSc = 0.86 + w5 * 0.14;
          finalePortraitRef.current.style.transform = `scale(${pSc.toFixed(3)})`;
        }
        setStandOutDOM(p > 0.91);
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.25,
        onEnter: () => {
          setActiveChapter("act-4");
          setLetterboxActive(false);
        },
        onEnterBack: () => {
          setActiveChapter("act-4");
          setLetterboxActive(false);
        },
        onUpdate: (self) => {
          applyProgress(self.progress);
        },
      });

      // Pre-seed initial p=0 state immediately on mount (zero flick!)
      applyProgress(st.progress);
    }, section);

    return () => ctx.revert();
  }, [setActiveChapter, setLetterboxActive]);

  const jumpToStage = (targetP: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const rectTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: rectTop + targetP * scrollable, behavior: "smooth" });
  };

  return (
    <section
      id="act-4"
      ref={sectionRef}
      className="relative h-[580vh] w-full bg-[#F4F7FB] text-[#07131C]"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#F4F7FB]">
        {/* === TOP-LEFT ARCHITECTURAL DISCIPLINE INDEX & QUICK-JUMP STRIP === */}
        <div className="pointer-events-none absolute left-4 top-14 sm:left-12 sm:top-6 z-50 flex flex-wrap items-center gap-3">
          <span
            ref={chapterCodeRef}
            className="font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#07131C] transition-colors duration-200"
          >
            04.00 // OVERVIEW
          </span>
          <div className="pointer-events-auto hidden sm:flex items-center gap-2">
            {[
              { label: "01 Civil", p: 0.22 },
              { label: "02 Software", p: 0.4 },
              { label: "03 UI/UX 3D", p: 0.58 },
              { label: "04 Hobbies", p: 0.76 },
            ].map((item, idx) => (
              <button
                key={item.label}
                type="button"
                onClick={() => jumpToStage(item.p)}
                className="group flex flex-col gap-1 px-1.5 py-0.5 text-left cursor-pointer"
              >
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#38BDF8]">
                  {item.label}
                </span>
                <span className="block h-[2px] w-14 bg-slate-400/30">
                  <span
                    ref={(el) => {
                      segBarRefs.current[idx] = el;
                    }}
                    className="block h-full w-full origin-left bg-[#38BDF8] will-change-transform"
                    style={{ transform: "scaleX(0.08)" }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================
            BEAT 0 (0.00 -> 0.16): INTRO MONUMENT
           ================================================================ */}
        <div
          ref={stage0Ref}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden px-4 text-center"
        >
          <div className="dot-grid-light pointer-events-none absolute inset-0" />
          <span
            ref={giantNumRef}
            aria-hidden="true"
            className="pointer-events-none absolute font-display text-[36vw] sm:text-[26vw] font-black leading-none tracking-tighter text-[#1D4ED8]/[0.08] select-none will-change-transform"
          >
            0+
          </span>

          <div className="relative z-10 flex flex-col items-center max-w-4xl">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.26em] text-[#1D4ED8]">
              {PORTFOLIO_DATA.skillsSection.experienceLabel} • 4 DEDICATED CHAPTERS
            </span>

            <h2 className="mt-3 flex flex-col items-center leading-[0.9] select-none">
              <div
                ref={s0Line1Ref}
                className="font-display text-[clamp(2.3rem,10.5vw,6.8rem)] font-black uppercase tracking-tight text-[#07131C] will-change-transform"
              >
                DISCIPLINES
              </div>
              <div
                ref={s0Line2Ref}
                className="flex flex-wrap items-baseline justify-center gap-x-3 font-display text-[clamp(2.1rem,9.5vw,6.2rem)] font-black uppercase tracking-tight text-[#1D4ED8] will-change-transform"
              >
                <span className="font-serif italic font-normal text-[#07131C]">&amp;</span>
                <span>CRAFT</span>
              </div>
            </h2>

            <p className="mt-3 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              01 Civil Engineering — 02 Software Systems — 03 UI/UX &amp; 3D — 04 Off-Clock Hobbies
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
              {CORE_TOOLS.map((t) => (
                <ToolBadge key={t} tool={t} size="sm" />
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            BEAT 1 (0.14 -> 0.34): DEDICATED STAGE 01 — CIVIL & STRUCTURAL
           ================================================================ */}
        <div
          ref={stage1CivilRef}
          className="absolute inset-0 z-20 flex items-center bg-[#06131F] px-5 pb-6 pt-20 sm:px-12 sm:py-16 text-white"
          style={{ clipPath: "inset(0% 0% 0% 100%)", visibility: "hidden" }}
        >
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-6 bottom-2 font-display text-[24vw] sm:text-[17vw] font-black leading-none tracking-tighter text-[#38BDF8]/[0.06] select-none"
          >
            01
          </span>

          <div className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
            {/* LEFT: Architectural Hairline Skill Ledger */}
            <div ref={civilContentRef} className="lg:col-span-6 will-change-transform">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#38BDF8]" />
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.26em] text-[#38BDF8]">
                  DISCIPLINE 01 // PHYSICAL INFRASTRUCTURE
                </span>
              </div>

              <h3 className="mt-2 font-display text-[clamp(2rem,5.2vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-white">
                Civil &amp;{" "}
                <span className="font-serif italic font-normal capitalize text-[#38BDF8]">
                  Structural.
                </span>
              </h3>

              <div className="mt-4 sm:mt-6 divide-y divide-white/12 border-y border-white/12">
                {CIVIL_ROWS.map((row, idx) => (
                  <div key={row.code} className="py-2.5 sm:py-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2.5 min-w-0">
                        <span className="font-mono text-[10px] font-bold text-[#38BDF8]">
                          {row.code}
                        </span>
                        <span className="truncate font-display text-sm sm:text-lg font-bold text-white">
                          {row.title}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#C6FF3D]">
                        {row.metric}
                      </span>
                    </div>
                    <p className="mt-0.5 pl-12 font-mono text-[10px] sm:text-[11px] text-slate-400">
                      {row.spec}
                    </p>
                    <div className="mt-1.5 ml-12 h-[2px] w-[calc(100%-3rem)] bg-white/10">
                      <span
                        ref={(el) => {
                          civilBarRefs.current[idx] = el;
                        }}
                        className="block h-full w-full origin-left bg-gradient-to-r from-[#38BDF8] to-[#C6FF3D] will-change-transform"
                        style={{ transform: "scaleX(0)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Open-Canvas Structural Bridge Elevation & Moment Diagram (NO Circle/Card!) */}
            <div
              ref={civilDiagramRef}
              className="hidden sm:flex lg:col-span-6 flex-col justify-center will-change-transform"
            >
              <svg viewBox="0 0 620 380" className="w-full h-auto overflow-visible" fill="none">
                {/* CAD Dimension Line */}
                <line x1="40" y1="36" x2="580" y2="36" stroke="#38BDF8" strokeOpacity="0.5" strokeWidth="1" />
                <line x1="40" y1="28" x2="40" y2="44" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="580" y1="28" x2="580" y2="44" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="310" y="26" textAnchor="middle" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  L = 280.00m CABLE-STAYED MAIN SPAN // FEA ENVELOPE
                </text>

                {/* Twin Towers */}
                <path d="M175 245 L182 68 L190 68 L197 245" stroke="#F8FAFC" strokeWidth="3" />
                <path d="M423 245 L430 68 L438 68 L445 245" stroke="#F8FAFC" strokeWidth="3" />

                {/* Fan Stay Cables */}
                {[-125, -95, -65, -35, 35, 65, 95, 125].map((dx, i) => (
                  <g key={i}>
                    <line
                      x1="186"
                      y1={78 + Math.abs(dx) * 0.22}
                      x2={186 + dx}
                      y2="205"
                      stroke={i % 3 === 0 ? "#C6FF3D" : "#38BDF8"}
                      strokeOpacity="0.8"
                      strokeWidth="1.4"
                    />
                    <line
                      x1="434"
                      y1={78 + Math.abs(dx) * 0.22}
                      x2={434 + dx}
                      y2="205"
                      stroke={i % 3 === 0 ? "#C6FF3D" : "#38BDF8"}
                      strokeOpacity="0.8"
                      strokeWidth="1.4"
                    />
                  </g>
                ))}

                {/* Main Highway Deck Girder */}
                <line x1="30" y1="205" x2="590" y2="205" stroke="#FFFFFF" strokeWidth="4" />
                <line x1="30" y1="212" x2="590" y2="212" stroke="#38BDF8" strokeWidth="1.5" />

                {/* Bending Moment Diagram Curve Below Deck */}
                <path
                  d="M 40 285 Q 112 330 186 250 Q 310 365 434 250 Q 508 330 580 285"
                  stroke="#C6FF3D"
                  strokeWidth="2.5"
                  fill="rgba(198,255,61,0.08)"
                />
                <line x1="40" y1="285" x2="580" y2="285" stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1" />
                <text x="310" y="356" textAnchor="middle" fill="#C6FF3D" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  BENDING MOMENT ENVELOPE: Mu = 412.6 kN·m ≤ φMn (PASS)
                </text>
              </svg>

              <div className="mt-2 flex items-center justify-end gap-3">
                <ToolBadge tool="autocad" size="sm" />
                <ToolBadge tool="revit" size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            BEAT 2 (0.32 -> 0.52): DEDICATED STAGE 02 — SOFTWARE & SOLVERS
           ================================================================ */}
        <div
          ref={stage2SoftRef}
          className="absolute inset-0 z-30 flex items-center bg-[#050B14] px-5 pb-6 pt-20 sm:px-12 sm:py-16 text-white"
          style={{ clipPath: "inset(100% 0% 0% 0%)", visibility: "hidden" }}
        >
          <div className="dot-grid-dark pointer-events-none absolute inset-0 opacity-45" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-6 bottom-2 font-display text-[24vw] sm:text-[17vw] font-black leading-none tracking-tighter text-[#C6FF3D]/[0.05] select-none"
          >
            02
          </span>

          <div className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
            {/* LEFT: Open-Canvas Computational Architecture & Code Stream (NO Circle/Card!) */}
            <div
              ref={softDiagramRef}
              className="hidden sm:flex lg:col-span-6 flex-col justify-center order-2 lg:order-1 will-change-transform"
            >
              <svg viewBox="0 0 600 320" className="w-full h-auto overflow-visible" fill="none">
                {/* Architectural Hairline Node Pipeline */}
                <line x1="160" y1="84" x2="245" y2="148" stroke="#38BDF8" strokeWidth="2" />
                <line x1="160" y1="212" x2="245" y2="148" stroke="#C6FF3D" strokeWidth="2" />
                <line x1="395" y1="148" x2="465" y2="148" stroke="#C6FF3D" strokeWidth="2.5" />

                {/* Input Nodes */}
                <line x1="20" y1="62" x2="160" y2="62" stroke="#38BDF8" strokeWidth="2" />
                <text x="20" y="84" fill="#FFFFFF" fontSize="13" fontFamily="monospace" fontWeight="bold">
                  REVIT_IFC.STREAM
                </text>
                <text x="20" y="102" fill="#64748B" fontSize="10" fontFamily="monospace">
                  142,800 Mesh Vertices
                </text>

                <line x1="20" y1="190" x2="160" y2="190" stroke="#C6FF3D" strokeWidth="2" />
                <text x="20" y="212" fill="#FFFFFF" fontSize="13" fontFamily="monospace" fontWeight="bold">
                  LOAD_MATRIX.PY
                </text>
                <text x="20" y="230" fill="#64748B" fontSize="10" fontFamily="monospace">
                  FastAPI • NumPy Stiffness [K]
                </text>

                {/* Central Solver Engine */}
                <line x1="245" y1="118" x2="395" y2="118" stroke="#C6FF3D" strokeWidth="3" />
                <line x1="245" y1="178" x2="395" y2="178" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="1" />
                <text x="320" y="146" textAnchor="middle" fill="#C6FF3D" fontSize="15" fontFamily="monospace" fontWeight="bold">
                  SOLVE_TWIN()
                </text>
                <text x="320" y="166" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  P99 = 14.2ms • Strict TS
                </text>

                {/* Output WebGL Stage */}
                <line x1="465" y1="118" x2="585" y2="118" stroke="#38BDF8" strokeWidth="3" />
                <text x="465" y="146" fill="#38BDF8" fontSize="15" fontFamily="monospace" fontWeight="bold">
                  120 FPS WEBGL
                </text>
                <text x="465" y="166" fill="#E2E8F0" fontSize="10" fontFamily="monospace">
                  Next.js 16 • Three.js
                </text>

                {/* Open-Space Code Excerpt */}
                <text x="20" y="284" fill="#38BDF8" fontSize="12" fontFamily="monospace">
                  export const solveSpan = async (mesh: BimGraph): Promise&lt;TwinState&gt; =&gt;
                </text>
                <text x="20" y="304" fill="#C6FF3D" fontSize="12" fontFamily="monospace">
                  {"  computeEigenModes(mesh.stiffnessMatrix, { targetFps: 120 });"}
                </text>
              </svg>

              <div className="mt-3 flex items-center gap-3">
                <ToolBadge tool="typescript" size="sm" />
                <ToolBadge tool="python" size="sm" />
              </div>
            </div>

            {/* RIGHT: Software Hairline Skill Ledger */}
            <div ref={softContentRef} className="lg:col-span-6 order-1 lg:order-2 will-change-transform">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#C6FF3D]" />
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.26em] text-[#C6FF3D]">
                  DISCIPLINE 02 // DIGITAL ARCHITECTURE
                </span>
              </div>

              <h3 className="mt-2 font-display text-[clamp(2rem,5.2vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-white">
                Software &amp;{" "}
                <span className="font-serif italic font-normal capitalize text-[#C6FF3D]">
                  Systems.
                </span>
              </h3>

              <div className="mt-4 sm:mt-6 divide-y divide-white/12 border-y border-white/12">
                {SOFTWARE_ROWS.map((row, idx) => (
                  <div key={row.code} className="py-2.5 sm:py-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2.5 min-w-0">
                        <span className="font-mono text-[10px] font-bold text-[#C6FF3D]">
                          {row.code}
                        </span>
                        <span className="truncate font-display text-sm sm:text-lg font-bold text-white">
                          {row.title}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8]">
                        {row.metric}
                      </span>
                    </div>
                    <p className="mt-0.5 pl-12 font-mono text-[10px] sm:text-[11px] text-slate-400">
                      {row.spec}
                    </p>
                    <div className="mt-1.5 ml-12 h-[2px] w-[calc(100%-3rem)] bg-white/10">
                      <span
                        ref={(el) => {
                          softBarRefs.current[idx] = el;
                        }}
                        className="block h-full w-full origin-left bg-gradient-to-r from-[#C6FF3D] to-[#38BDF8] will-change-transform"
                        style={{ transform: "scaleX(0)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            BEAT 3 (0.50 -> 0.70): DEDICATED STAGE 03 — UI/UX & 3D DESIGN
           ================================================================ */}
        <div
          ref={stage3DesignRef}
          className="absolute inset-0 z-40 flex items-center bg-[#F5F7FB] px-5 pb-6 pt-20 sm:px-12 sm:py-16 text-[#07131C]"
          style={{ clipPath: "inset(0% 100% 0% 0%)", visibility: "hidden" }}
        >
          <div className="mosaic-grid pointer-events-none absolute inset-0 opacity-40" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-6 bottom-2 font-display text-[24vw] sm:text-[17vw] font-black leading-none tracking-tighter text-[#1D4ED8]/[0.06] select-none"
          >
            03
          </span>

          <div className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
            {/* LEFT: Swiss-Grid UI/UX & 3D Ledger */}
            <div ref={designContentRef} className="lg:col-span-6 will-change-transform">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#1D4ED8]" />
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.26em] text-[#1D4ED8]">
                  DISCIPLINE 03 // INTERACTIVE CRAFT
                </span>
              </div>

              <h3 className="mt-2 font-display text-[clamp(2rem,5.2vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-[#07131C]">
                UI/UX &amp;{" "}
                <span className="font-serif italic font-normal capitalize text-[#1D4ED8]">
                  3D Motion.
                </span>
              </h3>

              <div className="mt-4 sm:mt-6 divide-y divide-slate-900/12 border-y border-slate-900/12">
                {DESIGN_ROWS.map((row, idx) => (
                  <div key={row.code} className="py-2.5 sm:py-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2.5 min-w-0">
                        <span className="font-mono text-[10px] font-bold text-[#1D4ED8]">
                          {row.code}
                        </span>
                        <span className="truncate font-display text-sm sm:text-lg font-bold text-[#07131C]">
                          {row.title}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#1D4ED8]">
                        {row.metric}
                      </span>
                    </div>
                    <p className="mt-0.5 pl-12 font-mono text-[10px] sm:text-[11px] text-slate-600">
                      {row.spec}
                    </p>
                    <div className="mt-1.5 ml-12 h-[2px] w-[calc(100%-3rem)] bg-slate-900/10">
                      <span
                        ref={(el) => {
                          designBarRefs.current[idx] = el;
                        }}
                        className="block h-full w-full origin-left bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] will-change-transform"
                        style={{ transform: "scaleX(0)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Open-Canvas Swiss Typography & Cubic-Bezier Motion Graph (NO Circle/Card!) */}
            <div
              ref={designDiagramRef}
              className="hidden sm:flex lg:col-span-6 flex-col justify-center will-change-transform"
            >
              <svg viewBox="0 0 580 340" className="w-full h-auto overflow-visible" fill="none">
                {/* Swiss Baseline Axes */}
                <line x1="60" y1="280" x2="520" y2="280" stroke="#0F172A" strokeWidth="2" />
                <line x1="60" y1="40" x2="60" y2="280" stroke="#0F172A" strokeWidth="2" />
                <line x1="60" y1="40" x2="520" y2="40" stroke="#94A3B8" strokeDasharray="6 6" strokeWidth="1" />
                <line x1="520" y1="40" x2="520" y2="280" stroke="#94A3B8" strokeDasharray="6 6" strokeWidth="1" />

                {/* Control Tangents */}
                <line x1="60" y1="280" x2="155" y2="44" stroke="#FF6B4A" strokeWidth="2" strokeDasharray="5 4" />
                <line x1="520" y1="40" x2="310" y2="40" stroke="#1D4ED8" strokeWidth="2" strokeDasharray="5 4" />

                {/* Scrubbed Expo Bezier Curve */}
                <path
                  ref={designBezierRef}
                  d="M 60 280 C 155 44, 310 40, 520 40"
                  stroke="#1D4ED8"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="460"
                  strokeDashoffset="460"
                />
                <rect x="149" y="38" width="12" height="12" fill="#FF6B4A" />
                <rect x="304" y="34" width="12" height="12" fill="#1D4ED8" />

                {/* Editorial Type Specimen Overlay */}
                <text x="330" y="215" fill="#07131C" fontSize="86" fontWeight="900" fontFamily="system-ui, sans-serif" opacity="0.12">
                  Aa
                </text>
                <text x="60" y="314" fill="#1D4ED8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  EASING: cubic-bezier(0.16, 1.00, 0.30, 1.00) // SWISS GRID RATIO 1:1.618
                </text>
              </svg>

              <div className="mt-2 flex items-center justify-end gap-3">
                <ToolBadge tool="figma" size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            BEAT 4 (0.68 -> 0.86): DEDICATED STAGE 04 — OFF-CLOCK HOBBIES
           ================================================================ */}
        <div
          ref={stage4HobbyRef}
          className="absolute inset-0 z-[45] flex items-center bg-[#0B0714] px-5 pb-6 pt-20 sm:px-12 sm:py-16 text-white"
          style={{ clipPath: "inset(100% 0% 0% 0%)", visibility: "hidden" }}
        >
          <div className="dot-grid-dark pointer-events-none absolute inset-0 opacity-35" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-6 bottom-2 font-display text-[24vw] sm:text-[17vw] font-black leading-none tracking-tighter text-[#FF6B4A]/[0.06] select-none"
          >
            04
          </span>

          <div className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
            {/* LEFT: LP Vinyl Tracklist Ledger (Clean Hairlines — Zero Bubble Soup!) */}
            <div ref={hobbyContentRef} className="lg:col-span-6 will-change-transform">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#FF6B4A]" />
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.26em] text-[#FF6B4A]">
                  CHAPTER 04 // LIFE BEYOND THE BLUEPRINT
                </span>
              </div>

              <h3 className="mt-2 font-display text-[clamp(2rem,5.2vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-white">
                Off-Clock{" "}
                <span className="font-serif italic font-normal capitalize text-[#FF6B4A]">
                  Hobbies.
                </span>
              </h3>

              <div className="mt-4 sm:mt-6 divide-y divide-white/12 border-y border-white/12">
                {HOBBY_TRACKS.map((tr) => (
                  <div key={tr.code} className="py-2.5 sm:py-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2.5 min-w-0">
                        <span className="font-mono text-[10px] font-bold text-[#FF6B4A]">
                          {tr.code}
                        </span>
                        <span className="truncate font-display text-sm sm:text-lg font-bold text-white">
                          {tr.title}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        {tr.tag}
                      </span>
                    </div>
                    <p className="mt-0.5 pl-16 font-sans text-[11px] sm:text-xs text-purple-200/75">
                      {tr.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Open-Canvas Guitar Fretboard + Spectrum Bars + Turntable (NO Oval Windows!) */}
            <div
              ref={hobbyVisualRef}
              className="hidden sm:flex lg:col-span-6 flex-col justify-center gap-5 will-change-transform"
            >
              <div className="flex items-center justify-between gap-6">
                <CodeTurntableProp className="h-36 lg:h-44 w-auto drop-shadow-[0_24px_40px_rgba(0,0,0,0.75)]" />
                <CodeEspressoProp className="h-28 lg:h-34 w-auto drop-shadow-[0_24px_40px_rgba(0,0,0,0.75)]" />
              </div>

              {/* Open-Space 6-String Fretboard & Harmonic Waveform */}
              <svg viewBox="0 0 560 150" className="w-full h-auto overflow-visible" fill="none">
                <line x1="0" y1="24" x2="560" y2="24" stroke="#F59E0B" strokeOpacity="0.6" strokeWidth="2" />
                <line x1="0" y1="116" x2="560" y2="116" stroke="#F59E0B" strokeOpacity="0.6" strokeWidth="2" />
                {[90, 185, 280, 375, 470].map((fx) => (
                  <line key={fx} x1={fx} y1="24" x2={fx} y2="116" stroke="#64748B" strokeWidth="2" />
                ))}
                {[34, 50, 66, 82, 98, 110].map((sy, idx) => (
                  <line
                    key={sy}
                    x1="0"
                    y1={sy}
                    x2="560"
                    y2={sy}
                    stroke="#FDE68A"
                    strokeOpacity="0.78"
                    strokeWidth={1 + idx * 0.22}
                  />
                ))}
                {/* Harmonic Vibrating String Wave */}
                <path
                  d="M 0 68 Q 70 8, 140 68 T 280 68 T 420 68 T 560 68"
                  stroke="#FF6B4A"
                  strokeWidth="3"
                />
                <path
                  d="M 0 68 Q 95 124, 190 68 T 380 68 T 560 68"
                  stroke="#38BDF8"
                  strokeOpacity="0.7"
                  strokeWidth="2"
                />
                <text x="0" y="142" fill="#FBBF24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ANALOG SIGNAL // 112 BPM • D MINOR9 VOICING • V60 COFFEE FUEL
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* ================================================================
            BEAT 5 (0.84 -> 1.00): FINALE PITCH ("STAND OUT")
           ================================================================ */}
        <div
          ref={stage5FinaleRef}
          className="absolute inset-0 z-[48] flex items-center justify-center bg-white text-[#07131C]"
          style={{ clipPath: "inset(0% 0% 0% 100%)", visibility: "hidden" }}
        >
          <div className="mosaic-grid pointer-events-none absolute inset-0 opacity-35" />

          <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-4 sm:gap-8 px-6 py-8 sm:py-12 md:grid-cols-12">
            {/* LEFT: Open Architectural Crosshair Portrait Stage (NO Circle Bubble!) */}
            <div className="relative flex items-center justify-center md:col-span-5">
              <div
                ref={finalePortraitRef}
                className="relative flex h-[190px] sm:h-[320px] md:h-[400px] items-end justify-center will-change-transform"
              >
                {/* Architectural Crosshair Lines Behind Portrait */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-[-20%] top-1/2 h-[1px] bg-[#1D4ED8]/25"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-1/2 w-[1px] bg-[#1D4ED8]/25"
                />
                <CodeCreatorPortrait className="relative z-10 h-full w-auto drop-shadow-[0_22px_36px_rgba(7,19,28,0.22)]" />
              </div>
            </div>

            {/* RIGHT: Kinetic Pitch Copy + Pointer Clicking "STAND OUT" */}
            <div className="relative z-20 flex flex-col items-center text-center md:col-span-7 md:items-start md:text-left">
              <span className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#1D4ED8]">
                READY FOR REAL-WORLD GRAVITY &amp; SCALE
              </span>
              <p className="font-display text-[clamp(1.5rem,5.2vw,3.4rem)] font-bold tracking-tight text-[#07131C] leading-tight">
                I engineer structures &amp; apps
              </p>
              <p className="font-display text-[clamp(1.5rem,5.2vw,3.4rem)] font-bold tracking-tight text-[#07131C] leading-tight">
                built to
              </p>

              <div className="relative mt-2 sm:mt-3 inline-flex items-center">
                <button
                  ref={standOutBtnRef}
                  type="button"
                  onMouseEnter={() => setStandOutDOM(true)}
                  onClick={() => setContactOpen(true)}
                  className="relative bg-transparent px-5 sm:px-7 py-1.5 font-display text-[clamp(2.1rem,8.5vw,4.6rem)] font-black uppercase tracking-tight text-[#07131C] transition-all duration-300 cursor-pointer"
                >
                  STAND OUT.
                </button>

                <div
                  ref={standCursorRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -bottom-4 sm:-right-9 sm:-bottom-6 z-30 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ transform: "translate3d(20px, 16px, 0) scale(1.06)" }}
                >
                  <svg
                    viewBox="0 0 36 36"
                    className="h-9 w-9 sm:h-14 sm:w-14 drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)]"
                  >
                    <path
                      d="M5 3L30 18L18 21L23 32L17 34L12 23L5 29V3Z"
                      fill="#FFFFFF"
                      stroke="#07131C"
                      strokeWidth="2.8"
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
