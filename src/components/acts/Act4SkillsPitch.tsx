"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Music, Guitar, Coffee, Compass, Sparkles } from "lucide-react";
import { PORTFOLIO_DATA, type ToolId } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";
import { ToolBadge } from "@/components/ui/ToolBadges";
import {
  CodeCreatorPortrait,
  CodeEspressoProp,
  CodeMotionScene,
  CodeTurntableProp,
  type CodeScenePreset,
} from "@/components/ui/CodeMotionAssets";

gsap.registerPlugin(ScrollTrigger);

const CORE_TOOLS: ToolId[] = ["autocad", "revit", "typescript", "python", "figma"];

const SKILL_GROUPS = [
  {
    domain: "Civil & Structural",
    accent: "#38BDF8",
    skills: [
      "ETABS & SAP2000 FEA",
      "Revit BIM LOD 400",
      "AutoCAD & Civil 3D",
      "Cable-Stayed & Arch Bridges",
      "Seismic Core (SNI / ACI 318)",
    ],
  },
  {
    domain: "Software & Solvers",
    accent: "#C6FF3D",
    skills: [
      "TypeScript & Next.js 16",
      "Python & FastAPI Solvers",
      "Three.js & WebGL 120fps",
      "PostgreSQL & Cloud APIs",
      "Parametric BIM Automation",
    ],
  },
  {
    domain: "UI/UX & 3D Craft",
    accent: "#C084FC",
    skills: [
      "Figma Design Systems",
      "GSAP Kinetic Motion",
      "Procedural 3D Geometry",
      "Liquid Glass & Shaders",
    ],
  },
];

const HOBBY_PILLS = [
  { label: "Electric Guitar & Maj9 Riffs", icon: Guitar, color: "#FF6B4A" },
  { label: "Analog Synth & DAW Beats", icon: Music, color: "#F472B6" },
  { label: "V60 & Espresso Extraction", icon: Coffee, color: "#FACC15" },
  { label: "Urban Architectural Sketching", icon: Compass, color: "#38BDF8" },
  { label: "Creative Shader Experiments", icon: Sparkles, color: "#C6FF3D" },
];

const FLOATING_LENSES: {
  id: string;
  label: string;
  preset: CodeScenePreset;
  posClass: string;
  accent: string;
}[] = [
  {
    id: "lens-bridge",
    label: "280m Cable-Stayed FEA",
    preset: "bridge-fea",
    posClass: "left-[3%] top-[11%] w-60 h-34 xl:w-72 xl:h-40",
    accent: "#38BDF8",
  },
  {
    id: "lens-bim",
    label: "BIM-to-Web 120 FPS",
    preset: "bim-web-engine",
    posClass: "right-[4%] top-[10%] w-44 h-44 xl:w-48 xl:h-48",
    accent: "#C6FF3D",
  },
  {
    id: "lens-tower",
    label: "42F Seismic Core",
    preset: "seismic-tower",
    posClass: "left-[5%] bottom-[10%] w-42 h-42 xl:w-46 xl:h-46",
    accent: "#FF6B4A",
  },
  {
    id: "lens-calc",
    label: "ACI 318 Solver API",
    preset: "autospec-calc",
    posClass: "right-[3%] bottom-[11%] w-60 h-34 xl:w-72 xl:h-40",
    accent: "#4ADE80",
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
  "ring-4",
  "ring-[#C6FF3D]/80",
];
const STAND_UNLIT = ["bg-transparent", "text-[#07131C]"];

/**
 * ZERO-CARD 4-Stage Full-Bleed Kinetic Skills & Off-Clock Hobbies Showreel (Chapter 04 — 460vh)
 *   Stage 1 (0.00 - 0.24): Monumental typographic stage + colossal 45+ numeral + tool orbit
 *   Stage 2 (0.21 - 0.52): Core Technical Skills Arsenal (Civil + Software + 3D UI pills) + 4K motion lenses
 *   Stage 3 (0.49 - 0.78): Dedicated OFF-CLOCK HOBBIES Stage (Electric Guitar, Synth DAW, Espresso, Sketching)
 *   Stage 4 (0.75 - 1.00): White circular iris sunburst + Creator Portrait + pointer-clicked STAND OUT
 * Driven 100% via direct DOM refs (0 React re-renders during scroll, 0 entry flick!).
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

  // Stage 2 (Technical Skills Arsenal) refs
  const stage2Ref = useRef<HTMLDivElement>(null);
  const diag1Ref = useRef<HTMLDivElement>(null);
  const diag2Ref = useRef<HTMLDivElement>(null);
  const skillsClusterRef = useRef<HTMLDivElement>(null);
  const lensRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Stage 3 (Off-Clock Hobbies & Creative Fuel) refs
  const stage3HobbyRef = useRef<HTMLDivElement>(null);
  const hobbyRibbon1Ref = useRef<HTMLDivElement>(null);
  const hobbyRibbon2Ref = useRef<HTMLDivElement>(null);
  const hobbyCenterRef = useRef<HTMLDivElement>(null);
  const hobbyVinylRef = useRef<HTMLDivElement>(null);
  const hobbyEspressoRef = useRef<HTMLDivElement>(null);

  // Stage 4 (Iris Sunburst + STAND OUT) refs
  const stage4Ref = useRef<HTMLDivElement>(null);
  const s4PortraitRef = useRef<HTMLDivElement>(null);
  const s4Line1Ref = useRef<HTMLParagraphElement>(null);
  const s4Line2Ref = useRef<HTMLParagraphElement>(null);
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

    const ctx = gsap.context(() => {
      // Smooth early counter trigger as Act 4 enters viewport
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

      const applyProgress = (p: number) => {
        // === STAGE 1 (0.00 -> 0.24): Kinetic Split Typography ===
        const s1Split = clamp01((p - 0.16) / 0.09);
        if (stage1Ref.current) {
          stage1Ref.current.style.opacity = (1 - s1Split).toFixed(3);
          stage1Ref.current.style.pointerEvents = s1Split > 0.6 ? "none" : "auto";
        }
        if (giantNumRef.current) {
          giantNumRef.current.style.transform = `scale(${(0.95 + p * 0.85).toFixed(3)})`;
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
          s1OrbitRef.current.style.transform = `scale(${(1 + s1Split * 0.45).toFixed(3)}) rotate(${(p * 36).toFixed(1)}deg)`;
        }

        // === STAGE 2 (0.21 -> 0.52): CORE SKILLS ARSENAL + 4K LENSES ===
        const s2In = easeInOutCubic(clamp01((p - 0.21) / 0.08));
        const local2 = clamp01((p - 0.22) / 0.3);

        if (stage2Ref.current) {
          stage2Ref.current.style.clipPath = `circle(${(s2In * 148).toFixed(1)}% at 50% 50%)`;
          stage2Ref.current.style.visibility = s2In > 0.005 ? "visible" : "hidden";
          stage2Ref.current.style.pointerEvents =
            p >= 0.24 && p < 0.5 ? "auto" : "none";
        }
        if (s2In > 0.005) {
          if (diag1Ref.current) {
            diag1Ref.current.style.transform = `translate3d(${(220 - local2 * 720).toFixed(1)}px, 0, 0) rotate(-5deg)`;
          }
          if (diag2Ref.current) {
            diag2Ref.current.style.transform = `translate3d(${(-420 + local2 * 720).toFixed(1)}px, 0, 0) rotate(-5deg)`;
          }
          if (skillsClusterRef.current) {
            const sc = 0.9 + Math.min(1, local2 * 3.2) * 0.1;
            skillsClusterRef.current.style.transform = `scale(${sc.toFixed(3)})`;
          }
          for (let i = 0; i < FLOATING_LENSES.length; i++) {
            const el = lensRefs.current[i];
            if (!el) continue;
            const dirX = i % 2 === 0 ? 1 : -1;
            const dirY = i < 2 ? 1 : -1;
            const driftX = (local2 - 0.5) * 90 * dirX;
            const driftY = (local2 - 0.5) * 45 * dirY;
            const sc = 0.84 + Math.sin(local2 * Math.PI) * 0.18;
            el.style.transform = `translate3d(${driftX.toFixed(1)}px, ${driftY.toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
          }
        }

        // === STAGE 3 (0.49 -> 0.78): DEDICATED OFF-CLOCK HOBBIES STAGE ===
        const s3Wipe = easeInOutCubic(clamp01((p - 0.49) / 0.08));
        const local3 = clamp01((p - 0.5) / 0.27);

        if (stage3HobbyRef.current) {
          const lead = 125 - s3Wipe * 155;
          const tail = 100 - s3Wipe * 155;
          stage3HobbyRef.current.style.clipPath =
            s3Wipe >= 0.995
              ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
              : `polygon(${lead.toFixed(1)}% 0%, 100% 0%, 100% 100%, ${tail.toFixed(1)}% 100%)`;
          stage3HobbyRef.current.style.visibility =
            s3Wipe > 0.005 ? "visible" : "hidden";
          stage3HobbyRef.current.style.pointerEvents =
            p >= 0.52 && p < 0.76 ? "auto" : "none";
        }

        if (s3Wipe > 0.005) {
          if (hobbyRibbon1Ref.current) {
            hobbyRibbon1Ref.current.style.transform = `translate3d(${(200 - local3 * 640).toFixed(1)}px, 0, 0) rotate(-4deg)`;
          }
          if (hobbyRibbon2Ref.current) {
            hobbyRibbon2Ref.current.style.transform = `translate3d(${(-300 + local3 * 640).toFixed(1)}px, 0, 0) rotate(-4deg)`;
          }
          if (hobbyCenterRef.current) {
            const hIn = clamp01(local3 * 3.2);
            hobbyCenterRef.current.style.transform = `translate3d(0, ${((1 - hIn) * 28).toFixed(1)}px, 0) scale(${(0.92 + hIn * 0.08).toFixed(3)})`;
          }
          if (hobbyVinylRef.current) {
            hobbyVinylRef.current.style.transform = `translate3d(${((0.5 - local3) * 60).toFixed(1)}px, 0, 0) rotate(${(-8 + local3 * 24).toFixed(1)}deg)`;
          }
          if (hobbyEspressoRef.current) {
            hobbyEspressoRef.current.style.transform = `translate3d(${((local3 - 0.5) * 60).toFixed(1)}px, 0, 0) rotate(${(12 - local3 * 28).toFixed(1)}deg)`;
          }
        }

        // === STAGE 4 (0.75 -> 1.00): WHITE CIRCULAR IRIS SUNBURST + STAND OUT ===
        const irisP = easeInOutCubic(clamp01((p - 0.75) / 0.11));
        if (stage4Ref.current) {
          const rad = irisP * 148;
          stage4Ref.current.style.clipPath = `circle(${rad.toFixed(1)}% at 50% 92%)`;
          stage4Ref.current.style.visibility = irisP > 0.005 ? "visible" : "hidden";
          stage4Ref.current.style.pointerEvents = irisP > 0.5 ? "auto" : "none";
        }
        if (s4PortraitRef.current) {
          const pScale = 0.74 + irisP * 0.26;
          s4PortraitRef.current.style.transform = `scale(${pScale.toFixed(3)})`;
        }
        if (s4Line1Ref.current) {
          const show1 = p > 0.81;
          s4Line1Ref.current.style.opacity = show1 ? "1" : "0.2";
          s4Line1Ref.current.style.transform = show1
            ? "translate3d(0,0,0)"
            : "translate3d(0,18px,0)";
        }
        if (s4Line2Ref.current) {
          const show2 = p > 0.84;
          s4Line2Ref.current.style.opacity = show2 ? "1" : "0.2";
          s4Line2Ref.current.style.transform = show2
            ? "translate3d(0,0,0)"
            : "translate3d(0,18px,0)";
        }

        setStandOutDOM(p > 0.88);
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

      // Synchronously seed initial p=0 state on mount (zero entry flick!)
      applyProgress(st.progress);
    }, section);

    return () => ctx.revert();
  }, [setActiveChapter, setLetterboxActive]);

  return (
    <section
      id="act-4"
      ref={sectionRef}
      className="relative h-[460vh] w-full bg-[#F4F7FB] text-[#07131C]"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#F4F7FB]">
        <div className="dot-grid-light pointer-events-none absolute inset-0" />

        {/* ================================================================
            STAGE 1 (0.00 -> 0.24): MONUMENTAL DUAL-DISCIPLINE IDENTITY
           ================================================================ */}
        <div
          ref={stage1Ref}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden px-4 sm:px-5 text-center"
        >
          <span
            ref={giantNumRef}
            aria-hidden="true"
            className="pointer-events-none absolute font-display text-[36vw] sm:text-[26vw] font-black leading-none tracking-tighter text-[#1D4ED8]/[0.08] select-none will-change-transform"
          >
            0+
          </span>

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
              04 • SKILLS &amp; BEYOND — {PORTFOLIO_DATA.skillsSection.experienceLabel}
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

            <div className="mt-4 flex items-center justify-center gap-1.5 sm:gap-2 md:hidden">
              {CORE_TOOLS.map((t) => (
                <ToolBadge key={t} tool={t} size="sm" />
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            STAGE 2 (0.21 -> 0.52): TECHNICAL SKILLS ARSENAL + 4K LENSES
           ================================================================ */}
        <div
          ref={stage2Ref}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#06101A] px-4 text-white"
          style={{ clipPath: "circle(0% at 50% 50%)", visibility: "hidden" }}
        >
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30" />

          {/* Subtle Kinetic Background Typography Streams */}
          <div
            ref={diag1Ref}
            aria-hidden="true"
            className="pointer-events-none absolute top-[10%] whitespace-nowrap font-display text-6xl sm:text-8xl font-black uppercase tracking-tight text-white/[0.04] select-none will-change-transform"
          >
            STRUCTURAL FEA • CABLE-STAYED BRIDGES • SEISMIC BIM • ETABS •
          </div>
          <div
            ref={diag2Ref}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[10%] whitespace-nowrap font-display text-6xl sm:text-8xl font-black uppercase tracking-tight text-[#C6FF3D]/[0.05] select-none will-change-transform"
          >
            TYPESCRIPT • NEXT.JS 16 • PYTHON SOLVERS • 120 FPS WEBGL •
          </div>

          {/* Desktop Outer Orbiting Circular & Pill 4K Vector Lenses */}
          <div className="pointer-events-none absolute inset-0 mx-auto hidden lg:block max-w-[1440px]">
            {FLOATING_LENSES.map((lens, idx) => (
              <div
                key={lens.id}
                ref={(el) => {
                  lensRefs.current[idx] = el;
                }}
                className={`absolute overflow-hidden rounded-full will-change-transform ${lens.posClass}`}
                style={{
                  boxShadow: `0 0 0 2px ${lens.accent}88, 0 24px 60px rgba(0,0,0,0.65)`,
                }}
              >
                <CodeMotionScene preset={lens.preset} compact />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                  {lens.label}
                </span>
              </div>
            ))}
          </div>

          {/* Central Frameless Technical Skills Constellation (Crisp & Zero Boxiness!) */}
          <div
            ref={skillsClusterRef}
            className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center will-change-transform"
          >
            <span className="rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#38BDF8]">
              04.A // CORE TECHNICAL ARSENAL
            </span>

            <h3 className="mt-2 font-display text-[clamp(1.75rem,5.5vw,3.3rem)] font-black tracking-tight text-white leading-tight">
              Dual-Engineered{" "}
              <span className="font-serif italic font-normal text-[#C6FF3D]">
                Skill Matrix.
              </span>
            </h3>

            {/* Mobile/Tablet Compact Live Pill Lenses */}
            <div className="mt-3 flex items-center justify-center gap-2.5 lg:hidden">
              <div className="relative h-16 w-36 overflow-hidden rounded-full ring-2 ring-[#38BDF8]/70">
                <CodeMotionScene preset="bridge-fea" compact />
              </div>
              <div className="relative h-16 w-36 overflow-hidden rounded-full ring-2 ring-[#C6FF3D]/70">
                <CodeMotionScene preset="bim-web-engine" compact />
              </div>
            </div>

            <div className="mt-4 sm:mt-5 flex flex-col gap-3.5 sm:gap-4 w-full">
              {SKILL_GROUPS.map((grp) => (
                <div key={grp.domain} className="flex flex-col items-center gap-1.5">
                  <span
                    className="font-mono text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.24em]"
                    style={{ color: grp.accent }}
                  >
                    {grp.domain}
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    {grp.skills.map((sk) => (
                      <span
                        key={sk}
                        style={{ borderColor: `${grp.accent}45` }}
                        className="rounded-full border bg-[#071524]/85 px-3 py-1 sm:px-3.5 sm:py-1.5 font-mono text-[10px] sm:text-[11px] font-bold text-slate-100 shadow-md backdrop-blur-md transition-transform hover:-translate-y-0.5 hover:scale-105"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            STAGE 3 (0.49 -> 0.78): DEDICATED OFF-CLOCK HOBBIES & CREATIVE FUEL
           ================================================================ */}
        <div
          ref={stage3HobbyRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden bg-[#0D071B] bg-[radial-gradient(circle_at_50%_45%,#3B0764_0%,#17092B_52%,#090514_100%)] px-4 text-white"
          style={{
            clipPath: "polygon(125% 0%, 100% 0%, 100% 100%, 100% 100%)",
            visibility: "hidden",
          }}
        >
          <div className="dot-grid-dark pointer-events-none absolute inset-0 opacity-35" />

          {/* Counter-Racing Sonic Hobby Ribbons */}
          <div
            ref={hobbyRibbon1Ref}
            aria-hidden="true"
            className="pointer-events-none absolute top-[9%] whitespace-nowrap font-display text-6xl sm:text-8xl font-black uppercase tracking-tight text-pink-400/[0.06] select-none will-change-transform"
          >
            ELECTRIC GUITAR • ANALOG SYNTH • 112 BPM SESSIONS • VINYL •
          </div>
          <div
            ref={hobbyRibbon2Ref}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[9%] whitespace-nowrap font-display text-6xl sm:text-8xl font-black uppercase tracking-tight text-amber-300/[0.06] select-none will-change-transform"
          >
            POUR-OVER ESPRESSO • URBAN SKETCHING • CREATIVE SHADERS •
          </div>

          {/* Floating Vinyl Turntable & Espresso Props in Outer Corners */}
          <div
            ref={hobbyVinylRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-[3%] top-[12%] hidden md:block will-change-transform"
          >
            <CodeTurntableProp className="h-36 lg:h-44 w-auto drop-shadow-[0_24px_40px_rgba(0,0,0,0.65)]" />
          </div>
          <div
            ref={hobbyEspressoRef}
            aria-hidden="true"
            className="pointer-events-none absolute right-[5%] bottom-[12%] hidden md:block will-change-transform"
          >
            <CodeEspressoProp className="h-32 lg:h-38 w-auto drop-shadow-[0_24px_40px_rgba(0,0,0,0.65)]" />
          </div>

          {/* Central Off-Clock Hobbies Showcase */}
          <div
            ref={hobbyCenterRef}
            className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center will-change-transform"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-pink-400/40 bg-pink-500/15 px-4 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-pink-300 backdrop-blur-md">
              <Music className="h-3 w-3 text-[#C6FF3D]" />
              <span>04.B // OFF-CLOCK HOBBIES &amp; CREATIVE FUEL</span>
            </span>

            <h3 className="mt-2.5 font-display text-[clamp(1.85rem,6vw,3.8rem)] font-black leading-[0.95] tracking-tight text-white">
              Beyond the Blueprint:{" "}
              <span className="font-serif italic font-normal text-[#FF6B4A]">
                Riffs, Synths &amp; Roast.
              </span>
            </h3>

            <p className="mt-2 max-w-xl text-xs sm:text-sm text-purple-200/80">
              When structural FEA models and TypeScript builds wrap up for the night,
              I recharge through music production, Maj9 guitar sessions, and specialty coffee.
            </p>

            {/* Twin Pill-Shaped Live 4K Vector Hobby Apertures (Zero Rectangular Boxes!) */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              <div className="relative h-28 w-56 sm:h-36 sm:w-72 overflow-hidden rounded-full shadow-[0_20px_55px_rgba(236,72,153,0.32)] ring-2 ring-pink-400/75">
                <CodeMotionScene preset="music-daw-session" compact />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-3 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-pink-200">
                  112 BPM Synth &amp; DAW
                </span>
              </div>

              <div className="relative h-28 w-56 sm:h-36 sm:w-72 overflow-hidden rounded-full shadow-[0_20px_55px_rgba(251,146,60,0.32)] ring-2 ring-amber-400/75">
                <CodeMotionScene preset="guitar-spectrum" compact />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-3 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-200">
                  Electric Guitar Harmonics
                </span>
              </div>
            </div>

            {/* 5 Tactile Curved Hobby Capsules */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-2xl">
              {HOBBY_PILLS.map((hb) => {
                const Icon = hb.icon;
                return (
                  <span
                    key={hb.label}
                    style={{ borderColor: `${hb.color}55` }}
                    className="inline-flex items-center gap-1.5 rounded-full border bg-white/[0.06] px-3.5 py-1.5 font-mono text-[10px] sm:text-[11px] font-bold text-white shadow-lg backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: hb.color }} />
                    <span>{hb.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================================================================
            STAGE 4 (0.75 -> 1.00): WHITE IRIS SUNBURST + POINTER CLICK "STAND OUT"
           ================================================================ */}
        <div
          ref={stage4Ref}
          className="absolute inset-0 z-40 flex items-center justify-center bg-white text-[#07131C]"
          style={{ clipPath: "circle(0% at 50% 92%)", visibility: "hidden" }}
        >
          <div className="relative mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-4 sm:gap-6 px-4 sm:px-6 py-6 sm:py-12 md:grid-cols-12">
            {/* LEFT: Circular Rotating Blueprint Sunburst + Illustrated Character */}
            <div className="relative flex items-center justify-center md:col-span-5">
              <div
                ref={s4PortraitRef}
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
                ref={s4Line1Ref}
                className="font-display text-[clamp(1.5rem,5.5vw,3.5rem)] font-bold tracking-tight text-[#07131C] leading-tight transition-all duration-300"
              >
                I engineer structures &amp; apps
              </p>
              <p
                ref={s4Line2Ref}
                className="font-display text-[clamp(1.5rem,5.5vw,3.5rem)] font-bold tracking-tight text-[#07131C] leading-tight transition-all duration-300"
              >
                built to
              </p>

              <div className="relative mt-2 sm:mt-3 inline-flex items-center">
                <button
                  ref={standOutBtnRef}
                  type="button"
                  onMouseEnter={() => setStandOutDOM(true)}
                  onClick={() => setContactOpen(true)}
                  className="relative rounded-xl sm:rounded-2xl bg-transparent px-4 sm:px-6 py-1 sm:py-1.5 font-display text-[clamp(2rem,8.5vw,4.5rem)] font-black uppercase tracking-tight text-[#07131C] transition-all duration-300 cursor-pointer"
                >
                  STAND OUT
                </button>

                <div
                  ref={standCursorRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -bottom-4 sm:-right-9 sm:-bottom-6 z-30 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ transform: "translate3d(20px, 16px, 0) scale(1.06)" }}
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
