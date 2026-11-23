"use client";

import React from "react";
import type { ToolId } from "@/data/portfolio";

interface ToolBadgeProps {
  tool: ToolId;
  size?: "sm" | "md" | "lg";
  variant?: "color" | "dark";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-15 w-15 sm:h-16 sm:w-16",
};

const TEXT_MAP = {
  sm: "text-[11px]",
  md: "text-sm",
  lg: "text-xl",
};

export function ToolBadge({
  tool,
  size = "md",
  variant = "color",
  className = "",
}: ToolBadgeProps) {
  const dim = SIZE_MAP[size];
  const txt = TEXT_MAP[size];
  const isDark = variant === "dark";

  if (tool === "autocad") {
    return (
      <div
        title="AutoCAD / Civil 3D"
        className={`inline-flex items-center justify-center rounded-xl font-display font-black tracking-tight transition-transform hover:scale-110 ${
          isDark
            ? "bg-[#0F172A]/90 text-[#FCA5A5] border border-white/15"
            : "bg-[#B91C1C] text-white border-2 border-[#FCA5A5]/75 shadow-[0_12px_26px_rgba(185,28,28,0.45)]"
        } ${dim} ${className}`}
      >
        <span className={txt}>CAD</span>
      </div>
    );
  }

  if (tool === "revit") {
    return (
      <div
        title="Revit BIM & Structural ETABS"
        className={`inline-flex items-center justify-center rounded-xl font-display font-black tracking-tight transition-transform hover:scale-110 ${
          isDark
            ? "bg-[#0F172A]/90 text-[#93C5FD] border border-white/15"
            : "bg-[#1D4ED8] text-white border-2 border-[#93C5FD]/80 shadow-[0_12px_26px_rgba(29,78,216,0.45)]"
        } ${dim} ${className}`}
      >
        <span className={txt}>BIM</span>
      </div>
    );
  }

  if (tool === "typescript") {
    return (
      <div
        title="TypeScript / Next.js Full-Stack"
        className={`inline-flex items-center justify-center rounded-xl font-display font-black tracking-tight transition-transform hover:scale-110 ${
          isDark
            ? "bg-[#0F172A]/90 text-[#38BDF8] border border-white/15"
            : "bg-[#0284C7] text-white border-2 border-[#7DD3FC]/80 shadow-[0_12px_26px_rgba(2,132,199,0.45)]"
        } ${dim} ${className}`}
      >
        <span className={txt}>TS</span>
      </div>
    );
  }

  if (tool === "python") {
    return (
      <div
        title="Python Computational Engineering"
        className={`inline-flex items-center justify-center rounded-xl font-display font-black tracking-tight transition-transform hover:scale-110 ${
          isDark
            ? "bg-[#0F172A]/90 text-[#FDE047] border border-white/15"
            : "bg-[#1E293B] text-[#FACC15] border-2 border-[#38BDF8]/80 shadow-[0_12px_26px_rgba(30,41,59,0.5)]"
        } ${dim} ${className}`}
      >
        <span className={txt}>Py</span>
      </div>
    );
  }

  if (tool === "figma") {
    return (
      <div
        title="UI/UX Design & 3D Motion"
        className={`inline-flex items-center justify-center rounded-xl p-1.5 transition-transform hover:scale-110 ${
          isDark
            ? "bg-[#0F172A]/90 border border-white/15"
            : "bg-[#18181B] border-2 border-[#C084FC]/75 shadow-[0_12px_26px_rgba(168,85,247,0.4)]"
        } ${dim} ${className}`}
      >
        <svg viewBox="0 0 48 48" className="h-full w-full" fill="none">
          <rect x="14" y="6" width="10" height="12" rx="5" fill="#F43F5E" />
          <rect x="24" y="6" width="10" height="12" rx="5" fill="#FB923C" />
          <rect x="14" y="18" width="10" height="12" rx="5" fill="#A855F7" />
          <circle cx="29" cy="24" r="5.5" fill="#38BDF8" />
          <rect x="14" y="30" width="10" height="12" rx="5" fill="#22C55E" />
        </svg>
      </div>
    );
  }

  // music
  return (
    <div
      title="Music Production & Live Guitar"
      className={`inline-flex items-center justify-center rounded-xl p-1.5 transition-transform hover:scale-110 ${
        isDark
          ? "bg-[#0F172A]/90 border border-white/15"
          : "bg-[#1E1033] border-2 border-[#F472B6]/80 shadow-[0_12px_26px_rgba(236,72,153,0.4)]"
      } ${dim} ${className}`}
    >
      <svg viewBox="0 0 48 48" className="h-full w-full" fill="none">
        <path
          d="M20 34V14L36 10V30"
          stroke={isDark ? "#F472B6" : "#FDE047"}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="15" cy="34" r="5" fill="#F472B6" />
        <circle cx="31" cy="30" r="5" fill="#38BDF8" />
      </svg>
    </div>
  );
}
