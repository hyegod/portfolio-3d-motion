"use client";

import React from "react";
import { Play, Pause, ArrowUpRight } from "lucide-react";
import { useShowreel } from "@/context/ShowreelContext";

/**
 * Minimalist Cinema Showreel Controls
 * Navbar & left coordinate notch removed per user request — only hairline progress,
 * Play Reel, and Let's Talk remain so 100% of the viewport belongs to the motion canvas.
 */
export function ShowreelHUD() {
  const {
    letterboxActive,
    progressBarRef,
    isAutoPlaying,
    toggleAutoPlay,
    setContactOpen,
  } = useShowreel();

  return (
    <>
      {/* Top 3px Hairline Scroll Progress */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[3px] bg-white/10">
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-gradient-to-r from-[#38BDF8] via-[#C6FF3D] to-[#FF6B4A] will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Minimal Top-Right Controls: Play Reel & Let's Talk ONLY */}
      <div
        className="pointer-events-auto fixed right-4 sm:right-7 z-50 flex items-center gap-2 transition-all duration-300"
        style={{
          top: letterboxActive ? "clamp(6px, 1.3vh, 13px)" : "14px",
        }}
      >
        <button
          type="button"
          onClick={toggleAutoPlay}
          className={`pointer-events-auto flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-[0_10px_28px_rgba(0,0,0,0.4)] backdrop-blur-md transition cursor-pointer ${
            isAutoPlaying
              ? "border-[#FF6B4A] bg-[#FF6B4A] text-white"
              : "border-white/20 bg-[#07131C]/80 text-white hover:border-[#38BDF8]"
          }`}
        >
          {isAutoPlaying ? (
            <>
              <Pause className="h-3 w-3 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3 fill-current text-[#C6FF3D]" />
              <span>Play Reel</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="pointer-events-auto flex items-center gap-1 rounded-full bg-[#C6FF3D] px-4 py-1.5 font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#07131C] shadow-[0_10px_28px_rgba(198,255,61,0.3)] transition hover:scale-[1.04] hover:bg-white cursor-pointer"
        >
          <span>Let&apos;s Talk</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </>
  );
}
