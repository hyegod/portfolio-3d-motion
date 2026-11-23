"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useShowreel } from "@/context/ShowreelContext";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isAutoPlaying,
    setIsAutoPlaying,
    progressBarRef,
    elevationTextRef,
    registerScrollTo,
    studio3DRef,
  } = useShowreel();

  const lenisRef = useRef<Lenis | null>(null);
  const autoPlayRef = useRef(isAutoPlaying);

  useEffect(() => {
    autoPlayRef.current = isAutoPlaying;
  }, [isAutoPlaying]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    let lastElString = "";
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      ScrollTrigger.update();
      const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }
      if (elevationTextRef.current) {
        const elMeters = (p * 42).toFixed(1);
        const nextStr = `EL +${elMeters}m`;
        if (nextStr !== lastElString) {
          lastElString = nextStr;
          elevationTextRef.current.textContent = nextStr;
        }
      }
    });

    let lastTime = performance.now();
    const tick = (time: number) => {
      const now = time * 1000;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (autoPlayRef.current) {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const currentY = window.scrollY;

        if (currentY >= maxScroll - 4) {
          setIsAutoPlaying(false);
        } else {
          const pxPerSec = Math.max(260, maxScroll / 30);
          const nextY = Math.min(maxScroll, currentY + pxPerSec * dt);
          lenis.scrollTo(nextY, { immediate: true });
        }
      }

      lenis.raf(now);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const stopAutoPlay = () => {
      if (autoPlayRef.current) setIsAutoPlaying(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", " "].includes(
          e.key
        )
      ) {
        stopAutoPlay();
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      studio3DRef.current.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      studio3DRef.current.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("wheel", stopAutoPlay, { passive: true });
    window.addEventListener("touchstart", stopAutoPlay, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    registerScrollTo((chapterId: string) => {
      if (chapterId === "top") {
        lenis.scrollTo(0, { duration: 1.35 });
        return;
      }
      const el = document.getElementById(chapterId);
      if (el) {
        lenis.scrollTo(el, { duration: 1.25, offset: 0 });
      }
    });

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("wheel", stopAutoPlay);
      window.removeEventListener("touchstart", stopAutoPlay);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [elevationTextRef, progressBarRef, registerScrollTo, setIsAutoPlaying, studio3DRef]);

  return <>{children}</>;
}
