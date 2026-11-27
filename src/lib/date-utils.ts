import { endOfDay, format, isBefore, isToday, isTomorrow, isYesterday, startOfDay } from "date-fns";

/**
 * Formats a Unix timestamp (ms) into a human-friendly string.
 */
export function formatFriendlyDate(timestamp: number | null, lang: string = "en"): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const isFa = lang === "fa";

  if (isToday(date)) {
    return isFa ? "امروز" : "Today";
  }
  if (isTomorrow(date)) {
    return isFa ? "فردا" : "Tomorrow";
  }
  if (isYesterday(date)) {
    return isFa ? "دیروز" : "Yesterday";
  }

  const currentYear = new Date().getFullYear();
  if (isFa) {
    try {
      return new Intl.DateTimeFormat(
        "fa-IR",
        date.getFullYear() === currentYear
          ? { day: "numeric", month: "short" }
          : { day: "numeric", month: "short", year: "numeric" },
      ).format(date);
    } catch {
      /* fallback below */
    }
  }

  if (date.getFullYear() === currentYear) {
    return format(date, "MMM d");
  }

  return format(date, "MMM d, yyyy");
}

/**
 * Checks if a task's due date is in the past (overdue).
 * Completed tasks are not considered overdue.
 */
export function isTaskOverdue(dueDate: number | null, completed: boolean): boolean {
  if (!dueDate || completed) return false;
  const todayStart = startOfDay(new Date());
  const dueDayStart = startOfDay(new Date(dueDate));
  return isBefore(dueDayStart, todayStart);
}

/**
 * Converts a timestamp to YYYY-MM-DD format for HTML date inputs (in local timezone).
 */
export function toHtmlDateValue(timestamp: number | null): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string from an HTML date input into an end-of-day timestamp in local timezone.
 */
export function fromHtmlDateValue(value: string): number | null {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  const date = new Date(year, month, day, 23, 59, 59, 999);
  return date.getTime();
}

/**
 * Returns the start (00:00:00.000) and end (23:59:59.999) timestamps for a date.
 */
export function toDayInterval(date: Date): { end: number; start: number } {
  return {
    end: endOfDay(date).getTime(),
    start: startOfDay(date).getTime(),
  };
}

/**
 * Formats a date for the day header (e.g., "جمعه ۲۹ آبان" or "Friday, Nov 20").
 */
export function formatDayHeader(date: Date, lang: string = "en"): string {
  try {
    if (lang === "fa") {
      return new Intl.DateTimeFormat("fa-IR", {
        day: "numeric",
        month: "long",
        weekday: "long",
      }).format(date);
    }
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      weekday: "long",
    }).format(date);
  } catch {
    return format(date, "EEE, MMM d");
  }
}

/**
 * Formats a short weekday (e.g., "جمعه" or "Fri").
 */
export function formatShortWeekday(date: Date, lang: string = "en"): string {
  try {
    if (lang === "fa") {
      return new Intl.DateTimeFormat("fa-IR", { weekday: "short" }).format(date);
    }
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
  } catch {
    return format(date, "EEE");
  }
}

/**
 * Formats a day number (e.g., "۲۹" or "20").
 */
export function formatDayNumber(date: Date, lang: string = "en"): string {
  try {
    if (lang === "fa") {
      return new Intl.DateTimeFormat("fa-IR", { day: "numeric" }).format(date);
    }
    return new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
  } catch {
    return String(date.getDate());
  }
}

/**
 * Formats month and year matching the Gregorian calendar grid (e.g., "November 2026" or "نوامبر ۲۰۲۶").
 */
export function formatMonthYear(date: Date, lang: string = "en"): string {
  try {
    if (lang === "fa") {
      return new Intl.DateTimeFormat("fa-IR-u-ca-gregory", {
        month: "long",
        year: "numeric",
      }).format(date);
    }
    return format(date, "MMMM yyyy");
  } catch {
    return format(date, "MMMM yyyy");
  }
}
