"use client";

import { useEffect, useRef, useState } from "react";

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

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);

  function handleOpen() {
    if (disabled) return;
    if (value) {
      setCurrentMonth(new Date(value));
    }
    setDragY(0);
    setIsDragging(false);
    setIsOpen(true);
  }

  // Prevent background body scrolling while date picker is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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

  // Touch gesture handlers for swipe-down to dismiss on mobile
  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  }

  function handleTouchEnd() {
    setIsDragging(false);
    if (dragY > 60) {
      setIsOpen(false);
      setDragY(0);
    } else {
      setDragY(0);
    }
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const daysInView = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

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
            <span>{formatFriendlyDate(value)}</span>
          </button>
          <button
            aria-label="Clear date"
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
          <span>Due Date</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          {/* Backdrop (blocks background touches and clicks) */}
          <div
            aria-hidden="true"
            className="fixed inset-0 animate-backdrop-fade-in bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
          />

          {/* Sheet / Modal */}
          <div
            aria-label="Select Due Date"
            aria-modal="true"
            role="dialog"
            className={cn(
              "relative z-50 w-full max-w-sm rounded-t-2xl border-t border-neutral-200 bg-white p-4 pb-6 shadow-2xl sm:rounded-2xl sm:border sm:border-neutral-200 sm:pb-4 dark:border-neutral-800 dark:bg-neutral-900 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]",
              !isDragging && "animate-sheet-slide-up sm:animate-none",
            )}
            style={{
              transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
              transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Interactive Mobile Drag Notch Handle */}
            <div
              aria-label="Drag down to close"
              className="-mt-2 mb-2 flex h-6 w-full cursor-grab items-center justify-center active:cursor-grabbing sm:hidden"
              role="button"
              tabIndex={0}
              onClick={() => setIsOpen(false)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              onTouchStart={handleTouchStart}
            >
              <div className="h-1.5 w-12 rounded-full bg-neutral-300 transition-colors hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600" />
            </div>

            {/* Header with swipe-down handler */}
            <div
              className="flex items-center justify-between border-b border-neutral-100 pb-2.5 dark:border-neutral-800"
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              onTouchStart={handleTouchStart}
            >
              <span className="font-semibold text-neutral-900 text-sm dark:text-neutral-100">
                Due Date
              </span>
              <button
                aria-label="Close"
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                <IconX size={16} stroke={2} />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                className="rounded-lg border border-neutral-200 px-2.5 py-1 font-medium text-[11px] text-neutral-700 transition-colors hover:border-orange-500 hover:text-orange-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
                type="button"
                onClick={() => handleQuickPreset(0)}
              >
                Today
              </button>
              <button
                className="rounded-lg border border-neutral-200 px-2.5 py-1 font-medium text-[11px] text-neutral-700 transition-colors hover:border-orange-500 hover:text-orange-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
                type="button"
                onClick={() => handleQuickPreset(1)}
              >
                Tomorrow
              </button>
              <button
                className="rounded-lg border border-neutral-200 px-2.5 py-1 font-medium text-[11px] text-neutral-700 transition-colors hover:border-orange-500 hover:text-orange-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
                type="button"
                onClick={() => handleQuickPreset(7)}
              >
                Next Week
              </button>
              {value && (
                <button
                  className="ml-auto rounded-lg px-2 py-1 font-medium text-[11px] text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  type="button"
                  onClick={handleClear}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Month Navigation */}
            <div className="mt-3 flex items-center justify-between px-1">
              <span className="font-medium text-neutral-800 text-sm dark:text-neutral-200">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  aria-label="Previous Month"
                  className="h-7 w-7 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  size="icon"
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                >
                  <IconChevronLeft size={16} stroke={2} />
                </Button>
                <Button
                  aria-label="Next Month"
                  className="h-7 w-7 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  size="icon"
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                >
                  <IconChevronRight size={16} stroke={2} />
                </Button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="mt-2 grid grid-cols-7 text-center font-medium text-[11px] text-neutral-400 dark:text-neutral-500">
              {WEEKDAYS.map((day) => (
                <div className="py-1" key={day}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
              {daysInView.map((day) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isCurrentDay = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-center transition-colors mx-auto",
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
        </div>
      )}
    </>
  );
}
