"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";

/**
 * Branded Axis._ Cinema Preloader & Asset Warmup Screen
 * - Waits for real Google Fonts (`document.fonts.ready`), DOM load, and Act 2's 3D WebGL warmup
 * - Includes a fast fail-safe timeout (2.4s max) so slow/no-WebGL devices never stall
 * - Exits via a dramatic split-shutter aperture reveal synchronized with Act 1's hero entrance
 */
export function LoadingScreen() {
  const { studio3DReady, setAppReady } = useShowreel();

  const [fontsReady, setFontsReady] = useState(false);
  const [domReady, setDomReady] = useState(false);
  const [forceReady, setForceReady] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  const startedAtRef = useRef<number>(0);
  const triggeredExitRef = useRef(false);
  const studioReadyRef = useRef(studio3DReady);
  const fontsReadyRef = useRef(fontsReady);
  const domReadyRef = useRef(domReady);
  const forceReadyRef = useRef(forceReady);

  useEffect(() => {
    studioReadyRef.current = studio3DReady;
  }, [studio3DReady]);
  useEffect(() => {
    fontsReadyRef.current = fontsReady;
  }, [fontsReady]);
  useEffect(() => {
    domReadyRef.current = domReady;
  }, [domReady]);
  useEffect(() => {
    forceReadyRef.current = forceReady;
  }, [forceReady]);

  // 1. Track real readiness signals + hard fail-safe ceiling
  useEffect(() => {
    startedAtRef.current = performance.now();

    let cancelled = false;

    // A) Typography readiness
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) setFontsReady(true);
      });
    } else {
      const t = window.setTimeout(() => {
        if (!cancelled) setFontsReady(true);
      }, 150);
      return () => window.clearTimeout(t);
    }

    // B) Window/DOM load readiness
    const onLoad = () => {
      if (!cancelled) setDomReady(true);
    };
    if (document.readyState === "complete") {
      queueMicrotask(onLoad);
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    // C) Hard fail-safe ceiling (2.4s) so no user or device ever gets stuck
    const failSafe = window.setTimeout(() => {
      if (!cancelled) {
        setFontsReady(true);
        setDomReady(true);
        setForceReady(true);
      }
    }, 2400);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      window.clearTimeout(failSafe);
    };
  }, []);

  // 2. Smooth 60fps interpolated percentage counter -> triggers synchronized shutter reveal at 100%
  useEffect(() => {
    if (unmounted) return;
    let rafId = 0;
    let current = 0;

    const MIN_VISIBLE_MS = 680;

    const step = () => {
      const elapsed = performance.now() - startedAtRef.current;
      const fDone = fontsReadyRef.current;
      const dDone = domReadyRef.current;
      const wDone = studioReadyRef.current || forceReadyRef.current;

      // Weighted target based on real readiness milestones
      let target = 24;
      if (fDone) target += 28;
      if (dDone) target += 20;
      if (wDone) target += 28;
      // Gentle ambient progress crawl up to 88% while waiting on WebGL shader compile
      if (!wDone) {
        target = Math.min(88, Math.max(target, 28 + (elapsed / 2200) * 58));
      }
      if (elapsed < MIN_VISIBLE_MS && target >= 100) {
        target = 96;
      }

      const speed = target >= 100 ? 0.22 : 0.12;
      current += (target - current) * speed;
      if (target >= 100 && current > 99.2) {
        current = 100;
      }

      const rounded = Math.min(100, Math.round(current));
      setDisplayPct((prev) => (prev === rounded ? prev : rounded));

      if (rounded >= 100 && !triggeredExitRef.current) {
        triggeredExitRef.current = true;
        // Refresh GSAP ScrollTrigger right before opening curtains
        try {
          ScrollTrigger.refresh();
        } catch {
          // Ignore if ScrollTrigger not yet initialized
        }
        setExiting(true);
        setAppReady(true);
        window.setTimeout(() => {
          setUnmounted(true);
        }, 720);
        return;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [setAppReady, unmounted]);

  if (unmounted) return null;

  const webglStageDone = studio3DReady || forceReady;
  const scrollStageDone = displayPct >= 98;
  const pctStr = String(displayPct).padStart(2, "0");

  return (
    <div
      aria-live="polite"
      aria-label="Loading portfolio experience"
      className={`fixed inset-0 z-[200] overflow-hidden ${
        exiting ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      {/* Top Split Shutter Panel */}
      <div
        className={`absolute inset-x-0 top-0 h-1/2 bg-[#050C14] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform ${
          exiting ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="blueprint-grid absolute inset-0 opacity-35" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C6FF3D]/70 to-transparent" />
      </div>

      {/* Bottom Split Shutter Panel */}
      <div
        className={`absolute inset-x-0 bottom-0 h-1/2 bg-[#050C14] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform ${
          exiting ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="blueprint-grid absolute inset-0 opacity-35" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/70 to-transparent" />
      </div>

      {/* Subtle Ambient Core Glow + Center Telemetry HUD */}
      <div
        className={`relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center transition-all duration-400 ease-out ${
          exiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-[320px] w-[320px] sm:h-[460px] sm:w-[460px] rounded-full bg-[#1D4ED8]/20 blur-[100px]"
        />

        {/* Telemetry Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.24em] text-[#38BDF8] backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#C6FF3D]" />
          <span>Initializing 3D Digital Twin</span>
        </div>

        {/* Brand + Giant Monospace Percentage */}
        <div className="mt-5 flex flex-col items-center">
          <div className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
            {PORTFOLIO_DATA.brand.name}
            <span className="text-[#C6FF3D]">{PORTFOLIO_DATA.brand.markSuffix}</span>
          </div>
          <div className="mt-1 font-display text-[clamp(3.75rem,14vw,7.5rem)] font-black leading-none tracking-tighter text-white tabular-nums">
            {pctStr}
            <span className="text-[#C6FF3D] text-[0.45em] align-top ml-1">%</span>
          </div>
        </div>

        {/* Real Asset Warmup Checklist */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em]">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors duration-200 ${
              fontsReady
                ? "border-[#C6FF3D]/45 bg-[#C6FF3D]/12 text-[#C6FF3D]"
                : "border-white/10 bg-white/[0.03] text-slate-400"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${fontsReady ? "bg-[#C6FF3D]" : "bg-slate-500"}`} />
            01 Fonts
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors duration-200 ${
              webglStageDone
                ? "border-[#38BDF8]/45 bg-[#38BDF8]/12 text-[#38BDF8]"
                : "border-white/10 bg-white/[0.03] text-slate-400"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${webglStageDone ? "bg-[#38BDF8]" : "bg-slate-500"}`} />
            02 WebGL Core
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors duration-200 ${
              scrollStageDone
                ? "border-[#FF6B4A]/45 bg-[#FF6B4A]/12 text-[#FF6B4A]"
                : "border-white/10 bg-white/[0.03] text-slate-400"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${scrollStageDone ? "bg-[#FF6B4A]" : "bg-slate-500"}`} />
            03 Motion Rig
          </span>
        </div>

        {/* Sleek Linear Progress Track */}
        <div className="mt-6 h-[3px] w-full max-w-[260px] sm:max-w-[340px] overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full w-full origin-left bg-gradient-to-r from-[#38BDF8] via-[#C6FF3D] to-[#FF6B4A] transition-transform duration-100 ease-out will-change-transform"
            style={{ transform: `scaleX(${displayPct / 100})` }}
          />
        </div>

        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">
          {PORTFOLIO_DATA.brand.roleLine}
        </p>
      </div>
    </div>
  );
}
