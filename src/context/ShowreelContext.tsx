"use client";

import React, { createContext, useContext, useRef, useState, useCallback } from "react";

export interface Studio3DScrollState {
  progress: number;
  inView: boolean;
  mouseX: number;
  mouseY: number;
}

interface ShowreelContextValue {
  activeChapter: string;
  setActiveChapter: (chapterId: string) => void;
  letterboxActive: boolean;
  setLetterboxActive: (active: boolean) => void;
  progressBarRef: React.RefObject<HTMLDivElement | null>;
  elevationTextRef: React.RefObject<HTMLSpanElement | null>;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
  toggleAutoPlay: () => void;
  scrollToChapter: (chapterId: string) => void;
  registerScrollTo: (fn: (chapterId: string) => void) => void;
  contactOpen: boolean;
  setContactOpen: (open: boolean) => void;
  studio3DRef: React.MutableRefObject<Studio3DScrollState>;
}

const ShowreelContext = createContext<ShowreelContextValue | null>(null);

export function ShowreelProvider({ children }: { children: React.ReactNode }) {
  const [activeChapter, setActiveChapterState] = useState("act-1");
  const [letterboxActive, setLetterboxActiveState] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Direct DOM refs -> 0 React re-renders during scroll!
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const elevationTextRef = useRef<HTMLSpanElement | null>(null);
  const scrollToFnRef = useRef<(chapterId: string) => void>(() => {});
  const studio3DRef = useRef<Studio3DScrollState>({
    progress: 0,
    inView: false,
    mouseX: 0,
    mouseY: 0,
  });

  const setActiveChapter = useCallback((chapterId: string) => {
    setActiveChapterState((prev) => (prev === chapterId ? prev : chapterId));
  }, []);

  const setLetterboxActive = useCallback((active: boolean) => {
    setLetterboxActiveState((prev) => (prev === active ? prev : active));
  }, []);

  const registerScrollTo = useCallback((fn: (chapterId: string) => void) => {
    scrollToFnRef.current = fn;
  }, []);

  const scrollToChapter = useCallback((chapterId: string) => {
    setIsAutoPlaying(false);
    scrollToFnRef.current(chapterId);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  return (
    <ShowreelContext.Provider
      value={{
        activeChapter,
        setActiveChapter,
        letterboxActive,
        setLetterboxActive,
        progressBarRef,
        elevationTextRef,
        isAutoPlaying,
        setIsAutoPlaying,
        toggleAutoPlay,
        scrollToChapter,
        registerScrollTo,
        contactOpen,
        setContactOpen,
        studio3DRef,
      }}
    >
      {children}
    </ShowreelContext.Provider>
  );
}

export function useShowreel() {
  const ctx = useContext(ShowreelContext);
  if (!ctx) {
    throw new Error("useShowreel must be used inside ShowreelProvider");
  }
  return ctx;
}
