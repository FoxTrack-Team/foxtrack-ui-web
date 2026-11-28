import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

import type { Habit } from "@/features/habits/types";
import type { Task } from "@/features/tasks/types";

import { db } from "@/db/database";

export const REMINDER_CHANNEL_ID = "foxtrack_reminders";
export const CUSTOM_NOTIFICATION_SOUND = "foxtrack_chime.wav";
const STORAGE_NOTIFICATIONS_ENABLED_KEY = "foxtrack-notifications-enabled";

export function isNotificationsEnabledInPrefs(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(STORAGE_NOTIFICATIONS_ENABLED_KEY);
    return raw !== "false";
  } catch {
    return true;
  }
}

export function setNotificationsEnabledInPrefs(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_NOTIFICATIONS_ENABLED_KEY, String(enabled));
  } catch {
    /* ignore */
  }
  db.settings.put({ key: "notificationsEnabled", value: String(enabled) }).catch(() => {});
}

/** Converts a UUID/string entity ID into a stable positive 31-bit integer for Android. */
export function toNotificationId(entityId: string): number {
  let hash = 0;
  for (let i = 0; i < entityId.length; i++) {
    hash = (hash * 31 + entityId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

export async function ensureNotificationChannel(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.createChannel({
      description: "Task and habit reminders with FoxTrack chime",
      id: REMINDER_CHANNEL_ID,
      importance: 4,
      name: "Reminders",
      sound: CUSTOM_NOTIFICATION_SOUND,
      vibration: true,
    });
  } catch (err) {
    console.warn("Failed to create notification channel", err);
  }
}

export async function getNotificationPermissionStatus(): Promise<
  "denied" | "granted" | "prompt" | "unsupported"
> {
  if (Capacitor.isNativePlatform()) {
    try {
      const { display } = await LocalNotifications.checkPermissions();
      if (display === "granted") return "granted";
      if (display === "denied") return "denied";
      return "prompt";
    } catch {
      return "unsupported";
    }
  }
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    return "prompt";
  }
  return "unsupported";
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      await ensureNotificationChannel();
      const { display } = await LocalNotifications.requestPermissions();
      return display === "granted";
    } catch {
      return false;
    }
  }
  if (typeof window !== "undefined" && "Notification" in window) {
    const result = await Notification.requestPermission();
    return result === "granted";
  }
  return false;
}

function buildTaskReminderDate(dueDate: number, dueTime: string): Date | null {
  const match = /^(\d{2}):(\d{2})$/.exec(dueTime.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const base = new Date(dueDate);
  const target = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    hours,
    minutes,
    0,
    0,
  );
  return target.getTime() > Date.now() ? target : null;
}

export async function scheduleTaskReminder(
  task: Pick<
    Task,
    "completed" | "dueDate" | "dueTime" | "id" | "reminderEnabled" | "reminderTime" | "title"
  >,
): Promise<void> {
  if (!Capacitor.isNativePlatform() || !isNotificationsEnabledInPrefs()) return;
  const effectiveTime = task.reminderTime || task.dueTime;
  if (task.reminderEnabled === false || task.completed || !task.dueDate || !effectiveTime) {
    await cancelTaskReminder(task.id);
    return;
  }

  const at = buildTaskReminderDate(task.dueDate, effectiveTime);
  if (!at) {
    await cancelTaskReminder(task.id);
    return;
  }

  try {
    await ensureNotificationChannel();
    const id = toNotificationId(`task:${task.id}`);
    await LocalNotifications.cancel({ notifications: [{ id }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          body: effectiveTime,
          channelId: REMINDER_CHANNEL_ID,
          id,
          schedule: { allowWhileIdle: true, at },
          sound: CUSTOM_NOTIFICATION_SOUND,
          title: task.title,
        },
      ],
    });
  } catch (err) {
    console.warn("Failed to schedule task reminder", err);
  }
}

export async function cancelTaskReminder(taskId: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: toNotificationId(`task:${taskId}`) }],
    });
  } catch {
    /* ignore */
  }
}

export async function scheduleHabitReminder(
  habit: Pick<Habit, "id" | "reminderEnabled" | "reminderTime" | "startTime" | "title">,
): Promise<void> {
  if (!Capacitor.isNativePlatform() || !isNotificationsEnabledInPrefs()) return;
  if (habit.reminderEnabled === false) {
    await cancelHabitReminder(habit.id);
    return;
  }
  const effectiveTime = habit.reminderTime || habit.startTime;
  const match = /^(\d{2}):(\d{2})$/.exec(effectiveTime?.trim() ?? "");
  if (!match) {
    await cancelHabitReminder(habit.id);
    return;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  try {
    await ensureNotificationChannel();
    const id = toNotificationId(`habit:${habit.id}`);
    await LocalNotifications.cancel({ notifications: [{ id }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          body: effectiveTime ?? "",
          channelId: REMINDER_CHANNEL_ID,
          id,
          schedule: { allowWhileIdle: true, every: "day", on: { hour, minute } },
          sound: CUSTOM_NOTIFICATION_SOUND,
          title: habit.title,
        },
      ],
    });
  } catch (err) {
    console.warn("Failed to schedule habit reminder", err);
  }
}

export async function cancelHabitReminder(habitId: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: toNotificationId(`habit:${habitId}`) }],
    });
  } catch {
    /* ignore */
  }
}

export async function sendTestNotification(title: string, body: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await ensureNotificationChannel();
    await LocalNotifications.schedule({
      notifications: [
        {
          body,
          channelId: REMINDER_CHANNEL_ID,
          id: toNotificationId(`test:${Date.now()}`),
          schedule: { at: new Date(Date.now() + 1000) },
          sound: CUSTOM_NOTIFICATION_SOUND,
          title,
        },
      ],
    });
    return;
  }

  if (typeof window !== "undefined") {
    try {
      const audio = new Audio(`/sounds/${CUSTOM_NOTIFICATION_SOUND}`);
      await audio.play().catch(() => {});
    } catch {
      /* ignore */
    }
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }
}
