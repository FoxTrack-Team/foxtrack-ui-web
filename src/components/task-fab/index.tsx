"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import { IconFlag, IconPlus } from "@tabler/icons-react";

import { DatePicker } from "@/components/date-picker";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { TaskPriority } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

const PRIORITIES: { value: TaskPriority; label: string; dotClass: string }[] = [
  { value: "low", label: "Low", dotClass: "bg-blue-400" },
  { value: "medium", label: "Med", dotClass: "bg-amber-400" },
  { value: "high", label: "High", dotClass: "bg-rose-500" },
];

export function TaskFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        title: trimmedTitle,
        priority,
        dueDate,
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
      <button
        aria-label="Add new task"
        type="button"
        className={cn(
          "fixed bottom-22 end-5 z-30 flex h-14 w-14 items-center justify-center rounded-full sm:bottom-24 sm:end-8",
          "bg-orange-500 text-white shadow-[0_6px_20px_rgba(249,115,22,0.4)]",
          "transition-all duration-200 hover:scale-105 hover:bg-orange-600 active:scale-95",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950",
          isOpen && "pointer-events-none opacity-0 scale-75",
        )}
        onClick={() => setIsOpen(true)}
      >
        <IconPlus size={26} stroke={2.5} />
      </button>

      <Modal isOpen={isOpen} maxWidth="lg" title="New Task" onClose={handleClose}>
        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-orange-500 dark:focus:bg-neutral-800"
            disabled={isSubmitting}
            placeholder="What needs to be done?"
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
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
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

          <div className="flex items-center justify-end gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800/80">
            <Button disabled={isSubmitting} type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="gap-1.5"
              disabled={!title.trim() || isSubmitting}
              type="button"
              onClick={handleSubmit}
            >
              <IconPlus size={16} stroke={2.5} />
              <span>Add Task</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
