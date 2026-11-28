"use client";

import { useRef, useState } from "react";

import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react";
import {
  addDays,
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  setMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
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
  const [isMonthYearView, setIsMonthYearView] = useState(false);
  const selectedDate = value ? new Date(value) : null;
  const [currentMonth, setCurrentMonth] = useState<Date>(() => selectedDate ?? new Date());
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
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
    setIsMonthYearView(false);
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

  function handleCalendarTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function handleCalendarTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    const goNext = isRtl ? dx > 0 : dx < 0;
    setCurrentMonth((prev) => (goNext ? addMonths(prev, 1) : subMonths(prev, 1)));
  }

  const monthNames = Array.from({ length: 12 }, (_, idx) =>
    new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-US", { month: "short" }).format(
      new Date(2026, idx, 1),
    ),
  );
  const yearLabel =
    language === "fa"
      ? currentMonth.getFullYear().toLocaleString("fa-IR", { useGrouping: false })
      : String(currentMonth.getFullYear());

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
            "relative inline-flex items-center",
            className?.includes("w-full") && "w-full",
          )}
        >
          <button
            disabled={disabled}
            type="button"
            className={cn(
              "inline-flex min-h-11 min-w-0 flex-1 items-center justify-start gap-2 rounded-xl bg-orange-500/12 px-3.5 font-medium text-orange-600 text-sm shadow-2xs ring-1 ring-orange-500/20 transition-colors hover:bg-orange-500/15 sm:min-h-10 sm:text-xs dark:bg-orange-500/15 dark:text-orange-400 dark:ring-orange-500/25",
              !disabled && "pe-11",
              className,
            )}
            onClick={handleOpen}
          >
            <IconCalendar size={15} stroke={2} />
            <span className="truncate">{formatFriendlyDate(value, language)}</span>
          </button>
          <button
            aria-label={t.datePicker.clear}
            className="absolute end-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-orange-500/20 text-orange-600 transition-colors after:absolute after:-inset-2.5 after:content-[''] hover:bg-orange-500/30 active:scale-95 dark:bg-orange-500/25 dark:text-orange-300 dark:hover:bg-orange-500/35"
            disabled={disabled}
            type="button"
            onClick={handleClear}
          >
            <IconX size={13} stroke={2.4} />
          </button>
        </div>
      ) : (
        <button
          disabled={disabled}
          type="button"
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-3.5 font-normal text-neutral-500 text-sm shadow-2xs ring-1 ring-black/[0.04] transition-colors hover:bg-neutral-50 active:scale-[0.99] sm:min-h-10 sm:text-xs dark:bg-neutral-900/80 dark:text-neutral-400 dark:ring-white/[0.06] dark:hover:bg-neutral-800/80",
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
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 text-xs">
            <button
              className="relative min-h-10 shrink-0 rounded-full bg-neutral-100/85 px-3.5 py-1.5 font-medium text-neutral-700 text-xs transition-colors after:absolute after:-inset-y-0.5 after:inset-x-0 after:content-[''] hover:bg-orange-500/10 hover:text-orange-600 active:scale-95 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:bg-orange-500/15 dark:hover:text-orange-400"
              type="button"
              onClick={() => handleQuickPreset(0)}
            >
              {t.datePicker.today}
            </button>
            <button
              className="relative min-h-10 shrink-0 rounded-full bg-neutral-100/85 px-3.5 py-1.5 font-medium text-neutral-700 text-xs transition-colors after:absolute after:-inset-y-0.5 after:inset-x-0 after:content-[''] hover:bg-orange-500/10 hover:text-orange-600 active:scale-95 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:bg-orange-500/15 dark:hover:text-orange-400"
              type="button"
              onClick={() => handleQuickPreset(1)}
            >
              {t.datePicker.tomorrow}
            </button>
            <button
              className="relative min-h-10 shrink-0 rounded-full bg-neutral-100/85 px-3.5 py-1.5 font-medium text-neutral-700 text-xs transition-colors after:absolute after:-inset-y-0.5 after:inset-x-0 after:content-[''] hover:bg-orange-500/10 hover:text-orange-600 active:scale-95 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:bg-orange-500/15 dark:hover:text-orange-400"
              type="button"
              onClick={() => handleQuickPreset(7)}
            >
              {t.datePicker.nextWeek}
            </button>
          </div>
        )}

        {/* Month Navigation Header */}
        <div className={cn("flex items-center justify-between", showQuickPresets && "mt-3")}>
          <button
            aria-expanded={isMonthYearView}
            className="inline-flex min-h-10 items-center gap-1 rounded-xl px-2 py-1 font-semibold text-neutral-800 text-sm transition-colors hover:bg-neutral-100 active:scale-[0.98] sm:text-xs dark:text-neutral-200 dark:hover:bg-neutral-800"
            type="button"
            onClick={() => setIsMonthYearView((prev) => !prev)}
          >
            <span>{isMonthYearView ? yearLabel : formatMonthYear(currentMonth, language)}</span>
            <IconChevronDown
              size={15}
              stroke={2.2}
              className={cn(
                "text-orange-500 transition-transform duration-200",
                isMonthYearView && "rotate-180",
              )}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <Button
              aria-label={t.datePicker.prevMonth}
              className="relative h-9 w-9 rounded-full after:absolute after:-inset-1 after:content-['']"
              size="icon"
              type="button"
              variant="ghost"
              onClick={() =>
                setCurrentMonth((prev) =>
                  isMonthYearView ? subYears(prev, 1) : subMonths(prev, 1),
                )
              }
            >
              <PrevIcon size={16} stroke={2} />
            </Button>
            <Button
              aria-label={t.datePicker.nextMonth}
              className="relative h-9 w-9 rounded-full after:absolute after:-inset-1 after:content-['']"
              size="icon"
              type="button"
              variant="ghost"
              onClick={() =>
                setCurrentMonth((prev) =>
                  isMonthYearView ? addYears(prev, 1) : addMonths(prev, 1),
                )
              }
            >
              <NextIcon size={16} stroke={2} />
            </Button>
          </div>
        </div>

        {/* Month / Year Switcher or Calendar Grid */}
        {isMonthYearView ? (
          <div className="fade-in zoom-in-95 mt-3 grid animate-in grid-cols-3 gap-2 py-2 duration-150">
            {monthNames.map((name, idx) => {
              const isSelectedMonth = currentMonth.getMonth() === idx;
              return (
                <button
                  key={name}
                  type="button"
                  className={cn(
                    "flex min-h-11 items-center justify-center rounded-xl font-medium text-xs transition-all active:scale-95 sm:text-sm",
                    isSelectedMonth
                      ? "bg-orange-500 font-semibold text-white shadow-xs"
                      : "bg-neutral-100/75 text-neutral-700 hover:bg-neutral-200/70 dark:bg-neutral-800/75 dark:text-neutral-200 dark:hover:bg-neutral-700/75",
                  )}
                  onClick={() => {
                    setCurrentMonth((prev) => setMonth(prev, idx));
                    setIsMonthYearView(false);
                  }}
                >
                  {name}
                </button>
              );
            })}
          </div>
        ) : (
          <div
            className="mt-2 touch-pan-y"
            onTouchEnd={handleCalendarTouchEnd}
            onTouchStart={handleCalendarTouchStart}
          >
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
            <div
              className="fade-in mt-1 grid animate-in grid-cols-7 gap-1 duration-150"
              key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}`}
            >
              {daysInView.map((day) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentDay = isToday(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                if (!isCurrentMonth) {
                  return <div aria-hidden="true" className="h-10 w-10" key={day.toISOString()} />;
                }

                const dayLabel =
                  language === "fa" ? day.getDate().toLocaleString("fa-IR") : String(day.getDate());

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    className={cn(
                      "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-xs tabular-nums transition-all after:absolute after:-inset-0.5 after:content-[''] active:scale-95 sm:text-sm",
                      isSelected
                        ? "bg-orange-500 font-semibold text-white shadow-xs"
                        : isCurrentDay
                          ? "bg-orange-500/10 font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
                          : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
                    )}
                    onClick={() => handleSelectDate(day)}
                  >
                    {dayLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          {value !== null && (
            <button
              className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-rose-500/[0.08] px-3 py-2.5 font-medium text-rose-600 text-xs transition-colors hover:bg-rose-500/15 active:scale-[0.98] dark:bg-rose-500/15 dark:text-rose-400 dark:hover:bg-rose-500/20"
              type="button"
              onClick={handleClear}
            >
              {t.datePicker.clear}
            </button>
          )}
          <button
            className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-neutral-100 px-3 py-2.5 font-medium text-neutral-700 text-xs transition-colors hover:bg-neutral-200/70 active:scale-[0.98] dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            {t.common.close}
          </button>
        </div>
      </Modal>
    </>
  );
}
