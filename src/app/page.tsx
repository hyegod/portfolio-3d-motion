"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ShowreelProvider, useShowreel } from "@/context/ShowreelContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { LetterboxOverlay } from "@/components/ui/LetterboxOverlay";
import { VisualGlueOverlay } from "@/components/ui/VisualGlueOverlay";
import { ShowreelHUD } from "@/components/ui/ShowreelHUD";
import { Act1HeroCollage } from "@/components/acts/Act1HeroCollage";
import { Act2Studio3D } from "@/components/acts/Act2Studio3D";
import { Act3KineticBridge } from "@/components/acts/Act3KineticBridge";
import { Act4SkillsPitch } from "@/components/acts/Act4SkillsPitch";
import { Act5WorkShowcase } from "@/components/acts/Act5WorkShowcase";
import { Act6Outro } from "@/components/acts/Act6Outro";

// Lazy-load heavy interactive modal only when the user actually opens it
const ContactModal = dynamic(
  () => import("@/components/ui/ContactModal").then((m) => m.ContactModal),
  { ssr: false }
);

function LazyContactModalGate() {
  const { contactOpen } = useShowreel();
  if (!contactOpen) return null;
  return <ContactModal />;
}

export default function HomePage() {
  return (
    <ShowreelProvider>
      <SmoothScrollProvider>
        {/* Cinema Preloader & Asset Warmup Curtain */}
        <LoadingScreen />

        {/* Global Subtle Halftone Grain, Cinema Letterbox & Floating Pill HUD */}
        <VisualGlueOverlay />
        <LetterboxOverlay />
        <ShowreelHUD />
        <LazyContactModalGate />

        {/* 6-Act Fluid Rounded Civil × Software × Design × Music Showreel */}
        <main className="relative w-full">
          <Act1HeroCollage />
          <Act2Studio3D />
          <Act3KineticBridge />
          <Act4SkillsPitch />
          <Act5WorkShowcase />
          <Act6Outro />
        </main>
      </SmoothScrollProvider>
    </ShowreelProvider>
  );
}
