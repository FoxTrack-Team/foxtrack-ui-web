"use client";

import { useState } from "react";

import {
  IconAlertCircle,
  IconCalendar,
  IconDeviceFloppy,
  IconEdit,
  IconFlag,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { Task, TaskPriority } from "@/features/tasks/types";

import { formatFriendlyDate, isTaskOverdue } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
}

const PRIORITIES: { dotClass: string; label: string; value: TaskPriority }[] = [
  { dotClass: "bg-blue-400", label: "Low", value: "low" },
  { dotClass: "bg-amber-400", label: "Med", value: "medium" },
  { dotClass: "bg-rose-500", label: "High", value: "high" },
];

const PRIORITY_INDICATORS: Record<TaskPriority, { dot: string; label: string }> = {
  high: { dot: "bg-rose-500", label: "High" },
  medium: { dot: "bg-amber-400", label: "Med" },
  low: { dot: "bg-neutral-300 dark:bg-neutral-600", label: "Low" },
};

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [editDueDate, setEditDueDate] = useState<number | null>(task.dueDate);
  const [isSaving, setIsSaving] = useState(false);

  const isOverdue = isTaskOverdue(task.dueDate, task.completed);
  const priorityInfo = PRIORITY_INDICATORS[task.priority];

  async function handleToggleComplete() {
    try {
      await taskRepository.toggleComplete(task.id);
    } catch (err) {
      console.error("Failed to toggle completion", err);
    }
  }

  async function handleDelete() {
    try {
      await taskRepository.delete(task.id);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  }

  async function handleSaveEdit() {
    const trimmed = editTitle.trim();
    if (!trimmed || isSaving) return;

    try {
      setIsSaving(true);
      await taskRepository.update(task.id, {
        title: trimmed,
        priority: editPriority,
        dueDate: editDueDate,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update task", err);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="mb-2.5 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-orange-500/10 dark:border-neutral-800 dark:bg-neutral-900/90 dark:focus-within:border-neutral-600">
        <div className="flex items-center gap-2">
          <input
            autoFocus
            className="flex-1 bg-transparent px-2 py-1 text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
            disabled={isSaving}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveEdit();
              } else if (e.key === "Escape") {
                e.preventDefault();
                handleCancelEdit();
              }
            }}
          />
          <div className="flex items-center gap-1">
            <Button
              aria-label="Cancel editing"
              className="h-7 w-7 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              size="icon"
              type="button"
              variant="ghost"
              onClick={handleCancelEdit}
            >
              <IconX size={15} stroke={2} />
            </Button>
            <Button
              aria-label="Save"
              className="h-7 gap-1 rounded-lg px-2.5 text-xs"
              disabled={!editTitle.trim() || isSaving}
              size="sm"
              type="button"
              onClick={handleSaveEdit}
            >
              <IconDeviceFloppy size={14} stroke={2} />
              <span>Save</span>
            </Button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-2 text-xs dark:border-neutral-800/60">
          <div className="flex items-center gap-1">
            <span className="mr-0.5 text-neutral-400 dark:text-neutral-500">
              <IconFlag size={12} stroke={2} />
            </span>
            {PRIORITIES.map((p) => {
              const isSelected = editPriority === p.value;
              return (
                <button
                  aria-label={p.value}
                  key={p.value}
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded px-2 py-0.5 font-medium text-[11px] transition-colors",
                    isSelected
                      ? "bg-neutral-100 text-neutral-900 ring-1 ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-700"
                      : "text-neutral-500 hover:bg-neutral-100/50 dark:text-neutral-400 dark:hover:bg-neutral-800/40",
                  )}
                  onClick={() => setEditPriority(p.value)}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", p.dotClass)} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <DatePicker value={editDueDate} onChange={setEditDueDate} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group mb-1.5 flex items-center justify-between gap-2.5 rounded-lg border px-3 py-2 transition-colors",
        task.completed
          ? "border-transparent bg-neutral-100/50 dark:bg-neutral-900/30"
          : "border-neutral-200/70 bg-white hover:border-neutral-300 dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:border-neutral-700",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {/* shadcn accessible Checkbox */}
        <Checkbox
          aria-label={task.completed ? "Mark as active" : "Mark as completed"}
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
        />

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
              <span className={cn("h-1.5 w-1.5 rounded-full", priorityInfo.dot)} />
              <span>{priorityInfo.label}</span>
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
                <span>{formatFriendlyDate(task.dueDate)}</span>
                {isOverdue && <span className="font-semibold">(Overdue)</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 opacity-90 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        <Button
          aria-label="Edit task"
          className="h-7 w-7 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
        >
          <IconEdit size={14} stroke={1.75} />
        </Button>
        <Button
          aria-label="Delete task"
          className="h-7 w-7 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          size="icon"
          variant="ghost"
          onClick={handleDelete}
        >
          <IconTrash size={14} stroke={1.75} />
        </Button>
      </div>
    </div>
  );
}
