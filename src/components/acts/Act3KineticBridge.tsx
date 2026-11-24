"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";
import { ToolBadge } from "@/components/ui/ToolBadges";

gsap.registerPlugin(ScrollTrigger);

const BUILD_CHARS = "BUILD.".split("");
const CODE_CHARS = "CODE.".split("");
const CREATE_FINAL = "CREATE.".split("");
const CREATE_SCRAMBLE_1 = "CR34T3.".split("");
const CREATE_SCRAMBLE_2 = "CRE4TE.".split("");

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutBack(x: number) {
  const c1 = 1.95;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Maximum-Impact After-Effects Kinetic Stunt Bridge (Act 3 — 380vh)
 * Zero hard opacity cuts: every beat blasts open via GPU clip-path shutter wipes!
 *   Beat 0 (0.00 - 0.28): Strikethrough "My 5tack ?" -> Volt-Lime "My Craft." Detonation
 *   Beat 1 (0.25 - 0.52): Circular Shockwave Wipe -> Colossal "BUILD." + Live Arch Blueprint
 *   Beat 2 (0.49 - 0.76): Diagonal Razor Slash Wipe -> "CODE." + Splitting </> Brackets
 *   Beat 3 (0.73 - 1.00): Center Iris Burst -> "CREATE." + Live Bezier Ribbons & Frameless Orbit
 */
export function Act3KineticBridge() {
  const sectionRef = useRef<HTMLElement>(null);

  // Beat 0: Strikethrough + Volt-Lime Slam refs
  const ringOuterRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const shockwave1Ref = useRef<HTMLDivElement>(null);
  const shockwave2Ref = useRef<HTMLDivElement>(null);
  const stackWrapRef = useRef<HTMLDivElement>(null);
  const strikeBarRef = useRef<HTMLSpanElement>(null);
  const craftPillRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Beat 1: BUILD (Circular Shockwave Wipe + Live Structural Arch Blueprint)
  const beat1Ref = useRef<HTMLDivElement>(null);
  const buildRibbonTopRef = useRef<HTMLDivElement>(null);
  const buildRibbonBotRef = useRef<HTMLDivElement>(null);
  const buildArchSvgRef = useRef<SVGPathElement>(null);
  const buildCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const buildPillsRef = useRef<HTMLDivElement>(null);

  // Beat 2: CODE (Diagonal Razor Slash Wipe + Splitting </> Brackets)
  const beat2Ref = useRef<HTMLDivElement>(null);
  const bracketLeftRef = useRef<HTMLSpanElement>(null);
  const bracketRightRef = useRef<HTMLSpanElement>(null);
  const codeStreak1Ref = useRef<HTMLDivElement>(null);
  const codeStreak2Ref = useRef<HTMLDivElement>(null);
  const codeCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const codePillsRef = useRef<HTMLDivElement>(null);

  // Beat 3: CREATE (Center Iris + Sweeping Bezier Splines + Frameless Orbit)
  const beat3Ref = useRef<HTMLDivElement>(null);
  const beat3StageRef = useRef<HTMLDivElement>(null);
  const bezierPath1Ref = useRef<SVGPathElement>(null);
  const bezierPath2Ref = useRef<SVGPathElement>(null);
  const orbitRingRef = useRef<HTMLDivElement>(null);
  const createCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const createSubRef = useRef<HTMLDivElement>(null);

  const { setActiveChapter, setLetterboxActive } = useShowreel();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let lastCreateStage = -1;

    const ctx = gsap.context(() => {
      const applyProgress = (p: number, updateHud = true) => {
        if (updateHud) setLetterboxActive(p <= 0.84);

        // ====================================================================
        // BEAT 0 (0.00 -> 0.28): STRIKETHROUGH "My 5tack ?" -> VOLT-LIME "My Craft."
        // ====================================================================
        const clickT = clamp01((p - 0.1) / 0.1);
        const craftSlam = easeOutBack(clamp01((p - 0.11) / 0.11));

        if (ringOuterRef.current && ringInnerRef.current) {
          const r1 = 0.55 + p * 3.4;
          const r2 = 0.35 + p * 4.1;
          ringOuterRef.current.style.transform = `scale(${r1.toFixed(3)}) rotate(${(p * 180).toFixed(1)}deg)`;
          ringInnerRef.current.style.transform = `scale(${r2.toFixed(3)}) rotate(${(-p * 240).toFixed(1)}deg)`;
        }

        // Dual concentric click shockwaves right at p = 0.11
        if (shockwave1Ref.current && shockwave2Ref.current) {
          const sw1 = clamp01((p - 0.1) / 0.12);
          const sw2 = clamp01((p - 0.12) / 0.13);
          shockwave1Ref.current.style.opacity =
            sw1 > 0 && sw1 < 1 ? ((1 - sw1) * 0.9).toFixed(3) : "0";
          shockwave1Ref.current.style.transform = `scale(${(0.35 + sw1 * 5.2).toFixed(3)})`;
          shockwave2Ref.current.style.opacity =
            sw2 > 0 && sw2 < 1 ? ((1 - sw2) * 0.75).toFixed(3) : "0";
          shockwave2Ref.current.style.transform = `scale(${(0.25 + sw2 * 6.4).toFixed(3)})`;
        }

        // "My 5tack ?" gets crossed out & pushed upward into faded ghost headline
        if (stackWrapRef.current) {
          const liftY = -clickT * 48;
          const shrink = 1 - clickT * 0.34;
          const op = 1 - clickT * 0.72;
          stackWrapRef.current.style.transform = `translate3d(0, ${liftY.toFixed(1)}px, 0) scale(${shrink.toFixed(3)})`;
          stackWrapRef.current.style.opacity = op.toFixed(3);
        }
        if (strikeBarRef.current) {
          strikeBarRef.current.style.transform = `scaleX(${clamp01(clickT * 1.4).toFixed(3)})`;
        }

        // Volt-Lime "My Craft." Pill slams onto screen with spring overshoot!
        if (craftPillRef.current) {
          const pillOp = clamp01((p - 0.1) / 0.04);
          const pillScale = Math.max(0.01, 2.15 - craftSlam * 1.15);
          const pillRot = (1 - craftSlam) * 12 - 2;
          const pillY = (1 - craftSlam) * 42 + 18;
          craftPillRef.current.style.opacity = pillOp.toFixed(3);
          craftPillRef.current.style.transform = `translate3d(0, ${pillY.toFixed(1)}px, 0) rotate(${pillRot.toFixed(1)}deg) scale(${pillScale.toFixed(3)})`;
        }

        // Studio pointer cursor races in & clicks
        if (cursorRef.current) {
          const curIn = clamp01(p / 0.11);
          const cx = (1 - curIn) * 165;
          const cy = (1 - curIn) * 115;
          const press = p > 0.1 && p < 0.15 ? 0.76 : 1;
          cursorRef.current.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) scale(${press})`;
          cursorRef.current.style.opacity = p > 0.01 && p < 0.27 ? "1" : "0";
        }

        // ====================================================================
        // BEAT 1 (0.25 -> 0.52): CIRCULAR SHOCKWAVE WIPE -> COLOSSAL "BUILD."
        // ====================================================================
        const b1Wipe = easeInOutCubic(clamp01((p - 0.25) / 0.08));
        const b1Local = clamp01((p - 0.26) / 0.25);

        if (beat1Ref.current) {
          beat1Ref.current.style.clipPath = `circle(${(b1Wipe * 150).toFixed(1)}% at 50% 54%)`;
          beat1Ref.current.style.visibility = b1Wipe > 0.005 ? "visible" : "hidden";
        }

        if (b1Wipe > 0.005) {
          if (buildRibbonTopRef.current) {
            buildRibbonTopRef.current.style.transform = `translate3d(${(220 - b1Local * 680).toFixed(1)}px, 0, 0) skewX(-14deg)`;
          }
          if (buildRibbonBotRef.current) {
            buildRibbonBotRef.current.style.transform = `translate3d(${(-280 + b1Local * 680).toFixed(1)}px, 0, 0) skewX(-14deg)`;
          }
          if (buildArchSvgRef.current) {
            const draw = 1200 * (1 - clamp01(b1Local * 1.6));
            buildArchSvgRef.current.style.strokeDashoffset = draw.toFixed(1);
          }

          for (let i = 0; i < BUILD_CHARS.length; i++) {
            const span = buildCharsRef.current[i];
            if (!span) continue;
            const charT = clamp01((b1Local - i * 0.045) / 0.34);
            const sp = easeOutBack(charT);
            const dropY = (1 - sp) * (i % 2 === 0 ? -150 : 150);
            const zScale = 2.6 - sp * 1.6 + b1Local * 0.14;
            const rot = (1 - sp) * (i % 2 === 0 ? -20 : 20);
            span.style.opacity = clamp01(charT * 3).toFixed(3);
            span.style.transform = `translate3d(0, ${dropY.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${Math.max(0.1, zScale).toFixed(3)})`;
          }

          if (buildPillsRef.current) {
            const pT = easeOutBack(clamp01((b1Local - 0.22) / 0.35));
            buildPillsRef.current.style.opacity = clamp01((b1Local - 0.2) * 4).toFixed(3);
            buildPillsRef.current.style.transform = `translate3d(0, ${((1 - pT) * 36).toFixed(1)}px, 0) scale(${(0.85 + pT * 0.15).toFixed(3)})`;
          }
        }

        // ====================================================================
        // BEAT 2 (0.49 -> 0.76): DIAGONAL RAZOR SLASH WIPE -> "CODE."
        // ====================================================================
        const b2Wipe = easeInOutCubic(clamp01((p - 0.49) / 0.08));
        const b2Local = clamp01((p - 0.5) / 0.25);

        if (beat2Ref.current) {
          // Sweeping diagonal razor polygon from right-bottom across to full viewport
          const lead = 125 - b2Wipe * 155;
          const tail = 100 - b2Wipe * 155;
          beat2Ref.current.style.clipPath =
            b2Wipe >= 0.995
              ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
              : `polygon(${lead.toFixed(1)}% 0%, 100% 0%, 100% 100%, ${tail.toFixed(1)}% 100%)`;
          beat2Ref.current.style.visibility = b2Wipe > 0.005 ? "visible" : "hidden";
        }

        if (b2Wipe > 0.005) {
          const vw = Math.min(1, window.innerWidth / 1100);
          const splitT = easeOutBack(clamp01(b2Local / 0.42));

          if (bracketLeftRef.current && bracketRightRef.current) {
            const bx = splitT * 340 * vw;
            bracketLeftRef.current.style.transform = `translate3d(${(-bx).toFixed(1)}px, 0, 0) scale(${(0.6 + splitT * 0.4).toFixed(3)})`;
            bracketRightRef.current.style.transform = `translate3d(${bx.toFixed(1)}px, 0, 0) scale(${(0.6 + splitT * 0.4).toFixed(3)})`;
          }

          for (let i = 0; i < CODE_CHARS.length; i++) {
            const span = codeCharsRef.current[i];
            if (!span) continue;
            const charT = clamp01((b2Local - i * 0.05) / 0.34);
            const sp = easeOutBack(charT);
            const spreadX = (i - 2) * (b2Local * 22 * vw);
            const waveY = Math.sin(b2Local * Math.PI * 2.5 + i * 1.1) * 12 * vw;
            const sc = Math.max(0.08, sp * (0.94 + b2Local * 0.22));
            const sk = (1 - sp) * 24;
            span.style.opacity = clamp01(charT * 3.2).toFixed(3);
            span.style.transform = `translate3d(${spreadX.toFixed(1)}px, ${((1 - sp) * 95 + waveY).toFixed(1)}px, 0) skewX(${sk.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
          }

          if (codeStreak1Ref.current) {
            codeStreak1Ref.current.style.transform = `translate3d(${(-460 + b2Local * 1040).toFixed(1)}px, 0, 0)`;
          }
          if (codeStreak2Ref.current) {
            codeStreak2Ref.current.style.transform = `translate3d(${(460 - b2Local * 1040).toFixed(1)}px, 0, 0)`;
          }
          if (codePillsRef.current) {
            codePillsRef.current.style.opacity = clamp01((b2Local - 0.18) * 4).toFixed(3);
          }
        }

        // ====================================================================
        // BEAT 3 (0.73 -> 1.00): CENTER IRIS BURST -> "CREATE." + BEZIER SPLINES
        // ====================================================================
        const b3Wipe = easeInOutCubic(clamp01((p - 0.73) / 0.08));
        const b3Local = clamp01((p - 0.74) / 0.26);

        if (beat3Ref.current) {
          beat3Ref.current.style.clipPath = `circle(${(b3Wipe * 150).toFixed(1)}% at 50% 50%)`;
          beat3Ref.current.style.visibility = b3Wipe > 0.005 ? "visible" : "hidden";
        }

        if (b3Wipe > 0.005) {
          const stage = b3Local < 0.2 ? 0 : b3Local < 0.36 ? 1 : 2;
          const chars =
            stage === 0
              ? CREATE_SCRAMBLE_1
              : stage === 1
                ? CREATE_SCRAMBLE_2
                : CREATE_FINAL;

          if (stage !== lastCreateStage) {
            lastCreateStage = stage;
            for (let i = 0; i < chars.length; i++) {
              const span = createCharsRef.current[i];
              if (span) span.textContent = chars[i];
            }
          }

          for (let i = 0; i < CREATE_FINAL.length; i++) {
            const span = createCharsRef.current[i];
            if (!span) continue;
            const charT = clamp01((b3Local - i * 0.038) / 0.34);
            const sp = easeOutBack(charT);
            const rot = (1 - sp) * (i % 2 === 0 ? -24 : 24);
            const y = (1 - sp) * 76 + Math.sin(b3Local * Math.PI * 2 + i) * 5;
            span.style.opacity = clamp01(charT * 3.2).toFixed(3);
            span.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${(0.8 + sp * 0.24).toFixed(3)})`;
          }

          if (bezierPath1Ref.current && bezierPath2Ref.current) {
            const dash = 1600 * (1 - clamp01(b3Local * 1.45));
            bezierPath1Ref.current.style.strokeDashoffset = dash.toFixed(1);
            bezierPath2Ref.current.style.strokeDashoffset = (-dash).toFixed(1);
          }

          if (orbitRingRef.current) {
            const orbitRot = -24 + b3Local * 58;
            const orbitScale = 0.72 + b3Local * 0.42;
            orbitRingRef.current.style.transform = `rotate(${orbitRot.toFixed(1)}deg) scale(${orbitScale.toFixed(3)})`;
          }

          if (createSubRef.current) {
            createSubRef.current.style.opacity = clamp01((b3Local - 0.16) * 4).toFixed(3);
          }

          // Camera zoom-punch exit right into Act 4!
          if (beat3StageRef.current) {
            const exitPush = easeInOutCubic(clamp01((b3Local - 0.78) / 0.22));
            beat3StageRef.current.style.transform = `scale(${(1 + exitPush * 0.22).toFixed(3)})`;
          }
        }
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.25,
        onEnter: () => {
          setActiveChapter("act-3");
          setLetterboxActive(true);
        },
        onEnterBack: () => {
          setActiveChapter("act-3");
          setLetterboxActive(true);
        },
        onUpdate: (self) => {
          applyProgress(self.progress, true);
        },
      });

      // Synchronously seed initial p=0 state on mount (zero entry flick!)
      applyProgress(st.progress, false);
    }, section);

    return () => ctx.revert();
  }, [setActiveChapter, setLetterboxActive]);

  return (
    <section
      id="act-3"
      ref={sectionRef}
      className="relative h-[380vh] w-full bg-[#F8FAFC]"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* ================================================================
            BEAT 0: STRIKETHROUGH "My 5tack ?" -> VOLT-LIME "My Craft." SLAM
           ================================================================ */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F8FAFC] px-4">
          <div className="mosaic-grid pointer-events-none absolute inset-0 opacity-45" />

          {/* Rotating CAD Target Halos */}
          <div
            ref={ringOuterRef}
            aria-hidden="true"
            className="pointer-events-none absolute h-[290px] w-[290px] sm:h-[410px] sm:w-[410px] rounded-full border-[2px] border-dashed border-[#1D4ED8]/35 will-change-transform"
          />
          <div
            ref={ringInnerRef}
            aria-hidden="true"
            className="pointer-events-none absolute h-[210px] w-[210px] sm:h-[300px] sm:w-[300px] rounded-full border-[14px] border-[#1D4ED8]/12 will-change-transform"
          />

          {/* Dual Click Detonation Shockwaves */}
          <div
            ref={shockwave1Ref}
            aria-hidden="true"
            className="pointer-events-none absolute h-28 w-28 rounded-full border-[6px] border-[#C6FF3D] opacity-0 will-change-transform"
          />
          <div
            ref={shockwave2Ref}
            aria-hidden="true"
            className="pointer-events-none absolute h-28 w-28 rounded-full border-[3px] border-[#1D4ED8] opacity-0 will-change-transform"
          />

          <span className="relative z-10 mb-5 rounded-full border border-slate-300 bg-white/90 px-4 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-slate-600 shadow-sm">
            03 • WHAT I ACTUALLY DO
          </span>

          <div className="relative z-10 flex flex-col items-center justify-center select-none">
            {/* Crossed-Out "My 5tack ?" */}
            <div ref={stackWrapRef} className="relative inline-flex items-center will-change-transform">
              <h2 className="font-display text-[clamp(2.3rem,10vw,5.4rem)] font-black tracking-tight text-slate-800">
                {PORTFOLIO_DATA.kineticBridge.initialSkillText}
              </h2>
              <span
                ref={strikeBarRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-[-4%] right-[-4%] top-1/2 h-1.5 sm:h-2.5 -translate-y-1/2 origin-left rounded-full bg-[#FF6B4A] will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            {/* Slamming Volt-Lime "My Craft." Capsule */}
            <div
              ref={craftPillRef}
              className="relative -mt-3 sm:-mt-5 rounded-2xl sm:rounded-3xl bg-[#C6FF3D] px-6 py-2 sm:px-10 sm:py-3 shadow-[0_24px_65px_rgba(198,255,61,0.65)] ring-4 ring-[#07131C]/10 opacity-0 will-change-transform"
            >
              <span className="font-display text-[clamp(2.6rem,11.5vw,6.4rem)] font-black leading-none tracking-tight text-[#07131C]">
                {PORTFOLIO_DATA.kineticBridge.correctedSkillText}.
              </span>
            </div>

            {/* Studio Pointer Cursor */}
            <div
              ref={cursorRef}
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-8 -right-8 z-30 opacity-0 will-change-transform"
            >
              <svg
                viewBox="0 0 36 36"
                className="h-11 w-11 sm:h-14 sm:w-14 drop-shadow-[0_10px_18px_rgba(0,0,0,0.32)]"
              >
                <path
                  d="M5 3L30 18L18 21L23 32L17 34L12 23L5 29V3Z"
                  fill="#FFFFFF"
                  stroke="#07131C"
                  strokeWidth="2.6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ================================================================
            BEAT 1: CIRCULAR SHOCKWAVE WIPE -> COLOSSAL "BUILD."
           ================================================================ */}
        <div
          ref={beat1Ref}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-[#090D16] bg-[radial-gradient(circle_at_50%_50%,#9A3412_0%,#431407_48%,#090D16_100%)]"
          style={{ clipPath: "circle(0% at 50% 54%)", visibility: "hidden" }}
        >
          <div className="blueprint-grid absolute inset-0 opacity-30" />

          {/* Counter-Racing Colossal Caution / Structural Ribbons */}
          <div
            ref={buildRibbonTopRef}
            aria-hidden="true"
            className="absolute top-[11%] whitespace-nowrap font-display text-[15vw] sm:text-[11vw] font-black uppercase tracking-tighter text-amber-400/10 select-none will-change-transform"
          >
            CABLE-STAYED BRIDGES • SEISMIC SHEAR CORES • LOD 400 BIM •
          </div>
          <div
            ref={buildRibbonBotRef}
            aria-hidden="true"
            className="absolute bottom-[11%] whitespace-nowrap font-display text-[15vw] sm:text-[11vw] font-black uppercase tracking-tighter text-orange-500/12 select-none will-change-transform"
          >
            280M MAIN SPAN • SNI 1726 • ACI 318 • FINITE ELEMENT •
          </div>

          {/* Live Scrubbed Parabolic Tied-Arch Blueprint SVG Behind Text */}
          <svg
            aria-hidden="true"
            viewBox="0 0 900 420"
            className="absolute w-[94vw] max-w-5xl opacity-45"
            fill="none"
          >
            <path
              ref={buildArchSvgRef}
              d="M 60 330 Q 450 20 840 330 M 40 330 L 860 330 M 200 232 L 200 330 M 320 182 L 320 330 M 450 162 L 450 330 M 580 182 L 580 330 M 700 232 L 700 330"
              stroke="#FACC15"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="1200"
              strokeDashoffset="1200"
            />
            <circle cx="450" cy="175" r="14" stroke="#C6FF3D" strokeWidth="2.5" />
          </svg>

          <div className="relative z-10 flex flex-col items-center text-center px-3">
            <span className="mb-2 rounded-full border border-amber-400/40 bg-amber-500/15 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300 backdrop-blur-sm">
              PILLAR 01 // CIVIL &amp; STRUCTURAL ENGINEERING
            </span>

            <h2 className="flex items-center justify-center font-display text-[clamp(3.6rem,17vw,12.5rem)] font-black leading-none tracking-tight text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.75)] select-none">
              {BUILD_CHARS.map((ch, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    buildCharsRef.current[idx] = el;
                  }}
                  className={`inline-block will-change-transform ${
                    ch === "." ? "text-[#FACC15]" : ""
                  }`}
                >
                  {ch}
                </span>
              ))}
            </h2>

            <div
              ref={buildPillsRef}
              className="mt-4 flex flex-wrap items-center justify-center gap-2 will-change-transform"
            >
              {["280m Cable-Stayed FEA", "42F Seismic Core", "Revit BIM LOD 400"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-amber-300/35 bg-black/45 px-3.5 py-1 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-200 backdrop-blur-md"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* ================================================================
            BEAT 2: DIAGONAL RAZOR SLASH WIPE -> "CODE." + </> BRACKETS
           ================================================================ */}
        <div
          ref={beat2Ref}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden bg-[#040B1A] bg-[radial-gradient(circle_at_50%_50%,#1D4ED8_0%,#0A1938_52%,#040B1A_100%)]"
          style={{
            clipPath: "polygon(125% 0%, 100% 0%, 100% 100%, 100% 100%)",
            visibility: "hidden",
          }}
        >
          <div className="blueprint-grid absolute inset-0 opacity-45" />

          {/* Racing Compiler Telemetry Streams */}
          <div
            ref={codeStreak1Ref}
            aria-hidden="true"
            className="absolute top-[18%] whitespace-nowrap font-mono text-xs sm:text-base font-bold tracking-[0.28em] text-[#38BDF8]/40 will-change-transform"
          >
            SOLVE_FEA_MATRIX() // NEXT.JS 16 // TYPESCRIPT STRICT // WEBGL2 120FPS // FASTAPI //
          </div>
          <div
            ref={codeStreak2Ref}
            aria-hidden="true"
            className="absolute bottom-[18%] whitespace-nowrap font-mono text-xs sm:text-base font-bold tracking-[0.28em] text-[#C6FF3D]/35 will-change-transform"
          >
            STREAM_DIGITAL_TWIN() // ZERO_RERENDER // PYTHON SOLVER // REALTIME SHADERS //
          </div>

          {/* Giant Splitting </> Vector Code Brackets */}
          <span
            ref={bracketLeftRef}
            aria-hidden="true"
            className="hidden sm:inline-block absolute font-mono text-7xl lg:text-9xl font-black text-[#38BDF8]/35 select-none will-change-transform"
          >
            &lt;
          </span>
          <span
            ref={bracketRightRef}
            aria-hidden="true"
            className="hidden sm:inline-block absolute font-mono text-7xl lg:text-9xl font-black text-[#38BDF8]/35 select-none will-change-transform"
          >
            /&gt;
          </span>

          <div className="relative z-10 flex flex-col items-center text-center px-3">
            <span className="mb-2 rounded-full border border-[#38BDF8]/45 bg-[#07152B]/80 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#38BDF8] backdrop-blur-sm">
              PILLAR 02 // FULL-STACK &amp; COMPUTATIONAL SOFTWARE
            </span>

            <h2 className="flex items-center justify-center font-display text-[clamp(3.6rem,17vw,12.5rem)] font-black leading-none tracking-tight text-[#C6FF3D] drop-shadow-[0_20px_55px_rgba(2,6,23,0.8)] select-none">
              {CODE_CHARS.map((ch, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    codeCharsRef.current[idx] = el;
                  }}
                  className={`inline-block will-change-transform ${
                    ch === "." ? "text-[#38BDF8]" : ""
                  }`}
                >
                  {ch}
                </span>
              ))}
            </h2>

            <div
              ref={codePillsRef}
              className="mt-4 flex flex-wrap items-center justify-center gap-2 opacity-0"
            >
              {["TypeScript • Next.js", "Python FEA Solvers", "120 FPS Three.js"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#C6FF3D]/35 bg-[#040B1A]/70 px-3.5 py-1 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-100 backdrop-blur-md"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* ================================================================
            BEAT 3: CENTER IRIS BURST -> "CREATE." + LIVE BEZIER SPLINES
           ================================================================ */}
        <div
          ref={beat3Ref}
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center overflow-hidden bg-[#F8FAFC]"
          style={{ clipPath: "circle(0% at 50% 50%)", visibility: "hidden" }}
        >
          <div className="dot-grid-light absolute inset-0" />

          {/* Sweeping Live Bezier Motion Ribbons (Zero Boxiness!) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 900"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <path
              ref={bezierPath1Ref}
              d="M -120 720 C 320 120, 980 860, 1560 180"
              stroke="#1D4ED8"
              strokeOpacity="0.16"
              strokeWidth="28"
              strokeLinecap="round"
              strokeDasharray="1600"
              strokeDashoffset="1600"
            />
            <path
              ref={bezierPath2Ref}
              d="M -120 220 C 460 820, 1020 80, 1560 700"
              stroke="#C6FF3D"
              strokeOpacity="0.55"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="1600"
              strokeDashoffset="-1600"
            />
          </svg>

          {/* Frameless Floating Tool Emblems Orbiting in Open Space (NO White Squares!) */}
          <div
            ref={orbitRingRef}
            aria-hidden="true"
            className="absolute inset-0 mx-auto max-w-5xl scale-75 sm:scale-100 will-change-transform"
          >
            <div className="absolute left-[6%] sm:left-[9%] top-[16%] -rotate-12 drop-shadow-[0_18px_28px_rgba(15,23,42,0.22)]">
              <ToolBadge tool="autocad" size="lg" />
            </div>
            <div className="absolute left-[12%] sm:left-[16%] bottom-[15%] rotate-[12deg] drop-shadow-[0_18px_28px_rgba(15,23,42,0.22)]">
              <ToolBadge tool="revit" size="md" />
            </div>
            <div className="absolute right-[6%] sm:right-[9%] top-[16%] rotate-[14deg] drop-shadow-[0_18px_28px_rgba(15,23,42,0.22)]">
              <ToolBadge tool="typescript" size="lg" />
            </div>
            <div className="absolute right-[20%] sm:right-[25%] top-[9%] -rotate-[8deg] drop-shadow-[0_18px_28px_rgba(15,23,42,0.2)]">
              <ToolBadge tool="python" size="md" />
            </div>
            <div className="absolute right-[10%] sm:right-[15%] bottom-[15%] -rotate-[12deg] drop-shadow-[0_18px_28px_rgba(15,23,42,0.22)]">
              <ToolBadge tool="figma" size="lg" />
            </div>
          </div>

          <div
            ref={beat3StageRef}
            className="relative z-10 flex flex-col items-center text-center px-4 will-change-transform"
          >
            <span className="mb-2 rounded-full border border-[#1D4ED8]/25 bg-[#1D4ED8]/10 px-4 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#1D4ED8]">
              PILLAR 03 // UI/UX &amp; INTERACTIVE 3D MOTION
            </span>

            <h2 className="flex items-center justify-center font-display text-[clamp(3.4rem,16.5vw,12rem)] font-black leading-none tracking-tighter text-[#07131C] select-none">
              {CREATE_FINAL.map((ch, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    createCharsRef.current[idx] = el;
                  }}
                  className={`inline-block will-change-transform ${
                    ch === "." ? "text-[#1D4ED8]" : ""
                  }`}
                >
                  {ch}
                </span>
              ))}
            </h2>

            <div
              ref={createSubRef}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#07131C] px-5 py-1.5 font-mono text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.26em] text-[#C6FF3D] shadow-xl opacity-0"
            >
              <span>Civil • Software • 3D Motion Craft</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
