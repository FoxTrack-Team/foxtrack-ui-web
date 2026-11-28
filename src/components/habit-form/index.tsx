"use client";

import { type FormEvent, useState } from "react";

import { IconClock, IconTrash } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { CategoryPicker } from "@/components/category-picker";
import { Modal } from "@/components/modal";
import { TimePicker } from "@/components/time-picker";
import { Button } from "@/components/ui/button";

import { HabitFrequency } from "@/features/habits/types";
import { formatDuration, getDurationMinutes } from "@/features/habits/utils/time-utils";

import { cn } from "@/lib/utils";

export interface HabitFormValues {
  categoryId: string | null;
  description?: string;
  endTime: string | null;
  frequencyType: HabitFrequency;
  reminderEnabled?: boolean;
  reminderTime?: string | null;
  startTime: string | null;
  targetDays: number[];
  title: string;
}

interface HabitFormProps {
  initialValues?: Partial<HabitFormValues>;
  isEdit?: boolean;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  onSubmit: (values: HabitFormValues) => Promise<void>;
  subtitle?: string;
  title: string;
}

const WEEKDAYS_EN = [
  { day: 1, label: "Mon" },
  { day: 2, label: "Tue" },
  { day: 3, label: "Wed" },
  { day: 4, label: "Thu" },
  { day: 5, label: "Fri" },
  { day: 6, label: "Sat" },
  { day: 0, label: "Sun" },
];

const WEEKDAYS_FA = [
  { day: 6, label: "ش" },
  { day: 0, label: "ی" },
  { day: 1, label: "د" },
  { day: 2, label: "س" },
  { day: 3, label: "چ" },
  { day: 4, label: "پ" },
  { day: 5, label: "ج" },
];

export function HabitForm({
  initialValues,
  isEdit = false,
  onCancel,
  onDelete,
  onSubmit,
  subtitle,
  title,
}: HabitFormProps) {
  const { language, t } = useTranslation();
  const [habitTitle, setHabitTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(initialValues?.categoryId ?? null);
  const [startTime, setStartTime] = useState(initialValues?.startTime ?? "");
  const [endTime, setEndTime] = useState(initialValues?.endTime ?? "");
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(
    initialValues?.reminderEnabled ?? true,
  );
  const [reminderTime, setReminderTime] = useState(initialValues?.reminderTime ?? "");
  const [frequencyType, setFrequencyType] = useState<HabitFrequency>(
    initialValues?.frequencyType ?? "daily",
  );
  const [targetDays, setTargetDays] = useState<number[]>(
    initialValues?.targetDays?.length ? initialValues.targetDays : [0, 1, 2, 3, 4, 5, 6],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const durationMinutes = getDurationMinutes(startTime || null, endTime || null);
  const weekdays = language === "fa" ? WEEKDAYS_FA : WEEKDAYS_EN;

  function toggleWeekday(day: number) {
    setTargetDays((prev) => {
      if (prev.includes(day)) {
        return prev.length > 1 ? prev.filter((d) => d !== day) : prev;
      }
      return [...prev, day];
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = habitTitle.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        categoryId,
        description: description.trim() || undefined,
        endTime: endTime || null,
        frequencyType,
        reminderEnabled,
        reminderTime: reminderTime || null,
        startTime: startTime || null,
        targetDays: frequencyType === "daily" ? [0, 1, 2, 3, 4, 5, 6] : targetDays,
        title: trimmed,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!onDelete || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onDelete();
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">{subtitle}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
          {t.habits.titleLabel}
        </label>
        <input
          autoFocus={!isEdit}
          className="min-h-11 w-full rounded-xl bg-white px-3.5 py-2.5 text-base text-neutral-900 shadow-2xs ring-1 ring-black/[0.04] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 sm:min-h-10 sm:text-sm dark:bg-neutral-900/80 dark:text-neutral-100 dark:ring-white/[0.06] dark:focus:ring-primary/40"
          placeholder={t.habits.titlePlaceholder}
          type="text"
          value={habitTitle}
          onChange={(e) => setHabitTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
          {t.habits.description}
        </label>
        <textarea
          className="w-full resize-none rounded-xl bg-white p-3.5 text-base text-neutral-900 shadow-2xs ring-1 ring-black/[0.04] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm dark:bg-neutral-900/80 dark:text-neutral-100 dark:ring-white/[0.06] dark:focus:ring-primary/40"
          placeholder={t.habits.descriptionPlaceholder}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <CategoryPicker value={categoryId} onChange={setCategoryId} />

      {/* Time Block Inputs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium text-neutral-700 text-xs dark:text-neutral-300">
            <IconClock size={14} stroke={1.8} />
            <span>
              {t.habits.startTime} / {t.habits.endTime}
            </span>
          </span>
          {durationMinutes !== null && (
            <span className="rounded-md bg-orange-500/10 px-2 py-0.5 font-medium text-[11px] text-orange-600 tabular-nums dark:bg-orange-500/15 dark:text-orange-400">
              {t.habits.durationLabel}: {formatDuration(durationMinutes, language)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="mb-1 block text-[11px] text-neutral-500 dark:text-neutral-400">
              {t.habits.startTime}
            </label>
            <TimePicker ariaLabel={t.habits.startTime} value={startTime} onChange={setStartTime} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-neutral-500 dark:text-neutral-400">
              {t.habits.endTime}
            </label>
            <TimePicker ariaLabel={t.habits.endTime} value={endTime} onChange={setEndTime} />
          </div>
        </div>
      </div>

      {/* Reminder Controls */}
      <div className="space-y-2.5 rounded-2xl bg-neutral-100/70 p-3 dark:bg-neutral-800/40">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {t.timePicker.reminder}
          </span>
          <button
            aria-checked={reminderEnabled}
            aria-label={t.timePicker.reminder}
            role="switch"
            type="button"
            className={cn(
              "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors",
              reminderEnabled ? "bg-orange-500" : "bg-neutral-300 dark:bg-neutral-700",
            )}
            onClick={() => setReminderEnabled((prev) => !prev)}
          >
            <span
              className={cn(
                "h-6 w-6 rounded-full bg-white shadow-xs transition-transform",
                reminderEnabled ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>
        {reminderEnabled && (
          <div>
            <label className="mb-1 block font-medium text-[11px] text-neutral-500 dark:text-neutral-400">
              {t.timePicker.reminderTime}
            </label>
            <TimePicker
              ariaLabel={t.timePicker.reminderTime}
              placeholder={startTime || t.timePicker.selectTime}
              value={reminderTime}
              onChange={setReminderTime}
            />
          </div>
        )}
      </div>

      {/* Frequency Selector */}
      <div className="space-y-2.5">
        <label className="block font-medium text-neutral-700 text-xs dark:text-neutral-300">
          {t.habits.frequencyLabel}
        </label>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-200/70 p-1 dark:bg-neutral-900/90">
          <button
            aria-pressed={frequencyType === "daily"}
            type="button"
            className={cn(
              "flex min-h-10 items-center justify-center rounded-lg py-1.5 font-medium text-xs transition-all sm:min-h-9",
              frequencyType === "daily"
                ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
            )}
            onClick={() => setFrequencyType("daily")}
          >
            {t.habits.daily}
          </button>
          <button
            aria-pressed={frequencyType === "specific_days"}
            type="button"
            className={cn(
              "flex min-h-10 items-center justify-center rounded-lg py-1.5 font-medium text-xs transition-all sm:min-h-9",
              frequencyType === "specific_days"
                ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
            )}
            onClick={() => setFrequencyType("specific_days")}
          >
            {t.habits.specificDays}
          </button>
        </div>

        {frequencyType === "specific_days" && (
          <div className="grid grid-cols-7 gap-1.5 pt-0.5">
            {weekdays.map((w) => {
              const selected = targetDays.includes(w.day);
              return (
                <button
                  aria-pressed={selected}
                  key={w.day}
                  type="button"
                  className={cn(
                    "flex h-11 items-center justify-center rounded-xl font-medium text-xs shadow-2xs transition-colors sm:h-10",
                    selected
                      ? "bg-orange-500/15 text-orange-600 ring-1 ring-orange-500/35 dark:text-orange-400"
                      : "bg-white text-neutral-500 hover:bg-neutral-50 dark:bg-neutral-900/80 dark:text-neutral-400 dark:hover:bg-neutral-800",
                  )}
                  onClick={() => toggleWeekday(w.day)}
                >
                  {w.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center sm:justify-start sm:gap-2.5">
          <Button
            className="h-11 w-full rounded-xl text-sm sm:h-10 sm:w-auto sm:min-w-[110px] sm:text-xs"
            disabled={!habitTitle.trim() || isSubmitting}
            type="submit"
          >
            {isEdit ? t.habits.saveHabit : t.habits.addHabit}
          </Button>
          <Button
            className="h-11 w-full rounded-xl bg-neutral-200/70 text-neutral-700 text-sm hover:bg-neutral-200 sm:h-10 sm:w-auto sm:px-5 sm:text-xs dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            disabled={isSubmitting}
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            {t.common.cancel}
          </Button>
        </div>

        {isEdit && onDelete && (
          <div className="pt-1">
            <Button
              className="h-11 w-full gap-1.5 rounded-xl bg-rose-500/[0.08] text-rose-600 text-xs hover:bg-rose-500/[0.14] hover:text-rose-700 sm:h-10 dark:bg-rose-500/[0.12] dark:text-rose-400 dark:hover:bg-rose-500/[0.2]"
              disabled={isSubmitting}
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <IconTrash size={15} stroke={1.9} />
              <span>{t.habits.deleteHabit}</span>
            </Button>
          </div>
        )}
      </div>

      {isEdit && (
        <Modal
          description={t.habits.deleteConfirm}
          isOpen={isDeleteModalOpen}
          maxWidth="sm"
          title={t.habits.deleteHabit}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              className="h-10 w-full rounded-xl text-xs sm:h-9 sm:w-auto"
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              className="h-10 w-full rounded-xl text-xs sm:h-9 sm:w-auto"
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              {t.common.delete}
            </Button>
          </div>
        </Modal>
      )}
    </form>
  );
}
