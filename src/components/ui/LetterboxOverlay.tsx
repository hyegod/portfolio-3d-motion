"use client";

import React from "react";
import { useShowreel } from "@/context/ShowreelContext";

export function LetterboxOverlay() {
  const { letterboxActive } = useShowreel();

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 right-0 top-0 z-40 h-[7vh] bg-[#04090F] transition-transform duration-500 ease-out will-change-transform ${
          letterboxActive ? "translate-y-0" : "-translate-y-full"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed bottom-0 left-0 right-0 z-40 h-[7vh] bg-[#04090F] transition-transform duration-500 ease-out will-change-transform ${
          letterboxActive ? "translate-y-0" : "translate-y-full"
        }`}
      />
    </>
  );
}
