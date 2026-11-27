"use client";

import { useState } from "react";

import { IconCalendar, IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
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

import { useDirection } from "@/hooks/use-direction";

import { formatFriendlyDate, formatMonthYear } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  className?: string;
  disabled?: boolean;
  onChange: (timestamp: number | null) => void;
  showQuickPresets?: boolean;
  title?: string;
  trigger?: React.ReactNode;
  value: number | null;
}

const WEEKDAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const WEEKDAYS_FA = ["ی", "د", "س", "چ", "پ", "ج", "ش"] as const;

function toEndOfDayTimestamp(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).getTime();
}

export function DatePicker({
  className,
  disabled,
  onChange,
  showQuickPresets = true,
  title,
  trigger,
  value,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = value ? new Date(value) : null;
  const [currentMonth, setCurrentMonth] = useState<Date>(() => selectedDate ?? new Date());
  const { language, t } = useTranslation();
  const { isRtl } = useDirection();
  const PrevIcon = isRtl ? IconChevronRight : IconChevronLeft;
  const NextIcon = isRtl ? IconChevronLeft : IconChevronRight;
  const weekdays = language === "fa" ? WEEKDAYS_FA : WEEKDAYS_EN;

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
        <span className="contents" onClick={handleOpen}>
          {trigger}
        </span>
      ) : value ? (
        <div
          className={cn(
            "inline-flex min-h-10 items-center justify-between gap-1 rounded-xl border border-orange-200/80 bg-orange-50 px-3 font-medium text-xs text-orange-600 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-400",
            className,
          )}
        >
          <button
            className="flex min-h-9 min-w-0 flex-1 items-center gap-1.5 hover:underline"
            disabled={disabled}
            type="button"
            onClick={handleOpen}
          >
            <IconCalendar size={14} stroke={2} />
            <span className="truncate">{formatFriendlyDate(value, language)}</span>
          </button>
          <button
            aria-label={t.datePicker.clear}
            className="-me-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-orange-500 transition-colors hover:bg-orange-100 hover:text-orange-700 active:scale-95 dark:text-orange-400 dark:hover:bg-orange-900/50"
            disabled={disabled}
            type="button"
            onClick={handleClear}
          >
            <IconX size={14} stroke={2.5} />
          </button>
        </div>
      ) : (
        <button
          disabled={disabled}
          type="button"
          className={cn(
            "inline-flex min-h-10 items-center gap-2 rounded-xl border border-neutral-200/80 bg-neutral-50/80 px-3 font-normal text-xs text-neutral-500 transition-colors hover:bg-neutral-100 active:scale-[0.99] dark:border-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-neutral-800",
            className,
          )}
          onClick={handleOpen}
        >
          <IconCalendar className="shrink-0 text-neutral-400" size={16} stroke={1.75} />
          <span>{t.datePicker.selectDueDate}</span>
        </button>
      )}

      <Modal
        ariaLabel={title ?? t.datePicker.selectDueDate}
        isOpen={isOpen}
        maxWidth="sm"
        title={title ?? t.datePicker.title}
        onClose={() => setIsOpen(false)}
      >
        {/* Quick Presets */}
        {showQuickPresets && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              className="min-h-9 shrink-0 rounded-lg border border-neutral-200 px-3 py-1.5 font-medium text-xs text-neutral-700 transition-colors hover:border-orange-500 hover:text-orange-600 active:scale-95 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
              type="button"
              onClick={() => handleQuickPreset(0)}
            >
              {t.datePicker.today}
            </button>
            <button
              className="min-h-9 shrink-0 rounded-lg border border-neutral-200 px-3 py-1.5 font-medium text-xs text-neutral-700 transition-colors hover:border-orange-500 hover:text-orange-600 active:scale-95 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
              type="button"
              onClick={() => handleQuickPreset(1)}
            >
              {t.datePicker.tomorrow}
            </button>
            <button
              className="min-h-9 shrink-0 rounded-lg border border-neutral-200 px-3 py-1.5 font-medium text-xs text-neutral-700 transition-colors hover:border-orange-500 hover:text-orange-600 active:scale-95 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
              type="button"
              onClick={() => handleQuickPreset(7)}
            >
              {t.datePicker.nextWeek}
            </button>
          </div>
        )}

        {/* Month Navigation Header */}
        <div className={cn("flex items-center justify-between", showQuickPresets && "mt-3")}>
          <span className="font-semibold text-neutral-800 text-sm sm:text-xs dark:text-neutral-200">
            {formatMonthYear(currentMonth, language)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              aria-label={t.datePicker.prevMonth}
              className="h-9 w-9 rounded-lg"
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <PrevIcon size={16} stroke={2} />
            </Button>
            <Button
              aria-label={t.datePicker.nextMonth}
              className="h-9 w-9 rounded-lg"
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <NextIcon size={16} stroke={2} />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mt-2">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center">
            {weekdays.map((day) => (
              <span
                className="py-1 font-medium text-[11px] text-neutral-500 dark:text-neutral-400"
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
              const dayLabel =
                language === "fa" ? day.getDate().toLocaleString("fa-IR") : String(day.getDate());

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-lg text-xs tabular-nums transition-all active:scale-95 sm:text-sm",
                    isSelected
                      ? "bg-orange-500 font-semibold text-white shadow-xs"
                      : isCurrentDay
                        ? "border border-orange-500/40 font-semibold text-orange-600 dark:text-orange-400"
                        : isCurrentMonth
                          ? "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                          : "text-neutral-400 hover:bg-neutral-50 dark:text-neutral-600 dark:hover:bg-neutral-800/40",
                  )}
                  onClick={() => handleSelectDate(day)}
                >
                  {dayLabel}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
