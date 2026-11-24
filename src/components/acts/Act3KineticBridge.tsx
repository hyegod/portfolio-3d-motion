"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";
import { ToolBadge } from "@/components/ui/ToolBadges";

gsap.registerPlugin(ScrollTrigger);

const BUILD_CHARS = "BUILD".split("");
const CODE_CHARS = "CODE".split("");
const CREATE_FINAL = "CREATE".split("");
const CREATE_SCRAMBLE_1 = "CR34T3".split("");
const CREATE_SCRAMBLE_2 = "CRE4TE".split("");

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutBack(x: number) {
  const c1 = 1.85;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/**
 * Hyper-Alive Kinetic Typography Showreel Bridge (Act 3)
 * Every beat uses per-letter elastic cascades, click ripple bursts, whip-pan skews,
 * racing geometric backdrops, and orbiting badges — 0 React re-renders during scroll!
 */
export function Act3KineticBridge() {
  const sectionRef = useRef<HTMLElement>(null);

  const beat0Ref = useRef<HTMLDivElement>(null);
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const beat3Ref = useRef<HTMLDivElement>(null);

  // Beat 0 refs
  const ringOuterRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const clickPulseRef = useRef<HTMLDivElement>(null);
  const skillWrapRef = useRef<HTMLDivElement>(null);
  const skillTextRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Beat 1 (BUILD) per-letter & racing truss backdrop refs
  const buildCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const buildBgRibbonRef = useRef<HTMLDivElement>(null);
  const buildSubRef = useRef<HTMLParagraphElement>(null);

  // Beat 2 (CODE) per-letter & shooting telemetry streak refs
  const codeCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const codeStreak1Ref = useRef<HTMLDivElement>(null);
  const codeStreak2Ref = useRef<HTMLDivElement>(null);
  const codeSubRef = useRef<HTMLParagraphElement>(null);

  // Beat 3 (CREATE) per-letter glitch-spring & orbiting badges
  const createCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const orbitRingRef = useRef<HTMLDivElement>(null);
  const createSubRef = useRef<HTMLParagraphElement>(null);

  const { setActiveChapter, setLetterboxActive } = useShowreel();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let currentPhase = -1;
    let lastSkillWord = "";
    let lastCreateStage = -1;

    const setActiveBeat = (idx: number) => {
      if (currentPhase === idx) return;
      currentPhase = idx;
      const beats = [beat0Ref.current, beat1Ref.current, beat2Ref.current, beat3Ref.current];
      beats.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = i === idx ? "1" : "0";
        el.style.pointerEvents = i === idx ? "auto" : "none";
        el.style.zIndex = i === idx ? "20" : "0";
      });
    };

    const ctx = gsap.context(() => {
      const applyProgress = (p: number, updateHud = true) => {
        if (updateHud) setLetterboxActive(p <= 0.78);

        // === BEAT 0 (0.00 -> 0.40): CLICK RIPPLE + CHROMATIC SNAP + WHIP-PAN SKEW ===
        if (p < 0.4) {
          setActiveBeat(0);
            const nextWord =
              p < 0.16
                ? PORTFOLIO_DATA.kineticBridge.initialSkillText
                : p < 0.21
                  ? "My Cr4ft"
                  : PORTFOLIO_DATA.kineticBridge.correctedSkillText;

            if (nextWord !== lastSkillWord && skillTextRef.current) {
              lastSkillWord = nextWord;
              skillTextRef.current.textContent = nextWord;
              skillTextRef.current.classList.toggle("chromatic-text", p > 0.2);
            }

            if (ringOuterRef.current && ringInnerRef.current) {
              const s1 = 0.45 + p * 4.2;
              const s2 = 0.25 + Math.max(0, p - 0.08) * 5.2;
              ringOuterRef.current.style.transform = `scale(${s1.toFixed(3)}) rotate(${(p * 120).toFixed(1)}deg)`;
              ringOuterRef.current.style.opacity = Math.max(0, 0.9 - p * 2.4).toFixed(3);
              ringInnerRef.current.style.transform = `scale(${s2.toFixed(3)}) rotate(${(-p * 160).toFixed(1)}deg)`;
              ringInnerRef.current.style.opacity = Math.max(0, 0.85 - p * 2.1).toFixed(3);
            }

            // Click shockwave burst right at p = 0.20!
            if (clickPulseRef.current) {
              const clickT = clamp01((p - 0.19) / 0.12);
              clickPulseRef.current.style.opacity =
                clickT > 0 && clickT < 1 ? (1 - clickT).toFixed(3) : "0";
              clickPulseRef.current.style.transform = `scale(${(0.3 + clickT * 3.8).toFixed(3)})`;
            }

            if (cursorRef.current) {
              const t = clamp01(p / 0.2);
              const cx = (1 - t) * 140;
              const cy = (1 - t) * 95;
              const clickScale = p > 0.19 && p < 0.25 ? 0.76 : 1;
              cursorRef.current.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) scale(${clickScale})`;
              cursorRef.current.style.opacity = p > 0.03 && p < 0.37 ? "1" : "0";
            }

            if (skillWrapRef.current) {
              const whip = clamp01((p - 0.32) / 0.08);
              const tilt = p > 0.2 ? -6.5 : 0;
              const wipeX = whip * -1400;
              const skewX = whip * -22;
              const stretchX = 1 + whip * 0.42;
              const sc = p > 0.2 ? 1.12 : 0.92 + p * 0.5;
              skillWrapRef.current.style.transform = `translate3d(${wipeX.toFixed(1)}px, 0, 0) rotate(${tilt}deg) skewX(${skewX.toFixed(1)}deg) scale(${(sc * stretchX).toFixed(3)}, ${sc.toFixed(3)})`;
            }

          // === BEAT 1 (0.40 -> 0.60): PER-LETTER ELASTIC SLAM "BUILD" ===
          } else if (p < 0.6) {
            setActiveBeat(1);
            const local = clamp01((p - 0.4) / 0.2);

            for (let i = 0; i < BUILD_CHARS.length; i++) {
              const span = buildCharsRef.current[i];
              if (!span) continue;
              const charT = clamp01((local - i * 0.065) / 0.38);
              const spring = easeOutBack(charT);
              const exitWhip = clamp01((local - 0.82) / 0.18);
              const y = (1 - spring) * (i % 2 === 0 ? 120 : -110) - exitWhip * 90;
              const rot = (1 - spring) * (i % 2 === 0 ? -18 : 18);
              const sc = Math.max(0.05, spring * (1 + local * 0.18));
              span.style.opacity = Math.min(1, charT * 2.5, 1 - exitWhip).toFixed(3);
              span.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
            }

            if (buildBgRibbonRef.current) {
              buildBgRibbonRef.current.style.transform = `translate3d(${(120 - local * 520).toFixed(1)}px, 0, 0) skewX(-12deg)`;
            }
            if (buildSubRef.current) {
              const sOp = Math.min(1, local * 4, (1 - local) * 5);
              buildSubRef.current.style.opacity = Math.max(0, sOp).toFixed(3);
              buildSubRef.current.style.letterSpacing = `${(0.18 + local * 0.25).toFixed(2)}em`;
            }

          // === BEAT 2 (0.60 -> 0.78): ACCORDION KINETIC "CODE" + DATA STREAKS ===
          } else if (p < 0.78) {
            setActiveBeat(2);
            const local = clamp01((p - 0.6) / 0.18);
            const vwScale = Math.min(1, window.innerWidth / 900);

            for (let i = 0; i < CODE_CHARS.length; i++) {
              const span = codeCharsRef.current[i];
              if (!span) continue;
              const charT = clamp01((local - i * 0.07) / 0.36);
              const spring = easeOutBack(charT);
              const spreadX = (i - 1.5) * (local * 32 * vwScale);
              const waveY = Math.sin(local * Math.PI * 2 + i * 1.1) * 14 * vwScale;
              const sc = Math.max(0.05, spring * (0.95 + local * 0.24));
              span.style.opacity = Math.min(1, charT * 3).toFixed(3);
              span.style.transform = `translate3d(${spreadX.toFixed(1)}px, ${((1 - spring) * 90 + waveY).toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
            }

            if (codeStreak1Ref.current) {
              codeStreak1Ref.current.style.transform = `translate3d(${(-400 + local * 950).toFixed(1)}px, 0, 0)`;
            }
            if (codeStreak2Ref.current) {
              codeStreak2Ref.current.style.transform = `translate3d(${(400 - local * 950).toFixed(1)}px, 0, 0)`;
            }
            if (codeSubRef.current) {
              codeSubRef.current.style.opacity = Math.min(1, local * 3.5).toFixed(3);
            }

          // === BEAT 3 (0.78 -> 1.00): GLITCH-SPRING "CREATE" + ORBITING BADGES ===
          } else {
            setActiveBeat(3);
            const local = clamp01((p - 0.78) / 0.22);
            const stage = local < 0.26 ? 0 : local < 0.46 ? 1 : 2;
            const chars =
              stage === 0 ? CREATE_SCRAMBLE_1 : stage === 1 ? CREATE_SCRAMBLE_2 : CREATE_FINAL;

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
              const charT = clamp01((local - i * 0.045) / 0.36);
              const spring = easeOutBack(charT);
              const rot = (1 - spring) * (i % 2 === 0 ? -22 : 22);
              const y = (1 - spring) * 70 + Math.sin(local * Math.PI * 2 + i) * 6;
              span.style.opacity = Math.min(1, charT * 3).toFixed(3);
              span.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${(0.82 + spring * 0.24 + local * 0.14).toFixed(3)})`;
            }

            if (orbitRingRef.current) {
              const orbitRot = -18 + local * 46;
              const orbitScale = 0.78 + local * 0.44;
              orbitRingRef.current.style.transform = `rotate(${orbitRot.toFixed(1)}deg) scale(${orbitScale.toFixed(3)})`;
            }
            if (createSubRef.current) {
              createSubRef.current.style.opacity = Math.min(1, local * 3).toFixed(3);
            }
          }
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
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

      // Pre-seed exact p=0 state on mount so entering "top top" never flicks!
      applyProgress(st.progress, false);
    }, section);

    return () => ctx.revert();
  }, [setActiveChapter, setLetterboxActive]);

  return (
    <section
      id="act-3"
      ref={sectionRef}
      className="relative h-[300vh] w-full bg-white"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* === BEAT 0: DUAL CONCENTRIC CAD HALOS + CLICK SHOCKWAVE + WHIP-PAN === */}
        <div
          ref={beat0Ref}
          className="absolute inset-0 z-20 flex items-center justify-center bg-white"
        >
          <div className="mosaic-grid pointer-events-none absolute inset-0 opacity-45" />

          <div
            ref={ringOuterRef}
            aria-hidden="true"
            className="pointer-events-none absolute h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] rounded-full border-[22px] border-[#1D4ED8]/80 shadow-[0_0_55px_rgba(29,78,216,0.45)] will-change-transform"
          />
          <div
            ref={ringInnerRef}
            aria-hidden="true"
            className="pointer-events-none absolute h-[240px] w-[240px] sm:h-[310px] sm:w-[310px] rounded-full border-[6px] border-dashed border-[#C6FF3D] will-change-transform"
          />
          <div
            ref={clickPulseRef}
            aria-hidden="true"
            className="pointer-events-none absolute h-24 w-24 rounded-full border-4 border-[#1D4ED8] opacity-0 will-change-transform"
          />

          <div
            ref={skillWrapRef}
            className="relative z-10 inline-flex items-center justify-center select-none will-change-transform"
          >
            <h2
              ref={skillTextRef}
              className="font-display text-[clamp(2.4rem,11.5vw,6rem)] font-extrabold tracking-tight text-[#0B0B0F]"
            >
              {PORTFOLIO_DATA.kineticBridge.initialSkillText}
            </h2>

            <div
              ref={cursorRef}
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-7 -right-8 z-20 will-change-transform"
            >
              <svg
                viewBox="0 0 36 36"
                className="h-11 w-11 sm:h-13 sm:w-13 drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)]"
              >
                <path
                  d="M6 4L28 19L17 21L12 31L6 4Z"
                  fill="#FFFFFF"
                  stroke="#0B0B0F"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* === BEAT 1: PER-LETTER ELASTIC SLAM "BUILD" === */}
        <div
          ref={beat1Ref}
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#C2410C] via-[#EA580C] to-[#9A3412] opacity-0"
        >
          <div
            ref={buildBgRibbonRef}
            aria-hidden="true"
            className="pointer-events-none absolute whitespace-nowrap font-display text-[20vw] font-black tracking-tighter text-black/15 select-none will-change-transform"
          >
            STRUCTURES • BRIDGES • SEISMIC • BIM •
          </div>

          <div className="relative z-10 text-center px-3">
            <h2 className="flex items-center justify-center gap-0.5 sm:gap-2 font-display text-[clamp(3.3rem,16.5vw,11.5rem)] font-black tracking-tight text-[#09090B] select-none">
              {BUILD_CHARS.map((ch, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    buildCharsRef.current[idx] = el;
                  }}
                  className="inline-block will-change-transform"
                >
                  {ch}
                </span>
              ))}
            </h2>
            <p
              ref={buildSubRef}
              className="mt-3 font-mono text-xs font-bold uppercase text-black/80"
            >
              Civil &amp; Structural Engineering
            </p>
          </div>
        </div>

        {/* === BEAT 2: ACCORDION KINETIC "CODE" + TELEMETRY STREAKS === */}
        <div
          ref={beat2Ref}
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-[#0A1D42] bg-gradient-to-tr from-[#0284C7] via-[#1D4ED8] to-[#0F172A] opacity-0"
        >
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />

          {/* Racing Horizontal Code Streams */}
          <div
            ref={codeStreak1Ref}
            aria-hidden="true"
            className="pointer-events-none absolute top-[24%] whitespace-nowrap font-mono text-sm sm:text-base font-bold tracking-[0.28em] text-[#38BDF8]/30 will-change-transform"
          >
            SOLVE_FEA(MATRIX) // NEXT.JS 16 // TYPESCRIPT // WEBGL2 120FPS // FASTAPI //
          </div>
          <div
            ref={codeStreak2Ref}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[24%] whitespace-nowrap font-mono text-sm sm:text-base font-bold tracking-[0.28em] text-[#C6FF3D]/25 will-change-transform"
          >
            STREAM_BIM_MESH() // ZERO_RERENDER // PYTHON SOLVER // DIGITAL TWIN //
          </div>

          <div className="relative z-10 text-center px-3">
            <h2 className="flex items-center justify-center font-display text-[clamp(3.4rem,17vw,12rem)] font-black tracking-tight text-[#C6FF3D] drop-shadow-[0_16px_40px_rgba(2,6,23,0.5)] select-none">
              {CODE_CHARS.map((ch, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    codeCharsRef.current[idx] = el;
                  }}
                  className="inline-block will-change-transform"
                >
                  {ch}
                </span>
              ))}
            </h2>
            <p
              ref={codeSubRef}
              className="mt-3 font-mono text-xs uppercase tracking-[0.35em] text-sky-200"
            >
              Full-Stack Systems &amp; Computational Tools
            </p>
          </div>
        </div>

        {/* === BEAT 3: GLITCH-SPRING "CREATE" + ORBITING BADGE CONSTELLATION === */}
        <div
          ref={beat3Ref}
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-[#F8FAFC] opacity-0"
        >
          <div
            ref={orbitRingRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mx-auto max-w-5xl scale-75 sm:scale-100 will-change-transform"
          >
            <div className="absolute left-[4%] sm:left-[8%] top-[14%] sm:top-[18%] -rotate-12 rounded-2xl sm:rounded-3xl bg-white p-2.5 sm:p-4 shadow-xl border border-black/5">
              <ToolBadge tool="autocad" size="md" />
            </div>
            <div className="absolute left-[10%] sm:left-[15%] bottom-[12%] sm:bottom-[16%] rotate-[10deg] rounded-xl sm:rounded-2xl bg-white p-2 sm:p-3.5 shadow-lg border border-black/5">
              <ToolBadge tool="revit" size="sm" />
            </div>
            <div className="absolute right-[4%] sm:right-[8%] top-[14%] sm:top-[18%] rotate-[14deg] rounded-2xl sm:rounded-3xl bg-white p-2.5 sm:p-4 shadow-xl border border-black/5">
              <ToolBadge tool="typescript" size="md" />
            </div>
            <div className="absolute right-[18%] sm:right-[24%] top-[8%] sm:top-[11%] -rotate-[8deg] rounded-xl sm:rounded-2xl bg-white p-2 sm:p-3 shadow-lg border border-black/5">
              <ToolBadge tool="python" size="sm" />
            </div>
            <div className="absolute right-[8%] sm:right-[13%] bottom-[12%] sm:bottom-[17%] -rotate-[12deg] rounded-2xl sm:rounded-3xl bg-white p-2.5 sm:p-4 shadow-xl border border-black/5">
              <ToolBadge tool="figma" size="md" />
            </div>
          </div>

          <div className="relative z-10 text-center px-4">
            <h2 className="flex items-center justify-center font-display text-[clamp(3.4rem,17vw,12rem)] font-black tracking-tighter text-[#0B0B0F] select-none">
              {CREATE_FINAL.map((ch, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    createCharsRef.current[idx] = el;
                  }}
                  className="inline-block will-change-transform"
                >
                  {ch}
                </span>
              ))}
            </h2>
            <p
              ref={createSubRef}
              className="mt-3 font-mono text-[clamp(0.65rem,2.2vw,0.75rem)] font-bold uppercase tracking-[0.3em] text-zinc-500"
            >
              Civil • Software • UI/UX &amp; 3D Design
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
