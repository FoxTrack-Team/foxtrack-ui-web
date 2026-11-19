"use client";

import { useState } from "react";

import { IconCalendar, IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

import { useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { formatFriendlyDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  className?: string;
  disabled?: boolean;
  onChange: (timestamp: number | null) => void;
  trigger?: React.ReactNode;
  value: number | null;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

function toEndOfDayTimestamp(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).getTime();
}

export function DatePicker({ className, disabled, onChange, trigger, value }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = value ? new Date(value) : null;
  const [currentMonth, setCurrentMonth] = useState<Date>(() => selectedDate ?? new Date());
  const { language, t } = useTranslation();

  function handleOpen() {
    if (disabled) return;
    if (value) {
      setCurrentMonth(new Date(value));
    }
    setIsOpen(true);
  }

  function handleSelectDate(date: Date) {
    onChange(toEndOfDayTimestamp(date));
    setIsOpen(false);
  }

  function handleClear(e?: React.MouseEvent) {
    e?.stopPropagation();
    onChange(null);
    setIsOpen(false);
  }

  function handleQuickPreset(daysFromToday: number) {
    const target = addDays(new Date(), daysFromToday);
    handleSelectDate(target);
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const daysInView = eachDayOfInterval({ end: calendarEnd, start: calendarStart });

  return (
    <>
      {trigger ? (
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
        >
          {trigger}
        </div>
      ) : value ? (
        <div
          className={cn(
            "flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 font-medium text-[11px] text-orange-600 dark:bg-orange-950/30 dark:text-orange-400",
            className,
          )}
        >
          <button
            className="flex items-center gap-1 hover:underline"
            disabled={disabled}
            type="button"
            onClick={handleOpen}
          >
            <IconCalendar size={13} stroke={2} />
            <span>{formatFriendlyDate(value, language)}</span>
          </button>
          <button
            aria-label={t.datePicker.clear}
            className="rounded p-0.5 text-orange-500 hover:bg-orange-100 hover:text-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/50"
            disabled={disabled}
            type="button"
            onClick={handleClear}
          >
            <IconX size={12} stroke={2.5} />
          </button>
        </div>
      ) : (
        <button
          disabled={disabled}
          type="button"
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
            className,
          )}
          onClick={handleOpen}
        >
          <IconCalendar size={13} stroke={1.75} />
          <span>{t.datePicker.selectDueDate}</span>
        </button>
      )}

      <Modal
        ariaLabel={t.datePicker.selectDueDate}
        isOpen={isOpen}
        maxWidth="sm"
        title={t.datePicker.title}
        onClose={() => setIsOpen(false)}
      >
        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            className="rounded-lg border border-neutral-200 px-2.5 py-1 font-medium text-[11px] text-neutral-700 transition-colors hover:border-orange-500 hover:text-orange-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
            type="button"
            onClick={() => handleQuickPreset(0)}
          >
            {t.datePicker.today}
          </button>
          <button
            className="rounded-lg border border-neutral-200 px-2.5 py-1 font-medium text-[11px] text-neutral-700 transition-colors hover:border-orange-500 hover:text-orange-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
            type="button"
            onClick={() => handleQuickPreset(1)}
          >
            {t.datePicker.tomorrow}
          </button>
          <button
            className="rounded-lg border border-neutral-200 px-2.5 py-1 font-medium text-[11px] text-neutral-700 transition-colors hover:border-orange-500 hover:text-orange-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
            type="button"
            onClick={() => handleQuickPreset(7)}
          >
            {t.datePicker.nextWeek}
          </button>
        </div>

        {/* Month Navigation Header */}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-medium text-neutral-800 text-xs dark:text-neutral-200">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <div className="flex items-center gap-1">
            <Button
              aria-label="Previous month"
              className="h-6 w-6 rounded-md"
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <IconChevronLeft size={14} stroke={2} />
            </Button>
            <Button
              aria-label="Next month"
              className="h-6 w-6 rounded-md"
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <IconChevronRight size={14} stroke={2} />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mt-2">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center">
            {WEEKDAYS.map((day) => (
              <span
                className="py-1 font-medium text-[10px] text-neutral-400 dark:text-neutral-500"
                key={day}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="mt-1 grid grid-cols-7 gap-1">
            {daysInView.map((day) => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  className={cn(
                    "flex h-7 w-full items-center justify-center rounded-md text-xs transition-colors",
                    isSelected
                      ? "bg-orange-500 font-semibold text-white shadow-xs"
                      : isCurrentDay
                        ? "border border-orange-500/40 font-semibold text-orange-600 dark:text-orange-400"
                        : isCurrentMonth
                          ? "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                          : "text-neutral-300 hover:bg-neutral-50 dark:text-neutral-600 dark:hover:bg-neutral-800/40",
                  )}
                  onClick={() => handleSelectDate(day)}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
