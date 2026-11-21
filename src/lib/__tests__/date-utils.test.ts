import { describe, expect, it } from "vitest";

import {
  formatDayHeader,
  formatDayNumber,
  formatFriendlyDate,
  formatShortWeekday,
  fromHtmlDateValue,
  isTaskOverdue,
  toDayInterval,
  toHtmlDateValue,
} from "../date-utils";

describe("date-utils", () => {
  it("formats today correctly", () => {
    const now = Date.now();
    expect(formatFriendlyDate(now)).toBe("Today");
  });

  it("identifies overdue tasks accurately", () => {
    const yesterday = Date.now() - 24 * 60 * 60 * 1000 * 2;
    const tomorrow = Date.now() + 24 * 60 * 60 * 1000 * 2;

    expect(isTaskOverdue(yesterday, false)).toBe(true);
    // Completed tasks are not overdue
    expect(isTaskOverdue(yesterday, true)).toBe(false);
    expect(isTaskOverdue(tomorrow, false)).toBe(false);
    expect(isTaskOverdue(null, false)).toBe(false);
  });

  it("converts between HTML date input strings and timestamps in local timezone", () => {
    const dateStr = "2026-11-25";
    const timestamp = fromHtmlDateValue(dateStr);
    expect(timestamp).not.toBeNull();

    const formattedBack = toHtmlDateValue(timestamp);
    expect(formattedBack).toBe(dateStr);
  });

  it("calculates start and end of day interval accurately", () => {
    const testDate = new Date(2026, 10, 20, 15, 30, 0);
    const interval = toDayInterval(testDate);

    const startDate = new Date(interval.start);
    expect(startDate.getHours()).toBe(0);
    expect(startDate.getMinutes()).toBe(0);
    expect(startDate.getSeconds()).toBe(0);

    const endDate = new Date(interval.end);
    expect(endDate.getHours()).toBe(23);
    expect(endDate.getMinutes()).toBe(59);
    expect(endDate.getSeconds()).toBe(59);
  });

  it("formats day header and weekday symbols", () => {
    const testDate = new Date(2026, 10, 20, 12, 0, 0);
    const enHeader = formatDayHeader(testDate, "en");
    expect(enHeader).toContain("Nov");

    const faHeader = formatDayHeader(testDate, "fa");
    expect(faHeader.length).toBeGreaterThan(0);

    const enWeekday = formatShortWeekday(testDate, "en");
    expect(enWeekday).toBe("Fri");

    const dayNumber = formatDayNumber(testDate, "en");
    expect(dayNumber).toBe("20");
  });
});
