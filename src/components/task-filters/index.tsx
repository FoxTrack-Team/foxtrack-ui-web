import { TaskCounts } from "@/features/tasks/hooks/use-tasks";
import { TaskFilter } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

interface TaskFiltersProps {
  counts: TaskCounts;
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export function TaskFilters({ currentFilter, onFilterChange, counts }: TaskFiltersProps) {
  const filters: { key: TaskFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "active", label: "Active", count: counts.active },
    { key: "completed", label: "Done", count: counts.completed },
  ];

  return (
    <div className="mb-4 flex items-center gap-1 border-b border-neutral-200/60 pb-2 dark:border-neutral-800/60">
      {filters.map(({ key, label, count }) => {
        const isActive = currentFilter === key;
        return (
          <button
            key={key}
            className={cn(
              "flex select-none items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              isActive
                ? "bg-neutral-200/70 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50",
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
