import { subDays } from "date-fns";

import { toHtmlDateValue } from "@/lib/date-utils";

import { Habit } from "../types";

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_DAY_START_MINUTES = 5 * 60; // 05:00 anchors logical day so 00:00 sleep sorts at night

export function parseTimeToMinutes(time?: string | null): number | null {
  if (!time) return null;
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/**
 * Calculates duration in minutes between startTime and endTime.
 * Handles overnight spans (e.g. 22:30 -> 00:00 = 90m, 00:00 -> 06:00 = 360m).
 */
export function getDurationMinutes(
  startTime?: string | null,
  endTime?: string | null,
): number | null {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (start === null || end === null) return null;

  let diff = end - start;
  if (diff <= 0) {
    diff += MINUTES_PER_DAY;
  }
  return diff;
}

export function formatDuration(minutes: number, lang: string = "en"): string {
  const isFa = lang === "fa";
  if (minutes < 60) {
    return isFa ? `${minutes} دقیقه` : `${minutes}m`;
  }
  const hours = minutes / 60;
  const rounded = Number.isInteger(hours) ? String(hours) : Number(hours.toFixed(2)).toString();
  return isFa ? `${rounded} ساعت` : `${rounded}h`;
}

export function getLogicalDayOffset(
  time?: string | null,
  dayStartMinutes = DEFAULT_DAY_START_MINUTES,
): number | null {
  const mins = parseTimeToMinutes(time);
  if (mins === null) return null;
  return (mins - dayStartMinutes + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

export function sortHabitsBySchedule(habits: Habit[]): Habit[] {
  return [...habits].sort((a, b) => {
    const offsetA = getLogicalDayOffset(a.startTime);
    const offsetB = getLogicalDayOffset(b.startTime);

    if (offsetA !== null && offsetB !== null) {
      if (offsetA !== offsetB) return offsetA - offsetB;
    } else if (offsetA !== null) {
      return -1;
    } else if (offsetB !== null) {
      return 1;
    }

    if (a.order !== b.order) return a.order - b.order;
    return a.createdAt - b.createdAt;
  });
}

export function isCurrentTimeBlock(
  startTime?: string | null,
  endTime?: string | null,
  now: Date = new Date(),
): boolean {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (start === null || end === null) return false;

  const current = now.getHours() * 60 + now.getMinutes();

  if (end > start) {
    return current >= start && current < end;
  }
  // Overnight window (e.g. 22:30 -> 00:00 or 23:00 -> 06:00)
  return current >= start || current < end;
}

export function isHabitScheduledForDate(habit: Habit, date: Date): boolean {
  if (habit.archived) return false;
  if (habit.frequencyType === "daily") return true;
  return habit.targetDays.includes(date.getDay());
}

/**
 * Computes consecutive scheduled days completed up to referenceDate.
 * If referenceDate itself is scheduled but not yet completed, streak counts from the prior scheduled day
 * so streaks don't vanish mid-day before the user checks off today's item.
 */
export function calculateHabitStreak(
  habit: Habit,
  completedDateKeys: Set<string>,
  referenceDate: Date = new Date(),
): number {
  let streak = 0;
  let checkedStart = false;

  for (let i = 0; i < 365; i++) {
    const day = subDays(referenceDate, i);
    const isScheduled = habit.frequencyType === "daily" || habit.targetDays.includes(day.getDay());

    if (!isScheduled) continue;

    const key = toHtmlDateValue(day.getTime());
    const done = completedDateKeys.has(key);

    if (!checkedStart) {
      checkedStart = true;
      if (done) {
        streak++;
      }
      // If today (i === 0) isn't checked yet, continue backwards from yesterday
      continue;
    }

    if (done) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export interface HabitDurationSummary {
  byCategory: Array<{ categoryId: string | null; minutes: number }>;
  completedMinutes: number;
  totalMinutes: number;
}

export function summarizeHabitDurations(
  habits: Habit[],
  completedHabitIds: Set<string>,
): HabitDurationSummary {
  let totalMinutes = 0;
  let completedMinutes = 0;
  const categoryTotals = new Map<string | null, number>();

  for (const habit of habits) {
    const mins = getDurationMinutes(habit.startTime, habit.endTime);
    if (mins === null) continue;

    totalMinutes += mins;
    if (completedHabitIds.has(habit.id)) {
      completedMinutes += mins;
    }

    const catKey = habit.categoryId ?? null;
    categoryTotals.set(catKey, (categoryTotals.get(catKey) ?? 0) + mins);
  }

  const byCategory = Array.from(categoryTotals.entries())
    .map(([categoryId, minutes]) => ({ categoryId, minutes }))
    .sort((a, b) => b.minutes - a.minutes);

  return {
    byCategory,
    completedMinutes,
    totalMinutes,
  };
}
