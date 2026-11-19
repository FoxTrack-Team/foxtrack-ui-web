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
    <div className="mb-4 flex items-center gap-1 border-neutral-200/60 border-b pb-2 dark:border-neutral-800/60">
      {filters.map(({ key, label, count }) => {
        const isActive = currentFilter === key;
        return (
          <button
            key={key}
            type="button"
            className={cn(
              "flex select-none items-center gap-1.5 rounded-md px-2.5 py-1 font-medium text-xs transition-colors",
              isActive
                ? "bg-neutral-200/70 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-200",
            )}
            onClick={() => onFilterChange(key)}
          >
            <span>{label}</span>
            <span
              className={cn(
                "tabular-nums text-[11px]",
                isActive
                  ? "font-semibold text-orange-600 dark:text-orange-400"
                  : "text-neutral-400 dark:text-neutral-500",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
