"use client";

import { useTranslation } from "@/providers/settings-provider";

import { CategoryIcon } from "@/features/categories/components/category-icon";
import { getCategoryColor } from "@/features/categories/constants";
import { Category } from "@/features/categories/types";
import { Habit } from "@/features/habits/types";
import { formatDuration, summarizeHabitDurations } from "@/features/habits/utils/time-utils";

import { cn } from "@/lib/utils";

interface HabitSummaryCardProps {
  categories: Category[];
  completedHabitIds: Set<string>;
  habits: Habit[];
}

export function HabitSummaryCard({ categories, completedHabitIds, habits }: HabitSummaryCardProps) {
  const { language, t } = useTranslation();

  const total = habits.length;
  const completed = habits.filter((h) => completedHabitIds.has(h.id)).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const summary = summarizeHabitDurations(habits, completedHabitIds);

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/60">
      <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
        <span className="font-semibold text-neutral-900 sm:text-sm dark:text-neutral-100">
          {completed} / {total} {t.habits.title}
        </span>
        {summary.totalMinutes > 0 && (
          <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-medium text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {t.habits.scheduledHours}: {formatDuration(summary.totalMinutes, language)}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={percentage}
          role="progressbar"
          style={{ width: `${percentage}%` }}
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            total > 0 && completed === total ? "bg-emerald-500" : "bg-orange-500",
          )}
        />
      </div>

      {/* Category Duration Breakdown */}
      {summary.byCategory.length > 0 && (
        <div className="no-scrollbar mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {summary.byCategory.map(({ categoryId, minutes }) => {
            const category = categoryId ? categoryMap.get(categoryId) : undefined;
            if (!category) return null;
            const colorDetails = getCategoryColor(category.color);

            return (
              <span
                key={category.id}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 font-medium text-[11px] tabular-nums",
                  colorDetails.badgeClass,
                )}
              >
                <CategoryIcon iconId={category.icon} size={11} stroke={2.2} />
                <span>{category.name}:</span>
                <span className="font-semibold">{formatDuration(minutes, language)}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
