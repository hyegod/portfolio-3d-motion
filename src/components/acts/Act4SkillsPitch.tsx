"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA, type ToolId } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";
import { ToolBadge } from "@/components/ui/ToolBadges";
import { CodeCreatorPortrait } from "@/components/ui/CodeMotionAssets";
import type { SkillsScrollState } from "@/components/three/Skills3DStage";

gsap.registerPlugin(ScrollTrigger);

const Skills3DStage = dynamic(
  () => import("@/components/three/Skills3DStage"),
  { ssr: false }
);

const CORE_TOOLS: ToolId[] = [
  "autocad",
  "revit",
  "typescript",
  "python",
  "figma",
];

interface SpotlightCapability {
  idx: string;
  shortLabel: string;
  heroStat: string;
  title: string;
  spec: string;
}

interface DisciplineChapter {
  id: "civil" | "software" | "design" | "hobbies";
  num: string;
  shortTab: string;
  tapeSticker: string;
  titleBold: string;
  titleItalic: string;
  accentHex: string;
  tools: ToolId[];
  startP: number;
  endP: number;
  jumpRatio: number;
  beats: SpotlightCapability[];
}

const CHAPTERS: DisciplineChapter[] = [
  {
    id: "civil",
    num: "01",
    shortTab: "01 Civil",
    tapeSticker: "01 × STRUCTURAL",
    titleBold: "Civil",
    titleItalic: "& Structural.",
    accentHex: "#F59E0B",
    tools: ["autocad", "revit"],
    startP: 0.115,
    endP: 0.315,
    jumpRatio: 0.159,
    beats: [
      {
        idx: "01",
        shortLabel: "Bridge FEA",
        heroStat: "280m+ Span",
        title: "Long-Span Bridge & Arch FEA",
        spec: "ETABS  •  SAP2000  •  NONLINEAR STAY-CABLE",
      },
      {
        idx: "02",
        shortLabel: "Seismic Core",
        heroStat: "42 Stories",
        title: "High-Rise Seismic Core & Diagrid",
        spec: "MODAL SPECTRUM  •  SNI 1726  •  ACI 318",
      },
      {
        idx: "03",
        shortLabel: "Revit BIM",
        heroStat: "LOD 400",
        title: "BIM & Rebar Clash Coordination",
        spec: "AUTODESK REVIT  •  ZERO-CLASH BAR SCHEDULES",
      },
      {
        idx: "04",
        shortLabel: "Civil 3D",
        heroStat: "18.4 km",
        title: "Corridor & Site Infrastructure",
        spec: "AUTOCAD  •  CIVIL 3D  •  CUT-FILL ALIGNMENTS",
      },
    ],
  },
  {
    id: "software",
    num: "02",
    shortTab: "02 Software",
    tapeSticker: "02 × FULL-STACK",
    titleBold: "Software",
    titleItalic: "& Solvers.",
    accentHex: "#38BDF8",
    tools: ["typescript", "python"],
    startP: 0.315,
    endP: 0.51,
    jumpRatio: 0.35,
    beats: [
      {
        idx: "01",
        shortLabel: "Full-Stack TS",
        heroStat: "Next.js 16",
        title: "Full-Stack TypeScript Architecture",
        spec: "REACT 19  •  STRICT TS  •  SCALABLE NODE APIS",
      },
      {
        idx: "02",
        shortLabel: "Python Solvers",
        heroStat: "< 18ms API",
        title: "Computational Structural Solvers",
        spec: "PYTHON  •  FASTAPI  •  NUMPY / SCIPY MATRICES",
      },
      {
        idx: "03",
        shortLabel: "WebGL 120fps",
        heroStat: "120 FPS",
        title: "Real-Time 3D & WebGL Engines",
        spec: "THREE.JS  •  REACT THREE FIBER  •  GLSL SHADERS",
      },
      {
        idx: "04",
        shortLabel: "BIM Pipeline",
        heroStat: "-75% Time",
        title: "BIM-to-Web Pipeline Automation",
        spec: "REVIT API  •  PYREVIT  •  IFC MESH STREAMING",
      },
    ],
  },
  {
    id: "design",
    num: "03",
    shortTab: "03 UI/UX & 3D",
    tapeSticker: "03 × INTERACTIVE",
    titleBold: "UI/UX",
    titleItalic: "& 3D Motion.",
    accentHex: "#C6FF3D",
    tools: ["figma"],
    startP: 0.51,
    endP: 0.705,
    jumpRatio: 0.545,
    beats: [
      {
        idx: "01",
        shortLabel: "Figma Tokens",
        heroStat: "80+ Tokens",
        title: "Design Systems & Component Kits",
        spec: "FIGMA VARIABLES  •  MULTI-BRAND  •  WCAG AA",
      },
      {
        idx: "02",
        shortLabel: "GSAP Motion",
        heroStat: "60–120 FPS",
        title: "Scroll & Kinetic Motion Direction",
        spec: "GSAP SCROLLTRIGGER  •  LENIS  •  BEZIER PHYSICS",
      },
      {
        idx: "03",
        shortLabel: "Spatial 3D UI",
        heroStat: "WebGL2",
        title: "Spatial 3D & Refractive Interfaces",
        spec: "PROCEDURAL 3D  •  STUDIO LIGHTING  •  GLASS IOR",
      },
      {
        idx: "04",
        shortLabel: "Design-to-Code",
        heroStat: "2× Faster",
        title: "Zero-Handoff Design to Production",
        spec: "FIGMA PROTOTYPE  →  ENGINEERED LIVE BUILD",
      },
    ],
  },
  {
    id: "hobbies",
    num: "04",
    shortTab: "04 Hobbies",
    tapeSticker: "04 × OFF-CLOCK",
    titleBold: "Riffs, Synth",
    titleItalic: "& Roast.",
    accentHex: "#FF6B4A",
    tools: ["music"],
    startP: 0.705,
    endP: 0.85,
    jumpRatio: 0.737,
    beats: [
      {
        idx: "01",
        shortLabel: "Maj9 Guitar",
        heroStat: "Maj9 Riffs",
        title: "Electric Guitar & Late-Night Sessions",
        spec: "NEO-SOUL VOICINGS  •  PEDALBOARD TONE CRAFT",
      },
      {
        idx: "02",
        shortLabel: "112 BPM Synth",
        heroStat: "112 BPM",
        title: "Analog Synth & DAW Beatmaking",
        spec: "INSTRUMENTAL LAYERING  •  DRUM GROOVE DESIGN",
      },
      {
        idx: "03",
        shortLabel: "V60 & Espresso",
        heroStat: "93°C • 1:15",
        title: "Specialty V60 & Espresso Dialing",
        spec: "SINGLE-ORIGIN POUR-OVER  •  MORNING RISTRETTO",
      },
      {
        idx: "04",
        shortLabel: "Urban Sketch",
        heroStat: "0.1mm Ink",
        title: "Urban Architectural Sketching",
        spec: "FINE-LINER PERSPECTIVE  •  BRIDGES & TRUSSES",
      },
    ],
  },
];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutBack(x: number) {
  const c1 = 1.85;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

const STAND_LIT = [
  "bg-[#1D4ED8]",
  "shadow-[0_20px_50px_rgba(29,78,216,0.5)]",
  "-rotate-1",
  "scale-105",
  "ring-4",
  "ring-[#C6FF3D]/80",
];

/**
 * Act 4 — Cardless 3D Cinema Flythrough & Frameless Kinetic Super-Titles (760vh)
 * Zero SaaS/CV progress-bar cards! Every discipline uses unobstructed 3D Cinema Camera
 * Choreography paired with colossal, frameless editorial typography & tilted tape stickers.
 */
export function Act4SkillsPitch() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  const skillsScrollRef = useRef<SkillsScrollState>({
    progress: 0,
    pointerX: 0,
    pointerY: 0,
    activeRow: 0,
  });

  // Minimal Chapter Switcher, 3D Canvas & Synchronized Midpoint Transition Curtain/FX refs
  const hudNavRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const canvasLayerRef = useRef<HTMLDivElement>(null);
  const scanlineFxRef = useRef<HTMLDivElement>(null);
  const apertureRingFxRef = useRef<HTMLDivElement>(null);
  const cyberCurtainRef = useRef<HTMLDivElement>(null);
  const laserSweepFxRef = useRef<HTMLDivElement>(null);
  const glitchWrapFxRef = useRef<HTMLDivElement>(null);
  const glitchBarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prismCurtainRef = useRef<HTMLDivElement>(null);
  const prismSlashFxRef = useRef<HTMLDivElement>(null);
  const vinylDomeRef = useRef<HTMLDivElement>(null);
  const vinylRippleFxRef = useRef<HTMLDivElement>(null);
  const stageCurtainWrapRef = useRef<HTMLDivElement>(null);
  const stageCurtainLeftRef = useRef<HTMLDivElement>(null);
  const stageCurtainRightRef = useRef<HTMLDivElement>(null);

  // Beat 0: Dynamic Kinetic 45+ Intro refs
  const bg0Ref = useRef<HTMLDivElement>(null);
  const introMarqueeTopRef = useRef<HTMLDivElement>(null);
  const introMarqueeBotRef = useRef<HTMLDivElement>(null);
  const introKickerRef = useRef<HTMLDivElement>(null);
  const numStageRef = useRef<HTMLDivElement>(null);
  const giantNumMainRef = useRef<HTMLSpanElement>(null);
  const giantNumLimeEchoRef = useRef<HTMLSpanElement>(null);
  const giantNumCyanEchoRef = useRef<HTMLSpanElement>(null);
  const s0TopLineRef = useRef<HTMLDivElement>(null);
  const s0BotLineRef = useRef<HTMLDivElement>(null);
  const introBadgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introChipLeftRef = useRef<HTMLDivElement>(null);
  const introChipRightRef = useRef<HTMLDivElement>(null);

  // Beats 1..4: Frameless Editorial Headers + Spotlight Super-Titles + Minimal Beat Ticks
  const bgChapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fgChapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spotlightWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beatSlideRefs = useRef<(HTMLDivElement | null)[][]>([[], [], [], []]);
  const beatTickRefs = useRef<(HTMLButtonElement | null)[][]>([[], [], [], []]);
  const beatPillRefs = useRef<(HTMLSpanElement | null)[][]>([[], [], [], []]);

  // Beat 5: Classic White Circular Iris Wipe + "STAND OUT" Finale refs
  const stageFinaleRef = useRef<HTMLDivElement>(null);
  const finalePortraitRef = useRef<HTMLDivElement>(null);
  const finaleLine1Ref = useRef<HTMLParagraphElement>(null);
  const finaleLine2Ref = useRef<HTMLParagraphElement>(null);
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
      btn.style.color = lit ? "#FFFFFF" : "#07131C";
      if (lit) {
        btn.classList.remove("bg-transparent");
        btn.classList.add(...STAND_LIT);
      } else {
        btn.classList.remove(...STAND_LIT);
        btn.classList.add("bg-transparent");
      }
    }
    if (standCursorRef.current) {
      standCursorRef.current.style.transform = lit
        ? "translate3d(-10px, -8px, 0) scale(0.85)"
        : "translate3d(18px, 14px, 0) scale(1.05)";
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: "250px 0px" }
    );
    observer.observe(section);

    let lastLitTab = -1;

    const ctx = gsap.context(() => {
      const applyIntroEntrance = (ep: number, pinnedP: number) => {
        const spNum = easeOutBack(clamp01(ep / 0.72));
        const targetVal = Math.round(
          clamp01(ep / 0.78) * PORTFOLIO_DATA.skillsSection.primaryStatTarget
        );
        const textVal = `${targetVal}+`;

        if (giantNumMainRef.current) giantNumMainRef.current.textContent = textVal;
        if (giantNumLimeEchoRef.current) giantNumLimeEchoRef.current.textContent = textVal;
        if (giantNumCyanEchoRef.current) giantNumCyanEchoRef.current.textContent = textVal;

        const exitSplit = clamp01((pinnedP - 0.06) / 0.055);

        if (introMarqueeTopRef.current) {
          introMarqueeTopRef.current.style.transform = `translate3d(${(180 - ep * 260 - pinnedP * 900).toFixed(1)}px, 0, 0) skewX(-10deg)`;
        }
        if (introMarqueeBotRef.current) {
          introMarqueeBotRef.current.style.transform = `translate3d(${(-180 + ep * 260 + pinnedP * 900).toFixed(1)}px, 0, 0) skewX(-10deg)`;
        }

        if (introKickerRef.current) {
          const kSp = easeOutBack(clamp01((ep - 0.08) / 0.55));
          introKickerRef.current.style.opacity = (
            clamp01(ep * 2.4) *
            (1 - exitSplit)
          ).toFixed(3);
          introKickerRef.current.style.transform = `translate3d(0, ${((1 - kSp) * -36 - exitSplit * 45).toFixed(1)}px, 0) scale(${(0.78 + kSp * 0.22).toFixed(3)})`;
        }

        if (numStageRef.current) {
          const dropY = (1 - spNum) * 95;
          const tilt = (1 - spNum) * -9;
          const zoom = (0.42 + spNum * 0.58) * (1 + exitSplit * 0.72);
          numStageRef.current.style.opacity = (
            clamp01(ep * 2.8) *
            (1 - exitSplit)
          ).toFixed(3);
          numStageRef.current.style.transform = `translate3d(0, ${dropY.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${zoom.toFixed(3)})`;
        }

        const spreadEcho = (1 - clamp01(ep / 0.85)) * 26 + exitSplit * 34;
        if (giantNumLimeEchoRef.current) {
          giantNumLimeEchoRef.current.style.transform = `translate3d(${(-8 - spreadEcho).toFixed(1)}px, ${(6 + spreadEcho * 0.5).toFixed(1)}px, 0)`;
        }
        if (giantNumCyanEchoRef.current) {
          giantNumCyanEchoRef.current.style.transform = `translate3d(${(8 + spreadEcho).toFixed(1)}px, ${(-6 - spreadEcho * 0.5).toFixed(1)}px, 0)`;
        }

        const lineT = easeOutBack(clamp01((ep - 0.18) / 0.65));
        if (s0TopLineRef.current) {
          const x1 = (1 - lineT) * -185 - exitSplit * 310;
          const sk1 = (1 - lineT) * 16 - exitSplit * 14;
          s0TopLineRef.current.style.opacity = clamp01((ep - 0.15) * 3).toFixed(3);
          s0TopLineRef.current.style.transform = `translate3d(${x1.toFixed(1)}px, 0, 0) skewX(${sk1.toFixed(1)}deg)`;
        }
        if (s0BotLineRef.current) {
          const x2 = (1 - lineT) * 185 + exitSplit * 310;
          const sk2 = (1 - lineT) * -16 + exitSplit * 14;
          s0BotLineRef.current.style.opacity = clamp01((ep - 0.2) * 3).toFixed(3);
          s0BotLineRef.current.style.transform = `translate3d(${x2.toFixed(1)}px, 0, 0) skewX(${sk2.toFixed(1)}deg)`;
        }

        if (introChipLeftRef.current && introChipRightRef.current) {
          const chSp = easeOutBack(clamp01((ep - 0.28) / 0.58));
          const chOp = clamp01((ep - 0.28) * 3) * (1 - exitSplit * 1.4);
          introChipLeftRef.current.style.opacity = Math.max(0, chOp).toFixed(3);
          introChipLeftRef.current.style.transform = `translate3d(${((1 - chSp) * -70 - exitSplit * 120).toFixed(1)}px, ${(Math.sin(ep * Math.PI) * -8).toFixed(1)}px, 0) rotate(-6deg) scale(${Math.max(0.2, chSp).toFixed(3)})`;
          introChipRightRef.current.style.opacity = Math.max(0, chOp).toFixed(3);
          introChipRightRef.current.style.transform = `translate3d(${((1 - chSp) * 70 + exitSplit * 120).toFixed(1)}px, ${(Math.sin(ep * Math.PI) * 8).toFixed(1)}px, 0) rotate(6deg) scale(${Math.max(0.2, chSp).toFixed(3)})`;
        }

        const tilts = [-9, 6, -4, 7, -6];
        for (let i = 0; i < CORE_TOOLS.length; i++) {
          const bEl = introBadgeRefs.current[i];
          if (!bEl) continue;
          const bT = clamp01((ep - 0.3 - i * 0.065) / 0.45);
          const bSp = easeOutBack(bT);
          const yOff = (1 - bSp) * 58 + exitSplit * 65;
          const rot = (1 - bSp) * tilts[i] * 2.2;
          bEl.style.opacity = (clamp01(bT * 3) * (1 - exitSplit)).toFixed(3);
          bEl.style.transform = `translate3d(0, ${yOff.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${Math.max(0.1, bSp).toFixed(3)})`;
        }
      };

      let currentEntranceP = 0;
      let currentPinnedP = 0;

      const entranceSt = ScrollTrigger.create({
        trigger: section,
        start: "top 88%",
        end: "top top",
        scrub: 0.2,
        onUpdate: (self) => {
          currentEntranceP = self.progress;
          applyIntroEntrance(currentEntranceP, currentPinnedP);
        },
      });

      const applyProgress = (p: number) => {
        currentPinnedP = p;
        skillsScrollRef.current.progress = p;
        applyIntroEntrance(p > 0.001 ? 1 : entranceSt.progress, p);

        const irisP = clamp01((p - 0.835) / 0.105);
        const navVis =
          clamp01((p - 0.13) / 0.025) * (1 - clamp01((p - 0.825) / 0.025));

        const activeChIdx =
          p < 0.315 ? 0 : p < 0.51 ? 1 : p < 0.705 ? 2 : 3;

        // ====================================================================
        // SYNCHRONIZED MIDPOINT TRANSITION TIMELINES (WEIGHTED CINEMA PACING)
        // - Cut 0 (Intro -> 01 Civil): Masked Blueprint Aperture Iris (0.095 -> 0.155, ~53vh)
        // - Cut 1 (01 Civil -> 02 Software): Straddles 0.315 (0.285 -> 0.345, ~53vh); swap at u1 = 0.5!
        // - Cut 2 (02 Software -> 03 UI/UX): Straddles 0.510 (0.480 -> 0.540, ~53vh); swap at u2 = 0.5!
        // - Cut 3 (03 UI/UX -> 04 Hobbies):  Straddles 0.705 (0.677 -> 0.733, ~49vh); swap at u3 = 0.5!
        // ====================================================================
        const w0 = easeInOutCubic(clamp01((p - 0.095) / 0.06));
        const inCut0 = p >= 0.095 && p < 0.155;
        const fx0 = inCut0 ? Math.sin(w0 * Math.PI) : 0;

        const u1 = clamp01((p - 0.285) / 0.06);
        const inCut1 = p > 0.285 && p < 0.345;
        const fx1Glitch = inCut1 ? Math.sin(u1 * Math.PI) : 0;

        const u2 = clamp01((p - 0.48) / 0.06);
        const inCut2 = p > 0.48 && p < 0.54;
        const fx2Env = inCut2 ? Math.sin(u2 * Math.PI) : 0;

        const u3 = clamp01((p - 0.677) / 0.056);
        const inCut3 = p > 0.677 && p < 0.733;
        const fx3Env = inCut3 ? Math.sin(u3 * Math.PI) : 0;

        const show3D = p >= 0.095 && irisP < 0.98;
        if (canvasLayerRef.current) {
          canvasLayerRef.current.style.opacity = show3D ? "1" : "0";
          canvasLayerRef.current.style.visibility = show3D ? "visible" : "hidden";
          // Cut 0 clips the 3D canvas TOGETHER with the amber sky & Civil title inside the aperture!
          canvasLayerRef.current.style.clipPath = inCut0
            ? `circle(${(w0 * 150).toFixed(1)}% at 50% 50%)`
            : "none";

          // Distinct 3D canvas spatial transition momentum synced around exact cut midpoints
          if (fx1Glitch > 0.01) {
            const jitterX = Math.sin(p * 640) * fx1Glitch * 14;
            const skew = Math.cos(p * 480) * fx1Glitch * 4.5;
            const scX = 1 + fx1Glitch * 0.04;
            canvasLayerRef.current.style.transform = `translate3d(${jitterX.toFixed(1)}px, 0, 0) skewX(${skew.toFixed(2)}deg) scaleX(${scX.toFixed(3)})`;
          } else if (fx2Env > 0.01) {
            const dir = u2 < 0.5 ? -1 : 1;
            const rotY = dir * fx2Env * 11;
            const sc = 1 - fx2Env * 0.045;
            canvasLayerRef.current.style.transform = `perspective(1100px) rotateY(${rotY.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
          } else if (fx3Env > 0.01) {
            const sc = 1 + fx3Env * 0.06;
            const rot = (u3 < 0.5 ? -1 : 1) * fx3Env * 1.5;
            canvasLayerRef.current.style.transform = `scale(${sc.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
          } else {
            canvasLayerRef.current.style.transform = "none";
          }
        }
        if (hudNavRef.current) {
          hudNavRef.current.style.opacity = navVis.toFixed(3);
          hudNavRef.current.style.visibility =
            navVis > 0.005 ? "visible" : "hidden";
        }

        // CRT Scanline Sweep Veil (dark/cyan texture across cuts 1, 2, 3 — zero white flash!)
        if (scanlineFxRef.current) {
          const scanStrength = Math.max(
            fx1Glitch * 0.92,
            fx2Env * 0.45,
            fx3Env * 0.55
          );
          if (scanStrength <= 0.01) {
            scanlineFxRef.current.style.visibility = "hidden";
            scanlineFxRef.current.style.opacity = "0";
          } else {
            scanlineFxRef.current.style.visibility = "visible";
            scanlineFxRef.current.style.opacity = scanStrength.toFixed(3);
            const yShift = ((p * 2400) % 24).toFixed(1);
            scanlineFxRef.current.style.backgroundPosition = `0 ${yShift}px`;
          }
        }

        // FX 0: Blueprint Amber Aperture Ring (Intro -> 01 Civil, synced with circular clipPath!)
        if (apertureRingFxRef.current) {
          if (fx0 <= 0.01) {
            apertureRingFxRef.current.style.visibility = "hidden";
            apertureRingFxRef.current.style.opacity = "0";
          } else {
            const r = w0 * 150;
            const rInner = Math.max(0, r - 4.5).toFixed(1);
            const rLime = Math.max(0, r - 1.2).toFixed(1);
            const rPeak = r.toFixed(1);
            const rOuter = (r + 3.2).toFixed(1);
            apertureRingFxRef.current.style.visibility = "visible";
            apertureRingFxRef.current.style.opacity = fx0.toFixed(3);
            apertureRingFxRef.current.style.backgroundImage = `radial-gradient(circle at 50% 50%, transparent ${rInner}%, rgba(198,255,61,0.5) ${rLime}%, rgba(245,158,11,0.94) ${rPeak}%, transparent ${rOuter}%)`;
          }
        }

        // FX 1: Cyber Terminal Laser Shutter + Chromatic RGB Glitch (01 Civil -> 02 Software)
        // Phase A (u1 <= 0.5): sweeps IN left->right covering Civil; swap happens at u1 = 0.5 (p = 0.315)
        // Phase B (u1 > 0.5): sweeps OFF left->right uncovering Software!
        if (cyberCurtainRef.current && laserSweepFxRef.current) {
          if (!inCut1) {
            cyberCurtainRef.current.style.visibility = "hidden";
            laserSweepFxRef.current.style.visibility = "hidden";
            laserSweepFxRef.current.style.opacity = "0";
          } else {
            cyberCurtainRef.current.style.visibility = "visible";
            if (u1 <= 0.5) {
              const tIn = easeInOutCubic(u1 * 2);
              const rightPct = ((1 - tIn) * 100).toFixed(1);
              cyberCurtainRef.current.style.clipPath = `inset(0 ${rightPct}% 0 0)`;
              const beamOp = Math.sin(tIn * Math.PI);
              laserSweepFxRef.current.style.visibility = beamOp > 0.01 ? "visible" : "hidden";
              laserSweepFxRef.current.style.opacity = beamOp.toFixed(3);
              laserSweepFxRef.current.style.left = `${(tIn * 100).toFixed(2)}%`;
            } else {
              const tOut = easeInOutCubic((u1 - 0.5) * 2);
              const leftPct = (tOut * 100).toFixed(1);
              cyberCurtainRef.current.style.clipPath = `inset(0 0 0 ${leftPct}%)`;
              const beamOp = Math.sin(tOut * Math.PI);
              laserSweepFxRef.current.style.visibility = beamOp > 0.01 ? "visible" : "hidden";
              laserSweepFxRef.current.style.opacity = beamOp.toFixed(3);
              laserSweepFxRef.current.style.left = `${(tOut * 100).toFixed(2)}%`;
            }
          }
        }

        if (glitchWrapFxRef.current) {
          if (fx1Glitch <= 0.01) {
            glitchWrapFxRef.current.style.visibility = "hidden";
            glitchWrapFxRef.current.style.opacity = "0";
          } else {
            glitchWrapFxRef.current.style.visibility = "visible";
            glitchWrapFxRef.current.style.opacity = fx1Glitch.toFixed(3);
            for (let g = 0; g < 5; g++) {
              const bar = glitchBarRefs.current[g];
              if (!bar) continue;
              const phase = Math.sin(p * (390 + g * 85) + g * 2.1);
              const tx = phase * (32 + g * 12) * fx1Glitch;
              const sx = 0.55 + Math.abs(Math.cos(p * 310 + g * 1.4)) * 0.65;
              bar.style.transform = `translate3d(${tx.toFixed(1)}px, 0, 0) scaleX(${sx.toFixed(3)})`;
            }
          }
        }

        // FX 2: 45° Diagonal Glass Prism Sheet + Prismatic Refraction Blade (02 Software -> 03 UI/UX & 3D)
        // Phase A (u2 <= 0.5): slashes IN top-left -> bottom-right over Software; swap at u2 = 0.5 (p = 0.510)
        // Phase B (u2 > 0.5): clears OUT top-left -> bottom-right unveiling UI/UX & 3D!
        if (prismCurtainRef.current && prismSlashFxRef.current) {
          if (!inCut2) {
            prismCurtainRef.current.style.visibility = "hidden";
            prismSlashFxRef.current.style.visibility = "hidden";
            prismSlashFxRef.current.style.opacity = "0";
          } else {
            prismCurtainRef.current.style.visibility = "visible";
            let bladePos = 0;
            let bladeOp = 0;
            if (u2 <= 0.5) {
              const tIn = easeInOutCubic(u2 * 2);
              const s = tIn * 200;
              const p2x = Math.min(100, s).toFixed(1);
              const p3y = Math.max(0, s - 100).toFixed(1);
              const p4x = Math.max(0, s - 100).toFixed(1);
              const p5y = Math.min(100, s).toFixed(1);
              prismCurtainRef.current.style.clipPath = `polygon(0% 0%, ${p2x}% 0%, ${p2x}% ${p3y}%, ${p4x}% ${p5y}%, 0% ${p5y}%)`;
              bladePos = tIn * 100;
              bladeOp = Math.sin(tIn * Math.PI);
            } else {
              const tOut = easeInOutCubic((u2 - 0.5) * 2);
              const s = tOut * 200;
              const aX = Math.min(100, s).toFixed(1);
              const aY = Math.max(0, s - 100).toFixed(1);
              const bX = Math.max(0, s - 100).toFixed(1);
              const bY = Math.min(100, s).toFixed(1);
              prismCurtainRef.current.style.clipPath = `polygon(${aX}% ${aY}%, 100% ${aY}%, 100% 100%, ${bX}% 100%, ${bX}% ${bY}%)`;
              bladePos = tOut * 100;
              bladeOp = Math.sin(tOut * Math.PI);
            }

            if (bladeOp <= 0.01) {
              prismSlashFxRef.current.style.visibility = "hidden";
              prismSlashFxRef.current.style.opacity = "0";
            } else {
              const c0 = Math.max(0, bladePos - 9).toFixed(1);
              const c1 = Math.max(0, bladePos - 3.2).toFixed(1);
              const c2 = bladePos.toFixed(1);
              const c3 = Math.min(100, bladePos + 3.2).toFixed(1);
              const c4 = Math.min(100, bladePos + 9.5).toFixed(1);
              prismSlashFxRef.current.style.visibility = "visible";
              prismSlashFxRef.current.style.opacity = (bladeOp * 0.95).toFixed(3);
              prismSlashFxRef.current.style.backgroundImage = `linear-gradient(to bottom right, transparent ${c0}%, rgba(56,189,248,0.6) ${c1}%, rgba(198,255,61,0.96) ${c2}%, rgba(168,85,247,0.64) ${c3}%, transparent ${c4}%)`;
            }
          }
        }

        // FX 3: Bottom Vinyl Spotlight Dome -> Twin Stage Curtains Parting (03 UI/UX & 3D -> 04 Hobbies)
        // Phase A (u3 <= 0.5): dark stage dome blooms up from 50% 100% over UI/UX; swap at u3 = 0.5 (p = 0.705)
        // Phase B (u3 > 0.5): twin midnight curtains part open horizontally revealing Hobbies stage!
        if (
          vinylDomeRef.current &&
          vinylRippleFxRef.current &&
          stageCurtainWrapRef.current &&
          stageCurtainLeftRef.current &&
          stageCurtainRightRef.current
        ) {
          if (!inCut3) {
            vinylDomeRef.current.style.visibility = "hidden";
            vinylRippleFxRef.current.style.visibility = "hidden";
            vinylRippleFxRef.current.style.opacity = "0";
            stageCurtainWrapRef.current.style.visibility = "hidden";
          } else if (u3 <= 0.5) {
            const tIn = easeInOutCubic(u3 * 2);
            const r = tIn * 150;
            vinylDomeRef.current.style.visibility = "visible";
            vinylDomeRef.current.style.clipPath = `circle(${r.toFixed(1)}% at 50% 100%)`;
            stageCurtainWrapRef.current.style.visibility = "hidden";

            const ripOp = Math.sin(tIn * Math.PI);
            if (ripOp <= 0.01) {
              vinylRippleFxRef.current.style.visibility = "hidden";
              vinylRippleFxRef.current.style.opacity = "0";
            } else {
              const g1a = Math.max(0, r - 18).toFixed(1);
              const g1b = Math.max(0, r - 16.2).toFixed(1);
              const g1c = Math.max(0, r - 14.4).toFixed(1);
              const g2a = Math.max(0, r - 9.5).toFixed(1);
              const g2b = Math.max(0, r - 7.8).toFixed(1);
              const g2c = Math.max(0, r - 6.0).toFixed(1);
              const rA = Math.max(0, r - 3.0).toFixed(1);
              const rB = r.toFixed(1);
              const rC = (r + 3.8).toFixed(1);
              vinylRippleFxRef.current.style.visibility = "visible";
              vinylRippleFxRef.current.style.opacity = (ripOp * 0.94).toFixed(3);
              vinylRippleFxRef.current.style.backgroundImage = `radial-gradient(circle at 50% 100%, transparent ${g1a}%, rgba(192,132,252,0.38) ${g1b}%, transparent ${g1c}%, transparent ${g2a}%, rgba(255,107,74,0.52) ${g2b}%, transparent ${g2c}%, transparent ${rA}%, rgba(255,107,74,0.95) ${rB}%, transparent ${rC}%)`;
            }
          } else {
            const tOut = easeInOutCubic((u3 - 0.5) * 2);
            const shift = (tOut * 105).toFixed(2);
            vinylDomeRef.current.style.visibility = "hidden";
            vinylRippleFxRef.current.style.visibility = "hidden";
            vinylRippleFxRef.current.style.opacity = "0";
            stageCurtainWrapRef.current.style.visibility = "visible";
            stageCurtainLeftRef.current.style.transform = `translate3d(-${shift}%, 0, 0)`;
            stageCurtainRightRef.current.style.transform = `translate3d(${shift}%, 0, 0)`;
          }
        }

        if (activeChIdx !== lastLitTab) {
          lastLitTab = activeChIdx;
          CHAPTERS.forEach((ch, idx) => {
            const btn = tabBtnRefs.current[idx];
            if (!btn) return;
            if (idx === activeChIdx) {
              btn.style.backgroundColor = ch.accentHex;
              btn.style.color = "#07131C";
              btn.style.opacity = "1";
              btn.style.transform = "scale(1.04)";
            } else {
              btn.style.backgroundColor = "transparent";
              btn.style.color = "#FFFFFF";
              btn.style.opacity = "0.52";
              btn.style.transform = "scale(1)";
            }
          });
        }

        // Keep Beat 0 white backdrop cleanly underneath until Cut 0's aperture finishes expanding!
        const s0Fade = clamp01((p - 0.15) / 0.015);
        if (bg0Ref.current) {
          bg0Ref.current.style.opacity = (1 - s0Fade).toFixed(3);
          bg0Ref.current.style.visibility =
            s0Fade >= 0.995 ? "hidden" : "visible";
        }

        const isDesktop = window.innerWidth >= 1024;

        // ====================================================================
        // BEATS 1..4: CARDLESS CINEMA SUPER-TITLES + 4 DISTINCT CAMERA FLIGHTS
        // ====================================================================
        CHAPTERS.forEach((ch, cIdx) => {
          const isCurrent =
            cIdx === 0
              ? p >= 0.095 && p < 0.315
              : cIdx === 1
                ? p >= 0.315 && p < 0.51
                : cIdx === 2
                  ? p >= 0.51 && p < 0.705
                  : p >= 0.705 && irisP < 0.98;

          const local = clamp01((p - ch.startP) / (ch.endP - ch.startP));
          const bgEl = bgChapterRefs.current[cIdx];
          const fgEl = fgChapterRefs.current[cIdx];
          const headerEl = headerRefs.current[cIdx];
          const spotEl = spotlightWrapRefs.current[cIdx];

          if (bgEl) {
            if (!isCurrent) {
              bgEl.style.visibility = "hidden";
              bgEl.style.clipPath = "none";
            } else {
              bgEl.style.visibility = "visible";
              // Cut 0 clips Civil's sky in exact lockstep with canvasLayerRef & fgChapterRefs[0]!
              // Cuts 1..3 swap seamlessly behind the z-[44] synchronized midpoint curtains!
              bgEl.style.clipPath =
                cIdx === 0 && inCut0
                  ? `circle(${(w0 * 150).toFixed(1)}% at 50% 50%)`
                  : "none";
            }
          }

          if (fgEl) {
            const fgOp = !isCurrent
              ? 0
              : cIdx === 3
                ? 1 - clamp01((irisP - 0.25) / 0.5)
                : 1;

            if (fgOp <= 0.005) {
              fgEl.style.visibility = "hidden";
              fgEl.style.opacity = "0";
              fgEl.style.clipPath = "none";
            } else {
              fgEl.style.visibility = "visible";
              fgEl.style.opacity = fgOp.toFixed(3);
              fgEl.style.clipPath =
                cIdx === 0 && inCut0
                  ? `circle(${(w0 * 150).toFixed(1)}% at 50% 50%)`
                  : "none";

              // Distinct spatial entrance & continuous parallax motion per chapter!
              const enterT = easeInOutCubic(clamp01(local / 0.24));
              const enterRem = 1 - enterT;

              if (headerEl && spotEl) {
                if (cIdx === 0) {
                  // Civil: Architectural elevation slide
                  const hY = (isDesktop ? (0.5 - local) * 34 : 0) - enterRem * 30;
                  const sY = (isDesktop ? (0.5 - local) * -28 : 0) + enterRem * 24;
                  headerEl.style.transform = `translate3d(0, ${hY.toFixed(1)}px, 0)`;
                  headerEl.style.textShadow = "none";
                  spotEl.style.transform = `translate3d(0, ${sY.toFixed(1)}px, 0)`;
                } else if (cIdx === 1) {
                  // Software: Horizontal terminal glitch-snap + chromatic RGB split shadow on entry
                  const zPush = isDesktop ? Math.sin(local * Math.PI) * 18 : 0;
                  const glitchX = enterRem * -48 + Math.sin(p * 520) * enterRem * 7;
                  const rgbOff = (enterRem * 4.5).toFixed(1);
                  headerEl.style.transform = `translate3d(${(zPush + glitchX).toFixed(1)}px, 0, 0) skewX(${(enterRem * -8).toFixed(1)}deg)`;
                  headerEl.style.textShadow =
                    enterRem > 0.04
                      ? `${rgbOff}px 0 rgba(56,189,248,0.85), -${rgbOff}px 0 rgba(244,63,94,0.85)`
                      : "none";
                  spotEl.style.transform = `translate3d(${(-zPush + enterRem * 36).toFixed(1)}px, 0, 0)`;
                } else if (cIdx === 2) {
                  // UI/UX & 3D: Spatial perspective 3D tilt-in
                  const hX = isDesktop ? (local - 0.5) * 55 : 0;
                  const sX = isDesktop ? (0.5 - local) * 65 : 0;
                  headerEl.style.transform = `perspective(900px) translate3d(${(hX - enterRem * 26).toFixed(1)}px, ${(enterRem * -14).toFixed(1)}px, 0) rotateX(${(enterRem * 24).toFixed(1)}deg)`;
                  headerEl.style.textShadow = "none";
                  spotEl.style.transform = `perspective(900px) translate3d(${(sX + enterRem * 26).toFixed(1)}px, 0, 0) rotateX(${(enterRem * -16).toFixed(1)}deg)`;
                } else {
                  // Hobbies: Warm organic vinyl stage bloom
                  const hY = (isDesktop ? (0.5 - local) * 32 : 0) + enterRem * 24;
                  const sY = (isDesktop ? (0.5 - local) * -32 : 0) + enterRem * 20;
                  const sc = 0.9 + enterT * 0.1;
                  headerEl.style.transform = `translate3d(0, ${hY.toFixed(1)}px, 0) rotate(${(enterRem * 3).toFixed(1)}deg) scale(${sc.toFixed(3)})`;
                  headerEl.style.textShadow = "none";
                  spotEl.style.transform = `translate3d(0, ${sY.toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
                }
              }

              // Continuous analog scroll-drum across the 4 frameless Spotlight Super-Titles (0.0 -> 3.0)
              // Framed cleanly between the wider incoming & outgoing cut curtains (local 0.20 -> 0.84)!
              const beatLocal = clamp01((local - 0.2) / 0.64);
              const beatFloat = beatLocal * 3;
              const activeBeat = Math.min(3, Math.round(beatFloat));
              if (activeChIdx === cIdx) {
                skillsScrollRef.current.activeRow = activeBeat;
              }

              for (let bIdx = 0; bIdx < 4; bIdx++) {
                const slide = beatSlideRefs.current[cIdx]?.[bIdx];
                const tick = beatTickRefs.current[cIdx]?.[bIdx];
                const pill = beatPillRefs.current[cIdx]?.[bIdx];

                const d = bIdx - beatFloat;
                const absD = Math.abs(d);

                if (slide) {
                  if (absD >= 0.54) {
                    slide.style.opacity = "0";
                    slide.style.visibility = "hidden";
                  } else {
                    const norm =
                      absD <= 0.28 ? 1 : 1 - (absD - 0.28) / 0.26;
                    const eased = norm * norm * (3 - 2 * norm);
                    let transform = "";
                    let textShadow = "none";

                    if (cIdx === 0) {
                      // Civil & Structural — vertical film-roll drum + skewX (blueprint paper feel)
                      const yShift = absD <= 0.16 ? 0 : d * 52;
                      const skew = absD <= 0.16 ? 0 : d * -12;
                      const sc = 0.93 + eased * 0.07;
                      transform = `translate3d(0, ${yShift.toFixed(1)}px, 0) skewX(${skew.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
                    } else if (cIdx === 1) {
                      // Software & Solvers — horizontal code-scroll swipe + live RGB chromatic split while moving!
                      const xShift = absD <= 0.16 ? 0 : d * -95;
                      const yShift = absD <= 0.16 ? 0 : d * 12;
                      const sc = 0.92 + eased * 0.08;
                      const rgbSplit = absD <= 0.16 ? 0 : Math.min(5, absD * 10);
                      if (rgbSplit > 0.3) {
                        textShadow = `${rgbSplit.toFixed(1)}px 0 rgba(56,189,248,0.85), -${rgbSplit.toFixed(1)}px 0 rgba(244,63,94,0.85)`;
                      }
                      transform = `translate3d(${xShift.toFixed(1)}px, ${yShift.toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
                    } else if (cIdx === 2) {
                      // UI/UX & 3D — perspective rotateX flip (like a spatial card turning in 3D)
                      const rotX = absD <= 0.16 ? 0 : d * 28;
                      const yShift = absD <= 0.16 ? 0 : d * 22;
                      const sc = 0.94 + eased * 0.06;
                      transform = `perspective(900px) translate3d(0, ${yShift.toFixed(1)}px, 0) rotateX(${rotX.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
                    } else {
                      // Hobbies — vinyl spin-in: scale pulse + slight rotation (organic, laid-back)
                      const sc = 0.68 + eased * 0.32;
                      const rot = absD <= 0.16 ? 0 : d * -9;
                      const yShift = absD <= 0.16 ? 0 : d * 30;
                      transform = `translate3d(0, ${yShift.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
                    }

                    slide.style.visibility = "visible";
                    slide.style.opacity = eased.toFixed(3);
                    slide.style.transform = transform;
                    slide.style.textShadow = textShadow;
                  }
                }

                const isBeatActive = bIdx === activeBeat;
                if (tick) {
                  tick.style.opacity = isBeatActive ? "1" : "0.38";
                  tick.style.transform = isBeatActive
                    ? "translate3d(0, -2px, 0)"
                    : "translate3d(0, 0, 0)";
                }
                if (pill) {
                  pill.style.backgroundColor = isBeatActive
                    ? ch.accentHex
                    : "rgba(255,255,255,0.14)";
                  pill.style.color = isBeatActive ? "#07131C" : "#FFFFFF";
                }
              }
            }
          }
        });

        // ====================================================================
        // BEAT 5 (0.835 -> 1.00): WHITE CIRCULAR IRIS WIPE + "STAND OUT"
        // ====================================================================
        if (stageFinaleRef.current) {
          const rad = irisP * 148;
          stageFinaleRef.current.style.clipPath = `circle(${rad.toFixed(1)}% at 50% 92%)`;
          stageFinaleRef.current.style.opacity = irisP > 0.005 ? "1" : "0";
          stageFinaleRef.current.style.visibility =
            irisP > 0.005 ? "visible" : "hidden";
          stageFinaleRef.current.style.pointerEvents =
            irisP > 0.45 ? "auto" : "none";
        }
        if (irisP > 0.005) {
          const pScale = 0.72 + irisP * 0.28;
          if (finalePortraitRef.current) {
            finalePortraitRef.current.style.transform = `scale(${pScale.toFixed(3)})`;
          }
          if (finaleLine1Ref.current) {
            const show1 = p > 0.88;
            finaleLine1Ref.current.style.opacity = show1 ? "1" : "0.2";
            finaleLine1Ref.current.style.transform = show1
              ? "translate3d(0, 0, 0)"
              : "translate3d(0, 18px, 0)";
          }
          if (finaleLine2Ref.current) {
            const show2 = p > 0.905;
            finaleLine2Ref.current.style.opacity = show2 ? "1" : "0.2";
            finaleLine2Ref.current.style.transform = show2
              ? "translate3d(0, 0, 0)"
              : "translate3d(0, 18px, 0)";
          }
          setStandOutDOM(p > 0.925);
        } else {
          setStandOutDOM(false);
        }
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.55,
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

      currentEntranceP = entranceSt.progress;
      applyProgress(st.progress);
    }, section);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, [setActiveChapter, setLetterboxActive]);

  const jumpToRatio = (ratio: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const absTop = window.scrollY + rect.top;
    const travel = Math.max(0, el.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: absTop + travel * ratio,
      behavior: "smooth",
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    const ny = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
    skillsScrollRef.current.pointerX = nx;
    skillsScrollRef.current.pointerY = ny;
  };

  return (
    <section
      id="act-4"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative h-[980vh] w-full bg-[#F8FAFC]"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* ================================================================
            SLEEK MINIMAL CHAPTER PILLS (TOP-LEFT — ZERO HEAVY CARD BOX!)
           ================================================================ */}
        <div
          ref={hudNavRef}
          style={{ opacity: 0, visibility: "hidden" }}
          className="pointer-events-auto absolute left-4 top-20 sm:left-10 sm:top-22 z-[48] flex flex-wrap items-center gap-1.5 sm:gap-2"
        >
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              ref={(el) => {
                tabBtnRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => jumpToRatio(ch.jumpRatio)}
              className="rounded-xl px-3 py-1 font-mono text-[10px] sm:text-[11px] font-extrabold tracking-wider transition-all duration-200 cursor-pointer"
            >
              {ch.shortTab}
            </button>
          ))}
        </div>

        {/* ================================================================
            BEAT 0: DYNAMIC KINETIC 45+ ENTRANCE STAGE (ZERO 3D CUBE!)
           ================================================================ */}
        <div
          ref={bg0Ref}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden bg-[#F8FAFC] px-6"
        >
          <div className="mosaic-grid pointer-events-none absolute inset-0 opacity-50" />

          <div
            ref={introMarqueeTopRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-[13%] whitespace-nowrap font-display text-[13vw] sm:text-[9.5vw] font-black uppercase tracking-tighter text-[#1D4ED8]/[0.045] select-none will-change-transform"
          >
            STRUCTURAL ENGINEERING • FULL-STACK SYSTEMS • SPATIAL 3D •
          </div>
          <div
            ref={introMarqueeBotRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[11%] whitespace-nowrap font-display text-[13vw] sm:text-[9.5vw] font-black uppercase tracking-tighter text-[#07131C]/[0.04] select-none will-change-transform"
          >
            280M SPANS • 120 FPS WEBGL • ZERO-HANDOFF PRODUCTION •
          </div>

          <div
            ref={introChipLeftRef}
            aria-hidden="true"
            className="pointer-events-none hidden md:flex absolute left-[9%] lg:left-[14%] top-[34%] items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-[0_16px_35px_rgba(29,78,216,0.12)] will-change-transform"
          >
            <span className="h-2.5 w-2.5 rounded-md bg-[#C6FF3D] ring-2 ring-[#07131C]/15" />
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
              Civil × Software
            </span>
          </div>
          <div
            ref={introChipRightRef}
            aria-hidden="true"
            className="pointer-events-none hidden md:flex absolute right-[9%] lg:right-[14%] bottom-[34%] items-center gap-2 rounded-2xl border border-slate-200 bg-[#07131C] px-4 py-2.5 shadow-[0_16px_35px_rgba(7,19,28,0.2)] will-change-transform"
          >
            <span className="h-2.5 w-2.5 rounded-md bg-[#38BDF8]" />
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#C6FF3D]">
              60–120 FPS Craft
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
            <div
              ref={introKickerRef}
              className="rounded-xl bg-[#C6FF3D] px-4 py-1.5 shadow-[0_10px_28px_rgba(198,255,61,0.5)] ring-2 ring-[#07131C]/10 will-change-transform"
            >
              <span className="font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#07131C]">
                {PORTFOLIO_DATA.skillsSection.experienceLabel}
              </span>
            </div>

            <div
              ref={numStageRef}
              className="relative mt-3 inline-flex items-center justify-center select-none will-change-transform"
            >
              <span
                ref={giantNumLimeEchoRef}
                aria-hidden="true"
                className="pointer-events-none absolute font-display text-[clamp(5.4rem,20vw,15rem)] font-black leading-[0.84] tracking-tighter text-[#C6FF3D] will-change-transform"
              >
                45+
              </span>
              <span
                ref={giantNumCyanEchoRef}
                aria-hidden="true"
                className="pointer-events-none absolute font-display text-[clamp(5.4rem,20vw,15rem)] font-black leading-[0.84] tracking-tighter text-[#38BDF8]/55 will-change-transform"
              >
                45+
              </span>
              <span
                ref={giantNumMainRef}
                className="relative z-10 font-display text-[clamp(5.4rem,20vw,15rem)] font-black leading-[0.84] tracking-tighter text-[#1D4ED8] drop-shadow-[0_16px_36px_rgba(29,78,216,0.22)]"
              >
                45+
              </span>
            </div>

            <div
              ref={s0TopLineRef}
              className="mt-3 font-display text-2xl sm:text-5xl font-black uppercase tracking-tight text-[#07131C] will-change-transform"
            >
              {PORTFOLIO_DATA.skillsSection.primaryStatTop}
            </div>
            <div
              ref={s0BotLineRef}
              className="font-serif-editorial text-2xl sm:text-5xl italic text-[#1D4ED8] will-change-transform"
            >
              {PORTFOLIO_DATA.skillsSection.primaryStatBottom}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              {CORE_TOOLS.map((tool, idx) => (
                <div
                  key={tool}
                  ref={(el) => {
                    introBadgeRefs.current[idx] = el;
                  }}
                  className="will-change-transform"
                >
                  <ToolBadge tool={tool} size="md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            BEATS 1..4 3D ATMOSPHERE BACKDROPS
           ================================================================ */}
        {CHAPTERS.map((ch, idx) => {
          const gradients = [
            "bg-[#090D16] bg-[radial-gradient(circle_at_55%_45%,rgba(245,158,11,0.24)_0%,rgba(67,20,7,0.4)_46%,#090D16_85%)]",
            "bg-[#040B18] bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.26)_0%,rgba(29,78,216,0.34)_46%,#040B18_85%)]",
            "bg-[#0A0F24] bg-[radial-gradient(circle_at_50%_48%,rgba(198,255,61,0.16)_0%,rgba(124,58,237,0.3)_46%,#0A0F24_85%)]",
            "bg-[#0D0716] bg-[radial-gradient(circle_at_55%_48%,rgba(255,107,74,0.24)_0%,rgba(147,51,234,0.3)_46%,#0D0716_85%)]",
          ];
          return (
            <div
              key={ch.id}
              ref={(el) => {
                bgChapterRefs.current[idx] = el;
              }}
              style={{ visibility: "hidden", zIndex: 14 + idx }}
              className={`pointer-events-none absolute inset-0 overflow-hidden ${gradients[idx]}`}
            />
          );
        })}

        {/* ================================================================
            UNOBSTRUCTED ACT-2-STYLE 3D CINEMA CAMERA STAGE
           ================================================================ */}
        <div
          ref={canvasLayerRef}
          style={{ opacity: 0, visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[34] will-change-[opacity,transform]"
        >
          <Skills3DStage scrollRef={skillsScrollRef} active={inView} />
        </div>

        {/* Soft Bottom Vignette Only for Crisp White Typography Contrast (Zero Boxes!) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[36] h-[44dvh] bg-gradient-to-t from-black/75 via-black/30 to-transparent"
        />

        {/* ================================================================
            SYNCHRONIZED MIDPOINT TRANSITION CURTAINS & VFX (z-[44..45])
            Sweeps OVER both 3D canvas (z-34) & titles (z-42), swaps at exact midpoint u = 0.5!
           ================================================================ */}
        {/* FX 1 Curtain: Cyber Terminal Laser Shutter (01 Civil -> 02 Software) */}
        <div
          ref={cyberCurtainRef}
          aria-hidden="true"
          style={{ visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[44] overflow-hidden bg-[#040B18] bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.28)_0%,rgba(29,78,216,0.22)_46%,#040B18_85%)]"
        >
          <div className="dot-grid-dark absolute inset-0 opacity-75" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.42em] text-[#38BDF8]/55">
              SYS // SOLVER MATRIX
            </span>
          </div>
        </div>

        {/* FX 2 Curtain: 45° Diagonal Glass Prism Sheet (02 Software -> 03 UI/UX & 3D) */}
        <div
          ref={prismCurtainRef}
          aria-hidden="true"
          style={{ visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[44] overflow-hidden bg-[#0A0F24] bg-[radial-gradient(circle_at_50%_48%,rgba(198,255,61,0.18)_0%,rgba(124,58,237,0.34)_48%,#0A0F24_86%)]"
        >
          <div className="blueprint-grid absolute inset-0 opacity-40" />
        </div>

        {/* FX 3A Curtain: Midnight Vinyl Stage Dome (u3: 0 -> 0.5) */}
        <div
          ref={vinylDomeRef}
          aria-hidden="true"
          style={{ visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[44] overflow-hidden bg-[#0D0716]"
        />

        {/* FX 3B Curtain: Twin Stage Curtains Parting From Center (u3: 0.5 -> 1.0) */}
        <div
          ref={stageCurtainWrapRef}
          aria-hidden="true"
          style={{ visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[44] overflow-hidden"
        >
          <div
            ref={stageCurtainLeftRef}
            className="absolute inset-y-0 left-0 w-1/2 bg-[#0D0716] border-r-2 border-[#FF6B4A]/80 shadow-[12px_0_45px_rgba(255,107,74,0.45)] will-change-transform"
          />
          <div
            ref={stageCurtainRightRef}
            className="absolute inset-y-0 right-0 w-1/2 bg-[#0D0716] border-l-2 border-[#C084FC]/80 shadow-[-12px_0_45px_rgba(192,132,252,0.45)] will-change-transform"
          />
        </div>

        {/* CRT Scanline Sweep Veil */}
        <div
          ref={scanlineFxRef}
          aria-hidden="true"
          style={{
            opacity: 0,
            visibility: "hidden",
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(56,189,248,0.12) 0px, rgba(56,189,248,0.12) 1px, rgba(2,6,23,0.18) 1px, rgba(2,6,23,0.18) 2px, transparent 2px, transparent 5px)",
          }}
          className="pointer-events-none absolute inset-0 z-[45] will-change-[opacity]"
        />

        {/* FX 0: Blueprint Amber Aperture Ring + Crosshair Axes (Entering 01 Civil) */}
        <div
          ref={apertureRingFxRef}
          aria-hidden="true"
          style={{ opacity: 0, visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[45] mix-blend-screen will-change-[opacity]"
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/40 to-transparent" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#F59E0B]/40 to-transparent" />
        </div>

        {/* FX 1A: Symmetric Vertical Cyan/Lime Terminal Laser Beam (01 Civil -> 02 Software) */}
        <div
          ref={laserSweepFxRef}
          aria-hidden="true"
          style={{ opacity: 0, visibility: "hidden", left: "0%" }}
          className="pointer-events-none absolute inset-y-0 z-[45] -ml-10 w-20 mix-blend-screen will-change-[left,opacity]"
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-[#38BDF8]/55 to-transparent" />
          <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-[3px] bg-[#E0F2FE] shadow-[0_0_24px_#38BDF8,0_0_48px_#C6FF3D]" />
        </div>

        {/* FX 1B: Chromatic RGB Glitch Slice Bars (01 Civil -> 02 Software) */}
        <div
          ref={glitchWrapFxRef}
          aria-hidden="true"
          style={{ opacity: 0, visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[45] overflow-hidden mix-blend-screen will-change-[opacity]"
        >
          {[
            { top: "14%", height: "3px", width: "58%", left: "12%", color: "rgba(56,189,248,0.8)", shadow: "10px 0 0 rgba(244,63,94,0.72), -8px 0 0 rgba(198,255,61,0.7)" },
            { top: "31%", height: "6px", width: "74%", left: "18%", color: "rgba(198,255,61,0.55)", shadow: "-14px 0 0 rgba(56,189,248,0.75), 14px 0 0 rgba(244,63,94,0.75)" },
            { top: "51%", height: "4px", width: "86%", left: "7%", color: "rgba(244,63,94,0.68)", shadow: "12px 0 0 rgba(56,189,248,0.82), -10px 0 0 rgba(198,255,61,0.65)" },
            { top: "69%", height: "7px", width: "62%", left: "26%", color: "rgba(56,189,248,0.62)", shadow: "-16px 0 0 rgba(244,63,94,0.72), 9px 0 0 rgba(198,255,61,0.62)" },
            { top: "84%", height: "3px", width: "52%", left: "16%", color: "rgba(198,255,61,0.7)", shadow: "11px 0 0 rgba(56,189,248,0.78), -11px 0 0 rgba(244,63,94,0.68)" },
          ].map((bar, idx) => (
            <div
              key={idx}
              ref={(el) => {
                glitchBarRefs.current[idx] = el;
              }}
              style={{
                top: bar.top,
                height: bar.height,
                width: bar.width,
                left: bar.left,
                backgroundColor: bar.color,
                boxShadow: bar.shadow,
              }}
              className="absolute will-change-transform"
            />
          ))}
        </div>

        {/* FX 2: 45° Diagonal Glass Prism Refraction Blade (02 Software -> 03 UI/UX & 3D) */}
        <div
          ref={prismSlashFxRef}
          aria-hidden="true"
          style={{ opacity: 0, visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[45] mix-blend-screen will-change-[opacity]"
        />

        {/* FX 3: Concentric Vinyl Groove Ripples + Stage Spotlight Arc (03 UI/UX & 3D -> 04 Hobbies) */}
        <div
          ref={vinylRippleFxRef}
          aria-hidden="true"
          style={{ opacity: 0, visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[45] mix-blend-screen will-change-[opacity]"
        />

        {/* ================================================================
            4 CARDLESS FRAMELESS KINETIC SUPER-TITLE CHOREOGRAPHIES
           ================================================================ */}
        {CHAPTERS.map((ch, cIdx) => {
          const isRightAligned = cIdx === 3;
          const headerPos =
            cIdx === 1
              ? "lg:items-end lg:text-right lg:self-end"
              : isRightAligned
                ? "lg:items-end lg:text-right lg:self-end"
                : "items-start text-left";

          return (
            <div
              key={ch.id}
              ref={(el) => {
                fgChapterRefs.current[cIdx] = el;
              }}
              style={{ visibility: "hidden", opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-[42] mx-auto flex max-w-[1440px] flex-col justify-between px-5 pb-7 pt-32 sm:px-12 sm:pb-10 lg:pt-32"
            >
              {/* TOP EDITORIAL DISCIPLINE LOCKUP (FRAMELESS + TILTED TAPE STICKER + SQUIRCLE ICONS!) */}
              <div
                ref={(el) => {
                  headerRefs.current[cIdx] = el;
                }}
                className={`flex flex-col ${headerPos} will-change-transform`}
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="-rotate-2 rounded-lg px-3 py-1 font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#07131C] shadow-lg"
                    style={{ backgroundColor: ch.accentHex }}
                  >
                    {ch.tapeSticker}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {ch.tools.map((tId) => (
                      <ToolBadge key={tId} tool={tId} size="sm" />
                    ))}
                  </div>
                </div>

                <h3 className="mt-2 font-display text-[clamp(2.2rem,5.5vw,4.4rem)] font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.85)] select-none">
                  {ch.titleBold}{" "}
                  <span
                    className="font-serif-editorial font-normal italic"
                    style={{ color: ch.accentHex }}
                  >
                    {ch.titleItalic}
                  </span>
                </h3>
              </div>

              {/* BOTTOM FRAMELESS KINETIC SUPER-TITLE + MINIMAL 01-04 BEAT RAIL (ZERO CARDS!) */}
              <div
                ref={(el) => {
                  spotlightWrapRefs.current[cIdx] = el;
                }}
                className={`flex flex-col gap-5 ${
                  isRightAligned
                    ? "lg:items-end lg:text-right"
                    : cIdx === 2
                      ? "lg:flex-row-reverse lg:items-end lg:justify-between"
                      : "lg:flex-row lg:items-end lg:justify-between"
                } w-full will-change-transform`}
              >
                {/* Colossal Untruncated Kinetic Super-Title Slot */}
                <div className="relative h-[132px] sm:h-[158px] w-full max-w-2xl">
                  {ch.beats.map((beat, bIdx) => (
                    <div
                      key={beat.idx}
                      ref={(el) => {
                        if (!beatSlideRefs.current[cIdx])
                          beatSlideRefs.current[cIdx] = [];
                        beatSlideRefs.current[cIdx][bIdx] = el;
                      }}
                      style={{ opacity: bIdx === 0 ? 1 : 0 }}
                      className={`absolute inset-x-0 bottom-0 flex flex-col ${
                        isRightAligned ? "lg:items-end" : "items-start"
                      } will-change-transform`}
                    >
                      <span
                        className="font-display text-[clamp(2.3rem,6.2vw,4.6rem)] font-black leading-[0.92] tracking-tight drop-shadow-[0_12px_28px_rgba(0,0,0,0.8)]"
                        style={{ color: ch.accentHex }}
                      >
                        {beat.heroStat}
                      </span>
                      <h4 className="mt-1 font-display text-[clamp(1.25rem,3vw,2.25rem)] font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_8px_22px_rgba(0,0,0,0.9)]">
                        {beat.title}
                      </h4>
                      <p className="mt-1.5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                        {beat.spec}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Minimal Frameless 01-04 Beat Switcher (Pure Typography, Zero Card Borders!) */}
                <div className="pointer-events-auto flex flex-wrap items-center gap-3 sm:gap-5">
                  {ch.beats.map((beat, bIdx) => {
                    const beatLocalTarget = 0.21 + (bIdx / 3) * 0.63;
                    const targetP =
                      ch.startP + beatLocalTarget * (ch.endP - ch.startP);
                    return (
                      <button
                        key={beat.idx}
                        ref={(el) => {
                          if (!beatTickRefs.current[cIdx])
                            beatTickRefs.current[cIdx] = [];
                          beatTickRefs.current[cIdx][bIdx] = el;
                        }}
                        type="button"
                        onClick={() => jumpToRatio(targetP)}
                        className="group flex items-center gap-2 text-left transition-all duration-200 cursor-pointer"
                      >
                        <span
                          ref={(el) => {
                            if (!beatPillRefs.current[cIdx])
                              beatPillRefs.current[cIdx] = [];
                            beatPillRefs.current[cIdx][bIdx] = el;
                          }}
                          className="rounded-md px-1.5 py-0.5 font-mono text-[10px] font-black tracking-wider transition-colors"
                        >
                          {beat.idx}
                        </span>
                        <span className="font-sans text-xs sm:text-sm font-semibold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]">
                          {beat.shortLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* ================================================================
            BEAT 5 (0.835 -> 1.00): WHITE CIRCULAR IRIS WIPE + "STAND OUT"
           ================================================================ */}
        <div
          ref={stageFinaleRef}
          style={{
            opacity: 0,
            clipPath: "circle(0% at 50% 92%)",
            visibility: "hidden",
            pointerEvents: "none",
          }}
          className="absolute inset-0 z-[52] flex items-center justify-center bg-white text-[#07131C]"
        >
          <div className="relative mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-4 sm:gap-8 px-4 sm:px-8 py-6 sm:py-12 md:grid-cols-12">
            <div className="relative flex items-center justify-center md:col-span-5">
              <div
                ref={finalePortraitRef}
                className="relative flex h-[175px] w-[175px] sm:h-[300px] sm:w-[300px] md:h-[390px] md:w-[390px] items-end justify-center overflow-hidden rounded-full bg-[#F0F9FF] shadow-[0_24px_65px_rgba(29,78,216,0.16)] will-change-transform"
              >
                <div
                  aria-hidden="true"
                  className="animate-slow-spin pointer-events-none absolute inset-[-20%]"
                  style={{
                    background:
                      "repeating-conic-gradient(from 0deg, rgba(56,189,248,0.28) 0deg 10deg, transparent 10deg 20deg)",
                  }}
                />
                <CodeCreatorPortrait className="relative z-10 h-[92%] w-auto drop-shadow-[0_14px_24px_rgba(0,0,0,0.22)]" />
              </div>
            </div>

            <div className="relative z-20 flex flex-col items-center text-center md:col-span-7 md:items-start md:text-left">
              <p
                ref={finaleLine1Ref}
                className="font-display text-[clamp(1.6rem,5.2vw,3.5rem)] font-bold tracking-tight text-[#07131C] leading-tight transition-all duration-300 will-change-transform"
              >
                I engineer structures &amp; apps
              </p>
              <p
                ref={finaleLine2Ref}
                className="font-display text-[clamp(1.6rem,5.2vw,3.5rem)] font-bold tracking-tight text-[#07131C] leading-tight transition-all duration-300 will-change-transform"
              >
                built to
              </p>

              <div className="relative mt-2.5 sm:mt-3.5 inline-flex items-center">
                <button
                  ref={standOutBtnRef}
                  type="button"
                  onMouseEnter={() => setStandOutDOM(true)}
                  onClick={() => setContactOpen(true)}
                  style={{ color: "#07131C" }}
                  className="relative rounded-xl sm:rounded-2xl bg-transparent px-5 sm:px-7 py-1.5 sm:py-2 font-display text-[clamp(2.1rem,8vw,4.5rem)] font-black uppercase tracking-tight transition-all duration-300 cursor-pointer"
                >
                  STAND OUT
                </button>

                <div
                  ref={standCursorRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -bottom-4 sm:-right-9 sm:-bottom-6 z-30 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ transform: "translate3d(18px, 14px, 0) scale(1.05)" }}
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
                      strokeLinejoin="miter"
                    />
                  </svg>
                </div>
              </div>

              <p className="mt-5 sm:mt-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-slate-500">
                Keep scrolling to enter the Full-Screen Works Reel ↓
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
