"use client";

import { IconCalendar, IconCalendarEvent, IconCalendarWeek } from "@tabler/icons-react";

import { useSettings } from "@/providers/settings-provider";

import { type CalendarType, type WeekdayIndex } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

const WEEKDAY_NAMES_EN: { index: WeekdayIndex; label: string }[] = [
  { index: 6, label: "Sat" },
  { index: 0, label: "Sun" },
  { index: 1, label: "Mon" },
  { index: 2, label: "Tue" },
  { index: 3, label: "Wed" },
  { index: 4, label: "Thu" },
  { index: 5, label: "Fri" },
];

const WEEKDAY_NAMES_FA: { index: WeekdayIndex; label: string }[] = [
  { index: 6, label: "ش" },
  { index: 0, label: "ی" },
  { index: 1, label: "د" },
  { index: 2, label: "س" },
  { index: 3, label: "چ" },
  { index: 4, label: "پ" },
  { index: 5, label: "ج" },
];

export function CalendarSection() {
  const {
    calendarType,
    language,
    setCalendarType,
    setWeekendDays,
    setWeekStartsOn,
    t,
    weekendDays,
    weekStartsOn,
  } = useSettings();

  const weekdays = language === "fa" ? WEEKDAY_NAMES_FA : WEEKDAY_NAMES_EN;

  const calendarTypes: { key: CalendarType; label: string }[] = [
    { key: "gregorian", label: t.settings.calendar.gregorian },
    { key: "jalali", label: t.settings.calendar.jalali },
  ];

  function handleToggleWeekendDay(dayIndex: WeekdayIndex) {
    if (weekendDays.includes(dayIndex)) {
      setWeekendDays(weekendDays.filter((d) => d !== dayIndex));
    } else {
      setWeekendDays([...weekendDays, dayIndex]);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {t.settings.calendar.title}
        </h1>
        <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
          {t.settings.calendar.description}
        </p>
      </div>

      <section className="space-y-5 rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-neutral-900/80">
        {/* Calendar Type */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 font-medium text-neutral-700 text-xs dark:text-neutral-300">
            <IconCalendar size={15} stroke={1.75} />
            <span>{t.settings.calendar.calendarType}</span>
          </label>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-200/70 p-1 dark:bg-neutral-800/80">
            {calendarTypes.map((item) => {
              const isActive = calendarType === item.key;
              return (
                <button
                  aria-pressed={isActive}
                  key={item.key}
                  type="button"
                  className={cn(
                    "flex min-h-11 items-center justify-center rounded-lg py-2 font-medium text-xs transition-all active:scale-[0.98] sm:min-h-10",
                    isActive
                      ? "bg-white text-neutral-900 shadow-xs ring-1 ring-black/5 dark:bg-neutral-700/90 dark:text-white dark:ring-white/10"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
                  )}
                  onClick={() => setCalendarType(item.key)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start of Week */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 font-medium text-neutral-700 text-xs dark:text-neutral-300">
            <IconCalendarWeek size={15} stroke={1.75} />
            <span>{t.settings.calendar.weekStartsOn}</span>
          </label>
          <div className="grid grid-cols-7 gap-1.5">
            {weekdays.map((day) => {
              const isActive = weekStartsOn === day.index;
              return (
                <button
                  aria-pressed={isActive}
                  key={day.index}
                  type="button"
                  className={cn(
                    "flex min-h-11 items-center justify-center rounded-full font-medium text-xs transition-all active:scale-95",
                    isActive
                      ? "bg-orange-500 font-semibold text-white shadow-xs"
                      : "bg-neutral-100/85 text-neutral-700 hover:bg-neutral-200/70 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:bg-neutral-700/80",
                  )}
                  onClick={() => setWeekStartsOn(day.index)}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekend Days */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 font-medium text-neutral-700 text-xs dark:text-neutral-300">
            <IconCalendarEvent size={15} stroke={1.75} />
            <span>{t.settings.calendar.weekendDays}</span>
          </label>
          <div className="grid grid-cols-7 gap-1.5">
            {weekdays.map((day) => {
              const isWeekend = weekendDays.includes(day.index);
              return (
                <button
                  aria-pressed={isWeekend}
                  key={day.index}
                  type="button"
                  className={cn(
                    "flex min-h-11 items-center justify-center rounded-full font-medium text-xs transition-all active:scale-95",
                    isWeekend
                      ? "bg-rose-500/15 font-semibold text-rose-600 ring-1 ring-rose-500/25 dark:bg-rose-500/20 dark:text-rose-400 dark:ring-rose-500/30"
                      : "bg-neutral-100/85 text-neutral-700 hover:bg-neutral-200/70 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:bg-neutral-700/80",
                  )}
                  onClick={() => handleToggleWeekendDay(day.index)}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-neutral-500 leading-relaxed dark:text-neutral-400">
          {t.settings.calendar.storageNote}
        </p>
      </section>
    </div>
  );
}
