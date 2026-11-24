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

interface KineticSkillCard {
  code: string;
  title: string;
  spec: string;
  metric: string;
  fill: number;
}

interface DisciplineChapter {
  id: "civil" | "software" | "design" | "hobbies";
  num: string;
  shortTab: string;
  kicker: string;
  headline: string;
  chars: string[];
  accentHex: string;
  camLabel: string;
  startP: number;
  endP: number;
  jumpRatio: number;
  rows: KineticSkillCard[];
}

const CHAPTERS: DisciplineChapter[] = [
  {
    id: "civil",
    num: "01",
    shortTab: "01 Civil",
    kicker: "01 • Civil & Structural Engineering",
    headline: "CIVIL.",
    chars: "CIVIL.".split(""),
    accentHex: "#F59E0B",
    camLabel: "CAM 01 • HELICOPTER SPIRAL → CRANE JIB",
    startP: 0.115,
    endP: 0.315,
    jumpRatio: 0.21,
    rows: [
      {
        code: "CIV-01",
        title: "Long-Span Bridge & Arch FEA",
        spec: "ETABS • SAP2000 • Nonlinear Cable & P-Delta",
        metric: "280m+ Span",
        fill: 0.96,
      },
      {
        code: "CIV-02",
        title: "High-Rise Seismic Core & Diagrid",
        spec: "Modal Response Spectrum • SNI 1726 & ACI 318",
        metric: "42 Stories",
        fill: 0.94,
      },
      {
        code: "CIV-03",
        title: "BIM LOD 400 & Rebar Coordination",
        spec: "Autodesk Revit • Automated Clash & Bar Schedules",
        metric: "Zero-Clash",
        fill: 0.95,
      },
      {
        code: "CIV-04",
        title: "Corridor & Earthwork Infrastructure",
        spec: "AutoCAD • Civil 3D Alignments & Cut-Fill Modeling",
        metric: "18.4 km",
        fill: 0.91,
      },
    ],
  },
  {
    id: "software",
    num: "02",
    shortTab: "02 Software",
    kicker: "02 • Full-Stack & Computational Software",
    headline: "SOFTWARE.",
    chars: "SOFTWARE.".split(""),
    accentHex: "#38BDF8",
    camLabel: "CAM 02 • FPV Z-TUNNEL DIVE THROUGH CORE",
    startP: 0.315,
    endP: 0.51,
    jumpRatio: 0.41,
    rows: [
      {
        code: "SWE-01",
        title: "Full-Stack TypeScript Architecture",
        spec: "Next.js 16 • React 19 • Node • Scalable APIs",
        metric: "Production",
        fill: 0.96,
      },
      {
        code: "SWE-02",
        title: "Computational Structural Solvers",
        spec: "Python • FastAPI • NumPy/SciPy Matrix Engines",
        metric: "< 18ms API",
        fill: 0.94,
      },
      {
        code: "SWE-03",
        title: "Real-Time 3D & WebGL Engines",
        spec: "Three.js • React Three Fiber • Custom GLSL",
        metric: "120 FPS",
        fill: 0.95,
      },
      {
        code: "SWE-04",
        title: "BIM & CAD Pipeline Automation",
        spec: "Revit API • pyRevit • IFC-to-WebGL Streaming",
        metric: "-75% Time",
        fill: 0.92,
      },
    ],
  },
  {
    id: "design",
    num: "03",
    shortTab: "03 UI/UX & 3D",
    kicker: "03 • UI/UX Systems & Kinetic 3D Motion",
    headline: "DESIGN.",
    chars: "DESIGN.".split(""),
    accentHex: "#C6FF3D",
    camLabel: "CAM 03 • LATERAL S-CURVE DOLLY SLALOM",
    startP: 0.51,
    endP: 0.705,
    jumpRatio: 0.6,
    rows: [
      {
        code: "UXD-01",
        title: "Design Systems & Token Architecture",
        spec: "Figma Variables • Multi-Brand Kits • WCAG AA",
        metric: "80+ Tokens",
        fill: 0.95,
      },
      {
        code: "UXD-02",
        title: "Scroll & Kinetic Motion Direction",
        spec: "GSAP ScrollTrigger • Lenis Physics • Bezier Curves",
        metric: "60-120 FPS",
        fill: 0.96,
      },
      {
        code: "UXD-03",
        title: "Spatial 3D & Refractive Interfaces",
        spec: "Procedural 3D Geometry • Studio Lighting • Shaders",
        metric: "WebGL2",
        fill: 0.93,
      },
      {
        code: "UXD-04",
        title: "Zero-Handoff Design-to-Production",
        spec: "Direct Figma Prototype → Live Engineered Build",
        metric: "2x Faster",
        fill: 0.97,
      },
    ],
  },
  {
    id: "hobbies",
    num: "04",
    shortTab: "04 Hobbies",
    kicker: "04 • Off-Clock Hobbies & Creative Fuel",
    headline: "OFF-CLOCK.",
    chars: "OFF-CLOCK.".split(""),
    accentHex: "#FF6B4A",
    camLabel: "CAM 04 • FRETBOARD STRING-RUN → TURNTABLE",
    startP: 0.705,
    endP: 0.85,
    jumpRatio: 0.77,
    rows: [
      {
        code: "TRK-01",
        title: "Electric Guitar & Riff Sessions",
        spec: "Neo-soul Maj9 chord voicings, tone crafting & improv",
        metric: "Maj9 • Fender",
        fill: 0.95,
      },
      {
        code: "TRK-02",
        title: "Analog Synth & DAW Beatmaking",
        spec: "112 BPM instrumental synth layering & drum grooves",
        metric: "112 BPM",
        fill: 0.92,
      },
      {
        code: "TRK-03",
        title: "Specialty V60 & Espresso Dialing",
        spec: "Single-origin 1:15 pour-over & morning ristretto ritual",
        metric: "93°C • 1:15",
        fill: 0.94,
      },
      {
        code: "TRK-04",
        title: "Urban Architectural Sketching",
        spec: "Fine-liner structural perspective studies of bridges & cities",
        metric: "0.1mm Ink",
        fill: 0.9,
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
 * Act 4 — 3D Cinema Camera Flythrough Showreel (760vh)
 * Every discipline has its OWN distinct Act-2-style 3D Camera Movement AND its OWN distinct HUD motion!
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
  const hoveredRowRef = useRef<number | null>(null);

  // Rounded-2xl Dock Switcher, 3D Canvas, Camera Telemetry & Cut Flash refs
  const hudDockRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabFillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const canvasLayerRef = useRef<HTMLDivElement>(null);
  const cutFlashRef = useRef<HTMLDivElement>(null);
  const camBadgeRef = useRef<HTMLDivElement>(null);
  const camLabelSpanRef = useRef<HTMLSpanElement>(null);

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

  // Beats 1..4: Separated 3D + Distinct Foreground HUD Choreography refs
  const bgChapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fgChapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const charRefs = useRef<(HTMLSpanElement | null)[][]>([[], [], [], []]);
  const rowRefs = useRef<(HTMLDivElement | null)[][]>([[], [], [], []]);
  const barRefs = useRef<(HTMLSpanElement | null)[][]>([[], [], [], []]);

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

    let lastCamText = "";
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
        const foundryVis =
          clamp01((p - 0.11) / 0.03) * (irisP >= 0.98 ? 0 : 1);
        const dockVis =
          clamp01((p - 0.11) / 0.03) * (1 - clamp01((p - 0.825) / 0.025));

        if (canvasLayerRef.current) {
          canvasLayerRef.current.style.opacity = foundryVis.toFixed(3);
          canvasLayerRef.current.style.visibility =
            foundryVis > 0.005 ? "visible" : "hidden";
        }
        if (hudDockRef.current) {
          hudDockRef.current.style.opacity = dockVis.toFixed(3);
          hudDockRef.current.style.visibility =
            dockVis > 0.005 ? "visible" : "hidden";
        }
        if (camBadgeRef.current) {
          camBadgeRef.current.style.opacity = dockVis.toFixed(3);
        }

        // Subtle cinema lens speed-flash right at chapter camera cuts (0.315, 0.51, 0.705)
        if (cutFlashRef.current) {
          const cuts = [0.315, 0.51, 0.705];
          let flash = 0;
          for (const cp of cuts) {
            const dist = Math.abs(p - cp);
            if (dist < 0.018) {
              flash = Math.max(flash, (1 - dist / 0.018) * 0.55);
            }
          }
          cutFlashRef.current.style.opacity = flash.toFixed(3);
        }

        const activeChIdx =
          p < 0.315 ? 0 : p < 0.51 ? 1 : p < 0.705 ? 2 : 3;

        if (activeChIdx !== lastLitTab) {
          lastLitTab = activeChIdx;
          CHAPTERS.forEach((_, idx) => {
            const btn = tabBtnRefs.current[idx];
            if (!btn) return;
            if (idx === activeChIdx) {
              btn.style.backgroundColor = "rgba(255,255,255,0.14)";
              btn.style.color = "#FFFFFF";
            } else {
              btn.style.backgroundColor = "transparent";
              btn.style.color = "rgba(226,232,240,0.65)";
            }
          });
        }

        const nextCam = CHAPTERS[activeChIdx].camLabel;
        if (nextCam !== lastCamText && camLabelSpanRef.current) {
          lastCamText = nextCam;
          camLabelSpanRef.current.textContent = nextCam;
          camLabelSpanRef.current.style.color = CHAPTERS[activeChIdx].accentHex;
        }

        CHAPTERS.forEach((ch, idx) => {
          const fillEl = tabFillRefs.current[idx];
          if (!fillEl) return;
          const f = clamp01((p - ch.startP) / (ch.endP - ch.startP));
          fillEl.style.transform = `scaleX(${Math.max(0.08, f).toFixed(3)})`;
        });

        const s0Fade = clamp01((p - 0.1) / 0.035);
        if (bg0Ref.current) {
          bg0Ref.current.style.opacity = (1 - s0Fade).toFixed(3);
          bg0Ref.current.style.visibility =
            s0Fade >= 0.995 ? "hidden" : "visible";
        }

        const isDesktop = window.innerWidth >= 1024;

        // ====================================================================
        // BEATS 1..4: 4 DISTINCT CAMERA + HUD CHOREOGRAPHIES
        // ====================================================================
        CHAPTERS.forEach((ch, cIdx) => {
          const isCurrent =
            cIdx === 0
              ? p >= 0.105 && p < 0.315
              : cIdx === 1
                ? p >= 0.315 && p < 0.51
                : cIdx === 2
                  ? p >= 0.51 && p < 0.705
                  : p >= 0.705 && irisP < 0.98;

          const local = clamp01((p - ch.startP) / (ch.endP - ch.startP));
          const bgEl = bgChapterRefs.current[cIdx];
          const fgEl = fgChapterRefs.current[cIdx];
          const headerEl = headerBlockRefs.current[cIdx];
          const cardsEl = cardsBlockRefs.current[cIdx];

          if (bgEl) {
            if (!isCurrent) {
              bgEl.style.visibility = "hidden";
            } else {
              bgEl.style.visibility = "visible";
              if (cIdx === 0) {
                const wipeIn = easeInOutCubic(clamp01((p - 0.105) / 0.035));
                bgEl.style.clipPath = `circle(${(wipeIn * 150).toFixed(1)}% at 50% 50%)`;
              } else {
                bgEl.style.clipPath = "none";
              }
            }
          }

          if (fgEl) {
            const fadeEdge =
              cIdx === 3
                ? 1 - clamp01((irisP - 0.25) / 0.5)
                : Math.min(
                    clamp01(local * 7),
                    clamp01((1 - local) * 7.5 + 0.15)
                  );
            const fgOp = isCurrent ? fadeEdge : 0;

            if (fgOp <= 0.005) {
              fgEl.style.visibility = "hidden";
              fgEl.style.opacity = "0";
            } else {
              fgEl.style.visibility = "visible";
              fgEl.style.opacity = fgOp.toFixed(3);

              // DISTINCT PER-CHAPTER SPATIAL HUD PARALLAX SYNCED TO THE 3D CAMERA!
              if (isDesktop && headerEl && cardsEl) {
                if (cIdx === 0) {
                  // 01 Civil: Counter-glide vertically as helicopter spirals up!
                  headerEl.style.transform = `translate3d(0, ${((0.5 - local) * 46).toFixed(1)}px, 0)`;
                  cardsEl.style.transform = `translate3d(0, ${((0.5 - local) * 28).toFixed(1)}px, 0)`;
                } else if (cIdx === 1) {
                  // 02 Software: Wing-HUD spreads outward as FPV camera dives into the center tunnel!
                  const tunnelPush = Math.sin(local * Math.PI) * 22;
                  headerEl.style.transform = `translate3d(0, ${(-tunnelPush * 0.5).toFixed(1)}px, 0) scale(${(1 + Math.sin(local * Math.PI) * 0.04).toFixed(3)})`;
                  cardsEl.style.transform = `translate3d(0, ${(tunnelPush * 0.35).toFixed(1)}px, 0)`;
                } else if (cIdx === 2) {
                  // 03 Design: Bottom Bento glides horizontally opposite the S-curve lateral dolly!
                  headerEl.style.transform = `translate3d(${((local - 0.5) * 60).toFixed(1)}px, 0, 0)`;
                  cardsEl.style.transform = `translate3d(${((0.5 - local) * 75).toFixed(1)}px, 0, 0)`;
                } else {
                  // 04 Hobbies: Right-side diagonal cascade glides upward with the fretboard string-run!
                  headerEl.style.transform = `translate3d(${((0.5 - local) * -35).toFixed(1)}px, ${((0.5 - local) * 32).toFixed(1)}px, 0)`;
                  cardsEl.style.transform = `translate3d(0, ${((0.5 - local) * 32).toFixed(1)}px, 0)`;
                }
              } else if (headerEl && cardsEl) {
                headerEl.style.transform = "none";
                cardsEl.style.transform = "none";
              }

              // Per-character whip-slam on discipline headline
              const chars = ch.chars;
              for (let i = 0; i < chars.length; i++) {
                const cSpan = charRefs.current[cIdx]?.[i];
                if (!cSpan) continue;
                const cT = clamp01((local * 2.2 - i * 0.04) / 0.35);
                const sp = easeOutBack(cT);
                const dropY = (1 - sp) * (i % 2 === 0 ? -42 : 42);
                const sk = (1 - sp) * -14;
                cSpan.style.opacity = clamp01(cT * 3.2).toFixed(3);
                cSpan.style.transform = `translate3d(0, ${dropY.toFixed(1)}px, 0) skewX(${sk.toFixed(1)}deg)`;
              }

              const scannedIdx =
                hoveredRowRef.current !== null
                  ? hoveredRowRef.current
                  : Math.min(3, Math.floor(clamp01(local * 1.08) * 4));
              if (activeChIdx === cIdx) {
                skillsScrollRef.current.activeRow = scannedIdx;
              }

              ch.rows.forEach((row, rIdx) => {
                const rowEl = rowRefs.current[cIdx]?.[rIdx];
                const barEl = barRefs.current[cIdx]?.[rIdx];
                const rT = clamp01((local * 2.1 - 0.04 - rIdx * 0.06) / 0.32);
                const rSp = easeOutBack(rT);
                const isLit = rIdx === scannedIdx;

                if (rowEl) {
                  let tx = 0;
                  let ty = 0;
                  if (!isDesktop) {
                    tx = (1 - rSp) * -45 + (isLit ? 6 : 0);
                  } else if (cIdx === 0) {
                    tx = (1 - rSp) * -75 + (isLit ? 14 : 0);
                  } else if (cIdx === 1) {
                    const side = rIdx < 2 ? -1 : 1;
                    tx = (1 - rSp) * 75 * side + (isLit ? -8 * side : 0);
                  } else if (cIdx === 2) {
                    ty = (1 - rSp) * 55 + (isLit ? -6 : 0);
                  } else {
                    tx = (1 - rSp) * 75 - rIdx * 10 + (isLit ? -14 : 0);
                  }

                  const sc = isLit ? 1.025 : 0.985;
                  rowEl.style.opacity = (
                    clamp01(rT * 2.8) * (isLit ? 1 : 0.82)
                  ).toFixed(3);
                  rowEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${sc})`;
                  rowEl.style.borderColor = isLit
                    ? `${ch.accentHex}AA`
                    : "rgba(255,255,255,0.10)";
                  rowEl.style.backgroundColor = isLit
                    ? "rgba(15, 23, 42, 0.80)"
                    : "rgba(15, 23, 42, 0.46)";
                  rowEl.style.boxShadow = isLit
                    ? `0 16px 38px -8px ${ch.accentHex}40`
                    : "0 8px 24px -10px rgba(0,0,0,0.35)";
                }
                if (barEl) {
                  const bf = clamp01(rT * 1.25) * row.fill;
                  barEl.style.transform = `scaleX(${bf.toFixed(3)})`;
                  barEl.style.opacity = isLit ? "1" : "0.45";
                }
              });
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

  const renderSkillCard = (
    ch: DisciplineChapter,
    cIdx: number,
    row: KineticSkillCard,
    rIdx: number
  ) => (
    <div
      key={row.code}
      ref={(el) => {
        if (!rowRefs.current[cIdx]) rowRefs.current[cIdx] = [];
        rowRefs.current[cIdx][rIdx] = el;
      }}
      onPointerEnter={() => {
        hoveredRowRef.current = rIdx;
        skillsScrollRef.current.activeRow = rIdx;
      }}
      onPointerLeave={() => {
        hoveredRowRef.current = null;
      }}
      className="group relative rounded-2xl border border-white/10 bg-slate-900/55 px-3.5 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-200 will-change-transform"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="shrink-0 rounded-lg px-2 py-0.5 font-mono text-[10px] font-extrabold tracking-wider text-[#07131C]"
            style={{ backgroundColor: ch.accentHex }}
          >
            {row.code}
          </span>
          <span className="truncate font-display text-xs sm:text-[15px] font-bold text-white">
            {row.title}
          </span>
        </div>
        <span
          className="shrink-0 rounded-lg border border-white/10 bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold tracking-wide"
          style={{ color: ch.accentHex }}
        >
          {row.metric}
        </span>
      </div>

      <p className="mt-1 font-sans text-[10.5px] sm:text-[11.5px] text-slate-300/85 line-clamp-1">
        {row.spec}
      </p>

      <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <span
          ref={(el) => {
            if (!barRefs.current[cIdx]) barRefs.current[cIdx] = [];
            barRefs.current[cIdx][rIdx] = el;
          }}
          className="block h-full w-full origin-left rounded-full will-change-transform"
          style={{
            backgroundColor: ch.accentHex,
            transform: "scaleX(0)",
          }}
        />
      </div>
    </div>
  );

  return (
    <section
      id="act-4"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative h-[760vh] w-full bg-[#F8FAFC]"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* ================================================================
            ROUNDED-2XL TACTILE CHAPTER DOCK (TOP-LEFT)
           ================================================================ */}
        <div
          ref={hudDockRef}
          style={{ opacity: 0, visibility: "hidden" }}
          className="pointer-events-auto absolute left-4 top-20 sm:left-10 sm:top-22 z-[48] inline-flex items-center gap-1 rounded-2xl border border-white/12 bg-slate-950/65 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              ref={(el) => {
                tabBtnRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => jumpToRatio(ch.jumpRatio)}
              className="group flex flex-col items-start rounded-xl px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-left transition-all duration-200 cursor-pointer"
            >
              <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-wider whitespace-nowrap">
                {ch.shortTab}
              </span>
              <span className="mt-1 relative h-1 w-full rounded-full bg-white/15 overflow-hidden">
                <span
                  ref={(el) => {
                    tabFillRefs.current[idx] = el;
                  }}
                  className="absolute inset-0 origin-left rounded-full will-change-transform"
                  style={{
                    backgroundColor: ch.accentHex,
                    transform: "scaleX(0.08)",
                  }}
                />
              </span>
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
            FULL-VIEWPORT ACT-2-STYLE 3D CINEMA CAMERA STAGE
           ================================================================ */}
        <div
          ref={canvasLayerRef}
          style={{ opacity: 0, visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[34]"
        >
          <Skills3DStage scrollRef={skillsScrollRef} active={inView} />
        </div>

        {/* Cinema Camera Cut Speed-Flash */}
        <div
          ref={cutFlashRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[40] bg-white opacity-0 will-change-[opacity]"
        />

        {/* Top-Right Cinema Camera Telemetry Readout (Desktop) */}
        <div
          ref={camBadgeRef}
          className="pointer-events-none hidden xl:flex absolute right-10 top-22 z-[48] items-center gap-2.5 rounded-2xl border border-white/12 bg-slate-950/65 px-4 py-2 shadow-xl backdrop-blur-xl opacity-0"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#C6FF3D]" />
          <span
            ref={camLabelSpanRef}
            className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#F59E0B]"
          >
            CAM 01 • HELICOPTER SPIRAL
          </span>
        </div>

        {/* ================================================================
            4 DISTINCT FOREGROUND HUD LAYOUTS & MOTION CHOREOGRAPHIES
           ================================================================ */}
        {CHAPTERS.map((ch, cIdx) => {
          // Each chapter gets its OWN Desktop spatial layout so no two feel alike!
          const containerAlign =
            cIdx === 0
              ? "justify-end lg:justify-center lg:items-start"
              : cIdx === 1
                ? "justify-end lg:justify-between"
                : cIdx === 2
                  ? "justify-end"
                  : "justify-end lg:justify-center lg:items-end";

          return (
            <div
              key={ch.id}
              ref={(el) => {
                fgChapterRefs.current[cIdx] = el;
              }}
              style={{ visibility: "hidden", opacity: 0 }}
              className={`pointer-events-none absolute inset-0 z-[42] mx-auto flex max-w-[1440px] flex-col px-4 pb-5 pt-28 sm:px-10 lg:py-20 ${containerAlign}`}
            >
              {/* 01 CIVIL: Left-Perimeter Ascending Stack */}
              {cIdx === 0 && (
                <div className="pointer-events-auto w-full lg:w-[420px]">
                  <div ref={(el) => { headerBlockRefs.current[0] = el; }} className="will-change-transform">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-slate-950/55 px-3 py-1 backdrop-blur-md">
                      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ch.accentHex }} />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: ch.accentHex }}>
                        {ch.kicker}
                      </span>
                    </div>
                    <h3 className="mt-1.5 flex flex-wrap items-center font-display text-[clamp(2.2rem,6vw,4.4rem)] font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.7)] select-none">
                      {ch.chars.map((char, charIdx) => (
                        <span
                          key={charIdx}
                          ref={(el) => {
                            if (!charRefs.current[0]) charRefs.current[0] = [];
                            charRefs.current[0][charIdx] = el;
                          }}
                          style={char === "." ? { color: ch.accentHex } : undefined}
                          className="inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      ))}
                    </h3>
                  </div>
                  <div
                    ref={(el) => { cardsBlockRefs.current[0] = el; }}
                    className="mt-3 flex flex-col gap-2 will-change-transform"
                  >
                    {ch.rows.map((row, rIdx) => renderSkillCard(ch, 0, row, rIdx))}
                  </div>
                </div>
              )}

              {/* 02 SOFTWARE: Split Left/Right FPV Tunnel Wing HUD! */}
              {cIdx === 1 && (
                <>
                  <div
                    ref={(el) => { headerBlockRefs.current[1] = el; }}
                    className="pointer-events-auto lg:mt-14 lg:self-center lg:text-center will-change-transform"
                  >
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-slate-950/55 px-3 py-1 backdrop-blur-md">
                      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ch.accentHex }} />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: ch.accentHex }}>
                        {ch.kicker}
                      </span>
                    </div>
                    <h3 className="mt-1.5 flex flex-wrap lg:justify-center items-center font-display text-[clamp(2.2rem,5.8vw,4.2rem)] font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.75)] select-none">
                      {ch.chars.map((char, charIdx) => (
                        <span
                          key={charIdx}
                          ref={(el) => {
                            if (!charRefs.current[1]) charRefs.current[1] = [];
                            charRefs.current[1][charIdx] = el;
                          }}
                          style={char === "." ? { color: ch.accentHex } : undefined}
                          className="inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      ))}
                    </h3>
                  </div>

                  <div
                    ref={(el) => { cardsBlockRefs.current[1] = el; }}
                    className="pointer-events-auto mt-3 lg:mt-0 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2 lg:gap-8 w-full will-change-transform"
                  >
                    <div className="flex flex-col gap-2 w-full lg:w-[375px]">
                      {ch.rows.slice(0, 2).map((row, idx) => renderSkillCard(ch, 1, row, idx))}
                    </div>
                    <div className="flex flex-col gap-2 w-full lg:w-[375px]">
                      {ch.rows.slice(2, 4).map((row, idx) => renderSkillCard(ch, 1, row, idx + 2))}
                    </div>
                  </div>
                </>
              )}

              {/* 03 DESIGN: Bottom Counter-Gliding 2x2 Bento Strip! */}
              {cIdx === 2 && (
                <div className="pointer-events-auto w-full">
                  <div
                    ref={(el) => { headerBlockRefs.current[2] = el; }}
                    className="will-change-transform"
                  >
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-slate-950/55 px-3 py-1 backdrop-blur-md">
                      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ch.accentHex }} />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: ch.accentHex }}>
                        {ch.kicker}
                      </span>
                    </div>
                    <h3 className="mt-1.5 flex flex-wrap items-center font-display text-[clamp(2.2rem,5.8vw,4.2rem)] font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.75)] select-none">
                      {ch.chars.map((char, charIdx) => (
                        <span
                          key={charIdx}
                          ref={(el) => {
                            if (!charRefs.current[2]) charRefs.current[2] = [];
                            charRefs.current[2][charIdx] = el;
                          }}
                          style={char === "." ? { color: ch.accentHex } : undefined}
                          className="inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      ))}
                    </h3>
                  </div>

                  <div
                    ref={(el) => { cardsBlockRefs.current[2] = el; }}
                    className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3 max-w-4xl will-change-transform"
                  >
                    {ch.rows.map((row, rIdx) => renderSkillCard(ch, 2, row, rIdx))}
                  </div>
                </div>
              )}

              {/* 04 OFF-CLOCK HOBBIES: Right-Perimeter Diagonal Tracklist Cascade! */}
              {cIdx === 3 && (
                <div className="pointer-events-auto w-full lg:w-[440px] lg:mt-10">
                  <div
                    ref={(el) => { headerBlockRefs.current[3] = el; }}
                    className="lg:text-right flex flex-col lg:items-end will-change-transform"
                  >
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-slate-950/55 px-3 py-1 backdrop-blur-md">
                      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ch.accentHex }} />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: ch.accentHex }}>
                        {ch.kicker}
                      </span>
                    </div>
                    <h3 className="mt-1.5 flex flex-wrap lg:justify-end items-center font-display text-[clamp(2.2rem,5.8vw,4.2rem)] font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.75)] select-none">
                      {ch.chars.map((char, charIdx) => (
                        <span
                          key={charIdx}
                          ref={(el) => {
                            if (!charRefs.current[3]) charRefs.current[3] = [];
                            charRefs.current[3][charIdx] = el;
                          }}
                          style={char === "." ? { color: ch.accentHex } : undefined}
                          className="inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      ))}
                    </h3>
                  </div>

                  <div
                    ref={(el) => { cardsBlockRefs.current[3] = el; }}
                    className="mt-5 flex flex-col gap-2 will-change-transform"
                  >
                    {ch.rows.map((row, rIdx) => renderSkillCard(ch, 3, row, rIdx))}
                  </div>
                </div>
              )}
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
