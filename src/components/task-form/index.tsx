"use client";

import { type FormEvent, useState } from "react";

import { IconCheck, IconTrash } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { CategoryPicker } from "@/components/category-picker";
import { DatePicker } from "@/components/date-picker";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { TaskPriority } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

export interface TaskFormValues {
  categoryId?: string | null;
  completed?: boolean;
  description?: string;
  dueDate: number | null;
  priority: TaskPriority;
  title: string;
}

interface TaskFormProps {
  initialValues?: Partial<TaskFormValues>;
  isEdit?: boolean;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  subtitle?: string;
  title: string;
}

export function TaskForm({
  initialValues,
  isEdit = false,
  onCancel,
  onDelete,
  onSubmit,
  subtitle,
  title,
}: TaskFormProps) {
  const { t } = useTranslation();
  const [taskTitle, setTaskTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(initialValues?.categoryId ?? null);
  const [completed, setCompleted] = useState(initialValues?.completed ?? false);
  const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority ?? "medium");
  const [dueDate, setDueDate] = useState<number | null>(initialValues?.dueDate ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const priorities: { dotClass: string; label: string; value: TaskPriority }[] = [
    { dotClass: "bg-blue-400", label: t.tasks.priorityLow, value: "low" },
    { dotClass: "bg-amber-400", label: t.tasks.priorityMed, value: "medium" },
    { dotClass: "bg-rose-500", label: t.tasks.priorityHigh, value: "high" },
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = taskTitle.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        categoryId,
        ...(isEdit ? { completed } : {}),
        description: description.trim() || undefined,
        dueDate,
        priority,
        title: trimmed,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!onDelete) return;
    try {
      setIsSubmitting(true);
      await onDelete();
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">{subtitle}</p>
        )}
      </div>

      {/* Completion Toggle (Edit Mode) */}
      {isEdit && (
        <button
          aria-checked={completed}
          role="checkbox"
          type="button"
          className={cn(
            "flex min-h-11 w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-colors sm:text-xs",
            completed
              ? "border-orange-200/80 bg-orange-50/70 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-300"
              : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100/80 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700/60",
          )}
          onClick={() => setCompleted((prev) => !prev)}
        >
          <span className="flex items-center gap-2.5 font-medium">
            <span
              className={cn(
                "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-colors sm:h-4 sm:w-4",
                completed
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900",
              )}
            >
              {completed && <IconCheck size={11} stroke={3} />}
            </span>
            <span>{completed ? t.tasks.completed : t.tasks.markCompleted}</span>
          </span>
        </button>
      )}

      {/* Task Title Input */}
      <div>
        <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
          {t.tasks.taskTitle}
        </label>
        <input
          autoFocus={!isEdit}
          className="min-h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 sm:min-h-10 sm:text-sm dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-primary dark:focus:bg-neutral-900"
          placeholder={t.tasks.placeholder}
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
          {t.tasks.description}
        </label>
        <textarea
          className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-primary dark:focus:bg-neutral-900"
          placeholder={t.tasks.placeholderDesc}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Category Picker (Replaces Tags) */}
      <CategoryPicker value={categoryId} onChange={setCategoryId} />

      {/* Priority & Due Date Row */}
      <div className="space-y-3.5 pt-0.5">
        <div>
          <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {t.tasks.priorityLabel}
          </label>
          <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800/70">
            {priorities.map((p) => {
              const isSelected = priority === p.value;
              return (
                <button
                  aria-label={p.value}
                  aria-pressed={isSelected}
                  key={p.value}
                  type="button"
                  className={cn(
                    "flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-xs transition-all active:scale-[0.98]",
                    isSelected
                      ? "bg-white text-neutral-900 shadow-xs ring-1 ring-black/5 dark:bg-neutral-700/90 dark:text-white dark:ring-white/15"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
                  )}
                  onClick={() => setPriority(p.value)}
                >
                  <span className={cn("h-2 w-2 rounded-full", p.dotClass)} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {t.datePicker.title}
          </label>
          <DatePicker
            className="h-11 w-full justify-start px-3 text-sm sm:h-10 sm:text-xs"
            value={dueDate}
            onChange={setDueDate}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-2 sm:order-1">
          {isEdit && onDelete && (
            <Button
              className="h-10 w-full gap-1.5 rounded-xl text-rose-600 text-xs hover:bg-rose-50 hover:text-rose-700 sm:h-9 sm:w-auto dark:text-rose-400 dark:hover:bg-rose-950/40"
              disabled={isSubmitting}
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <IconTrash size={15} stroke={2} />
              <span>{t.tasks.deleteTask}</span>
            </Button>
          )}
        </div>

        <div className="order-1 flex flex-row-reverse items-center gap-2.5 sm:order-2">
          <Button
            className="h-11 flex-[1.35] rounded-xl text-sm sm:h-9 sm:flex-none sm:min-w-[110px] sm:text-xs"
            disabled={!taskTitle.trim() || isSubmitting}
            type="submit"
          >
            {isEdit ? t.tasks.saveTask : t.tasks.addTask}
          </Button>
          <Button
            className="h-11 flex-1 rounded-xl text-sm sm:h-9 sm:flex-none sm:text-xs"
            disabled={isSubmitting}
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t.common.cancel}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isEdit && (
        <Modal
          description={t.tasks.deleteConfirm}
          isOpen={isDeleteModalOpen}
          maxWidth="sm"
          title={t.tasks.deleteTask}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              className="h-10 w-full rounded-full text-xs sm:h-9 sm:w-auto"
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              className="h-10 w-full rounded-full text-xs sm:h-9 sm:w-auto"
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              {t.tasks.deleteTask}
            </Button>
          </div>
        </Modal>
      )}
    </form>
  );
}
