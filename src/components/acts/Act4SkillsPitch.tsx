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
  id: string;
  num: string;
  shortTab: string;
  kicker: string;
  headline: string;
  chars: string[];
  accentHex: string;
  ribbonTop: string;
  ribbonBot: string;
  twinLabel: string;
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
    ribbonTop:
      "42F SEISMIC DIAGRID • 280M BRIDGE FEA • REVIT BIM LOD 400 • SNI 1726 •",
    ribbonBot:
      "ETABS MODAL SPECTRUM • SAP2000 NONLINEAR • AUTOCAD CIVIL 3D • ACI 318 •",
    twinLabel: "3D Twin • 42F Seismic Diagrid & Tower Crane",
    startP: 0.12,
    endP: 0.33,
    jumpRatio: 0.22,
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
    ribbonTop:
      "TYPESCRIPT STRICT • NEXT.JS 16 • PYTHON FEA SOLVER • FASTAPI • DOCKER •",
    ribbonBot:
      "120 FPS THREE.JS • WEBGL2 SHADERS • IFC STREAMING • POSTGRESQL •",
    twinLabel: "3D Twin • 3x3x3 Compute Cluster & Data Bus",
    startP: 0.31,
    endP: 0.52,
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
    ribbonTop:
      "FIGMA VARIABLES • SPATIAL 3D INTERFACES • GSAP CHOREOGRAPHY • LENIS •",
    ribbonBot:
      "TACTILE DESIGN SYSTEMS • CUBIC-BEZIER PHYSICS • DESIGN-TO-CODE •",
    twinLabel: "3D Twin • Spatial UI Stack & Kinetic Spline",
    startP: 0.5,
    endP: 0.71,
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
    ribbonTop:
      "ELECTRIC GUITAR MAJ9 • 112 BPM ANALOG SYNTH • LATE NIGHT DAW SESSIONS •",
    ribbonBot:
      "V60 SPECIALTY POUR-OVER • DOUBLE ESPRESSO • URBAN SKETCHING •",
    twinLabel: "3D Twin • 6-String Fretboard, EQ & Turntable",
    startP: 0.69,
    endP: 0.87,
    jumpRatio: 0.78,
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
 * Act 4 — 3D + Kinetic Discipline Showreel (640vh)
 * - Beat 0: Pure Kinetic 45+ Entrance Choreography (Zero 3D cube blocking text!)
 * - Beats 1..4: Separated Civil, Software, UI/UX & 3D, and Off-Clock Hobbies with
 *   Tactile Rounded-Rectangle (rounded-2xl) UI + Beveled <RoundedBox> 3D WebGL Models!
 * - Beat 5: Classic Sunburst Creator Portrait + Royal-Blue/Volt-Lime "STAND OUT" Finale!
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

  // Rounded-2xl Dock Switcher & 3D Canvas visibility refs
  const hudDockRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabFillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const canvasLayerRef = useRef<HTMLDivElement>(null);
  const twinReadoutRef = useRef<HTMLDivElement>(null);
  const twinLabelSpanRef = useRef<HTMLSpanElement>(null);

  // Beat 0: Dynamic Kinetic 45+ Intro refs (Zero 3D Cube!)
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

  // Beats 1..4: Separated 3D + Kinetic Discipline refs
  const bgChapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ribbonTopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ribbonBotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fgChapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const charRefs = useRef<(HTMLSpanElement | null)[][]>([[], [], [], []]);
  const rowRefs = useRef<(HTMLDivElement | null)[][]>([[], [], [], []]);
  const barRefs = useRef<(HTMLSpanElement | null)[][]>([[], [], [], []]);

  // Beat 5: Restored Sunburst Portrait + "STAND OUT" Finale refs
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

    let lastTwinText = "";
    let lastLitTab = -1;

    const ctx = gsap.context(() => {
      // Pre-pin scroll-scrubbed kinetic entrance for Beat 0 (as Act 4 enters viewport!)
      const applyIntroEntrance = (ep: number, pinnedP: number) => {
        const spNum = easeOutBack(clamp01(ep / 0.72));
        const targetVal = Math.round(
          clamp01(ep / 0.78) * PORTFOLIO_DATA.skillsSection.primaryStatTarget
        );
        const textVal = `${targetVal}+`;

        if (giantNumMainRef.current) giantNumMainRef.current.textContent = textVal;
        if (giantNumLimeEchoRef.current) giantNumLimeEchoRef.current.textContent = textVal;
        if (giantNumCyanEchoRef.current) giantNumCyanEchoRef.current.textContent = textVal;

        const exitSplit = clamp01((pinnedP - 0.065) / 0.06);

        if (introMarqueeTopRef.current) {
          introMarqueeTopRef.current.style.transform = `translate3d(${(180 - ep * 260 - pinnedP * 900).toFixed(1)}px, 0, 0) skewX(-10deg)`;
        }
        if (introMarqueeBotRef.current) {
          introMarqueeBotRef.current.style.transform = `translate3d(${(-180 + ep * 260 + pinnedP * 900).toFixed(1)}px, 0, 0) skewX(-10deg)`;
        }

        if (introKickerRef.current) {
          const kSp = easeOutBack(clamp01((ep - 0.08) / 0.55));
          introKickerRef.current.style.opacity = (clamp01(ep * 2.4) * (1 - exitSplit)).toFixed(3);
          introKickerRef.current.style.transform = `translate3d(0, ${((1 - kSp) * -36 - exitSplit * 45).toFixed(1)}px, 0) scale(${(0.78 + kSp * 0.22).toFixed(3)})`;
        }

        if (numStageRef.current) {
          const dropY = (1 - spNum) * 95;
          const tilt = (1 - spNum) * -9;
          const zoom = (0.42 + spNum * 0.58) * (1 + exitSplit * 0.72);
          numStageRef.current.style.opacity = (clamp01(ep * 2.8) * (1 - exitSplit)).toFixed(3);
          numStageRef.current.style.transform = `translate3d(0, ${dropY.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${zoom.toFixed(3)})`;
        }

        // Chromatic 3D echo layers snap cleanly behind 45+ on arrival, then fan out on exit!
        const spreadEcho = (1 - clamp01(ep / 0.85)) * 26 + exitSplit * 34;
        if (giantNumLimeEchoRef.current) {
          giantNumLimeEchoRef.current.style.transform = `translate3d(${(-8 - spreadEcho).toFixed(1)}px, ${(6 + spreadEcho * 0.5).toFixed(1)}px, 0)`;
        }
        if (giantNumCyanEchoRef.current) {
          giantNumCyanEchoRef.current.style.transform = `translate3d(${(8 + spreadEcho).toFixed(1)}px, ${(-6 - spreadEcho * 0.5).toFixed(1)}px, 0)`;
        }

        // Opposite-velocity kinetic headlines ("STRUCTURES & APPS" / "Engineered & Shipped")
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

        // Floating outer telemetry squircle chips
        if (introChipLeftRef.current && introChipRightRef.current) {
          const chSp = easeOutBack(clamp01((ep - 0.28) / 0.58));
          const chOp = clamp01((ep - 0.28) * 3) * (1 - exitSplit * 1.4);
          introChipLeftRef.current.style.opacity = Math.max(0, chOp).toFixed(3);
          introChipLeftRef.current.style.transform = `translate3d(${((1 - chSp) * -70 - exitSplit * 120).toFixed(1)}px, ${(Math.sin(ep * Math.PI) * -8).toFixed(1)}px, 0) rotate(-6deg) scale(${Math.max(0.2, chSp).toFixed(3)})`;
          introChipRightRef.current.style.opacity = Math.max(0, chOp).toFixed(3);
          introChipRightRef.current.style.transform = `translate3d(${((1 - chSp) * 70 + exitSplit * 120).toFixed(1)}px, ${(Math.sin(ep * Math.PI) * 8).toFixed(1)}px, 0) rotate(6deg) scale(${Math.max(0.2, chSp).toFixed(3)})`;
        }

        // Staggered parabolic spring-wave on the 5 squircle tool icons!
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
        applyIntroEntrance(
          p > 0.001 ? 1 : entranceSt.progress,
          p
        );

        // Show 3D WebGL Canvas & Rounded Dock Switcher ONLY inside Beats 1..4, staying visible underneath while the white circular iris expands!
        const irisP = clamp01((p - 0.82) / 0.11);
        const foundryVis =
          clamp01((p - 0.115) / 0.035) * (irisP >= 0.98 ? 0 : 1);
        const dockVis =
          clamp01((p - 0.115) / 0.035) * (1 - clamp01((p - 0.81) / 0.03));

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
        if (twinReadoutRef.current) {
          twinReadoutRef.current.style.opacity = dockVis.toFixed(3);
        }

        const activeChIdx =
          p < 0.31 ? 0 : p < 0.5 ? 1 : p < 0.69 ? 2 : 3;

        if (activeChIdx !== lastLitTab) {
          lastLitTab = activeChIdx;
          CHAPTERS.forEach((ch, idx) => {
            const btn = tabBtnRefs.current[idx];
            if (!btn) return;
            if (idx === activeChIdx) {
              btn.style.backgroundColor = "rgba(255,255,255,0.12)";
              btn.style.color = "#FFFFFF";
            } else {
              btn.style.backgroundColor = "transparent";
              btn.style.color = "rgba(226,232,240,0.65)";
            }
          });
        }

        const nextTwin = CHAPTERS[activeChIdx].twinLabel;
        if (nextTwin !== lastTwinText && twinLabelSpanRef.current) {
          lastTwinText = nextTwin;
          twinLabelSpanRef.current.textContent = nextTwin;
          twinLabelSpanRef.current.style.color = CHAPTERS[activeChIdx].accentHex;
        }

        CHAPTERS.forEach((ch, idx) => {
          const fillEl = tabFillRefs.current[idx];
          if (!fillEl) return;
          const f = clamp01((p - ch.startP) / (ch.endP - ch.startP));
          fillEl.style.transform = `scaleX(${Math.max(0.08, f).toFixed(3)})`;
        });

        // Beat 0 visibility
        const s0Fade = clamp01((p - 0.1) / 0.045);
        if (bg0Ref.current) {
          bg0Ref.current.style.opacity = (1 - s0Fade).toFixed(3);
          bg0Ref.current.style.visibility = s0Fade >= 0.995 ? "hidden" : "visible";
        }

        // ====================================================================
        // BEATS 1..4: 4 SEPARATED 3D + KINETIC DISCIPLINE STAGES
        // ====================================================================
        CHAPTERS.forEach((ch, cIdx) => {
          const wipeIn = easeInOutCubic(clamp01((p - ch.startP) / 0.05));
          const nextStart = cIdx < 3 ? CHAPTERS[cIdx + 1].startP : 0.94;
          const wipeOut = easeInOutCubic(clamp01((p - (nextStart + 0.035)) / 0.04));
          const local = clamp01(
            (p - (ch.startP + 0.015)) / (ch.endP - ch.startP - 0.015)
          );

          const bgEl = bgChapterRefs.current[cIdx];
          const fgEl = fgChapterRefs.current[cIdx];

          if (bgEl) {
            if (wipeIn <= 0.003 || wipeOut >= 0.998) {
              bgEl.style.visibility = "hidden";
            } else {
              bgEl.style.visibility = "visible";
              if (cIdx === 0) {
                const lead = 122 - wipeIn * 148;
                const tail = 98 - wipeIn * 148;
                bgEl.style.clipPath =
                  wipeIn >= 0.995
                    ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                    : `polygon(${lead.toFixed(1)}% 0%, 100% 0%, 100% 100%, ${tail.toFixed(1)}% 100%)`;
              } else if (cIdx === 1) {
                const lead = -22 + wipeIn * 148;
                const tail = 2 + wipeIn * 148;
                bgEl.style.clipPath =
                  wipeIn >= 0.995
                    ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                    : `polygon(0% 0%, ${lead.toFixed(1)}% 0%, ${tail.toFixed(1)}% 100%, 0% 100%)`;
              } else if (cIdx === 2) {
                bgEl.style.clipPath = `inset(${((1 - wipeIn) * 100).toFixed(1)}% 0% 0% 0%)`;
              } else {
                const lead = 122 - wipeIn * 148;
                const tail = 98 - wipeIn * 148;
                bgEl.style.clipPath =
                  wipeIn >= 0.995
                    ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                    : `polygon(${lead.toFixed(1)}% 0%, 100% 0%, 100% 100%, ${tail.toFixed(1)}% 100%)`;
              }
            }
          }

          if (wipeIn > 0.005 && wipeOut < 0.995) {
            const rTop = ribbonTopRefs.current[cIdx];
            const rBot = ribbonBotRefs.current[cIdx];
            if (rTop) {
              rTop.style.transform = `translate3d(${(240 - local * 720).toFixed(1)}px, 0, 0) skewX(-12deg)`;
            }
            if (rBot) {
              rBot.style.transform = `translate3d(${(-260 + local * 720).toFixed(1)}px, 0, 0) skewX(-12deg)`;
            }
          }

          const exitFade = clamp01((p - (nextStart - 0.005)) / 0.04);
          const fgOp = clamp01(wipeIn * 1.6) * (1 - exitFade);

          if (fgEl) {
            if (fgOp <= 0.005) {
              fgEl.style.visibility = "hidden";
              fgEl.style.opacity = "0";
            } else {
              fgEl.style.visibility = "visible";
              fgEl.style.opacity = fgOp.toFixed(3);
              fgEl.style.transform = `translate3d(0, ${(-exitFade * 44).toFixed(1)}px, 0)`;

              const chars = ch.chars;
              for (let i = 0; i < chars.length; i++) {
                const cSpan = charRefs.current[cIdx]?.[i];
                if (!cSpan) continue;
                const cT = clamp01((local * 1.45 - i * 0.032) / 0.28);
                const sp = easeOutBack(cT);
                const dropY = (1 - sp) * (i % 2 === 0 ? -52 : 52);
                const sk = (1 - sp) * -16;
                const sc = Math.max(0.2, 1.42 - sp * 0.42);
                cSpan.style.opacity = clamp01(cT * 3.2).toFixed(3);
                cSpan.style.transform = `translate3d(0, ${dropY.toFixed(1)}px, 0) skewX(${sk.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
              }

              const scannedIdx =
                hoveredRowRef.current !== null
                  ? hoveredRowRef.current
                  : Math.min(3, Math.floor(clamp01(local * 1.15) * 4));
              if (activeChIdx === cIdx) {
                skillsScrollRef.current.activeRow = scannedIdx;
              }

              ch.rows.forEach((row, rIdx) => {
                const rowEl = rowRefs.current[cIdx]?.[rIdx];
                const barEl = barRefs.current[cIdx]?.[rIdx];
                const rT = clamp01((local * 1.5 - 0.06 - rIdx * 0.065) / 0.3);
                const rSp = easeOutBack(rT);
                const isLit = rIdx === scannedIdx;

                if (rowEl) {
                  const slideX = (1 - rSp) * -80 + (isLit ? 10 : 0);
                  const skew = (1 - rSp) * -6;
                  rowEl.style.opacity = clamp01(rT * 2.8).toFixed(3);
                  rowEl.style.transform = `translate3d(${slideX.toFixed(1)}px, 0, 0) skewX(${skew.toFixed(1)}deg)`;
                  rowEl.style.borderColor = isLit
                    ? `${ch.accentHex}99`
                    : "rgba(255,255,255,0.10)";
                  rowEl.style.backgroundColor = isLit
                    ? "rgba(15, 23, 42, 0.78)"
                    : "rgba(15, 23, 42, 0.44)";
                  rowEl.style.boxShadow = isLit
                    ? `0 14px 36px -8px ${ch.accentHex}33`
                    : "0 8px 24px -10px rgba(0,0,0,0.35)";
                }
                if (barEl) {
                  const bf = clamp01(rT * 1.2) * row.fill;
                  barEl.style.transform = `scaleX(${bf.toFixed(3)})`;
                  barEl.style.opacity = isLit ? "1" : "0.45";
                }
              });
            }
          }
        });

        // ====================================================================
        // BEAT 5 (0.82 -> 1.00): WHITE CIRCULAR IRIS WIPE + "STAND OUT" FINALE
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
            const show1 = p > 0.87;
            finaleLine1Ref.current.style.opacity = show1 ? "1" : "0.2";
            finaleLine1Ref.current.style.transform = show1
              ? "translate3d(0, 0, 0)"
              : "translate3d(0, 18px, 0)";
          }
          if (finaleLine2Ref.current) {
            const show2 = p > 0.895;
            finaleLine2Ref.current.style.opacity = show2 ? "1" : "0.2";
            finaleLine2Ref.current.style.transform = show2
              ? "translate3d(0, 0, 0)"
              : "translate3d(0, 18px, 0)";
          }
          setStandOutDOM(p > 0.92);
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

  return (
    <section
      id="act-4"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative h-[640vh] w-full bg-[#F8FAFC]"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* ================================================================
            ROUNDED-2XL TACTILE CHAPTER DOCK (VISIBLE ONLY IN SKILLS 01..04)
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

          {/* Subtle Counter-Gliding Kinetic Background Typography Streams */}
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

          {/* Outer Tactile Rounded-2xl Floating Telemetry Chips (Desktop Safe Corners) */}
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
            {/* Tactile Volt-Lime Squircle Kicker Badge */}
            <div
              ref={introKickerRef}
              className="rounded-xl bg-[#C6FF3D] px-4 py-1.5 shadow-[0_10px_28px_rgba(198,255,61,0.5)] ring-2 ring-[#07131C]/10 will-change-transform"
            >
              <span className="font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#07131C]">
                {PORTFOLIO_DATA.skillsSection.experienceLabel}
              </span>
            </div>

            {/* Layered 3D Chromatic Pop Counter ("45+") */}
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

            {/* Opposite-Velocity Whip Headlines */}
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

            {/* Staggered Parabolic Spring-Wave of Squircle Tool Icons */}
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
            BEATS 1..4 BACKGROUND ATMOSPHERE & GIANT RACING RIBBONS
           ================================================================ */}
        {CHAPTERS.map((ch, idx) => {
          const gradients = [
            "bg-[#090D16] bg-[radial-gradient(circle_at_72%_48%,rgba(245,158,11,0.22)_0%,rgba(67,20,7,0.38)_42%,#090D16_80%)]",
            "bg-[#050C1A] bg-[radial-gradient(circle_at_72%_48%,rgba(56,189,248,0.22)_0%,rgba(29,78,216,0.32)_44%,#050C1A_82%)]",
            "bg-[#0A0F24] bg-[radial-gradient(circle_at_72%_48%,rgba(198,255,61,0.16)_0%,rgba(124,58,237,0.28)_44%,#0A0F24_82%)]",
            "bg-[#0D0716] bg-[radial-gradient(circle_at_72%_48%,rgba(255,107,74,0.22)_0%,rgba(147,51,234,0.28)_44%,#0D0716_82%)]",
          ];
          return (
            <div
              key={ch.id}
              ref={(el) => {
                bgChapterRefs.current[idx] = el;
              }}
              style={{ visibility: "hidden", zIndex: 14 + idx * 2 }}
              className={`pointer-events-none absolute inset-0 overflow-hidden ${gradients[idx]}`}
            >
              <div className="blueprint-grid absolute inset-0 opacity-30" />

              <div
                ref={(el) => {
                  ribbonTopRefs.current[idx] = el;
                }}
                aria-hidden="true"
                className="absolute top-[13%] whitespace-nowrap font-display text-[15vw] sm:text-[10.5vw] font-black uppercase tracking-tighter text-white/[0.045] select-none will-change-transform"
              >
                {ch.ribbonTop}
              </div>
              <div
                ref={(el) => {
                  ribbonBotRefs.current[idx] = el;
                }}
                aria-hidden="true"
                className="absolute bottom-[8%] whitespace-nowrap font-display text-[15vw] sm:text-[10.5vw] font-black uppercase tracking-tighter text-white/[0.045] select-none will-change-transform"
              >
                {ch.ribbonBot}
              </div>
            </div>
          );
        })}

        {/* ================================================================
            REAL-TIME 60-120 FPS BEVELED 3D SCULPTURE STAGE (BEATS 1..4 ONLY)
           ================================================================ */}
        <div
          ref={canvasLayerRef}
          style={{ opacity: 0, visibility: "hidden" }}
          className="pointer-events-none absolute inset-0 z-[34]"
        >
          <Skills3DStage scrollRef={skillsScrollRef} active={inView} />
        </div>

        {/* Bottom-Right Rounded-2xl 3D Digital Twin Badge (Desktop) */}
        <div
          ref={twinReadoutRef}
          className="pointer-events-none hidden lg:flex absolute right-10 bottom-8 z-[44] flex-col items-end gap-0.5 rounded-2xl border border-white/12 bg-slate-950/60 px-4 py-2.5 text-right shadow-xl backdrop-blur-xl opacity-0"
        >
          <span
            ref={twinLabelSpanRef}
            className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#C6FF3D]"
          >
            3D Twin • Active
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">
            Move cursor or hover cards to inspect 3D rig
          </span>
        </div>

        {/* ================================================================
            4 SEPARATED KINETIC FOREGROUND DISCIPLINE CHOREOGRAPHIES
            (TACTILE ROUNDED-2XL CARDS MATCHING PORTFOLIO SQUIRCLE THEME!)
           ================================================================ */}
        {CHAPTERS.map((ch, cIdx) => (
          <div
            key={ch.id}
            ref={(el) => {
              fgChapterRefs.current[cIdx] = el;
            }}
            style={{ visibility: "hidden", opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-[42] mx-auto flex max-w-[1440px] flex-col justify-end lg:justify-center px-4 pb-5 pt-28 sm:px-12 lg:py-16 will-change-transform"
          >
            <div className="pointer-events-auto w-full lg:w-[49%] max-w-[600px]">
              {/* Tactile Rounded-XL Eyebrow Kicker */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] px-3 py-1 backdrop-blur-md">
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ backgroundColor: ch.accentHex }}
                />
                <span
                  className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: ch.accentHex }}
                >
                  {ch.kicker}
                </span>
              </div>

              {/* Per-Character 3D Whip-Slam Discipline Headline */}
              <h3 className="mt-2 flex flex-wrap items-center font-display text-[clamp(2.35rem,7vw,5.1rem)] font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.65)] select-none">
                {ch.chars.map((char, charIdx) => (
                  <span
                    key={charIdx}
                    ref={(el) => {
                      if (!charRefs.current[cIdx]) charRefs.current[cIdx] = [];
                      charRefs.current[cIdx][charIdx] = el;
                    }}
                    style={char === "." ? { color: ch.accentHex } : undefined}
                    className="inline-block will-change-transform"
                  >
                    {char}
                  </span>
                ))}
              </h3>

              {/* 4 Tactile Rounded-2xl Kinetic Skill Cards */}
              <div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-2.5">
                {ch.rows.map((row, rIdx) => (
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
                    className="group relative rounded-2xl border border-white/10 bg-slate-900/50 px-3.5 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-200 will-change-transform"
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="shrink-0 rounded-lg px-2 py-0.5 font-mono text-[10px] font-extrabold tracking-wider text-[#07131C]"
                          style={{ backgroundColor: ch.accentHex }}
                        >
                          {row.code}
                        </span>
                        <span className="truncate font-display text-sm sm:text-[16.5px] font-bold text-white">
                          {row.title}
                        </span>
                      </div>
                      <span
                        className="shrink-0 rounded-lg border border-white/10 bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-bold tracking-wide"
                        style={{ color: ch.accentHex }}
                      >
                        {row.metric}
                      </span>
                    </div>

                    <p className="mt-1 font-sans text-[11px] sm:text-xs text-slate-300/85 line-clamp-1">
                      {row.spec}
                    </p>

                    {/* Smooth Rounded-Full Precision Bar */}
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
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* ================================================================
            BEAT 5 (0.82 -> 1.00): WHITE CIRCULAR IRIS WIPE + "STAND OUT"
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
            {/* LEFT: Circular Rotating Sky-Blue Sunburst + Illustrated Creator Portrait */}
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

            {/* RIGHT: Classic Side-by-Side Pitch Copy + Royal-Blue/Volt-Lime "STAND OUT" */}
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
