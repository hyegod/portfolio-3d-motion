"use client";

import React from "react";
import { ShowreelProvider } from "@/context/ShowreelContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { LetterboxOverlay } from "@/components/ui/LetterboxOverlay";
import { VisualGlueOverlay } from "@/components/ui/VisualGlueOverlay";
import { ShowreelHUD } from "@/components/ui/ShowreelHUD";
import { ContactModal } from "@/components/ui/ContactModal";
import { Act1HeroCollage } from "@/components/acts/Act1HeroCollage";
import { Act2Studio3D } from "@/components/acts/Act2Studio3D";
import { Act3KineticBridge } from "@/components/acts/Act3KineticBridge";
import { Act4SkillsPitch } from "@/components/acts/Act4SkillsPitch";
import { Act5WorkShowcase } from "@/components/acts/Act5WorkShowcase";
import { Act6Outro } from "@/components/acts/Act6Outro";

export default function HomePage() {
  return (
    <ShowreelProvider>
      <SmoothScrollProvider>
        {/* Global Subtle Halftone Grain, Cinema Letterbox & Floating Pill HUD */}
        <VisualGlueOverlay />
        <LetterboxOverlay />
        <ShowreelHUD />
        <ContactModal />

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
