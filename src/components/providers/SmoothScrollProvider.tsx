"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useShowreel } from "@/context/ShowreelContext";
import { isCompactViewport } from "@/lib/webgl";

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
    registerScrollToY,
    contactOpen,
    projectModalOpen,
    isAppReady,
    studio3DRef,
  } = useShowreel();

  const lenisRef = useRef<Lenis | null>(null);
  const autoPlayRef = useRef(isAutoPlaying);
  const isScrollLocked = !isAppReady || contactOpen || projectModalOpen;

  useEffect(() => {
    autoPlayRef.current = isAutoPlaying;
  }, [isAutoPlaying]);

  // Lock background scroll cleanly while LoadingScreen or any Modal is active
  useEffect(() => {
    const lenis = lenisRef.current;
    if (isScrollLocked) {
      if (autoPlayRef.current) setIsAutoPlaying(false);
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isScrollLocked, setIsAutoPlaying]);

  // Refresh ScrollTrigger once app finishes preloading so every pinned act is pixel-accurate
  useEffect(() => {
    if (!isAppReady) return;
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(id);
  }, [isAppReady]);

  useEffect(() => {
    const useNativeTouchScroll = isCompactViewport();

    // Prevent iOS/Android address-bar resize jumps from triggering jarring ScrollTrigger recalculations
    ScrollTrigger.config({ ignoreMobileResize: true });

    let lastElString = "";
    const updateHudProgress = (rawProgress: number) => {
      const p = Number.isFinite(rawProgress)
        ? Math.min(1, Math.max(0, rawProgress))
        : 0;
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
    };

    // Desktop gets silky Lenis wheel smoothing; Mobile & Tablet keep 100% native 60-120Hz hardware inertia!
    let lenis: Lenis | null = null;
    if (!useNativeTouchScroll) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
      });
      lenisRef.current = lenis;
      if (!isAppReady) lenis.stop();

      lenis.on("scroll", ({ progress }: { progress: number }) => {
        ScrollTrigger.update();
        updateHudProgress(progress);
      });
    }

    const onNativeScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      updateHudProgress(window.scrollY / maxScroll);
    };
    if (useNativeTouchScroll) {
      window.addEventListener("scroll", onNativeScroll, { passive: true });
    }

    let lastTime = performance.now();
    const tick = (time: number) => {
      const now = time * 1000;
      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;

      if (autoPlayRef.current) {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const currentY = window.scrollY;

        if (currentY >= maxScroll - 4) {
          setIsAutoPlaying(false);
        } else {
          const pxPerSec = Math.max(220, maxScroll / 52);
          const nextY = Math.min(maxScroll, currentY + pxPerSec * dt);
          if (lenis) {
            lenis.scrollTo(nextY, { immediate: true });
          } else {
            window.scrollTo(0, nextY);
          }
        }
      }

      lenis?.raf(now);
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
      studio3DRef.current.mouseX =
        (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      studio3DRef.current.mouseY =
        -(e.clientY / Math.max(1, window.innerHeight)) * 2 + 1;
    };

    let resizeTimer = 0;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      // Ignore mobile browser URL-bar height-only resizes while scrolling!
      if (useNativeTouchScroll && window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 240);
    };

    window.addEventListener("wheel", stopAutoPlay, { passive: true });
    window.addEventListener("touchstart", stopAutoPlay, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);
    if (!useNativeTouchScroll) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    registerScrollTo((chapterId: string) => {
      if (chapterId === "top") {
        if (lenis) lenis.scrollTo(0, { duration: 1.35 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(chapterId);
      if (el) {
        if (lenis) lenis.scrollTo(el, { duration: 1.25, offset: 0 });
        else el.scrollIntoView({ behavior: "smooth" });
      }
    });

    registerScrollToY((y: number) => {
      if (lenis) lenis.scrollTo(y, { duration: 1.05 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    });

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("wheel", stopAutoPlay);
      window.removeEventListener("touchstart", stopAutoPlay);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (useNativeTouchScroll) {
        window.removeEventListener("scroll", onNativeScroll);
      } else {
        window.removeEventListener("mousemove", onMouseMove);
      }
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elevationTextRef, progressBarRef, registerScrollTo, registerScrollToY, setIsAutoPlaying, studio3DRef]);

  return <>{children}</>;
}
