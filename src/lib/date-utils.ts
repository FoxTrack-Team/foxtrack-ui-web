import { format, isBefore, isToday, isTomorrow, isYesterday, startOfDay } from "date-fns";

/**
 * Formats a Unix timestamp (ms) into a human-friendly string.
 */
export function formatFriendlyDate(timestamp: number | null): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (isToday(date)) {
    return "Today";
  }
  if (isTomorrow(date)) {
    return "Tomorrow";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }

  const currentYear = new Date().getFullYear();
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
 * Parses a YYYY-MM-DD string from an HTML date input into a local timezone timestamp.
 * Sets the time to 23:59:59.999 (end of due day).
 */
export function fromHtmlDateValue(dateString: string): number | null {
  if (!dateString) return null;
  const [yearStr, monthStr, dayStr] = dateString.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  const date = new Date(year, month, day, 23, 59, 59, 999);
  return date.getTime();
}
