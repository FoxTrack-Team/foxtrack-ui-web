"use client";

import { type FormEvent, useState } from "react";

import { IconFlag, IconTrash } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { CategoryPicker } from "@/components/category-picker";
import { DatePicker } from "@/components/date-picker";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { TaskPriority } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

export interface TaskFormValues {
  categoryId?: string | null;
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
          <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">{subtitle}</p>
        )}
      </div>

      {/* Task Title Input */}
      <div>
        <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
          {t.tasks.title}
        </label>
        <input
          autoFocus
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-neutral-900 text-xs focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-primary"
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
          className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 text-xs placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-primary"
          placeholder={t.tasks.placeholderDesc}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Category Picker (Replaces Tags) */}
      <CategoryPicker value={categoryId} onChange={setCategoryId} />

      {/* Priority & Due Date Row */}
      <div className="space-y-3 pt-1">
        <div>
          <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {t.tasks.priorityLabel}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 dark:text-neutral-500">
              <IconFlag size={14} stroke={2} />
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {priorities.map((p) => {
                const isSelected = priority === p.value;
                return (
                  <button
                    aria-label={p.value}
                    key={p.value}
                    type="button"
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-xs transition-colors active:scale-95",
                      isSelected
                        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700",
                    )}
                    onClick={() => setPriority(p.value)}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", p.dotClass)} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {t.tasks.dueDate}
          </label>
          <DatePicker value={dueDate} onChange={setDueDate} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-3 sm:order-1">
          {isEdit && onDelete && (
            <Button
              className="w-full sm:w-auto gap-1 h-10 sm:h-9 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-full"
              disabled={isSubmitting}
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <IconTrash size={14} stroke={2} />
              <span>{t.tasks.deleteTask}</span>
            </Button>
          )}
        </div>

        <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-center gap-2">
          <Button
            className="w-full sm:w-auto order-2 sm:order-1 h-10 sm:h-9 text-xs rounded-full"
            disabled={isSubmitting}
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t.common.cancel}
          </Button>
          <Button
            className="w-full sm:w-auto order-1 sm:order-2 h-10 sm:h-9 text-xs sm:min-w-[100px] rounded-full"
            disabled={!taskTitle.trim() || isSubmitting}
            type="submit"
          >
            {isEdit ? t.tasks.saveTask : t.tasks.addTask}
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
          <div className="flex justify-end gap-2 pt-2">
            <Button
              className="h-8 text-xs rounded-full"
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              className="h-8 text-xs rounded-full"
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
