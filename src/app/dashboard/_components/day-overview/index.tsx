"use client";

import { useEffect, useRef, useState } from "react";

import { IconCheck } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { Task } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

interface DayOverviewProps {
  dateKey?: string;
  habitsCompleted?: number;
  habitsTotal?: number;
  tasks: Task[];
}

export function DayOverview({
  tasks,
  habitsTotal = 0,
  habitsCompleted = 0,
  dateKey = "",
}: DayOverviewProps) {
  const { t } = useTranslation();

  const tasksTotal = tasks.length;
  const tasksCompleted = tasks.filter((item) => item.completed).length;
  const total = tasksTotal + habitsTotal;
  const completed = tasksCompleted + habitsCompleted;
  const pending = total - completed;
  const isAllDone = total > 0 && pending === 0;

  const prevRef = useRef<{ completed: number; dateKey: string } | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = { completed, dateKey };
    if (prev && prev.dateKey === dateKey && completed > prev.completed) {
      setPulseKey((k) => k + 1);
    }
  }, [completed, dateKey]);

  const tasksPct = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 100;
  const habitsPct = habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 100;

  const rOuter = 30;
  const rInner = 19;
  const cOuter = 2 * Math.PI * rOuter;
  const cInner = 2 * Math.PI * rInner;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-2xs dark:bg-neutral-900/90">
      <div className="flex items-center gap-4">
        {/* Apple Fitness Concentric Activity Rings (Tasks & Habits) */}
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={total > 0 ? Math.round((completed / total) * 100) : 0}
          key={pulseKey}
          role="progressbar"
          className={cn(
            "relative flex h-18 w-18 shrink-0 items-center justify-center",
            pulseKey > 0 && "animate-celebration-ring",
          )}
        >
          <svg className="h-18 w-18 -rotate-90 transform" viewBox="0 0 76 76">
            <circle
              className="stroke-orange-500/15"
              cx="38"
              cy="38"
              fill="transparent"
              r={rOuter}
              strokeWidth="7"
            />
            <circle
              className="stroke-orange-500 transition-all duration-500 ease-out"
              cx="38"
              cy="38"
              fill="transparent"
              r={rOuter}
              strokeDasharray={cOuter}
              strokeDashoffset={cOuter - (tasksPct / 100) * cOuter}
              strokeLinecap="round"
              strokeWidth="7"
            />

            <circle
              className="stroke-emerald-500/15"
              cx="38"
              cy="38"
              fill="transparent"
              r={rInner}
              strokeWidth="7"
            />
            <circle
              className="stroke-emerald-500 transition-all duration-500 ease-out"
              cx="38"
              cy="38"
              fill="transparent"
              r={rInner}
              strokeDasharray={cInner}
              strokeDashoffset={cInner - (habitsPct / 100) * cInner}
              strokeLinecap="round"
              strokeWidth="7"
            />
          </svg>
        </div>

        {/* Apple Fitness Metrics Breakdown */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-neutral-900 text-sm tracking-tight dark:text-neutral-100">
              {isAllDone ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <IconCheck size={15} stroke={2.5} />
                  <span>{t.dashboard.allDone}</span>
                </span>
              ) : (
                `${completed}/${total}`
              )}
            </span>
          </div>

          <div className="space-y-1 text-xs tabular-nums">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                <span>{t.bottomNav.tasks}</span>
              </span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {tasksCompleted}/{tasksTotal}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{t.habits.title}</span>
              </span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {habitsCompleted}/{habitsTotal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
