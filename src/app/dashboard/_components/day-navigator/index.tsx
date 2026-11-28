"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { IconCalendar, IconChevronLeft, IconChevronRight, IconRotate } from "@tabler/icons-react";
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isTomorrow,
  isYesterday,
  subDays,
} from "date-fns";

import { useTranslation } from "@/providers/settings-provider";

import { DatePicker } from "@/components/date-picker";

import { useDirection } from "@/hooks/use-direction";

import {
  formatDayHeader,
  formatDayNumber,
  formatShortWeekday,
  toHtmlDateValue,
} from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface DayNavigatorProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  taskDatesSet: Set<string>;
}

export function DayNavigator({ selectedDate, taskDatesSet, onSelectDate }: DayNavigatorProps) {
  const { language, t } = useTranslation();
  const { isRtl } = useDirection();
  const activeDayRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const prevScrollWidthRef = useRef<number | null>(null);

  // Dynamic range for incremental/infinite loading
  const [daysRange, setDaysRange] = useState({ after: 30, before: 30 });

  // Adjust range during rendering if selectedDate is outside
  const diffFromToday = differenceInCalendarDays(selectedDate, new Date());
  const requiredBefore = Math.max(30, -diffFromToday + 30);
  const requiredAfter = Math.max(30, diffFromToday + 30);
  if (requiredBefore > daysRange.before || requiredAfter > daysRange.after) {
    setDaysRange({
      after: Math.max(daysRange.after, requiredAfter),
      before: Math.max(daysRange.before, requiredBefore),
    });
  }

  // Generate continuous list of days based on dynamic range
  const days = useMemo(() => {
    const today = new Date();
    return eachDayOfInterval({
      end: addDays(today, daysRange.after),
      start: subDays(today, daysRange.before),
    });
  }, [daysRange]);

  // Adjust scroll position after prepending past days to prevent scroll jumps
  useLayoutEffect(() => {
    if (prevScrollWidthRef.current !== null && scrollContainerRef.current) {
      const delta = scrollContainerRef.current.scrollWidth - prevScrollWidthRef.current;
      if (delta > 0) {
        if (isRtl) {
          scrollContainerRef.current.scrollLeft -= delta;
        } else {
          scrollContainerRef.current.scrollLeft += delta;
        }
      }
      prevScrollWidthRef.current = null;
    }
  }, [daysRange.before, isRtl]);

  // Scroll active day into center: instant on mount, smooth on user selection
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      activeDayRef.current?.scrollIntoView?.({
        behavior: "auto",
        block: "nearest",
        inline: "center",
      });
    } else {
      activeDayRef.current?.scrollIntoView?.({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedDate]);

  // Infinite scroll listener
  function handleScroll() {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { clientWidth, scrollLeft, scrollWidth } = el;

    const scrollFromStart = isRtl ? scrollWidth - clientWidth + scrollLeft : scrollLeft;
    const scrollFromEnd = isRtl ? Math.abs(scrollLeft) : scrollWidth - clientWidth - scrollLeft;

    if (scrollFromStart < 200) {
      prevScrollWidthRef.current = scrollWidth;
      setDaysRange((prev) => ({ ...prev, before: prev.before + 30 }));
    } else if (scrollFromEnd < 200) {
      setDaysRange((prev) => ({ ...prev, after: prev.after + 30 }));
    }
  }

  const isCurrentDayToday = isToday(selectedDate);
  const isCurrentDayTomorrow = isTomorrow(selectedDate);
  const isCurrentDayYesterday = isYesterday(selectedDate);

  const relativeLabel = isCurrentDayToday
    ? t.dashboard.today
    : isCurrentDayTomorrow
      ? t.dashboard.tomorrow
      : isCurrentDayYesterday
        ? t.dashboard.yesterday
        : null;

  function handlePrevDay() {
    onSelectDate(subDays(selectedDate, 1));
  }

  function handleNextDay() {
    onSelectDate(addDays(selectedDate, 1));
  }

  const PrevIcon = isRtl ? IconChevronRight : IconChevronLeft;
  const NextIcon = isRtl ? IconChevronLeft : IconChevronRight;

  return (
    <div className="space-y-3">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate font-bold text-base text-neutral-900 tracking-tight sm:text-lg dark:text-neutral-100">
            {formatDayHeader(selectedDate, language)}
          </h2>
          {relativeLabel && (
            <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 font-medium text-[11px] text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
              {relativeLabel}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {!isCurrentDayToday && (
            <button
              aria-label={t.dashboard.today}
              className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-white px-2.5 py-1.5 font-medium text-neutral-700 text-xs shadow-2xs transition-all hover:bg-neutral-50 active:scale-95 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:bg-neutral-800"
              type="button"
              onClick={() => onSelectDate(new Date())}
            >
              <IconRotate size={14} stroke={2} />
              <span>{t.dashboard.today}</span>
            </button>
          )}

          <div className="flex items-center rounded-xl bg-white p-0.5 shadow-2xs dark:bg-neutral-900/80">
            <button
              aria-label={t.dashboard.prevDay}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors after:absolute after:-inset-0.5 after:content-[''] hover:bg-neutral-100 hover:text-neutral-900 active:scale-95 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              type="button"
              onClick={handlePrevDay}
            >
              <PrevIcon size={17} stroke={2} />
            </button>
            <DatePicker
              showQuickPresets={false}
              title={t.datePicker.calendar}
              value={selectedDate.getTime()}
              trigger={
                <button
                  aria-label={t.dashboard.openCalendar}
                  className="relative flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors after:absolute after:-inset-0.5 after:content-[''] hover:bg-neutral-100 hover:text-neutral-900 active:scale-95 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  type="button"
                >
                  <IconCalendar size={17} stroke={2} />
                </button>
              }
              onChange={(timestamp) => {
                if (timestamp) onSelectDate(new Date(timestamp));
              }}
            />
            <button
              aria-label={t.dashboard.nextDay}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors after:absolute after:-inset-0.5 after:content-[''] hover:bg-neutral-100 hover:text-neutral-900 active:scale-95 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              type="button"
              onClick={handleNextDay}
            >
              <NextIcon size={17} stroke={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Days Slider */}
      <div className="relative rounded-2xl bg-white p-1 shadow-2xs sm:p-1.5 dark:bg-neutral-900/80">
        <div
          className="no-scrollbar flex items-center gap-1 overflow-x-auto py-0.5 [touch-action:pan-x]"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isDayToday = isToday(day);
            const dayDateStr = toHtmlDateValue(day.getTime());
            const hasTasks = taskDatesSet.has(dayDateStr);

            return (
              <button
                key={day.toISOString()}
                ref={isSelected ? activeDayRef : null}
                type="button"
                className={cn(
                  "relative flex min-h-[48px] w-[calc((100%-24px)/7)] min-w-[42px] shrink-0 flex-col items-center justify-center rounded-lg py-1.5 transition-all duration-150 active:scale-95",
                  isSelected
                    ? "bg-orange-500 font-semibold text-white shadow-xs"
                    : isDayToday
                      ? "bg-orange-50 font-medium text-orange-900 hover:bg-orange-100/70 dark:bg-orange-950/30 dark:text-orange-200 dark:hover:bg-orange-950/50"
                      : "text-neutral-600 hover:bg-neutral-100/80 dark:text-neutral-400 dark:hover:bg-neutral-800/60",
                )}
                onClick={() => onSelectDate(day)}
              >
                <span className="text-[11px] uppercase opacity-80">
                  {formatShortWeekday(day, language)}
                </span>
                <span className="mt-0.5 font-medium text-xs tabular-nums sm:text-sm">
                  {formatDayNumber(day, language)}
                </span>

                {/* Task indicator dot: only shown for unselected days with tasks */}
                <span
                  className={cn(
                    "mt-1 h-1 w-1 rounded-full transition-opacity",
                    !isSelected && hasTasks
                      ? isDayToday
                        ? "bg-orange-500 opacity-100"
                        : "bg-neutral-400 opacity-100 dark:bg-neutral-500"
                      : "opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
