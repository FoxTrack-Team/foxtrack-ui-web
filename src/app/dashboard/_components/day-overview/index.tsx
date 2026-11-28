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
  dateKey = "",
  habitsCompleted = 0,
  habitsTotal = 0,
  tasks,
}: DayOverviewProps) {
  const { t } = useTranslation();

  const taskTotal = tasks.length;
  const taskCompleted = tasks.filter((item) => item.completed).length;
  const total = taskTotal + habitsTotal;
  const completed = taskCompleted + habitsCompleted;
  const pending = total - completed;
  const highPriority = tasks.filter((item) => !item.completed && item.priority === "high").length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
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

  // SVG Circular progress values
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl bg-white p-3.5 shadow-2xs sm:p-4 dark:bg-neutral-900/80">
      <div className="flex items-center gap-3.5">
        {/* Mobile-Friendly Circular Progress Ring */}
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={percentage}
          key={pulseKey}
          role="progressbar"
          className={cn(
            "relative flex h-11 w-11 shrink-0 items-center justify-center",
            pulseKey > 0 && "animate-celebration-ring",
          )}
        >
          <svg className="h-11 w-11 -rotate-90 transform" viewBox="0 0 42 42">
            <circle
              className="stroke-neutral-100 dark:stroke-neutral-800"
              cx="21"
              cy="21"
              fill="transparent"
              r={radius}
              strokeWidth="3.5"
            />
            {total > 0 && (
              <circle
                cx="21"
                cy="21"
                fill="transparent"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="3.5"
                className={cn(
                  "transition-all duration-500 ease-out",
                  isAllDone ? "stroke-emerald-500" : "stroke-orange-500",
                )}
              />
            )}
          </svg>

          <div className="absolute inset-0 flex items-center justify-center font-bold text-[11px] tabular-nums">
            {isAllDone ? (
              <IconCheck className="text-emerald-500" size={16} stroke={3} />
            ) : total === 0 ? (
              <span className="text-neutral-500 dark:text-neutral-500">0%</span>
            ) : (
              <span className="text-neutral-800 dark:text-neutral-200">{percentage}%</span>
            )}
          </div>
        </div>

        {/* Content & Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="truncate font-semibold text-neutral-900 text-xs tabular-nums sm:text-sm dark:text-neutral-100">
              {habitsTotal === 0
                ? total === 0
                  ? `0 / 0 ${t.dashboard.tasksCount}`
                  : `${completed} / ${total} ${total === 1 ? t.dashboard.taskSingular : t.dashboard.tasksCount}`
                : `${completed} / ${total} ${t.dashboard.progress}`}
            </span>
            {habitsTotal > 0 && (
              <span className="text-[11px] text-neutral-500 tabular-nums dark:text-neutral-400">
                {t.bottomNav.tasks}: {taskCompleted}/{taskTotal} · {t.bottomNav.habits}:{" "}
                {habitsCompleted}/{habitsTotal}
              </span>
            )}
          </div>

          {/* Compact Fluid Metrics Badges */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tabular-nums">
            <span className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                {t.dashboard.completedCount}:{" "}
                <strong className="font-semibold text-neutral-900 dark:text-neutral-200">
                  {completed}
                </strong>
              </span>
            </span>

            <span className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>
                {t.dashboard.pendingCount}:{" "}
                <strong className="font-semibold text-neutral-900 dark:text-neutral-200">
                  {pending}
                </strong>
              </span>
            </span>

            {highPriority > 0 && (
              <span className="inline-flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                <span>
                  {highPriority} {t.dashboard.highPriority}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
