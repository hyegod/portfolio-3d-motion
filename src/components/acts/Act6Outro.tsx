"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ArrowUp,
  Copy,
  Check,
  Send,
  Clock,
  Sparkles,
  Layers,
  Code2,
  Palette,
  Coffee,
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";

gsap.registerPlugin(ScrollTrigger);

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutBack(x: number) {
  const c1 = 1.8;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

const EXTRAORDINARY_CHARS = "Extraordinary.".split("");

interface InquiryChannel {
  id: string;
  shortLabel: string;
  tagline: string;
  icon: React.ElementType;
  subject: string;
  defaultBody: string;
  accent: string;
  freq: number;
}

const INQUIRY_CHANNELS: InquiryChannel[] = [
  {
    id: "civil-fea",
    shortLabel: "Structural & BIM",
    tagline: "BRIDGES • SEISMIC CORES • LOD 400 DIGITAL TWINS",
    icon: Layers,
    subject: "Inquiry: Civil & Structural Engineering Collaboration",
    defaultBody:
      "Hi Axis,\n\nI would like to discuss a structural engineering / BIM automation project.\n\nProject details:",
    accent: "#38BDF8",
    freq: 2.2,
  },
  {
    id: "software-api",
    shortLabel: "Full-Stack & API",
    tagline: "NEXT.JS • TYPESCRIPT • PYTHON FEA SOLVERS",
    icon: Code2,
    subject: "Inquiry: Full-Stack Computational Software Project",
    defaultBody:
      "Hi Axis,\n\nI am looking for a Software Engineer to architect high-performance web apps / engineering tools.\n\nStack & requirements:",
    accent: "#C6FF3D",
    freq: 3.4,
  },
  {
    id: "3d-motion",
    shortLabel: "3D & Motion UI",
    tagline: "120 FPS WEBGL • THREE.JS • KINETIC CHOREOGRAPHY",
    icon: Palette,
    subject: "Inquiry: UI/UX & Interactive 3D Web Design",
    defaultBody:
      "Hi Axis,\n\nWe love your interactive 3D and kinetic motion work and want to collaborate on a flagship web experience.\n\nScope & timeline:",
    accent: "#FF6B4A",
    freq: 4.4,
  },
  {
    id: "sync-coffee",
    shortLabel: "Coffee & Sync",
    tagline: "OPEN ROLES • ADVISORY • CREATIVE JAM",
    icon: Coffee,
    subject: "Hello from someone who loved your 3D portfolio!",
    defaultBody:
      "Hi Axis,\n\nSaw your interactive 3D motion portfolio and wanted to connect!\n\nBest regards,",
    accent: "#C084FC",
    freq: 1.6,
  },
];

const LIT_CLASSES = [
  "-rotate-1",
  "scale-[1.04]",
  "bg-[#C6FF3D]",
  "text-[#050C14]",
  "shadow-[0_18px_50px_rgba(198,255,61,0.42)]",
  "ring-2",
  "ring-white/80",
];
const UNLIT_CLASSES = ["bg-white/[0.04]", "text-[#C6FF3D]"];

/**
 * Explosive Kinetic Showreel Finale & Magnetic Contact Launchpad (Chapter 06)
 * - Zero FOUC / Zero double-animation: pre-seeded initial hidden transforms + seamless "top 88%" scrub
 * - Zero React re-renders during scroll or clock ticks (100% direct DOM refs)
 */
export function Act6Outro() {
  const sectionRef = useRef<HTMLElement>(null);
  const stage3DRef = useRef<HTMLDivElement>(null);
  const clockSpanRef = useRef<HTMLSpanElement>(null);

  // Background kinetic ribbons & portal rings
  const ribbonTopRef = useRef<HTMLDivElement>(null);
  const ribbonBotRef = useRef<HTMLDivElement>(null);
  const portalRingsRef = useRef<SVGSVGElement>(null);
  const radarSweepRef = useRef<SVGGElement>(null);

  // Kinetic headline refs
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const extraBtnRef = useRef<HTMLButtonElement>(null);
  const extraCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const pointerCursorRef = useRef<HTMLDivElement>(null);

  // Interactive launchpad & live wave refs
  const launchpadWrapRef = useRef<HTMLDivElement>(null);
  const magneticCardRef = useRef<HTMLDivElement>(null);
  const wavePath1Ref = useRef<SVGPathElement>(null);
  const wavePath2Ref = useRef<SVGPathElement>(null);
  const creditsRef = useRef<HTMLElement>(null);

  const [activeChannelId, setActiveChannelId] = useState<string>("software-api");
  const [copied, setCopied] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const { setActiveChapter, setLetterboxActive, setContactOpen, scrollToChapter } =
    useShowreel();

  const selectedChannel = useMemo(
    () =>
      INQUIRY_CHANNELS.find((c) => c.id === activeChannelId) ||
      INQUIRY_CHANNELS[1],
    [activeChannelId]
  );

  const freqRef = useRef(selectedChannel.freq);
  const spikeRef = useRef(0);
  const isPillLitRef = useRef(false);

  const setPillLitDOM = (lit: boolean) => {
    if (isPillLitRef.current === lit) return;
    isPillLitRef.current = lit;
    const btn = extraBtnRef.current;
    if (!btn) return;
    if (lit) {
      btn.classList.remove(...UNLIT_CLASSES);
      btn.classList.add(...LIT_CLASSES);
      spikeRef.current = 1.05;
    } else {
      btn.classList.remove(...LIT_CLASSES);
      btn.classList.add(...UNLIT_CLASSES);
    }
  };

  useEffect(() => {
    freqRef.current = selectedChannel.freq;
    spikeRef.current = 1.0;
  }, [selectedChannel]);

  // Zero-rerender live Jakarta WIB clock (updates DOM textContent directly)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tickClock = () => {
      if (clockSpanRef.current) {
        clockSpanRef.current.textContent = `WIB ${fmt.format(new Date())}`;
      }
    };
    tickClock();
    const interval = setInterval(tickClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll-Scrubbed Kinetic Choreography + Living 60fps Harmonic Oscilloscope
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    let inViewport = false;
    let phase = 0;

    const tickWave = () => {
      if (inViewport) {
        phase += 0.065;
        spikeRef.current *= 0.94;
        const amp = 10 + spikeRef.current * 14;
        const f = freqRef.current;

        if (wavePath1Ref.current && wavePath2Ref.current) {
          let d1 = "M 0 24";
          let d2 = "M 0 24";
          for (let x = 0; x <= 600; x += 20) {
            const u = x / 600;
            const envelope = Math.sin(u * Math.PI);
            const y1 =
              24 +
              Math.sin(u * Math.PI * 2 * f - phase) * amp * envelope +
              Math.cos(u * Math.PI * 5 + phase * 0.7) * 3 * envelope;
            const y2 =
              24 +
              Math.cos(u * Math.PI * 2 * (f * 0.75) + phase * 1.15) *
                (amp * 0.68) *
                envelope;
            d1 += ` L ${x} ${y1.toFixed(1)}`;
            d2 += ` L ${x} ${y2.toFixed(1)}`;
          }
          wavePath1Ref.current.setAttribute("d", d1);
          wavePath2Ref.current.setAttribute("d", d2);
        }

        if (radarSweepRef.current) {
          radarSweepRef.current.style.transform = `rotate(${((phase * 28) % 360).toFixed(1)}deg)`;
        }
      }
      rafId = requestAnimationFrame(tickWave);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
      },
      { rootMargin: "250px 0px" }
    );
    observer.observe(section);
    rafId = requestAnimationFrame(tickWave);

    // Pure deterministic scrub function called BOTH on mount (p=st.progress) AND on every scroll frame!
    const applyProgress = (p: number) => {
      if (ribbonTopRef.current) {
        ribbonTopRef.current.style.transform = `translate3d(${(240 - p * 680).toFixed(1)}px, 0, 0) rotate(-3deg)`;
      }
      if (ribbonBotRef.current) {
        ribbonBotRef.current.style.transform = `translate3d(${(-340 + p * 680).toFixed(1)}px, 0, 0) rotate(-3deg)`;
      }

      if (portalRingsRef.current) {
        const pScale = 0.45 + clamp01(p / 0.6) * 0.65;
        portalRingsRef.current.style.transform = `translate(-50%, -50%) scale(${pScale.toFixed(3)}) rotate(${(p * 100).toFixed(1)}deg)`;
        portalRingsRef.current.style.opacity = (0.18 + clamp01(p / 0.45) * 0.6).toFixed(3);
      }

      // Entrance begins smoothly as soon as Act 6 rises into the bottom of the viewport (p: 0.04 -> 0.34)
      const t1 = easeOutBack(clamp01((p - 0.04) / 0.26));
      const t2 = easeOutBack(clamp01((p - 0.09) / 0.26));

      if (line1Ref.current) {
        const x1 = (1 - t1) * -130;
        const sk1 = (1 - t1) * -15;
        line1Ref.current.style.transform = `translate3d(${x1.toFixed(1)}px, 0, 0) skewX(${sk1.toFixed(1)}deg) scale(${(0.84 + t1 * 0.16).toFixed(3)})`;
        line1Ref.current.style.opacity = clamp01((p - 0.03) / 0.14).toFixed(3);
      }
      if (line2Ref.current) {
        const x2 = (1 - t2) * 130;
        const sk2 = (1 - t2) * 15;
        line2Ref.current.style.transform = `translate3d(${x2.toFixed(1)}px, 0, 0) skewX(${sk2.toFixed(1)}deg) scale(${(0.84 + t2 * 0.16).toFixed(3)})`;
        line2Ref.current.style.opacity = clamp01((p - 0.08) / 0.14).toFixed(3);
      }

      // Per-letter 3D elastic flip-slam on "Extraordinary."
      for (let i = 0; i < EXTRAORDINARY_CHARS.length; i++) {
        const span = extraCharsRef.current[i];
        if (!span) continue;
        const charP = clamp01((p - (0.14 + i * 0.014)) / 0.22);
        const sp = easeOutBack(charP);
        const y = (1 - sp) * 52;
        const rot = (1 - sp) * (i % 2 === 0 ? -22 : 22);
        const sc = 0.55 + sp * 0.45;
        span.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
        span.style.opacity = clamp01(charP * 2.5).toFixed(3);
      }

      // Studio vector pointer swoops in and clicks "Extraordinary." once pinned!
      const cursorProgress = clamp01((p - 0.34) / 0.2);
      if (pointerCursorRef.current) {
        const cx = (1 - cursorProgress) * 90;
        const cy = (1 - cursorProgress) * 60;
        const clickPress = p > 0.5 && p < 0.58 ? 0.84 : 1.0;
        pointerCursorRef.current.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) scale(${clickPress})`;
        pointerCursorRef.current.style.opacity = clamp01((p - 0.32) / 0.1).toFixed(3);
      }

      setPillLitDOM(p >= 0.5);

      // Launchpad console & social satellites spring upward smoothly
      const padT = easeOutBack(clamp01((p - 0.26) / 0.3));
      if (launchpadWrapRef.current) {
        const py = (1 - padT) * 56;
        const pSc = 0.9 + padT * 0.1;
        launchpadWrapRef.current.style.transform = `translate3d(0, ${py.toFixed(1)}px, 0) scale(${pSc.toFixed(3)})`;
        launchpadWrapRef.current.style.opacity = clamp01((p - 0.24) / 0.18).toFixed(3);
      }

      if (creditsRef.current) {
        creditsRef.current.style.opacity = clamp01((p - 0.34) / 0.22).toFixed(3);
      }
    };

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        // Start scrubbing right as Act 6 enters the bottom of the viewport so it NEVER
        // scrolls in static/assembled first and then snaps back to 0 at "top top"!
        start: "top 88%",
        end: "bottom bottom",
        scrub: 0.35,
        onEnter: () => {
          setActiveChapter("act-6");
          setLetterboxActive(false);
        },
        onEnterBack: () => {
          setActiveChapter("act-6");
          setLetterboxActive(false);
        },
        onUpdate: (self) => {
          applyProgress(self.progress);
        },
      });

      // Seed exact initial transform/opacity immediately on mount (zero FOUC!)
      applyProgress(st.progress);
    }, section);

    // Desktop Magnetic Cursor Pull + 3D Stage Tilt
    const stageRotX = stage3DRef.current
      ? gsap.quickTo(stage3DRef.current, "rotateX", { duration: 0.5, ease: "power2.out" })
      : null;
    const stageRotY = stage3DRef.current
      ? gsap.quickTo(stage3DRef.current, "rotateY", { duration: 0.5, ease: "power2.out" })
      : null;
    const cardX = magneticCardRef.current
      ? gsap.quickTo(magneticCardRef.current, "x", { duration: 0.38, ease: "power3.out" })
      : null;
    const cardY = magneticCardRef.current
      ? gsap.quickTo(magneticCardRef.current, "y", { duration: 0.38, ease: "power3.out" })
      : null;

    const onMouseMove = (e: MouseEvent) => {
      if (!inViewport) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      stageRotY?.(nx * 5.5);
      stageRotX?.(-ny * 4);
      cardX?.(nx * 10);
      cardY?.(ny * 6);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      ctx.revert();
    };
  }, [setActiveChapter, setLetterboxActive]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_DATA.brand.email);
    } catch {
      // Clipboard fallback
    }
    setCopied(true);
    setBurstKey((k) => k + 1);
    spikeRef.current = 1.35;
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDirectDispatch = () => {
    spikeRef.current = 1.25;
    const mailto = `mailto:${PORTFOLIO_DATA.brand.email}?subject=${encodeURIComponent(
      selectedChannel.subject
    )}&body=${encodeURIComponent(selectedChannel.defaultBody)}`;
    window.location.href = mailto;
  };

  return (
    <section
      id="act-6"
      ref={sectionRef}
      className="relative h-[240vh] w-full bg-[#040A12] text-white"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full flex-col items-center justify-between overflow-hidden bg-[#040A12] px-4 pb-3 pt-11 sm:px-8 sm:pb-5 sm:pt-14 [perspective:1200px]">
        {/* === DYNAMIC ACCENT ATMOSPHERE GLOW === */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] sm:h-[640px] sm:w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] transition-colors duration-700"
          style={{ backgroundColor: `${selectedChannel.accent}22` }}
        />
        <div className="dot-grid-dark pointer-events-none absolute inset-0 opacity-45" />

        {/* === COUNTER-RACING KINETIC TYPOGRAPHY RIBBONS === */}
        <div
          ref={ribbonTopRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-[12%] whitespace-nowrap font-display text-[13vw] sm:text-[8.5vw] font-black uppercase tracking-tighter text-white/[0.035] select-none will-change-transform"
        >
          STRUCTURAL FEA • FULL-STACK SYSTEMS • 120 FPS WEBGL • DIGITAL TWINS •
        </div>
        <div
          ref={ribbonBotRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[13%] whitespace-nowrap font-display text-[13vw] sm:text-[8.5vw] font-black uppercase tracking-tighter text-[#C6FF3D]/[0.04] select-none will-change-transform"
        >
          READY TO SHIP • JAKARTA TO WORLDWIDE • LET&apos;S COLLABORATE • AXIS._ •
        </div>

        {/* === EXPANDING SONAR PORTAL RINGS + ROTATING RADAR SWEEP (No inline transform prop so React re-renders never reset GSAP!) === */}
        <svg
          ref={portalRingsRef}
          aria-hidden="true"
          viewBox="0 0 600 600"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] sm:h-[620px] sm:w-[620px] opacity-20 will-change-transform"
        >
          <defs>
            <linearGradient id="radarBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={selectedChannel.accent} stopOpacity="0.32" />
              <stop offset="100%" stopColor={selectedChannel.accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="300"
            cy="300"
            r="275"
            fill="none"
            stroke="rgba(56,189,248,0.18)"
            strokeWidth="1.2"
            strokeDasharray="8 10"
          />
          <circle
            cx="300"
            cy="300"
            r="210"
            fill="none"
            stroke="rgba(198,255,61,0.18)"
            strokeWidth="1.2"
          />
          <circle
            cx="300"
            cy="300"
            r="142"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <g ref={radarSweepRef} style={{ transformOrigin: "300px 300px" }}>
            <path d="M300 300 L300 25 A275 275 0 0 1 495 106 Z" fill="url(#radarBeamGrad)" />
            <circle cx="300" cy="25" r="4" fill={selectedChannel.accent} />
          </g>
        </svg>

        {/* === 3D PERSPECTIVE KINETIC STAGE === */}
        <div
          ref={stage3DRef}
          className="relative z-10 my-auto flex w-full max-w-4xl flex-col items-center text-center will-change-transform [transform-style:preserve-3d]"
        >
          {/* Top Live Radar Telemetry Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-[#07131E]/80 px-3.5 py-1 shadow-lg backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-80"
                style={{ backgroundColor: selectedChannel.accent }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: selectedChannel.accent }}
              />
            </span>
            <span
              className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] transition-colors duration-300"
              style={{ color: selectedChannel.accent }}
            >
              SIGNAL LOCKED • AVAILABLE FOR ROLES &amp; PROJECTS
            </span>
            <span className="hidden sm:inline text-white/25">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-slate-300">
              <Clock className="h-3 w-3 text-[#38BDF8]" />
              <span ref={clockSpanRef}>WIB --:--:--</span>
            </span>
          </div>

          {/* === KINETIC WHIP-SLAM + PER-LETTER FLIP HEADLINE (Pre-hidden opacity-0 prevents FOUC!) === */}
          <h2 className="mt-2.5 sm:mt-4 flex flex-col items-center leading-[0.94] tracking-tight select-none">
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5">
              <span
                ref={line1Ref}
                className="inline-block opacity-0 font-display text-[clamp(1.85rem,7vw,4.3rem)] font-black uppercase text-white will-change-transform"
              >
                LET&apos;S BUILD
              </span>
              <span
                ref={line2Ref}
                className="inline-block opacity-0 font-display text-[clamp(1.85rem,7vw,4.3rem)] font-black uppercase text-sky-200 will-change-transform"
              >
                SOMETHING
              </span>
            </div>

            {/* Tactile Cursor-Clicked Highlight Pill around "Extraordinary." */}
            <div className="relative mt-1.5 sm:mt-2 inline-flex items-center justify-center">
              <button
                type="button"
                ref={extraBtnRef}
                onClick={() => setContactOpen(true)}
                onMouseEnter={() => setPillLitDOM(true)}
                className="relative inline-flex items-center rounded-2xl bg-white/[0.04] px-4 py-0.5 sm:px-6 sm:py-1 font-serif italic text-[clamp(2.25rem,8.8vw,5.1rem)] leading-none text-[#C6FF3D] transition-all duration-300 cursor-pointer"
              >
                {EXTRAORDINARY_CHARS.map((ch, idx) => (
                  <span
                    key={idx}
                    ref={(el) => {
                      extraCharsRef.current[idx] = el;
                    }}
                    className="inline-block opacity-0 will-change-transform"
                  >
                    {ch}
                  </span>
                ))}
              </button>

              {/* Animated Vector Studio Pointer Clicking the Headline */}
              <div
                ref={pointerCursorRef}
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-5 -right-6 sm:-bottom-6 sm:-right-8 z-30 opacity-0 will-change-transform"
              >
                <svg
                  viewBox="0 0 36 36"
                  className="h-8 w-8 sm:h-11 sm:w-11 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                >
                  <path
                    d="M5 3L30 18L18 21L23 32L17 34L12 23L5 29V3Z"
                    fill="#FFFFFF"
                    stroke="#050C14"
                    strokeWidth="2.6"
                  />
                </svg>
              </div>
            </div>
          </h2>

          {/* === FRAMELESS MAGNETIC ORBITAL LAUNCHPAD (Pre-hidden opacity-0 prevents FOUC!) === */}
          <div
            ref={launchpadWrapRef}
            className="mt-4 sm:mt-6 flex w-full max-w-3xl flex-col items-center opacity-0 will-change-transform"
          >
            {/* 4 Tactile Frequency-Tuned Channel Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
              {INQUIRY_CHANNELS.map((ch, idx) => {
                const Icon = ch.icon;
                const active = ch.id === activeChannelId;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setActiveChannelId(ch.id)}
                    style={{
                      borderColor: active ? ch.accent : "rgba(255,255,255,0.12)",
                      boxShadow: active ? `0 10px 28px ${ch.accent}35` : "none",
                    }}
                    className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md transition-all duration-200 cursor-pointer ${
                      active
                        ? "-translate-y-0.5 scale-105 bg-white/12 text-white"
                        : "bg-white/[0.03] text-slate-400 hover:-translate-y-0.5 hover:text-white"
                    } ${idx % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1"}`}
                  >
                    <Icon
                      className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-200 group-hover:scale-125"
                      style={{ color: ch.accent }}
                    />
                    <span>{ch.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Live 60fps Dual-Harmonic Oscilloscope Strip */}
            <div className="mt-2.5 flex w-full max-w-xl flex-col items-center px-2">
              <svg
                viewBox="0 0 600 48"
                className="h-7 sm:h-9 w-full overflow-visible"
                aria-hidden="true"
              >
                <path
                  ref={wavePath2Ref}
                  d="M 0 24 L 600 24"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeOpacity="0.38"
                  strokeLinecap="round"
                />
                <path
                  ref={wavePath1Ref}
                  d="M 0 24 L 600 24"
                  fill="none"
                  stroke={selectedChannel.accent}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.24em] text-slate-400">
                {selectedChannel.tagline}
              </span>
            </div>

            {/* === MAGNETIC HERO DISPATCH CAPSULE === */}
            <div
              ref={magneticCardRef}
              className="relative mt-3 flex w-full max-w-2xl flex-col items-center justify-between gap-2.5 rounded-3xl sm:rounded-full border border-white/20 bg-gradient-to-r from-[#0B1B2B]/95 via-[#0F273D]/95 to-[#091522]/95 p-2.5 sm:flex-row sm:px-4 sm:py-2.5 shadow-[0_22px_60px_rgba(0,0,0,0.75)] backdrop-blur-xl will-change-transform"
            >
              {copied && (
                <span
                  key={burstKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 animate-ping rounded-full border-2 border-[#C6FF3D] opacity-60"
                />
              )}

              <button
                type="button"
                onClick={handleCopyEmail}
                className="group flex items-center gap-2.5 rounded-full px-3 py-1 text-left transition hover:bg-white/5 cursor-pointer"
                title="Click to copy direct email"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#050C14] transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: selectedChannel.accent }}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0">
                  <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {copied ? "COPIED TO CLIPBOARD ✓" : "TAP TO COPY DIRECT EMAIL"}
                  </span>
                  <span className="block truncate font-display text-sm sm:text-base font-extrabold text-white">
                    {PORTFOLIO_DATA.brand.email}
                  </span>
                </div>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleDirectDispatch}
                  style={{ backgroundColor: selectedChannel.accent }}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 sm:px-5 font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#050C14] shadow-lg transition-transform duration-200 hover:scale-105 hover:brightness-110 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Dispatch Now ↗</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white transition hover:scale-105 hover:border-[#C6FF3D] hover:text-[#C6FF3D] cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#C6FF3D]" />
                  <span>Write Brief</span>
                </button>
              </div>
            </div>

            {/* Floating Orbiting Social Satellites + Replay Pill */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
              {PORTFOLIO_DATA.socials.map((s, idx) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-200 backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-[#C6FF3D] hover:text-[#C6FF3D] ${
                    idx % 2 === 0 ? "animate-float-gentle" : "animate-float-reverse"
                  }`}
                >
                  <span>{s.label}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ))}

              <button
                type="button"
                onClick={() => scrollToChapter("top")}
                className="inline-flex items-center gap-1 rounded-full border border-[#38BDF8]/35 bg-[#38BDF8]/10 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] transition duration-200 hover:-translate-y-1 hover:bg-[#38BDF8] hover:text-[#050C14] cursor-pointer"
              >
                <ArrowUp className="h-3 w-3" />
                <span>Replay Reel</span>
              </button>
            </div>
          </div>
        </div>

        {/* === MINIMAL FLOATING CREDITS SIGNATURE === */}
        <footer
          ref={creditsRef}
          className="relative z-10 flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 text-[10px] font-mono text-slate-400 opacity-0"
        >
          <div className="flex items-center gap-2">
            <span className="font-display text-xs font-extrabold text-white">
              {PORTFOLIO_DATA.brand.name}
              <span className="text-[#C6FF3D]">._</span>
            </span>
            <span className="text-white/20">•</span>
            <span>{PORTFOLIO_DATA.brand.roleLine}</span>
          </div>
          <span className="hidden sm:inline text-slate-400">
            {PORTFOLIO_DATA.brand.hobbyLine}
          </span>
        </footer>
      </div>
    </section>
  );
}
