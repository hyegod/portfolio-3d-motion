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
  Radio,
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
  const c1 = 1.65;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

interface InquiryChannel {
  id: string;
  code: string;
  label: string;
  icon: React.ElementType;
  subject: string;
  defaultBody: string;
  accent: string;
}

const INQUIRY_CHANNELS: InquiryChannel[] = [
  {
    id: "civil-fea",
    code: "CHANNEL_01",
    label: "Civil & Structural BIM",
    icon: Layers,
    subject: "Inquiry: Civil & Structural Engineering Collaboration",
    defaultBody:
      "Hi Axis,\n\nI would like to discuss a structural engineering / BIM automation project with your team.\n\nProject details:",
    accent: "#38BDF8",
  },
  {
    id: "software-api",
    code: "CHANNEL_02",
    label: "Full-Stack Software & API",
    icon: Code2,
    subject: "Inquiry: Full-Stack Computational Software Project",
    defaultBody:
      "Hi Axis,\n\nI am looking for a Software Engineer to architect web apps / engineering calculation tools.\n\nStack & requirements:",
    accent: "#C6FF3D",
  },
  {
    id: "3d-motion",
    code: "CHANNEL_03",
    label: "UI/UX & 3D Motion Craft",
    icon: Palette,
    subject: "Inquiry: UI/UX & Interactive 3D Web Design",
    defaultBody:
      "Hi Axis,\n\nWe love your interactive 3D and kinetic motion work and want to collaborate on a digital experience.\n\nScope & timeline:",
    accent: "#FF6B4A",
  },
  {
    id: "sync-coffee",
    code: "CHANNEL_04",
    label: "Casual Sync / Coffee",
    icon: Coffee,
    subject: "Hello from someone who loves your portfolio",
    defaultBody:
      "Hi Axis,\n\nSaw your 3D motion portfolio and wanted to connect and say hello!\n\nBest regards,",
    accent: "#E2E8F0",
  },
];

/**
 * High-Tech Interactive Mission Control Contact Station (Chapter 06)
 * Real-time WIB clock, live radar beacon, interactive channel dispatch selector,
 * pre-filled email transmission, one-click copy, and full-screen kinetic credits.
 */
export function Act6Outro() {
  const sectionRef = useRef<HTMLElement>(null);
  const emblemRef = useRef<SVGSVGElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const word3Ref = useRef<HTMLSpanElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLElement>(null);

  const [activeChannelId, setActiveChannelId] = useState<string>("civil-fea");
  const [copied, setCopied] = useState(false);
  const [timeString, setTimeString] = useState<string>("02:00:00");

  const { setActiveChapter, setLetterboxActive, setContactOpen, scrollToChapter } =
    useShowreel();

  const selectedChannel = useMemo(
    () =>
      INQUIRY_CHANNELS.find((c) => c.id === activeChannelId) ||
      INQUIRY_CHANNELS[0],
    [activeChannelId]
  );

  // Live WIB clock (UTC+7)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to WIB (Asia/Jakarta)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setTimeString(new Intl.DateTimeFormat("en-GB", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onEnter: () => {
          setActiveChapter("act-6");
          setLetterboxActive(false);
        },
        onEnterBack: () => {
          setActiveChapter("act-6");
          setLetterboxActive(false);
        },
        onUpdate: (self) => {
          const p = self.progress;

          const w1 = easeOutBack(clamp01(p / 0.34));
          const w2 = easeOutBack(clamp01((p - 0.08) / 0.34));
          const w3 = easeOutBack(clamp01((p - 0.16) / 0.36));
          const consoleT = clamp01((p - 0.24) / 0.36);

          if (emblemRef.current) {
            const sc = 0.65 + clamp01(p / 0.45) * 0.35;
            emblemRef.current.style.transform = `scale(${sc.toFixed(3)}) rotate(${(p * 140).toFixed(1)}deg)`;
          }
          if (word1Ref.current) {
            word1Ref.current.style.transform = `translate3d(0, ${((1 - w1) * 36).toFixed(1)}px, 0) scale(${(0.88 + w1 * 0.12).toFixed(3)})`;
            word1Ref.current.style.opacity = Math.min(1, w1 * 1.5).toFixed(3);
          }
          if (word2Ref.current) {
            word2Ref.current.style.transform = `translate3d(0, ${((1 - w2) * 40).toFixed(1)}px, 0) scale(${(0.88 + w2 * 0.12).toFixed(3)})`;
            word2Ref.current.style.opacity = Math.min(1, w2 * 1.5).toFixed(3);
          }
          if (word3Ref.current) {
            word3Ref.current.style.transform = `translate3d(0, ${((1 - w3) * 44).toFixed(1)}px, 0) rotate(${((1 - w3) * -4).toFixed(1)}deg) scale(${(0.86 + w3 * 0.14).toFixed(3)})`;
            word3Ref.current.style.opacity = Math.min(1, w3 * 1.5).toFixed(3);
          }
          if (consoleRef.current) {
            consoleRef.current.style.transform = `translate3d(0, ${((1 - consoleT) * 30).toFixed(1)}px, 0)`;
            consoleRef.current.style.opacity = (0.2 + consoleT * 0.8).toFixed(3);
          }
          if (creditsRef.current) {
            creditsRef.current.style.opacity = (0.2 + consoleT * 0.8).toFixed(3);
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [setActiveChapter, setLetterboxActive]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_DATA.brand.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard fallback
    }
  };

  const handleDirectDispatch = () => {
    const mailto = `mailto:${PORTFOLIO_DATA.brand.email}?subject=${encodeURIComponent(
      selectedChannel.subject
    )}&body=${encodeURIComponent(selectedChannel.defaultBody)}`;
    window.location.href = mailto;
  };

  return (
    <section
      id="act-6"
      ref={sectionRef}
      className="relative min-h-[190vh] w-full bg-[#050C14] text-white"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full flex-col items-center justify-between overflow-hidden bg-[#050C14] bg-[radial-gradient(ellipse_at_bottom,#103D52_0%,#071520_58%,#050C14_100%)] px-4 pb-3 pt-10 sm:px-8 sm:pb-6 sm:pt-14">
        {/* Subtle engineering blueprint dot grid */}
        <div className="dot-grid-dark pointer-events-none absolute inset-0 opacity-40" />

        {/* Ambient atmospheric glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#38BDF8]/10 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 bottom-10 h-72 w-72 rounded-full bg-[#C6FF3D]/10 blur-[90px]"
        />

        {/* === MAIN INTERACTIVE MISSION CONTROL CONTAINER === */}
        <div className="relative z-10 my-auto flex w-full max-w-4xl flex-col items-center text-center">
          {/* Rotating Parametric Truss Monogram */}
          <div className="relative mb-2 sm:mb-4 flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center">
            <svg
              ref={emblemRef}
              viewBox="0 0 120 120"
              className="h-full w-full will-change-transform"
              aria-hidden="true"
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                opacity="0.75"
              />
              <polygon
                points="60,12 102,36 102,84 60,108 18,84 18,36"
                fill="none"
                stroke="#C6FF3D"
                strokeWidth="2"
              />
              <polygon
                points="60,24 91,42 91,78 60,96 29,78 29,42"
                fill="none"
                stroke="#FF6B4A"
                strokeWidth="1.5"
                opacity="0.85"
              />
            </svg>
            <span className="absolute font-display text-sm sm:text-base font-extrabold text-white">
              A<span className="text-[#C6FF3D]">.</span>
            </span>
          </div>

          {/* Telemetry Radar Pill with Live WIB Clock */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C6FF3D] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C6FF3D]" />
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[#C6FF3D]">
              RADAR ACTIVE • OPEN FOR COMMISSIONS &amp; ROLES
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-slate-300">
              <Clock className="h-3 w-3 text-[#38BDF8]" />
              <span>JAKARTA (UTC+7): {timeString}</span>
            </span>
          </div>

          {/* Monumental Headline */}
          <h2 className="mt-2.5 sm:mt-3.5 flex flex-col items-center leading-[0.92] tracking-tight select-none">
            <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3">
              <span
                ref={word1Ref}
                className="font-display text-[clamp(1.9rem,7.5vw,4.2rem)] font-black text-white will-change-transform"
              >
                Let&apos;s Build
              </span>
              <span
                ref={word2Ref}
                className="font-display text-[clamp(1.9rem,7.5vw,4.2rem)] font-black text-white will-change-transform"
              >
                Something
              </span>
            </div>
            <span
              ref={word3Ref}
              className="font-serif italic text-[clamp(2.3rem,9vw,5.2rem)] font-normal text-[#C6FF3D] will-change-transform"
            >
              Extraordinary.
            </span>
          </h2>

          {/* === INTERACTIVE DISPATCH & TRANSMISSION CONSOLE === */}
          <div
            ref={consoleRef}
            className="mt-4 sm:mt-6 w-full rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#091520]/90 to-[#04090F]/90 p-3.5 sm:p-5 shadow-[0_24px_70px_rgba(0,0,0,0.8)] backdrop-blur-xl will-change-transform"
          >
            {/* Top Bar of Console */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 text-left">
              <div className="flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-[#38BDF8] animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#38BDF8]">
                  TRANSMISSION CHANNEL
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                ⚡ SLA: RESPONSE WITHIN 12 HOURS
              </span>
            </div>

            {/* Interactive Intent Badges / Channels */}
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
              {INQUIRY_CHANNELS.map((channel) => {
                const Icon = channel.icon;
                const isSelected = activeChannelId === channel.id;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setActiveChannelId(channel.id)}
                    className={`group relative flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#C6FF3D] bg-[#C6FF3D]/10 text-white shadow-[0_0_18px_rgba(198,255,61,0.2)]"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    <Icon
                      className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110"
                      style={{ color: isSelected ? "#C6FF3D" : channel.accent }}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[9px] font-extrabold uppercase tracking-wider">
                        {channel.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Direct Email & Action Dispatch Bar */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-2 sm:p-2.5">
              {/* Email Address & Copy */}
              <div className="flex min-w-0 items-center gap-2 px-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C6FF3D]" />
                <span className="truncate font-mono text-xs sm:text-sm font-bold text-white">
                  {PORTFOLIO_DATA.brand.email}
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-300 transition hover:bg-[#C6FF3D] hover:text-[#07131C] cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-2.5 w-2.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-2.5 w-2.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDirectDispatch}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#C6FF3D] px-4 py-2 font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#07131C] shadow-[0_8px_24px_rgba(198,255,61,0.28)] transition hover:scale-[1.03] hover:bg-white cursor-pointer"
                >
                  <Send className="h-3 w-3" />
                  <span>Dispatch Email ↗</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 font-mono text-[10px] sm:text-[11px] font-bold text-white transition hover:border-[#38BDF8] hover:text-[#38BDF8] cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-[#38BDF8]" />
                  <span>Interactive Brief</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToChapter("top")}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-transparent px-3 py-2 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 transition hover:border-[#C6FF3D] hover:text-[#C6FF3D] cursor-pointer"
                  title="Replay from Beginning"
                >
                  <ArrowUp className="h-3 w-3" />
                  <span className="hidden sm:inline">Replay</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* === BORDERLESS FLOATING END-CREDITS FOOTER === */}
        <footer
          ref={creditsRef}
          className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-between gap-2 border-t border-white/10 pt-2.5 sm:flex-row sm:pt-3.5"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="font-display text-sm font-extrabold text-white">
              {PORTFOLIO_DATA.brand.name}
              <span className="text-[#C6FF3D]">._</span>
            </span>
            <span className="text-white/25">•</span>
            <span className="font-mono text-[10px] text-slate-400">
              {PORTFOLIO_DATA.brand.roleLine}
            </span>
            <span className="hidden md:inline text-white/25">•</span>
            <span className="hidden md:inline font-mono text-[10px] text-slate-400">
              {PORTFOLIO_DATA.brand.hobbyLine}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            {PORTFOLIO_DATA.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition hover:text-[#C6FF3D]"
              >
                <span>{s.label}</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
