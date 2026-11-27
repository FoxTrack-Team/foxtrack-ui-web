"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { FoxAnimatedLogo } from "./fox-animated-logo";

interface SplashScreenProps {
  /**
   * Minimum duration in milliseconds to keep the splash screen visible.
   * Defaults to 1350ms to let the logo animation sequence complete cleanly.
   */
  minDuration?: number;
}

export function SplashScreen({ minDuration = 1350 }: SplashScreenProps) {
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
      style={{ contain: "strict" }}
      className={cn(
        "fixed inset-0 z-50 flex transform-gpu flex-col items-center justify-center overflow-hidden select-none will-change-[transform,opacity]",
        "bg-[#fcfbfa] dark:bg-[#09090b]",
        "transition-[transform,opacity] duration-400 ease-out",
        isFading && "pointer-events-none scale-[1.03] opacity-0",
      )}
    >
      {/* Subtle Top Studio Ambient Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.09)_0%,transparent_70%)]"
      />

      <div className="relative flex flex-col items-center px-6" dir="ltr">
        {/* Multi-layered Animated Fox Emblem */}
        <FoxAnimatedLogo />

        {/* Brand Wordmark */}
        <div className="mt-4 flex flex-col items-center text-center">
          <span className="splash-wordmark font-bold text-[26px] text-neutral-900 leading-none tracking-tight dark:text-neutral-50">
            Fox<span className="text-orange-500">Track</span>
          </span>

          {/* Crisp Expanding Horizon Accent */}
          <div
            aria-hidden="true"
            className="splash-hairline mt-3 h-px w-12 bg-gradient-to-r from-transparent via-orange-400/75 to-transparent dark:via-orange-500/60"
          />

          <p className="splash-tagline mt-2.5 font-medium text-[11px] text-neutral-400 uppercase tracking-[0.2em] dark:text-neutral-500">
            Personal Productivity
          </p>
        </div>

        {/* Precision Kinetic Progress Track */}
        <div className="mt-7 h-0.5 w-28 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="splash-bar-fill h-full w-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-teal-400" />
        </div>
      </div>
    </div>
  );
}
