"use client";

import { type KeyboardEvent, useState } from "react";

import { IconCornerDownLeft, IconFlag, IconPlus } from "@tabler/icons-react";

import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { TaskPriority } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

const PRIORITIES: { value: TaskPriority; label: string; dotClass: string }[] = [
  { value: "low", label: "Low", dotClass: "bg-blue-400" },
  { value: "medium", label: "Med", dotClass: "bg-amber-400" },
  { value: "high", label: "High", dotClass: "bg-rose-500" },
];

export function TaskInput() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      setTitle("");
      setPriority("medium");
      setDueDate(null);
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-orange-500/10 dark:border-neutral-800 dark:bg-neutral-900/90 dark:focus-within:border-neutral-600">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 bg-transparent px-2 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
          disabled={isSubmitting}
          placeholder="New task... press Enter"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          aria-label="Add task"
          className="h-7 w-7 rounded-lg"
          disabled={!title.trim() || isSubmitting}
          size="icon"
          onClick={handleSubmit}
        >
          {title.trim() ? (
            <IconCornerDownLeft size={14} stroke={2} />
          ) : (
            <IconPlus size={16} stroke={2} />
          )}
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-2 text-xs dark:border-neutral-800/60">
        <div className="flex items-center gap-1">
          <span className="mr-0.5 text-neutral-400 dark:text-neutral-500">
            <IconFlag size={12} stroke={2} />
          </span>
          {PRIORITIES.map((p) => {
            const isSelected = priority === p.value;
            return (
              <button
                key={p.value}
                type="button"
                className={cn(
                  "flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium transition-colors",
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

        <div className="flex items-center gap-1.5">
          <DatePicker value={dueDate} onChange={setDueDate} />
        </div>
      </div>
    </div>
  );
}
