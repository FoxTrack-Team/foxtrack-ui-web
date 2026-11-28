"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import { IconCheck, IconSparkles } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { cn } from "@/lib/utils";

interface CompletionCelebrationProps {
  completed: number;
  dateKey: string;
  total: number;
}

const CONFETTI_PARTICLES = [
  { color: "bg-orange-500", rot: "-140deg", tx: "-76px", ty: "-34px" },
  { color: "bg-emerald-500", rot: "160deg", tx: "-54px", ty: "-52px" },
  { color: "bg-amber-400", rot: "-110deg", tx: "-28px", ty: "-58px" },
  { color: "bg-sky-400", rot: "125deg", tx: "28px", ty: "-58px" },
  { color: "bg-rose-400", rot: "-165deg", tx: "54px", ty: "-52px" },
  { color: "bg-orange-400", rot: "145deg", tx: "76px", ty: "-34px" },
  { color: "bg-emerald-400", rot: "90deg", tx: "-86px", ty: "18px" },
  { color: "bg-amber-500", rot: "-95deg", tx: "-48px", ty: "36px" },
  { color: "bg-sky-500", rot: "110deg", tx: "48px", ty: "36px" },
  { color: "bg-rose-500", rot: "-120deg", tx: "86px", ty: "18px" },
];

export function CompletionCelebration({ completed, dateKey, total }: CompletionCelebrationProps) {
  const { t } = useTranslation();
  const prevRef = useRef<{ completed: number; dateKey: string } | null>(null);
  const [burstKey, setBurstKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = { completed, dateKey };

    if (!prev || prev.dateKey !== dateKey) {
      setIsVisible(false);
      return;
    }

    if (completed > prev.completed) {
      setBurstKey((k) => k + 1);
      setIsVisible(true);
    }
  }, [completed, dateKey]);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setIsVisible(false), 1800);
    return () => clearTimeout(timer);
  }, [isVisible, burstKey]);

  if (!isVisible) return null;

  const isAllDone = total > 0 && completed >= total;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4"
      key={burstKey}
      role="status"
    >
      <div className="relative flex items-center justify-center">
        {/* Confetti Particles */}
        {CONFETTI_PARTICLES.map((particle, idx) => (
          <span
            className={cn("animate-confetti-fly absolute h-2 w-2 rounded-full", particle.color)}
            key={idx}
            style={
              {
                "--rot": particle.rot,
                "--tx": particle.tx,
                "--ty": particle.ty,
              } as CSSProperties
            }
          />
        ))}

        {/* Apple-style Floating Celebration Pill */}
        <div
          className={cn(
            "animate-celebration-pill relative flex items-center gap-2.5 rounded-full bg-white/95 px-4 py-2 shadow-lg ring-1 backdrop-blur-md dark:bg-neutral-900/95",
            isAllDone
              ? "ring-emerald-500/30 dark:ring-emerald-500/40"
              : "ring-black/5 dark:ring-white/10",
          )}
        >
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
              isAllDone
                ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
            )}
          >
            {isAllDone ? (
              <IconCheck size={14} stroke={2.5} />
            ) : (
              <IconSparkles size={14} stroke={2} />
            )}
          </span>

          <span className="font-semibold text-neutral-900 text-xs dark:text-neutral-100">
            {isAllDone ? t.dashboard.allDoneCelebrate : t.dashboard.greatProgress}
          </span>

          {total > 0 && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-semibold text-[11px] tabular-nums",
                isAllDone
                  ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
              )}
            >
              {completed}/{total}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
