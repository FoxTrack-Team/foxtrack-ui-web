"use client";

import { useTranslation } from "@/providers/settings-provider";

import { TaskCounts } from "@/features/tasks/hooks/use-tasks";
import { TaskFilter } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

interface TaskFiltersProps {
  counts: TaskCounts;
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export function TaskFilters({ currentFilter, onFilterChange, counts }: TaskFiltersProps) {
  const { t } = useTranslation();

  const filters: { count: number; key: TaskFilter; label: string }[] = [
    { count: counts.all, key: "all", label: t.tasks.all },
    { count: counts.active, key: "active", label: t.tasks.active },
    { count: counts.completed, key: "completed", label: t.tasks.completed },
  ];

  return (
    <div className="mb-4 flex items-center">
      <div className="grid w-full grid-cols-3 gap-1 rounded-xl bg-neutral-200/70 p-1 sm:inline-flex sm:w-auto dark:bg-neutral-900/90">
        {filters.map(({ key, label, count }) => {
          const isActive = currentFilter === key;
          return (
            <button
              key={key}
              type="button"
              className={cn(
                "flex min-h-10 select-none items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-xs transition-all active:scale-[0.98] sm:min-h-9",
                isActive
                  ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
              )}
              onClick={() => onFilterChange(key)}
            >
              <span>{label}</span>
              <span
                className={cn(
                  "tabular-nums text-[11px]",
                  isActive
                    ? "font-semibold text-orange-600 dark:text-orange-400"
                    : "text-neutral-500 dark:text-neutral-400",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
