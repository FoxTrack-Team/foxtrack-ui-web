import { describe, expect, it } from "vitest";

import {
  formatFriendlyDate,
  fromHtmlDateValue,
  isTaskOverdue,
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
});
