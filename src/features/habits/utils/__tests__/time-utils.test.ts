import { describe, expect, it } from "vitest";

import { Habit } from "../../types";
import {
  calculateHabitStreak,
  formatDuration,
  getDurationMinutes,
  isCurrentTimeBlock,
  isHabitScheduledForDate,
  sortHabitsBySchedule,
  summarizeHabitDurations,
} from "../time-utils";

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    archived: false,
    categoryId: null,
    createdAt: 1000,
    endTime: null,
    frequencyType: "daily",
    id: "h1",
    order: 0,
    startTime: null,
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    title: "Test Habit",
    updatedAt: 1000,
    ...overrides,
  };
}

describe("habits time-utils", () => {
  it("calculates duration accurately including overnight spans", () => {
    expect(getDurationMinutes("06:00", "06:15")).toBe(15);
    expect(getDurationMinutes("08:00", "15:30")).toBe(450);
    expect(getDurationMinutes("22:30", "00:00")).toBe(90);
    expect(getDurationMinutes("00:00", "06:00")).toBe(360);
    expect(getDurationMinutes("06:00", null)).toBeNull();
  });

  it("formats durations cleanly for English and Farsi", () => {
    expect(formatDuration(15, "en")).toBe("15m");
    expect(formatDuration(90, "en")).toBe("1.5h");
    expect(formatDuration(360, "en")).toBe("6h");
    expect(formatDuration(15, "fa")).toBe("15 دقیقه");
    expect(formatDuration(90, "fa")).toBe("1.5 ساعت");
  });

  it("sorts schedule from 05:00 morning through 00:00 midnight sleep", () => {
    const sleep = makeHabit({ endTime: "06:00", id: "sleep", startTime: "00:00" });
    const wake = makeHabit({ endTime: "06:15", id: "wake", startTime: "06:00" });
    const night = makeHabit({ endTime: "00:00", id: "night", startTime: "22:30" });
    const unscheduled = makeHabit({ id: "unscheduled", order: 1, startTime: null });

    const sorted = sortHabitsBySchedule([sleep, unscheduled, night, wake]);
    expect(sorted.map((h) => h.id)).toEqual(["wake", "night", "sleep", "unscheduled"]);
  });

  it("detects active time block including overnight windows", () => {
    expect(isCurrentTimeBlock("08:00", "15:30", new Date("2026-11-28T10:15:00"))).toBe(true);
    expect(isCurrentTimeBlock("08:00", "15:30", new Date("2026-11-28T15:30:00"))).toBe(false);
    expect(isCurrentTimeBlock("22:30", "00:00", new Date("2026-11-28T23:45:00"))).toBe(true);
    expect(isCurrentTimeBlock("22:30", "00:00", new Date("2026-11-28T00:15:00"))).toBe(false);
    expect(isCurrentTimeBlock("23:00", "06:00", new Date("2026-11-28T02:00:00"))).toBe(true);
  });

  it("calculates streak skipping non-scheduled days", () => {
    // Saturday (6) and Monday (1) habit
    const habit = makeHabit({
      frequencyType: "specific_days",
      targetDays: [1, 6],
    });
    // Reference: Saturday 2026-11-28 (day 6). Prior scheduled days: Mon 2026-11-23, Sat 2026-11-21
    const ref = new Date(2026, 10, 28, 12, 0, 0);
    const logs = new Set(["2026-11-23", "2026-11-21"]);

    // Today not checked yet -> preserves 2-day streak from scheduled days
    expect(calculateHabitStreak(habit, logs, ref)).toBe(2);

    // Check today too -> 3
    logs.add("2026-11-28");
    expect(calculateHabitStreak(habit, logs, ref)).toBe(3);
  });

  it("filters scheduled habits for a date and summarizes durations by category", () => {
    const h1 = makeHabit({
      categoryId: "joyto",
      endTime: "07:30",
      id: "h1",
      startTime: "07:00",
    });
    const h2 = makeHabit({
      categoryId: "joyto",
      endTime: "00:00",
      id: "h2",
      startTime: "22:30",
    });
    const archived = makeHabit({ archived: true, id: "h3" });

    expect(isHabitScheduledForDate(h1, new Date(2026, 10, 28))).toBe(true);
    expect(isHabitScheduledForDate(archived, new Date(2026, 10, 28))).toBe(false);

    const summary = summarizeHabitDurations([h1, h2], new Set(["h1"]));
    expect(summary.totalMinutes).toBe(120);
    expect(summary.completedMinutes).toBe(30);
    expect(summary.byCategory).toEqual([{ categoryId: "joyto", minutes: 120 }]);
  });
});
