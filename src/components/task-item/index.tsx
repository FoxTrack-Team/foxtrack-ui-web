"use client";

import { type MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { IconAlertCircle, IconCalendar, IconEdit, IconFlag, IconTrash } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { CategoryIcon } from "@/features/categories/components/category-icon";
import { getCategoryColor } from "@/features/categories/constants";
import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { Task, TaskPriority } from "@/features/tasks/types";

import { formatFriendlyDate, isTaskOverdue } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

import { db } from "@/db/database";

interface TaskItemProps {
  task: Task;
}

const PRIORITY_FLAG_COLORS: Record<TaskPriority, string> = {
  high: "text-rose-500 dark:text-rose-400",
  low: "text-blue-500 dark:text-blue-400",
  medium: "text-amber-500 dark:text-amber-400",
};

export function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();
  const { language, t } = useTranslation();

  const category = useLiveQuery(
    () => (task.categoryId ? db.categories.get(task.categoryId) : undefined),
    [task.categoryId],
  );
  const colorDetails = category ? getCategoryColor(category.color) : null;

  const isOverdue = isTaskOverdue(task.dueDate, task.completed);
  const priorityLabel =
    task.priority === "high"
      ? t.tasks.priorityHigh
      : task.priority === "medium"
        ? t.tasks.priorityMed
        : t.tasks.priorityLow;

  async function handleToggleComplete() {
    try {
      await taskRepository.toggleComplete(task.id);
    } catch (err) {
      console.error("Failed to toggle completion", err);
    }
  }

  async function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    try {
      await taskRepository.delete(task.id);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  }

  function handleNavigateEdit(e?: MouseEvent) {
    if (e) e.stopPropagation();
    router.push(`/tasks/edit?id=${task.id}`);
  }

  return (
    <div
      className={cn(
        "group mb-1.5 flex cursor-pointer items-center justify-between gap-2.5 rounded-lg border px-3 py-2 transition-colors",
        task.completed
          ? "border-transparent bg-neutral-100/50 dark:bg-neutral-900/30"
          : "border-neutral-200/70 bg-white hover:border-neutral-300 dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:border-neutral-700",
      )}
      onClick={handleNavigateEdit}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2.5">
        <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            aria-label={task.completed ? t.tasks.markActive : t.tasks.markCompleted}
            checked={task.completed}
            onCheckedChange={handleToggleComplete}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "break-words text-sm leading-snug transition-all",
              task.completed
                ? "text-neutral-400 line-through dark:text-neutral-500"
                : "text-neutral-800 dark:text-neutral-200",
            )}
          >
            {task.title}
          </p>

          {task.description && (
            <p
              className={cn(
                "mt-0.5 line-clamp-1 text-xs leading-normal",
                task.completed
                  ? "text-neutral-400/80 line-through dark:text-neutral-500/80"
                  : "text-neutral-500 dark:text-neutral-400",
              )}
            >
              {task.description}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
            <span
              aria-label={priorityLabel}
              title={priorityLabel}
              className={cn(
                "inline-flex items-center",
                PRIORITY_FLAG_COLORS[task.priority],
                task.completed && "opacity-50",
              )}
            >
              <IconFlag size={12} stroke={2} />
            </span>

            {task.dueDate && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-medium",
                  isOverdue
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-neutral-400 dark:text-neutral-500",
                )}
              >
                {isOverdue ? (
                  <IconAlertCircle className="text-rose-500" size={12} stroke={2} />
                ) : (
                  <IconCalendar size={12} stroke={2} />
                )}
                <span>{formatFriendlyDate(task.dueDate, language)}</span>
                {isOverdue && <span className="font-semibold">({t.tasks.overdue})</span>}
              </span>
            )}

            {category && colorDetails && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-[10px] border shadow-2xs",
                  colorDetails.badgeClass,
                )}
              >
                <CategoryIcon iconId={category.icon} size={11} stroke={2.2} />
                <span>{category.name}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 opacity-90 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        <Button
          aria-label={t.tasks.editTask}
          className="h-7 w-7 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          size="icon"
          type="button"
          variant="ghost"
          onClick={handleNavigateEdit}
        >
          <IconEdit size={14} stroke={1.75} />
        </Button>
        <Button
          aria-label={t.tasks.deleteTask}
          className="h-7 w-7 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          size="icon"
          type="button"
          variant="ghost"
          onClick={handleDelete}
        >
          <IconTrash size={14} stroke={1.75} />
        </Button>
      </div>
    </div>
  );
}
