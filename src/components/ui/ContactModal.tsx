"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Copy,
  Check,
  Send,
  Sparkles,
  ArrowUpRight,
  Layers,
  Code2,
  Palette,
  Coffee,
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useShowreel } from "@/context/ShowreelContext";

const INQUIRY_TOPICS = [
  { id: "civil", label: "Civil & Structural BIM", icon: Layers },
  { id: "software", label: "Software & WebGL API", icon: Code2 },
  { id: "design", label: "UI/UX & 3D Interactive", icon: Palette },
  { id: "general", label: "General Chat / Sync", icon: Coffee },
];

export function ContactModal() {
  const { contactOpen, setContactOpen } = useShowreel();
  const [selectedTopic, setSelectedTopic] = useState("civil");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);

  useEffect(() => {
    if (!contactOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [contactOpen, setContactOpen]);

  if (!contactOpen) return null;

  const copyDirectEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_DATA.brand.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard fallback
    }
  };

  const getTopicLabel = () =>
    INQUIRY_TOPICS.find((t) => t.id === selectedTopic)?.label || "Collaboration";

  const generateMailto = () => {
    const subject = `[Project Inquiry: ${getTopicLabel()}] ${name ? `From ${name}` : "New Project"}`;
    const body = `Hi Axis,\n\nSender: ${name || "[Your Name]"}\nContact: ${
      email || "[Your Email]"
    }\nTopic: ${getTopicLabel()}\n\nMessage:\n${
      message || "I would like to collaborate on a new project."
    }\n\nBest regards,\n${name || ""}`;
    return `mailto:${PORTFOLIO_DATA.brand.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const copyFullBrief = async () => {
    const briefText = `PROJECT INQUIRY FOR AXIS._\n-------------------------\nTopic: ${getTopicLabel()}\nSender: ${
      name || "N/A"
    }\nEmail: ${email || "N/A"}\nMessage: ${message || "N/A"}\nSent via axis-eng.dev`;
    try {
      await navigator.clipboard.writeText(briefText);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Direct Dispatch Console"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#03070E]/85 p-3 sm:p-5 backdrop-blur-md"
      onClick={() => setContactOpen(false)}
    >
      <div
        data-lenis-prevent
        className="relative max-h-[92dvh] w-full max-w-xl overflow-x-hidden overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#0B1A28] to-[#050C14] p-5 sm:p-8 text-white shadow-[0_32px_95px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#38BDF8]/25 blur-3xl"
        />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={() => setContactOpen(false)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-[#C6FF3D] hover:text-[#07131C] cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Telemetry Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C6FF3D]/30 bg-[#C6FF3D]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">
          <Sparkles className="h-3 w-3" />
          <span>Interactive Dispatch Console • SLA &lt; 12h</span>
        </div>

        <h3 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
          Let&apos;s Build Something{" "}
          <span className="text-[#38BDF8]">Resilient.</span>
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Select a project domain or send an open inquiry directly to Axis._.
        </p>

        {/* Domain Selector Pills */}
        <div className="mt-4">
          <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Domain Focus
          </label>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {INQUIRY_TOPICS.map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left font-mono text-[10px] font-bold uppercase transition cursor-pointer ${
                    isSelected
                      ? "border-[#C6FF3D] bg-[#C6FF3D]/15 text-[#C6FF3D] shadow-[0_0_15px_rgba(198,255,61,0.2)]"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <Icon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{topic.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Inquiry Fields */}
        <div className="mt-4 space-y-2.5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Elena Rostova"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#38BDF8] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1">
                Your Email / Handle
              </label>
              <input
                type="text"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#38BDF8] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1">
              Project Brief / Note
            </label>
            <textarea
              rows={3}
              placeholder="Tell me about the engineering challenge, timeline, or design goals..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#38BDF8] focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Dispatch Action Strip */}
        <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={copyDirectEmail}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[10px] text-slate-300 transition hover:border-[#38BDF8] hover:text-[#38BDF8] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span>Email Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>{PORTFOLIO_DATA.brand.email}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyFullBrief}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-[10px] font-bold text-white transition hover:bg-white/20 cursor-pointer"
            >
              {copiedBrief ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span>Brief Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Brief</span>
                </>
              )}
            </button>

            <a
              href={generateMailto()}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#C6FF3D] px-4 py-1.5 font-mono text-[11px] font-extrabold uppercase tracking-wider text-[#07131C] shadow-[0_8px_22px_rgba(198,255,61,0.28)] transition hover:scale-[1.03] hover:bg-white cursor-pointer"
            >
              <Send className="h-3 w-3" />
              <span>Launch Client ↗</span>
            </a>
          </div>
        </div>

        {/* Social Badges Footer */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {PORTFOLIO_DATA.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-2.5 py-2 text-[10px] font-mono text-slate-300 transition hover:border-[#C6FF3D]/40 hover:bg-white/5"
            >
              <span className="font-semibold text-white truncate">{s.label}</span>
              <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-500 transition group-hover:text-[#C6FF3D]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
