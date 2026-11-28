"use client";

import Link from "next/link";

import {
  IconAlertCircle,
  IconChecklist,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { TaskItem } from "@/components/task-item";

import { Task, TaskPriority } from "@/features/tasks/types";

import { useDirection } from "@/hooks/use-direction";

interface DayTasksProps {
  isTodaySelected: boolean;
  overdueCount: number;
  tasks: Task[];
}

const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  high: 3,
  low: 1,
  medium: 2,
};

export function DayTasks({ tasks, overdueCount, isTodaySelected }: DayTasksProps) {
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

  const completedCount = tasks.filter((item) => item.completed).length;

  return (
    <section className="space-y-2.5">
      {/* Overdue alert if today is selected */}
      {isTodaySelected && overdueCount > 0 && (
        <Link
          className="group flex min-h-11 items-center justify-between gap-2.5 rounded-2xl bg-rose-500/[0.08] px-3.5 py-2.5 text-rose-800 text-xs transition-colors hover:bg-rose-500/[0.12] active:bg-rose-500/[0.16] dark:bg-rose-500/[0.12] dark:text-rose-300 dark:hover:bg-rose-500/[0.18]"
          href="/tasks"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/12 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <IconAlertCircle size={15} stroke={1.8} />
            </div>
            <span className="truncate font-medium">
              <span className="font-semibold">{overdueCount}</span>{" "}
              {overdueCount === 1 ? t.dashboard.overdueWarningSingular : t.dashboard.overdueWarning}
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-0.5 font-medium text-[11px] text-rose-700 dark:text-rose-300">
            <span>{t.bottomNav.tasks}</span>
            <ChevronIcon size={14} stroke={2} />
          </span>
        </Link>
      )}

      {/* Symmetric Section Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <IconChecklist className="text-orange-500" size={16} stroke={2} />
          <h2 className="font-semibold text-neutral-800 text-xs tracking-tight sm:text-sm dark:text-neutral-200">
            {t.bottomNav.tasks}
          </h2>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-[11px] text-neutral-500 tabular-nums dark:bg-neutral-800 dark:text-neutral-400">
            {completedCount}/{tasks.length}
          </span>
        </div>

        <Link
          className="font-medium text-orange-600 text-xs hover:underline dark:text-orange-400"
          href="/tasks"
        >
          {t.tasks.all}
        </Link>
      </div>

      {/* Task List or Compact Equal Empty State */}
      {sortedTasks.length === 0 ? (
        <div className="flex items-center gap-2.5 rounded-2xl bg-white/75 px-3.5 py-3 shadow-2xs dark:bg-neutral-900/55">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
            <IconChecklist size={16} stroke={1.75} />
          </div>
          <p className="truncate text-neutral-500 text-xs dark:text-neutral-400">
            {t.dashboard.noTasksForDay}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  );
}
