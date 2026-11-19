"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import { IconDeviceFloppy, IconFlag, IconTrash } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { DatePicker } from "@/components/date-picker";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { Task, TaskPriority } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export function TaskEditModal({ isOpen, onClose, task }: TaskEditModalProps) {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevTask, setPrevTask] = useState(task);

  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState<number | null>(task.dueDate);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const priorities: { dotClass: string; label: string; value: TaskPriority }[] = [
    { dotClass: "bg-blue-400", label: t.tasks.priorityLow, value: "low" },
    { dotClass: "bg-amber-400", label: t.tasks.priorityMed, value: "medium" },
    { dotClass: "bg-rose-500", label: t.tasks.priorityHigh, value: "high" },
  ];

  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setTitle(task.title);
    setPriority(task.priority);
    setDueDate(task.dueDate);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  if (task.id !== prevTask.id || task.updatedAt !== prevTask.updatedAt) {
    setPrevTask(task);
    setTitle(task.title);
    setPriority(task.priority);
    setDueDate(task.dueDate);
  }

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  async function handleSave() {
    const trimmed = title.trim();
    if (!trimmed || isSaving) return;

    try {
      setIsSaving(true);
      await taskRepository.update(task.id, {
        dueDate,
        priority,
        title: trimmed,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update task", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (isSaving) return;
    try {
      setIsSaving(true);
      await taskRepository.delete(task.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete task", err);
    } finally {
      setIsSaving(false);
    }
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  }

  return (
    <Modal isOpen={isOpen} maxWidth="lg" title={t.tasks.editTaskTitle} onClose={onClose}>
      <div className="space-y-4">
        <input
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-neutral-900 text-sm placeholder:text-neutral-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-orange-500 dark:focus:bg-neutral-800"
          disabled={isSaving}
          placeholder={t.tasks.placeholderEdit}
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="mr-0.5 text-neutral-400 dark:text-neutral-500">
              <IconFlag size={14} stroke={2} />
            </span>
            {priorities.map((p) => {
              const isSelected = priority === p.value;
              return (
                <button
                  aria-label={p.value}
                  key={p.value}
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium text-xs transition-colors",
                    isSelected
                      ? "bg-neutral-100 text-neutral-900 ring-1 ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-700"
                      : "text-neutral-500 hover:bg-neutral-100/50 dark:text-neutral-400 dark:hover:bg-neutral-800/40",
                  )}
                  onClick={() => setPriority(p.value)}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", p.dotClass)} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center">
            <DatePicker value={dueDate} onChange={setDueDate} />
          </div>
        </div>

        <div className="flex items-center justify-between border-neutral-100 border-t pt-3 dark:border-neutral-800/80">
          <Button
            aria-label={t.tasks.deleteTask}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
            disabled={isSaving}
            size="sm"
            type="button"
            variant="ghost"
            onClick={handleDelete}
          >
            <IconTrash className="mr-1.5" size={15} stroke={1.75} />
            <span>{t.common.delete}</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button disabled={isSaving} size="sm" type="button" variant="ghost" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button
              className="gap-1.5"
              disabled={!title.trim() || isSaving}
              size="sm"
              type="button"
              onClick={handleSave}
            >
              <IconDeviceFloppy size={15} stroke={2} />
              <span>{t.tasks.saveTask}</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
