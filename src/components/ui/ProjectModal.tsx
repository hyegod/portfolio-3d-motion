"use client";

import React, { useEffect } from "react";
import { X, Gauge, Sparkles, Layers, ArrowUpRight } from "lucide-react";
import type { WorkProject } from "@/data/portfolio";
import { ToolBadge } from "@/components/ui/ToolBadges";
import { useShowreel } from "@/context/ShowreelContext";
import { CodeMotionScene } from "@/components/ui/CodeMotionAssets";

interface ProjectModalProps {
  project: WorkProject | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { setContactOpen } = useShowreel();

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#04090F]/80 p-3 sm:p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        className="relative max-h-[92dvh] w-full max-w-2xl overflow-x-hidden overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/15 bg-[#091520] p-4 sm:p-8 text-white shadow-[0_32px_90px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#38BDF8]">
            Engineering &amp; Creative Case Study • {project.year}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="relative z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-[#C6FF3D] hover:text-[#07131C] cursor-pointer"
            aria-label="Close project detail"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mb-6 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-[#050C14]">
          <CodeMotionScene preset={project.codePreset} />

          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-[#07131C]/85 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-sm">
            <Gauge className="h-3.5 w-3.5 text-[#C6FF3D]" />
            <span>{project.metricBadge}</span>
            <span className="text-white/30">•</span>
            <span>{project.year}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span
              className="inline-block rounded-full px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#07131C]"
              style={{ backgroundColor: project.accentColor }}
            >
              {project.category}
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold">
              {project.title}
            </h3>
            <p className="text-sm text-slate-400">
              {project.subtitle} — {project.client}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {project.tools.map((t) => (
              <ToolBadge key={t} tool={t} size="sm" />
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {project.description}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-400">
              <Layers className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Scope &amp; Deliverables</span>
            </div>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-200">
              {project.deliverables.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C6FF3D]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-[#FF6B4A]" />
                <span>Measured Outcome</span>
              </div>
              <p className="mt-2.5 font-display text-base font-bold text-white">
                {project.metrics}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                setContactOpen(true);
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#C6FF3D] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#07131C] transition hover:brightness-110 cursor-pointer"
            >
              <span>Discuss a Similar Build</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
