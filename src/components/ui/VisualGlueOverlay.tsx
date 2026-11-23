"use client";

import React from "react";

/**
 * Lightweight zero-blend-mode halftone dot overlay so the browser compositor
 * never pays full-screen mix-blend-mode or blur-2xl readback cost during 120fps scroll.
 */
export function VisualGlueOverlay() {
  return (
    <div
      aria-hidden="true"
      className="halftone-overlay pointer-events-none fixed inset-0 z-30 opacity-[0.07]"
    />
  );
}
