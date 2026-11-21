"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface SplashScreenProps {
  /**
   * Minimum duration in milliseconds to keep the splash screen visible.
   * Defaults to 750ms.
   */
  minDuration?: number;
}

export function SplashScreen({ minDuration = 750 }: SplashScreenProps) {
  const [isMounted, setIsMounted] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  useEffect(() => {
    if (!isFading) return;
    const fadeTimer = setTimeout(() => {
      setIsMounted(false);
    }, 400);

    return () => clearTimeout(fadeTimer);
  }, [isFading]);

  if (!isMounted) return null;

  return (
    <div
      aria-label="Application loading"
      role="status"
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center select-none",
        "bg-neutral-50 dark:bg-neutral-950",
        "transition-all duration-400 ease-out",
        isFading && "pointer-events-none opacity-0 scale-102",
      )}
    >
      <div className="flex flex-col items-center">
        {/* Logo Container with Ambient Glow */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10 shadow-xs ring-1 ring-orange-500/20 dark:bg-orange-500/15 dark:ring-orange-500/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="FoxTrack Logo"
            className="h-10 w-10 animate-pulse select-none"
            height={40}
            src="/favicon.svg"
            width={40}
          />
        </div>

        {/* Brand Name */}
        <div className="mt-4 flex flex-col items-center">
          <span className="font-bold text-2xl tracking-tight text-neutral-900 leading-none dark:text-neutral-100">
            Fox<span className="text-orange-500">Track</span>
          </span>
          <p className="mt-1.5 font-medium text-neutral-400 text-xs dark:text-neutral-500">
            Personal Productivity
          </p>
        </div>

        {/* Minimalist Loading Bar */}
        <div className="mt-6 h-1 w-24 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-800">
          <div className="h-full w-full origin-left animate-[splash-progress_1s_ease-in-out_infinite] rounded-full bg-orange-500" />
        </div>
      </div>
    </div>
  );
}
