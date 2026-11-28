import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import type { SupportedLanguage } from "@/lib/i18n";

export type CalendarType = "gregorian" | "jalali";
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const JALALI_MONTHS_FA = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

const JALALI_MONTHS_EN = [
  "Farvardin",
  "Ordibehesht",
  "Khordad",
  "Tir",
  "Mordad",
  "Shahrivar",
  "Mehr",
  "Aban",
  "Azar",
  "Dey",
  "Bahman",
  "Esfand",
] as const;

const WEEKDAYS_SHORT_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const WEEKDAYS_SHORT_FA = ["ی", "د", "س", "چ", "پ", "ج", "ش"] as const;

function div(a: number, b: number): number {
  return Math.trunc(a / b);
}

/** Converts a Gregorian Date to Jalali (1-based month & day). */
export function toJalali(date: Date): { day: number; month: number; year: number } {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) +
    gd +
    gdm[gm - 1];

  let jy = -1595 + 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }

  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);

  return { day: jd, month: jm, year: jy };
}

/** Converts a Jalali date (1-based month & day) to a local Gregorian Date. */
export function jalaliToGregorian(jy: number, jm: number, jd: number): Date {
  const jy1 = jy + 1595;
  let days =
    -355668 +
    365 * jy1 +
    div(jy1, 33) * 8 +
    div((jy1 % 33) + 3, 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  let gy = 400 * div(days, 146097);
  days %= 146097;
  if (days > 36524) {
    days--;
    gy += 100 * div(days, 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    gy += div(days - 1, 365);
    days = (days - 1) % 365;
  }

  let gd = days + 1;
  const salA = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  for (gm = 0; gm < 13 && gd > salA[gm]; gm++) {
    gd -= salA[gm];
  }

  return new Date(gy, gm - 1, gd);
}

export function isJalaliLeapYear(jy: number): boolean {
  const breaks = [1, 5, 9, 13, 17, 22, 26, 30];
  const mod = jy > 0 ? (jy - 474) % 128 : ((jy - 474) % 128) + 128;
  const mod33 = mod % 33;
  return breaks.includes(mod33);
}

export function getJalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
}

/** Returns 0-based monthIndex (0..11) and 1-based day/year in the active calendar. */
export function getCalendarParts(
  date: Date,
  calendarType: CalendarType,
): { day: number; monthIndex: number; year: number } {
  if (calendarType === "jalali") {
    const j = toJalali(date);
    return { day: j.day, monthIndex: j.month - 1, year: j.year };
  }
  return { day: date.getDate(), monthIndex: date.getMonth(), year: date.getFullYear() };
}

export function buildCalendarDate(
  year: number,
  monthIndex: number,
  day: number,
  calendarType: CalendarType,
): Date {
  if (calendarType === "jalali") {
    const maxDay = getJalaliMonthLength(year, monthIndex + 1);
    return jalaliToGregorian(year, monthIndex + 1, Math.min(day, maxDay));
  }
  const maxDay = new Date(year, monthIndex + 1, 0).getDate();
  return new Date(year, monthIndex, Math.min(day, maxDay));
}

export function addCalendarMonths(date: Date, amount: number, calendarType: CalendarType): Date {
  if (calendarType === "gregorian") {
    return addMonths(date, amount);
  }
  const { year, monthIndex, day } = getCalendarParts(date, "jalali");
  const totalMonths = year * 12 + monthIndex + amount;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonthIndex = ((totalMonths % 12) + 12) % 12;
  return buildCalendarDate(targetYear, targetMonthIndex, day, "jalali");
}

export function addCalendarYears(date: Date, amount: number, calendarType: CalendarType): Date {
  if (calendarType === "gregorian") {
    return addYears(date, amount);
  }
  const { year, monthIndex, day } = getCalendarParts(date, "jalali");
  return buildCalendarDate(year + amount, monthIndex, day, "jalali");
}

export function setCalendarMonthIndex(
  date: Date,
  monthIndex: number,
  calendarType: CalendarType,
): Date {
  const { year, day } = getCalendarParts(date, calendarType);
  return buildCalendarDate(year, monthIndex, day, calendarType);
}

export function getOrderedWeekdays(
  weekStartsOn: WeekdayIndex,
  language: SupportedLanguage,
): Array<{ index: WeekdayIndex; shortLabel: string }> {
  const labels = language === "fa" ? WEEKDAYS_SHORT_FA : WEEKDAYS_SHORT_EN;
  return Array.from({ length: 7 }, (_, offset) => {
    const index = ((weekStartsOn + offset) % 7) as WeekdayIndex;
    return { index, shortLabel: labels[index] };
  });
}

export function getCalendarMonthNames(
  calendarType: CalendarType,
  language: SupportedLanguage,
): string[] {
  if (calendarType === "jalali") {
    return [...(language === "fa" ? JALALI_MONTHS_FA : JALALI_MONTHS_EN)];
  }
  return Array.from({ length: 12 }, (_, idx) =>
    new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-US", { month: "short" }).format(
      new Date(2026, idx, 1),
    ),
  );
}

export function formatCalendarMonthYear(
  date: Date,
  calendarType: CalendarType,
  language: SupportedLanguage,
): string {
  if (calendarType === "jalali") {
    const { year, monthIndex } = getCalendarParts(date, "jalali");
    const monthName = (language === "fa" ? JALALI_MONTHS_FA : JALALI_MONTHS_EN)[monthIndex];
    const yearStr =
      language === "fa" ? year.toLocaleString("fa-IR", { useGrouping: false }) : String(year);
    return `${monthName} ${yearStr}`;
  }
  return new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatCalendarDayNumber(day: number, language: SupportedLanguage): string {
  return language === "fa" ? day.toLocaleString("fa-IR", { useGrouping: false }) : String(day);
}

export interface CalendarGridCell {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  key: string;
}

export function getCalendarDaysGrid(
  currentMonthDate: Date,
  calendarType: CalendarType,
  weekStartsOn: WeekdayIndex,
): CalendarGridCell[] {
  if (calendarType === "gregorian") {
    const monthStart = startOfMonth(currentMonthDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });
    return eachDayOfInterval({ end: calendarEnd, start: calendarStart }).map((day) => ({
      date: day,
      dayNumber: day.getDate(),
      isCurrentMonth: isSameMonth(day, currentMonthDate),
      key: day.toISOString(),
    }));
  }

  const { year, monthIndex } = getCalendarParts(currentMonthDate, "jalali");
  const monthLength = getJalaliMonthLength(year, monthIndex + 1);
  const firstDay = jalaliToGregorian(year, monthIndex + 1, 1);
  const leadingEmpty = (firstDay.getDay() - weekStartsOn + 7) % 7;

  const cells: CalendarGridCell[] = [];
  for (let i = 0; i < leadingEmpty; i++) {
    cells.push({
      date: firstDay,
      dayNumber: 0,
      isCurrentMonth: false,
      key: `empty-start-${i}`,
    });
  }

  for (let d = 1; d <= monthLength; d++) {
    const gDate = jalaliToGregorian(year, monthIndex + 1, d);
    cells.push({
      date: gDate,
      dayNumber: d,
      isCurrentMonth: true,
      key: `${year}-${monthIndex + 1}-${d}`,
    });
  }

  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const trailingEmpty = 7 - remainder;
    for (let i = 0; i < trailingEmpty; i++) {
      cells.push({
        date: firstDay,
        dayNumber: 0,
        isCurrentMonth: false,
        key: `empty-end-${i}`,
      });
    }
  }

  return cells;
}
