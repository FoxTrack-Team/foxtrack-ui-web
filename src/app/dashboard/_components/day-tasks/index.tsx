"use client";

import Link from "next/link";

import { IconAlertCircle, IconChecklist, IconPlus } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { TaskItem } from "@/components/task-item";
import { Button } from "@/components/ui/button";

import { Task, TaskPriority } from "@/features/tasks/types";

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
        <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-200/80 bg-rose-50/70 px-3.5 py-2.5 text-rose-800 text-xs dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <IconAlertCircle
              className="shrink-0 text-rose-600 dark:text-rose-400"
              size={15}
              stroke={2}
            />
            <span>
              {overdueCount} {t.dashboard.overdueWarning}
            </span>
          </div>
          <Link className="font-medium underline underline-offset-2 hover:opacity-80" href="/tasks">
            {t.bottomNav.tasks}
          </Link>
        </div>
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
            className="mt-4 gap-1.5"
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
