"use client";

import { type MouseEvent, type TouchEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  IconAlertCircle,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconFlag,
  IconNotes,
  IconTrash,
} from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { CategoryIcon } from "@/features/categories/components/category-icon";
import { getCategoryColor } from "@/features/categories/constants";
import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { Task, TaskPriority } from "@/features/tasks/types";

import { useDirection } from "@/hooks/use-direction";

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
  const { isRtl } = useDirection();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingUndo, setConfirmingUndo] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isSwipingRef = useRef(false);
  const ChevronIcon = isRtl ? IconChevronLeft : IconChevronRight;

  useEffect(() => {
    if (!confirmingDelete) return;
    const timer = setTimeout(() => setConfirmingDelete(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmingDelete]);

  useEffect(() => {
    if (!confirmingUndo) return;
    const timer = setTimeout(() => setConfirmingUndo(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmingUndo]);

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
    if (task.completed && !confirmingUndo) {
      setConfirmingUndo(true);
      return;
    }
    try {
      await taskRepository.toggleComplete(task.id);
    } catch (err) {
      console.error("Failed to toggle completion", err);
    } finally {
      setConfirmingUndo(false);
    }
  }

  async function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    try {
      await taskRepository.delete(task.id);
    } catch (err) {
      console.error("Failed to delete task", err);
    } finally {
      setConfirmingDelete(false);
    }
  }

  function handleNavigateEdit(e?: MouseEvent) {
    if (e) e.stopPropagation();
    if (swipeOffset !== 0) {
      setSwipeOffset(0);
      return;
    }
    router.push(`/tasks/edit?id=${task.id}`);
  }

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isSwipingRef.current = false;
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!touchStartRef.current) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;
    if (!isSwipingRef.current && Math.abs(dy) > Math.abs(dx)) {
      touchStartRef.current = null;
      return;
    }
    if (Math.abs(dx) > 8) isSwipingRef.current = true;
    // Trailing swipe: left in LTR (dx < 0), right in RTL (dx > 0)
    const directionalDx = isRtl ? -dx : dx;
    if (directionalDx < 0) {
      setSwipeOffset(Math.max(directionalDx, -80));
    } else if (swipeOffset < 0) {
      setSwipeOffset(Math.min(0, -72 + directionalDx));
    }
  }

  function handleTouchEnd() {
    touchStartRef.current = null;
    setSwipeOffset((prev) => (prev <= -44 ? -72 : 0));
  }

  async function handleSwipeDelete(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    try {
      await taskRepository.delete(task.id);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  }

  return (
    <div className="relative mb-1.5 overflow-hidden rounded-2xl">
      {/* Revealed Swipe-to-Delete Action (Mobile iOS style) */}
      {swipeOffset < 0 && (
        <div className="absolute inset-y-0 end-0 flex items-center pe-1 sm:hidden">
          <button
            aria-label={t.common.delete}
            className="flex h-full min-w-[64px] items-center justify-center rounded-xl bg-red-500 text-white active:bg-red-600"
            type="button"
            onClick={handleSwipeDelete}
          >
            <IconTrash size={18} stroke={2} />
          </button>
        </div>
      )}

      <div
        className={cn(
          "group relative flex cursor-pointer items-center justify-between gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-2xs transition-transform duration-150",
          task.completed
            ? "bg-neutral-100/60 active:bg-neutral-100 dark:bg-neutral-900/35 dark:active:bg-neutral-900/50"
            : "bg-white hover:bg-neutral-50/70 active:bg-neutral-50 dark:bg-neutral-900/80 dark:hover:bg-neutral-900 dark:active:bg-neutral-800/70",
        )}
        style={
          swipeOffset !== 0
            ? { transform: `translateX(${isRtl ? -swipeOffset : swipeOffset}px)` }
            : undefined
        }
        onClick={handleNavigateEdit}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              aria-label={task.completed ? t.tasks.markActive : t.tasks.markCompleted}
              checked={task.completed}
              className={cn(
                confirmingUndo &&
                  "ring-2 ring-red-500/20 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500",
              )}
              onBlur={() => setConfirmingUndo(false)}
              onCheckedChange={handleToggleComplete}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p
                className={cn(
                  "min-w-0 flex-1 break-words pt-0.5 font-medium text-[15px] leading-snug transition-all sm:text-sm",
                  task.completed
                    ? "text-neutral-400 line-through dark:text-neutral-500"
                    : "text-neutral-800 dark:text-neutral-100",
                )}
              >
                {task.title}
              </p>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
              <span
                aria-label={priorityLabel}
                title={priorityLabel}
                className={cn(
                  "inline-flex items-center",
                  PRIORITY_FLAG_COLORS[task.priority],
                  task.completed && "opacity-50",
                )}
              >
                <IconFlag size={13} stroke={2} />
              </span>

              {Boolean(task.description?.trim()) && (
                <span
                  aria-label={t.tasks.description}
                  title={t.tasks.description}
                  className={cn(
                    "inline-flex items-center text-neutral-400 dark:text-neutral-500",
                    task.completed && "opacity-50",
                  )}
                >
                  <IconNotes size={13} stroke={1.9} />
                </span>
              )}

              {task.dueDate && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-medium text-[11px]",
                    isOverdue
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-neutral-500 dark:text-neutral-400",
                  )}
                >
                  {isOverdue ? (
                    <IconAlertCircle className="text-rose-500" size={12} stroke={2} />
                  ) : (
                    <IconCalendar size={12} stroke={2} />
                  )}
                  <span>{formatFriendlyDate(task.dueDate, language)}</span>
                  {task.dueTime && <span className="tabular-nums">· {task.dueTime}</span>}
                  {isOverdue && <span className="font-semibold">({t.tasks.overdue})</span>}
                </span>
              )}

              {category && colorDetails && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-[11px]",
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

        <div className="-me-1 flex shrink-0 items-center">
          <ChevronIcon
            stroke={2}
            className={cn(
              "h-4 w-4 text-neutral-400/70 dark:text-neutral-500/70",
              "sm:group-hover:hidden",
              confirmingDelete && "sm:hidden",
            )}
          />
          <Button
            aria-label={t.tasks.deleteTask}
            aria-pressed={confirmingDelete}
            size="icon"
            title={confirmingDelete ? t.tasks.deleteConfirm : t.tasks.deleteTask}
            type="button"
            variant="ghost"
            className={cn(
              "relative hidden h-9 w-9 rounded-lg transition-all after:absolute after:-inset-1 after:content-[''] sm:flex",
              confirmingDelete
                ? "bg-red-500 text-white opacity-100 hover:bg-red-600 hover:text-white dark:bg-red-600 dark:text-white dark:hover:bg-red-500"
                : "text-neutral-500 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:text-neutral-400 dark:hover:bg-red-950/40 dark:hover:text-red-400",
            )}
            onBlur={() => setConfirmingDelete(false)}
            onClick={handleDelete}
          >
            <IconTrash size={15} stroke={1.75} />
          </Button>
        </div>
      </div>
    </div>
  );
}
