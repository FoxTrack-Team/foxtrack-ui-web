import { describe, expect, it } from "vitest";

import {
  formatCalendarMonthYear,
  getCalendarDaysGrid,
  getOrderedWeekdays,
  jalaliToGregorian,
  toJalali,
} from "../calendar-utils";

describe("calendar-utils", () => {
  it("converts Gregorian to Jalali and back accurately", () => {
    const gDate = new Date(2026, 2, 21); // 2026-03-21 = 1405-01-01 (Nowruz)
    const j = toJalali(gDate);
    expect(j).toEqual({ day: 1, month: 1, year: 1405 });

    const back = jalaliToGregorian(j.year, j.month, j.day);
    expect(back.getFullYear()).toBe(2026);
    expect(back.getMonth()).toBe(2);
    expect(back.getDate()).toBe(21);
  });

  it("orders weekdays starting from weekStartsOn", () => {
    const satStart = getOrderedWeekdays(6, "en");
    expect(satStart[0]).toEqual({ index: 6, shortLabel: "Sat".slice(0, 2) });
    expect(satStart[6]).toEqual({ index: 5, shortLabel: "Fr" });
  });

  it("builds Jalali month grid with correct number of days", () => {
    const farvardin = new Date(2026, 2, 21); // 1 Farvardin 1405 (31 days)
    const cells = getCalendarDaysGrid(farvardin, "jalali", 6);
    const activeDays = cells.filter((c) => c.isCurrentMonth);
    expect(activeDays).toHaveLength(31);
    expect(activeDays[0].dayNumber).toBe(1);
    expect(activeDays[30].dayNumber).toBe(31);
  });

  it("formats Jalali month and year in Persian and English", () => {
    const farvardin = new Date(2026, 2, 21);
    expect(formatCalendarMonthYear(farvardin, "jalali", "en")).toBe("Farvardin 1405");
    expect(formatCalendarMonthYear(farvardin, "jalali", "fa")).toContain("فروردین");
  });
});
