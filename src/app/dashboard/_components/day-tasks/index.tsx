"use client";

import Link from "next/link";

import {
  IconAlertCircle,
  IconChecklist,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { TaskItem } from "@/components/task-item";
import { Button } from "@/components/ui/button";

import { Task, TaskPriority } from "@/features/tasks/types";

import { useDirection } from "@/hooks/use-direction";

interface DayTasksProps {
  isTodaySelected: boolean;
  onAddTask: () => void;
  overdueCount: number;
  tasks: Task[];
}

const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  high: 3,
  low: 1,
  medium: 2,
};

export function DayTasks({ tasks, overdueCount, isTodaySelected, onAddTask }: DayTasksProps) {
  const { t } = useTranslation();
  const { isRtl } = useDirection();
  const ChevronIcon = isRtl ? IconChevronLeft : IconChevronRight;

  // Sort: active tasks first (by priority high -> medium -> low), then completed tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const weightA = PRIORITY_WEIGHTS[a.priority];
    const weightB = PRIORITY_WEIGHTS[b.priority];
    if (weightA !== weightB) {
      return weightB - weightA;
    }
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="space-y-3">
      {/* Overdue alert if today is selected */}
      {isTodaySelected && overdueCount > 0 && (
        <Link
          className="group flex items-center justify-between gap-2.5 rounded-xl border border-rose-200/80 bg-rose-50/70 px-3 py-2 text-rose-800 text-xs transition-colors hover:bg-rose-50 active:bg-rose-100/70 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50"
          href="/tasks"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/15 dark:bg-rose-500/20 dark:text-rose-400">
              <IconAlertCircle size={15} stroke={1.8} />
            </div>
            <span className="truncate font-medium">
              <span className="font-semibold">{overdueCount}</span> {t.dashboard.overdueWarning}
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-0.5 font-medium text-[11px] text-rose-700 dark:text-rose-300">
            <span>{t.bottomNav.tasks}</span>
            <ChevronIcon size={14} stroke={2} />
          </span>
        </Link>
      )}

      {/* Task List or Empty State */}
      {sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 border-dashed bg-white/50 px-4 py-10 text-center dark:border-neutral-800/80 dark:bg-neutral-900/30">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
            <IconChecklist size={22} stroke={1.75} />
          </div>
          <p className="mt-3 font-medium text-neutral-700 text-sm dark:text-neutral-300">
            {t.dashboard.noTasksForDay}
          </p>
          <p className="mt-1 max-w-xs text-neutral-400 text-xs dark:text-neutral-500">
            {t.dashboard.noTasksForDayDesc}
          </p>
          <Button
            className="mt-4 min-h-10 gap-1.5 rounded-xl px-4"
            size="sm"
            type="button"
            variant="outline"
            onClick={onAddTask}
          >
            <IconPlus size={14} stroke={2.5} />
            <span>{t.dashboard.addTaskForDay}</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-1">
          {sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
