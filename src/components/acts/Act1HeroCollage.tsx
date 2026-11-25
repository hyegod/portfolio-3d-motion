"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";
import { ToolBadge } from "@/components/ui/ToolBadges";
import {
  CodeBokehLeaves,
  CodeCreatorPortrait,
  CodeDraftingToolsProp,
  CodeEspressoProp,
  CodeMechKeyboardProp,
  CodeTurntableProp,
} from "@/components/ui/CodeMotionAssets";

gsap.registerPlugin(ScrollTrigger);

const PORT_CHARS = PORTFOLIO_DATA.hero.scriptTitle.split("");
const FOLIO_CHARS = PORTFOLIO_DATA.hero.boldTitle.split("");

export function Act1HeroCollage() {
  const sectionRef = useRef<HTMLElement>(null);
  const cameraRigRef = useRef<HTMLDivElement>(null);
  const exitFlashRef = useRef<HTMLDivElement>(null);
  const fgLeavesRef = useRef<HTMLDivElement>(null);
  const mgStageRef = useRef<HTMLDivElement>(null);
  const bgArcsRef = useRef<SVGSVGElement>(null);
  const introTlRef = useRef<gsap.core.Timeline | null>(null);
  const idleTweensRef = useRef<gsap.core.Tween[]>([]);

  // Independent multi-depth prop refs for true After-Effects fly-through parallax!
  const propDraftingRef = useRef<HTMLDivElement>(null);
  const propEspressoRef = useRef<HTMLDivElement>(null);
  const propKeyboardRef = useRef<HTMLDivElement>(null);
  const propTurntableRef = useRef<HTMLDivElement>(null);
  const propPortraitRef = useRef<HTMLDivElement>(null);
  const titlePortRef = useRef<HTMLHeadingElement>(null);
  const titleFolioRef = useRef<HTMLSpanElement>(null);
  const tapeRowRef = useRef<HTMLDivElement>(null);
  const topPillRef = useRef<HTMLDivElement>(null);

  const { setActiveChapter, setLetterboxActive, isAppReady } = useShowreel();
  const isAppReadyRef = useRef(isAppReady);

  // Trigger Act 1's elastic spring entrance right as LoadingScreen shutters part!
  useEffect(() => {
    isAppReadyRef.current = isAppReady;
    if (isAppReady && introTlRef.current) {
      introTlRef.current.play(0);
    }
  }, [isAppReady]);

  useEffect(() => {
    const section = sectionRef.current;
    const cameraRig = cameraRigRef.current;
    const exitFlash = exitFlashRef.current;
    if (!section || !cameraRig || !exitFlash) return;

    const isTouchOnly = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // 1. Living Kinetic Intro Choreography (Paused until LoadingScreen opens!)
      const introTl = gsap.timeline({
        paused: true,
        defaults: { ease: "expo.out" },
      });

      introTl
        .fromTo(
          cameraRig,
          { scale: 1.12, rotate: -1.8 },
          { scale: 1, rotate: 0, duration: 1.1, ease: "expo.out" },
          0
        )
        .from(
          ".hero-prop",
          {
            scale: 0.55,
            opacity: 0,
            y: 38,
            rotate: (i) => (i % 2 === 0 ? -18 : 18),
            duration: 0.9,
            stagger: 0.06,
            ease: "back.out(1.65)",
          },
          0.12
        )
        .from(
          ".hero-char",
          {
            y: 64,
            scale: 0.5,
            rotate: (i) => (i % 2 === 0 ? -16 : 14),
            opacity: 0,
            duration: 0.85,
            stagger: 0.045,
            ease: "back.out(2.1)",
          },
          0.2
        )
        .from(
          ".hero-badge-pop",
          {
            scale: 0,
            rotate: -28,
            opacity: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "back.out(2.2)",
          },
          0.42
        );

      introTlRef.current = introTl;
      if (prefersReducedMotion) {
        introTl.progress(1);
      } else if (isAppReadyRef.current) {
        introTl.play(0);
      }

      // Continuous subtle alive kinetic wave — auto-paused when scrolled past Act 1!
      const idleList: gsap.core.Tween[] = [];
      if (!prefersReducedMotion) {
        idleList.push(
          gsap.to(".hero-char", {
            y: (i) => (i % 2 === 0 ? -5 : 5),
            duration: 2.2,
            stagger: { each: 0.14, repeat: -1, yoyo: true },
            ease: "sine.inOut",
            delay: 1.35,
          })
        );
        idleList.push(
          gsap.to(".hero-tape-live", {
            rotate: 5.5,
            y: -4,
            duration: 2.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.2,
          })
        );
      }
      idleTweensRef.current = idleList;

      // 2. TRUE MULTI-LAYER CAMERA FLY-THROUGH ON SCROLL
      // Every prop flies past the camera lens at its own Z-depth, angle & speed!
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          onEnter: () => {
            setActiveChapter("act-1");
            setLetterboxActive(true);
            idleTweensRef.current.forEach((tw) => tw.play());
          },
          onEnterBack: () => {
            setActiveChapter("act-1");
            setLetterboxActive(true);
            idleTweensRef.current.forEach((tw) => tw.play());
          },
          onLeave: () => {
            idleTweensRef.current.forEach((tw) => tw.pause());
          },
        },
      });

      scrollTl
        // Dramatic camera roll + lens push-in
        .to(
          cameraRig,
          {
            scale: 1.24,
            rotate: 5,
            duration: 0.35,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          cameraRig,
          {
            scale: 1.62,
            rotate: -6,
            duration: 0.65,
            ease: "power3.in",
          },
          0.35
        )
        // Independent multi-plane radial prop dispersion (feels like diving through a 3D desk!)
        .to(
          propDraftingRef.current,
          { x: -240, y: -160, rotate: -48, scale: 1.65, opacity: 0, ease: "power2.in" },
          0.18
        )
        .to(
          propEspressoRef.current,
          { x: -220, y: 170, rotate: 35, scale: 1.7, opacity: 0, ease: "power2.in" },
          0.2
        )
        .to(
          propKeyboardRef.current,
          { y: 230, scale: 1.65, rotate: -14, opacity: 0, ease: "power2.in" },
          0.22
        )
        .to(
          propTurntableRef.current,
          { x: 250, y: -180, rotate: 32, scale: 1.6, opacity: 0, ease: "power2.in" },
          0.18
        )
        .to(
          propPortraitRef.current,
          { x: 280, y: 110, rotate: 16, scale: 1.55, opacity: 0, ease: "power2.in" },
          0.22
        )
        // Center typography splits open as camera dives through!
        .to(
          topPillRef.current,
          { y: -120, scale: 1.35, opacity: 0, ease: "power2.in" },
          0.28
        )
        .to(
          titlePortRef.current,
          { x: -160, y: -60, rotate: -18, scale: 1.85, opacity: 0, ease: "power3.in" },
          0.34
        )
        .to(
          titleFolioRef.current,
          { x: 170, y: 55, rotate: 14, scale: 1.95, opacity: 0, ease: "power3.in" },
          0.34
        )
        .to(
          tapeRowRef.current,
          { y: 150, scale: 1.6, opacity: 0, ease: "power2.in" },
          0.3
        )
        // Foreground bokeh leaves rush aggressively past the cinema lens
        .to(
          fgLeavesRef.current,
          { scale: 2.35, opacity: 0.2, ease: "power2.in" },
          0.1
        )
        // Bright lens-flare flash straight into 3D Studio Desk!
        .to(
          exitFlash,
          { opacity: 1, duration: 0.24, ease: "power2.in" },
          0.74
        );
    }, section);

    // 3. Multi-plane 3D Perspective Pointer Parallax (desktop fine-pointer only!)
    if (isTouchOnly || prefersReducedMotion) {
      return () => {
        introTlRef.current = null;
        idleTweensRef.current = [];
        ctx.revert();
      };
    }

    const mgQuickX = mgStageRef.current
      ? gsap.quickTo(mgStageRef.current, "x", { duration: 0.45, ease: "power2.out" })
      : null;
    const mgQuickY = mgStageRef.current
      ? gsap.quickTo(mgStageRef.current, "y", { duration: 0.45, ease: "power2.out" })
      : null;
    const mgQuickRotY = mgStageRef.current
      ? gsap.quickTo(mgStageRef.current, "rotateY", { duration: 0.55, ease: "power2.out" })
      : null;
    const mgQuickRotX = mgStageRef.current
      ? gsap.quickTo(mgStageRef.current, "rotateX", { duration: 0.55, ease: "power2.out" })
      : null;
    const fgQuickX = fgLeavesRef.current
      ? gsap.quickTo(fgLeavesRef.current, "x", { duration: 0.55, ease: "power2.out" })
      : null;
    const fgQuickY = fgLeavesRef.current
      ? gsap.quickTo(fgLeavesRef.current, "y", { duration: 0.55, ease: "power2.out" })
      : null;
    const bgQuickX = bgArcsRef.current
      ? gsap.quickTo(bgArcsRef.current, "x", { duration: 0.7, ease: "power2.out" })
      : null;
    const bgQuickY = bgArcsRef.current
      ? gsap.quickTo(bgArcsRef.current, "y", { duration: 0.7, ease: "power2.out" })
      : null;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2.2) return;
      const nx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      const ny = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      bgQuickX?.(nx * 14);
      bgQuickY?.(ny * 10);
      mgQuickX?.(nx * -18);
      mgQuickY?.(ny * -13);
      mgQuickRotY?.(nx * 6);
      mgQuickRotX?.(-ny * 4.5);
      fgQuickX?.(nx * -38);
      fgQuickY?.(ny * -26);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      introTlRef.current = null;
      idleTweensRef.current = [];
      ctx.revert();
    };
  }, [setActiveChapter, setLetterboxActive]);

  return (
    <section
      id="act-1"
      ref={sectionRef}
      className="relative h-[220vh] w-full bg-[#0B35B8]"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden [perspective:1200px]">
        <div
          ref={cameraRigRef}
          className="relative flex h-full w-full items-center justify-center will-change-transform"
        >
          {/* === PLANE 0: ENGINEERING CAD BLUEPRINT CANVAS === */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_44%,#1A56FF_0%,#0B35B8_52%,#061859_100%)]" />
          <div className="blueprint-grid absolute inset-0 opacity-85" />

          {/* Living Rotating Architectural CAD Compass Arcs */}
          <svg
            ref={bgArcsRef}
            aria-hidden="true"
            viewBox="0 0 1440 900"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-30 will-change-transform"
            preserveAspectRatio="xMidYMid slice"
          >
            <g
              stroke="#7DD3FC"
              strokeWidth="1.2"
              fill="none"
              strokeDasharray="8 7"
              className="animate-slow-spin"
              style={{ transformOrigin: "720px 450px", animationDuration: "46s" }}
            >
              <circle cx="720" cy="450" r="280" />
              <circle cx="720" cy="450" r="415" />
            </g>
            <g stroke="#7DD3FC" strokeWidth="1" fill="none" opacity="0.55">
              <line x1="120" y1="450" x2="1320" y2="450" />
              <line x1="720" y1="90" x2="720" y2="810" />
            </g>
            <g fill="#030B2E" opacity="0.8">
              <ellipse cx="210" cy="240" rx="210" ry="64" transform="rotate(-24 210 240)" />
              <ellipse cx="1180" cy="190" rx="250" ry="70" transform="rotate(28 1180 190)" />
              <ellipse cx="680" cy="730" rx="320" ry="62" transform="rotate(-8 680 730)" />
            </g>
          </svg>

          {/* === PLANE 1: ALL-PLATFORM RESPONSIVE MULTI-DEPTH COLLAGE === */}
          <div
            ref={mgStageRef}
            className="relative z-10 mx-auto flex h-[74dvh] max-h-[600px] w-full max-w-[1160px] items-center justify-center px-3 sm:h-auto sm:max-h-none sm:aspect-[16/9] sm:px-4 will-change-transform [transform-style:preserve-3d]"
          >
            {/* PROP 1 (Civil Engineering): Steel Compass & 45-90 Set Square */}
            <div
              ref={propDraftingRef}
              className="hero-prop absolute left-[4%] top-[6%] sm:left-[15%] sm:top-[18%] lg:left-[19%] lg:top-[20%] z-20 will-change-transform"
            >
              <div className="animate-float-gentle">
                <CodeDraftingToolsProp className="h-18 w-18 sm:h-32 sm:w-32 md:h-40 md:w-40 md:drop-shadow-[0_22px_28px_rgba(3,10,45,0.72)]" />
              </div>
            </div>

            {/* PROP 2 (Engineer Fuel): Top-Down Espresso Cup */}
            <div
              ref={propEspressoRef}
              className="hero-prop absolute bottom-[12%] left-[3%] sm:bottom-[15%] sm:left-[11%] lg:left-[15%] z-20 will-change-transform"
            >
              <div className="animate-float-reverse">
                <CodeEspressoProp className="h-17 w-17 sm:h-28 sm:w-28 md:h-36 md:w-36 md:drop-shadow-[0_24px_30px_rgba(3,10,45,0.74)]" />
              </div>
            </div>

            {/* PROP 3 (Software Engineering): 65% Mechanical Developer Keyboard */}
            <div
              ref={propKeyboardRef}
              className="hero-prop absolute bottom-[3%] left-1/2 -translate-x-1/2 sm:translate-x-0 sm:bottom-[9%] sm:left-[25%] lg:left-[29%] z-10 will-change-transform"
            >
              <div className="animate-float-gentle" style={{ animationDelay: "-1.4s" }}>
                <CodeMechKeyboardProp className="h-17 sm:h-28 md:h-36 w-auto md:drop-shadow-[0_22px_30px_rgba(3,10,45,0.72)]" />
              </div>
            </div>

            {/* PROP 4 (Off-Clock Hobby): Spinning Walnut Vinyl Turntable */}
            <div
              ref={propTurntableRef}
              className="hero-prop absolute right-[3%] top-[5%] sm:right-[14%] sm:top-[5%] lg:right-[20%] z-10 will-change-transform"
            >
              <div className="animate-float-reverse" style={{ animationDelay: "-0.8s" }}>
                <CodeTurntableProp className="h-20 sm:h-36 md:h-48 w-auto md:drop-shadow-[0_24px_34px_rgba(3,10,45,0.75)]" />
              </div>
            </div>

            {/* PROP 5 (Creator Character): Editorial Vector Portrait */}
            <div
              ref={propPortraitRef}
              className="hero-prop absolute bottom-[9%] right-[2%] sm:bottom-[10%] sm:right-[5%] lg:right-[8%] z-20 will-change-transform"
            >
              <div className="animate-float-gentle relative" style={{ animationDelay: "-2.1s" }}>
                <CodeCreatorPortrait className="h-28 sm:h-52 md:h-68 w-auto md:drop-shadow-[0_26px_32px_rgba(3,10,45,0.78)]" />
                <div className="absolute -bottom-1.5 right-0 -rotate-6 rounded-md bg-[#C6FF3D] px-2 py-0.5 font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-[#061859] shadow-lg">
                  CIVIL × CODE
                </div>
              </div>
            </div>

            {/* === CENTER HERO KINETIC PER-LETTER TITLE CLUSTER === */}
            <div className="relative z-30 flex flex-col items-center text-center select-none px-2">
              {/* Role Pill + CAD Badge above "Port" */}
              <div
                ref={topPillRef}
                className="hero-badge-pop mb-1.5 flex items-center justify-center gap-2 sm:-ml-14 will-change-transform"
              >
                <div className="scale-75 sm:scale-100 transition-transform hover:scale-115 hover:rotate-0">
                  <ToolBadge tool="autocad" size="md" className="-rotate-12" />
                </div>
                <span className="rounded-full border border-sky-300/45 bg-[#061859]/85 px-2.5 py-1 sm:px-3.5 font-mono text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-sky-100 shadow-lg backdrop-blur-sm">
                  {PORTFOLIO_DATA.brand.roleLine}
                </span>
              </div>

              {/* Per-Letter Animated Script "Port" + Bold "Folio" */}
              <div className="relative flex flex-wrap items-baseline justify-center gap-x-1.5 sm:gap-x-2">
                <h1
                  ref={titlePortRef}
                  className="font-script text-[clamp(3.2rem,14vw,7.6rem)] leading-none font-bold text-white drop-shadow-[0_14px_30px_rgba(3,12,54,0.7)] -rotate-6 will-change-transform"
                >
                  {PORT_CHARS.map((ch, idx) => (
                    <span key={idx} className="hero-char inline-block will-change-transform">
                      {ch}
                    </span>
                  ))}
                </h1>
                <span
                  ref={titleFolioRef}
                  className="font-display text-[clamp(2.7rem,12vw,6.3rem)] leading-none font-extrabold tracking-tight text-[#C6FF3D] drop-shadow-[0_14px_30px_rgba(3,12,54,0.65)] translate-y-1.5 sm:translate-y-4 will-change-transform"
                >
                  {FOLIO_CHARS.map((ch, idx) => (
                    <span key={idx} className="hero-char inline-block will-change-transform">
                      {ch}
                    </span>
                  ))}
                </span>
              </div>

              {/* Living Tilted Lime Tape Strip + Tactile Stack Badges */}
              <div
                ref={tapeRowRef}
                className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-3.5 will-change-transform"
              >
                <div className="hero-badge-pop scale-75 sm:scale-100 rotate-[8deg] translate-y-1.5 transition-transform hover:scale-115">
                  <ToolBadge tool="revit" size="md" />
                </div>

                <div className="hero-tape-live rotate-[2deg] rounded-sm bg-[#C6FF3D] px-3 py-1 sm:px-5 sm:py-1.5 shadow-[0_14px_28px_rgba(3,10,45,0.55)] will-change-transform">
                  <span className="font-display text-xs sm:text-lg font-extrabold tracking-tight text-[#061859]">
                    {PORTFOLIO_DATA.hero.tapeLabel}
                  </span>
                </div>

                <div className="hero-badge-pop scale-75 sm:scale-100 rotate-[-10deg] translate-y-2 transition-transform hover:scale-115">
                  <ToolBadge tool="typescript" size="lg" />
                </div>

                <div className="hero-badge-pop hidden sm:block rotate-[10deg] translate-y-1 transition-transform hover:scale-115">
                  <ToolBadge tool="python" size="md" />
                </div>

                <div className="hero-badge-pop hidden sm:block rotate-[-8deg] translate-y-3 transition-transform hover:scale-115">
                  <ToolBadge tool="figma" size="md" />
                </div>
              </div>
            </div>
          </div>

          {/* === PLANE 2: 4K SOFT-GRADIENT BOKEH FOLIAGE (Rushes Past Lens on Scroll) === */}
          <div
            ref={fgLeavesRef}
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 z-30 will-change-transform"
          >
            <CodeBokehLeaves
              variant="tl"
              className="animate-float-gentle absolute left-[10%] top-[2%] h-32 sm:h-48 md:h-56 w-auto"
            />
            <CodeBokehLeaves
              variant="tr"
              className="animate-float-reverse absolute -right-6 top-[2%] h-44 sm:h-64 md:h-76 w-auto"
            />
            <CodeBokehLeaves
              variant="bl"
              className="animate-float-gentle absolute -left-6 bottom-[4%] h-44 sm:h-64 md:h-72 w-auto"
            />
          </div>

          {/* Minimal Scroll Cue (clean bottom spacing since mobile dock is gone!) */}
          <div className="pointer-events-none absolute bottom-[8.5vh] left-0 right-0 z-30 mx-auto flex max-w-4xl flex-col items-center gap-2 px-6 text-center">
            <p className="hidden sm:block max-w-2xl text-[10px] leading-relaxed tracking-wide text-sky-100/80">
              {PORTFOLIO_DATA.hero.microBio}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#061859]/75 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <span>Scroll to Dive Into 3D Digital Twin</span>
              <ChevronDown className="h-3.5 w-3.5 animate-bounce text-[#C6FF3D]" />
            </div>
          </div>
        </div>

        <div
          ref={exitFlashRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 opacity-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.98)_0%,rgba(224,242,254,0.92)_55%,rgba(196,181,253,0.9)_100%)]"
        />
      </div>
    </section>
  );
}
