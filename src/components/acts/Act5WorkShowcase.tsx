"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Gauge } from "lucide-react";
import {
  PORTFOLIO_DATA,
  type WorkCategory,
  type WorkProject,
} from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";
import { ToolBadge } from "@/components/ui/ToolBadges";
import { CodeMotionScene } from "@/components/ui/CodeMotionAssets";

const ProjectModal = dynamic(
  () => import("@/components/ui/ProjectModal").then((m) => m.ProjectModal),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

type FilterTab = "ALL" | WorkCategory;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "Civil Engineering", label: "Civil" },
  { id: "Software Engineering", label: "Software" },
  { id: "UI/UX & 3D Design", label: "Design" },
];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/**
 * ZERO-CARD 100% Full-Screen Edge-to-Edge Cinema Showreel (Chapter 05: Selected Works)
 * Each project takes over the entire 100vw x 100vh viewport with live Ken-Burns camera zoom,
 * GPU clip-path cinema shutter wipes, parallax background numerals, and kinetic lower-third titles.
 * Zero React re-renders during scroll -> locked 60-120 FPS!
 */
export function Act5WorkShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgScaleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numeralRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrubBarRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reelIndexTextRef = useRef<HTMLSpanElement>(null);

  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");
  const [modalProject, setModalProject] = useState<WorkProject | null>(null);

  const {
    setActiveChapter,
    setLetterboxActive,
    setProjectModalOpen,
    scrollToY,
  } = useShowreel();

  useEffect(() => {
    setProjectModalOpen(modalProject !== null);
    return () => setProjectModalOpen(false);
  }, [modalProject, setProjectModalOpen]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "ALL") return PORTFOLIO_DATA.workSection.projects;
    return PORTFOLIO_DATA.workSection.projects.filter(
      (p) => p.category === activeFilter
    );
  }, [activeFilter]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const count = filteredProjects.length;
    let lastActive = -1;

    const updateReel = (p: number) => {
      const segs = Math.max(1, count - 1);
      const exactPos = p * segs;
      const activeIdx = count <= 1 ? 0 : Math.min(count - 1, Math.round(exactPos));

      if (activeIdx !== lastActive && reelIndexTextRef.current) {
        lastActive = activeIdx;
        reelIndexTextRef.current.textContent = `REEL 0${activeIdx + 1} / 0${count}`;
      }

      for (let i = 0; i < count; i++) {
        const slide = slideRefs.current[i];
        const bgWrap = bgScaleRefs.current[i];
        const numEl = numeralRefs.current[i];
        const titleEl = titleRefs.current[i];
        const dash = scrubBarRefs.current[i];

        // Hold each project 100% full-screen cleanly before performing a swift cinema shutter wipe into the next reel!
        const rawDelta = exactPos - (i - 1);
        const wipeProgress = i === 0 ? 1 : clamp01((rawDelta - 0.45) / 0.55);
        const nextRawDelta = exactPos - i;
        const nextWipe = i < count - 1 ? clamp01((nextRawDelta - 0.45) / 0.55) : 0;
        const localHold = clamp01(exactPos - i + 0.5);

        if (slide) {
          const isOccluded =
            (i > 0 && wipeProgress <= 0.002) || nextWipe >= 0.998;
          slide.style.visibility = isOccluded ? "hidden" : "visible";
          // Pure GPU translate3d shutter wipe (ZERO SVG clip-path re-rasterization on mobile/tablet!)
          const leftPct = i === 0 ? 0 : (1 - wipeProgress) * 100;
          slide.style.transform = `translate3d(${leftPct.toFixed(2)}%, 0, 0)`;
          slide.style.pointerEvents = i === activeIdx ? "auto" : "none";
        }

        // Smooth Ken-Burns cinema zoom on full-bleed 4K scene
        if (bgWrap) {
          const kbScale = 1.02 + localHold * 0.1 + (1 - wipeProgress) * 0.08;
          bgWrap.style.transform = `scale(${kbScale.toFixed(4)})`;
        }

        // Giant translucent background index numeral gliding in parallax
        if (numEl) {
          const nx = (1 - wipeProgress) * 160 - localHold * 45;
          numEl.style.transform = `translate3d(${nx.toFixed(1)}px, 0, 0)`;
        }

        // Kinetic lower-third title glides cleanly in AND fades out before next shutter wipes over it
        if (titleEl) {
          const tx = (1 - wipeProgress) * 90 - nextWipe * 60;
          const enterOp = i === 0 ? 1 : clamp01((wipeProgress - 0.2) / 0.55);
          const exitOp = 1 - clamp01(nextWipe * 2.2);
          titleEl.style.transform = `translate3d(${tx.toFixed(1)}px, 0, 0)`;
          titleEl.style.opacity = Math.min(enterOp, exitOp).toFixed(3);
        }

        // Bottom timeline dash fill
        if (dash) {
          const fill = i === 0 ? 1 : wipeProgress;
          dash.style.transform = `scaleX(${Math.max(0.08, fill).toFixed(3)})`;
        }
      }
    };

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onEnter: () => {
          setActiveChapter("act-5");
          setLetterboxActive(false);
        },
        onEnterBack: () => {
          setActiveChapter("act-5");
          setLetterboxActive(false);
        },
        onUpdate: (self) => {
          updateReel(self.progress);
        },
      });
      updateReel(st.progress);
    }, section);

    // Refresh downstream ScrollTriggers (Act 6) whenever filter height changes
    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);

    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
    };
  }, [filteredProjects, setActiveChapter, setLetterboxActive]);

  const jumpToReelIndex = (idx: number) => {
    const section = sectionRef.current;
    if (!section || filteredProjects.length <= 1) return;
    const rectTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
    const targetY = rectTop + (idx / (filteredProjects.length - 1)) * scrollable;
    scrollToY(targetY);
  };

  const heightClass =
    filteredProjects.length <= 1
      ? "h-[140vh]"
      : filteredProjects.length === 2
        ? "h-[240vh]"
        : "h-[460vh]";

  return (
    <section
      id="act-5"
      ref={sectionRef}
      className={`relative w-full bg-[#050C14] text-white ${heightClass}`}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#050C14]">
        {/* === FULL-SCREEN EDGE-TO-EDGE CINEMA REEL LAYERS (ZERO CARDS!) === */}
        {filteredProjects.map((project, idx) => (
          <div
            key={project.id}
            ref={(el) => {
              slideRefs.current[idx] = el;
            }}
            className="absolute inset-0 h-full w-full overflow-hidden bg-[#050C14] [contain:layout_style_paint] will-change-transform"
            style={{
              zIndex: 10 + idx,
              transform: idx === 0 ? "translate3d(0%, 0, 0)" : "translate3d(100%, 0, 0)",
            }}
          >
            {/* Full-Bleed 100vw x 100vh Live 4K Motion Visual with Ken-Burns Zoom */}
            <div
              ref={(el) => {
                bgScaleRefs.current[idx] = el;
              }}
              className="absolute inset-0 h-full w-full will-change-transform"
            >
              <CodeMotionScene preset={project.codePreset} />
            </div>

            {/* Subtle Cinema Vignette for Razor-Sharp Typography Legibility */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040910] via-[#040910]/40 to-[#040910]/45"
            />

            {/* Colossal Parallax Index Numeral in Open Space */}
            <span
              ref={(el) => {
                numeralRefs.current[idx] = el;
              }}
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-16 sm:right-12 sm:top-14 font-display text-[26vw] sm:text-[18vw] font-black leading-none tracking-tighter text-white/[0.08] select-none will-change-transform"
            >
              0{idx + 1}
            </span>

            {/* Lower-Third Cinema Title & Interactive Spec Action (Frameless!) */}
            <div
              ref={(el) => {
                titleRefs.current[idx] = el;
              }}
              className="absolute inset-x-0 bottom-12 sm:bottom-20 z-20 mx-auto flex max-w-[1380px] flex-col justify-between gap-3 sm:gap-6 px-4 sm:px-12 sm:flex-row sm:items-end will-change-transform"
            >
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[9px] sm:text-xs font-bold uppercase tracking-[0.18em]">
                  <span style={{ color: project.accentColor }}>
                    {project.category}
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="inline-flex items-center gap-1.5 text-white/90">
                    <Gauge className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#C6FF3D]" />
                    {project.metricBadge}
                  </span>
                  <span className="hidden sm:inline text-white/30">•</span>
                  <span className="hidden sm:inline text-slate-300">
                    {project.client} ({project.year})
                  </span>
                </div>

                <h2 className="mt-1.5 sm:mt-2.5 font-display text-[clamp(1.75rem,6.2vw,4.5rem)] font-black leading-[0.94] tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
                  {project.title.split("—")[0].trim()}
                </h2>
                <p className="mt-1 sm:mt-2 max-w-xl text-xs sm:text-base text-slate-200 line-clamp-2 sm:line-clamp-none">
                  {project.subtitle} — <span className="text-slate-300">{project.metrics}</span>
                </p>

                <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5 sm:gap-2">
                  {project.tools.map((t) => (
                    <ToolBadge key={t} tool={t} size="sm" />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalProject(project)}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 sm:gap-2 self-start rounded-full bg-[#C6FF3D] px-4 py-2 sm:px-6 sm:py-3.5 font-mono text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#07131C] shadow-[0_14px_38px_rgba(198,255,61,0.32)] transition hover:scale-[1.04] hover:bg-white sm:self-end cursor-pointer"
              >
                <span>Inspect Full Spec</span>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        ))}

        {/* === TOP-LEFT FRAMELESS FILTER & REEL TELEMETRY (Clear below mobile top-right buttons!) === */}
        <div className="pointer-events-none absolute left-5 top-14 sm:left-12 sm:top-6 z-40 flex flex-wrap items-center gap-3 sm:gap-4">
          <span
            ref={reelIndexTextRef}
            className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#C6FF3D]"
          >
            REEL 01 / 0{filteredProjects.length}
          </span>
          <span className="h-3.5 w-px bg-white/25" />
          <div
            role="tablist"
            aria-label="Filter showcase reels"
            className="pointer-events-auto flex items-center gap-3"
          >
            {FILTER_TABS.map((tab) => {
              const selected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={selected}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition cursor-pointer ${
                    selected
                      ? "text-[#C6FF3D] underline decoration-2 underline-offset-4"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* === BOTTOM FILMSTRIP SCRUBBER BAR (Clickable Quick-Jump) === */}
        <div className="absolute inset-x-0 bottom-2.5 sm:bottom-5 z-40 mx-auto flex max-w-[1380px] items-center gap-2 sm:gap-3 px-4 sm:px-12">
          {filteredProjects.map((proj, idx) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => jumpToReelIndex(idx)}
              className="group flex flex-1 flex-col gap-1.5 py-1 text-left cursor-pointer"
              aria-label={`Jump to ${proj.title}`}
            >
              <span className="hidden sm:block truncate font-mono text-[9px] uppercase tracking-wider text-white/60 transition group-hover:text-white">
                0{idx + 1} {proj.title.split("—")[0].trim()}
              </span>
              <span className="block h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                <span
                  ref={(el) => {
                    scrubBarRefs.current[idx] = el;
                  }}
                  className="block h-full w-full origin-left bg-[#C6FF3D] will-change-transform"
                  style={{ transform: idx === 0 ? "scaleX(1)" : "scaleX(0.08)" }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lazy-Loaded Rounded Case Study Modal */}
      {modalProject && (
        <ProjectModal
          project={modalProject}
          onClose={() => setModalProject(null)}
        />
      )}
    </section>
  );
}
