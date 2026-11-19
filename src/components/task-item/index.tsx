"use client";

import { type MouseEvent, useState } from "react";

import { IconAlertCircle, IconCalendar, IconEdit, IconTrash } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { TaskEditModal } from "@/components/task-edit-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { Task, TaskPriority } from "@/features/tasks/types";

import { formatFriendlyDate, isTaskOverdue } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
}

const PRIORITY_DOTS: Record<TaskPriority, string> = {
  high: "bg-rose-500",
  low: "bg-neutral-300 dark:bg-neutral-600",
  medium: "bg-amber-400",
};

export function TaskItem({ task }: TaskItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { language, t } = useTranslation();

  const isOverdue = isTaskOverdue(task.dueDate, task.completed);
  const dotClass = PRIORITY_DOTS[task.priority];
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

  function handleEditClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsEditOpen(true);
  }

  return (
    <>
      <div
        className={cn(
          "group mb-1.5 flex cursor-pointer items-center justify-between gap-2.5 rounded-lg border px-3 py-2 transition-colors",
          task.completed
            ? "border-transparent bg-neutral-100/50 dark:bg-neutral-900/30"
            : "border-neutral-200/70 bg-white hover:border-neutral-300 dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:border-neutral-700",
        )}
        onClick={() => setIsEditOpen(true)}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div onClick={(e) => e.stopPropagation()}>
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

            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />
                <span>{priorityLabel}</span>
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
            onClick={handleEditClick}
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

      <TaskEditModal isOpen={isEditOpen} task={task} onClose={() => setIsEditOpen(false)} />
    </>
  );
}
