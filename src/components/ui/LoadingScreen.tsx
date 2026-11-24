"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";

/**
 * Minimalist Cinema Preloader
 * - Pure matte obsidian canvas, subtle wordmark, 1.5px hairline progress & whisper counter
 * - Still waits for real Google Fonts, DOM load, and Act 2 WebGL warmup (2.4s fail-safe max)
 * - Exits with a single smooth upward curtain wipe synchronized with Act 1's hero entrance
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

    const onLoad = () => {
      if (!cancelled) setDomReady(true);
    };
    if (document.readyState === "complete") {
      queueMicrotask(onLoad);
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

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

  // 2. Smooth interpolated progress -> clean upward curtain exit at 100%
  useEffect(() => {
    if (unmounted) return;
    let rafId = 0;
    let current = 0;
    const MIN_VISIBLE_MS = 580;

    const step = () => {
      const elapsed = performance.now() - startedAtRef.current;
      const fDone = fontsReadyRef.current;
      const dDone = domReadyRef.current;
      const wDone = studioReadyRef.current || forceReadyRef.current;

      let target = 24;
      if (fDone) target += 28;
      if (dDone) target += 20;
      if (wDone) target += 28;
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
        try {
          ScrollTrigger.refresh();
        } catch {
          // Ignore if ScrollTrigger not yet initialized
        }
        setExiting(true);
        setAppReady(true);
        window.setTimeout(() => {
          setUnmounted(true);
        }, 700);
        return;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [setAppReady, unmounted]);

  if (unmounted) return null;

  const pctStr = String(displayPct).padStart(2, "0");

  return (
    <div
      aria-live="polite"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-[#050C14] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform ${
        exiting ? "pointer-events-none -translate-y-full" : "pointer-events-auto translate-y-0"
      }`}
    >
      <div
        className={`flex flex-col items-center gap-4 transition-all duration-350 ease-out ${
          exiting ? "-translate-y-3 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Minimal Brand Mark */}
        <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white select-none">
          {PORTFOLIO_DATA.brand.name}
          <span className="text-[#C6FF3D]">.</span>
          <span className="inline-block animate-pulse text-[#C6FF3D]">_</span>
        </div>

        {/* Hairline Progress Bar + Quiet Counter */}
        <div className="flex items-center gap-3">
          <div className="h-[1.5px] w-28 sm:w-36 overflow-hidden rounded-full bg-white/12">
            <div
              className="h-full w-full origin-left bg-[#C6FF3D] will-change-transform"
              style={{ transform: `scaleX(${displayPct / 100})` }}
            />
          </div>
          <span className="w-7 text-right font-mono text-[11px] font-medium tracking-widest text-white/45 tabular-nums">
            {pctStr}
          </span>
        </div>
      </div>
    </div>
  );
}
