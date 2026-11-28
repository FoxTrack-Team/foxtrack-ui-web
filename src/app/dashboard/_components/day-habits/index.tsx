"use client";

import Link from "next/link";

import { IconRepeat } from "@tabler/icons-react";

import { HabitItem } from "@/app/habits/_components/habit-item";

import { useTranslation } from "@/providers/settings-provider";

import { Category } from "@/features/categories/types";
import { Habit } from "@/features/habits/types";
import { formatDuration, summarizeHabitDurations } from "@/features/habits/utils/time-utils";

interface DayHabitsProps {
  categories: Category[];
  dateKey: string;
  habits: Habit[];
  isTodaySelected: boolean;
  logsByHabit: Map<string, Set<string>>;
}

export function DayHabits({
  categories,
  dateKey,
  habits,
  isTodaySelected,
  logsByHabit,
}: DayHabitsProps) {
  const { language, t } = useTranslation();

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const completedIds = new Set(
    habits.filter((h) => logsByHabit.get(h.id)?.has(dateKey)).map((h) => h.id),
  );
  const completedCount = completedIds.size;
  const durationSummary = summarizeHabitDurations(habits, completedIds);

  return (
    <section className="space-y-2.5">
      {/* Symmetric Section Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <IconRepeat className="text-emerald-500" size={16} stroke={2} />
          <h2 className="font-semibold text-neutral-800 text-xs tracking-tight sm:text-sm dark:text-neutral-200">
            {t.habits.title}
          </h2>
          <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-medium text-[11px] text-neutral-500 tabular-nums dark:bg-neutral-800 dark:text-neutral-400">
            {completedCount}/{habits.length}
          </span>
          {durationSummary.totalMinutes > 0 && (
            <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-medium text-[11px] text-neutral-500 tabular-nums dark:bg-neutral-800 dark:text-neutral-400">
              {formatDuration(durationSummary.totalMinutes, language)}
            </span>
          )}
        </div>

        <Link
          className="font-medium text-orange-600 text-xs hover:underline dark:text-orange-400"
          href="/habits"
        >
          {t.habits.all}
        </Link>
      </div>

      {/* Habits List or Compact Equal Empty State */}
      {habits.length === 0 ? (
        <div className="flex items-center gap-2.5 rounded-2xl bg-white/75 px-3.5 py-3 shadow-2xs dark:bg-neutral-900/55">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
            <IconRepeat size={16} stroke={1.75} />
          </div>
          <p className="truncate text-neutral-500 text-xs dark:text-neutral-400">
            {t.habits.emptyTodayTitle}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {habits.map((habit) => (
            <HabitItem
              category={habit.categoryId ? categoryMap.get(habit.categoryId) : undefined}
              completedDateKeys={logsByHabit.get(habit.id) ?? new Set()}
              dateKey={dateKey}
              habit={habit}
              isTodayView={isTodaySelected}
              key={habit.id}
              mode="daily"
            />
          ))}
        </div>
      )}
    </section>
  );
}
