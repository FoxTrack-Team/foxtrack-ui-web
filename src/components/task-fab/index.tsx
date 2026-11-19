"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import { IconFlag, IconPlus } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { DatePicker } from "@/components/date-picker";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { TaskPriority } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

export function TaskFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const priorities: { dotClass: string; label: string; value: TaskPriority }[] = [
    { dotClass: "bg-blue-400", label: t.tasks.priorityLow, value: "low" },
    { dotClass: "bg-amber-400", label: t.tasks.priorityMed, value: "medium" },
    { dotClass: "bg-rose-500", label: t.tasks.priorityHigh, value: "high" },
  ];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
    setTitle("");
    setPriority("medium");
    setDueDate(null);
  }

  async function handleSubmit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await taskRepository.create({
        dueDate,
        priority,
        title: trimmedTitle,
      });
      handleClose();
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-22 z-30 mx-auto max-w-xl px-5 sm:bottom-24 sm:px-6">
        <div className="flex justify-end">
          <button
            aria-label={t.tasks.addNewTask}
            type="button"
            className={cn(
              "pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full",
              "bg-orange-500 text-white shadow-[0_6px_20px_rgba(249,115,22,0.4)]",
              "transition-all duration-200 hover:scale-105 hover:bg-orange-600 active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950",
              isOpen && "pointer-events-none scale-75 opacity-0",
            )}
            onClick={() => setIsOpen(true)}
          >
            <IconPlus size={26} stroke={2.5} />
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} maxWidth="lg" title={t.tasks.newTask} onClose={handleClose}>
        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-neutral-900 text-sm placeholder:text-neutral-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-orange-500 dark:focus:bg-neutral-800"
            disabled={isSubmitting}
            placeholder={t.tasks.placeholder}
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

          <div className="flex items-center justify-end gap-2 border-neutral-100 border-t pt-3 dark:border-neutral-800/80">
            <Button disabled={isSubmitting} type="button" variant="ghost" onClick={handleClose}>
              {t.common.cancel}
            </Button>
            <Button
              className="gap-1.5"
              disabled={!title.trim() || isSubmitting}
              type="button"
              onClick={handleSubmit}
            >
              <IconPlus size={16} stroke={2.5} />
              <span>{t.tasks.addTask}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
