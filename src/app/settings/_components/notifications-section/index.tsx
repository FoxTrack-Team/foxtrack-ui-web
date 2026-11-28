"use client";

import { useEffect, useState } from "react";

import { IconBell, IconBellRinging, IconCheck } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { Button } from "@/components/ui/button";

import {
  getNotificationPermissionStatus,
  isNotificationsEnabledInPrefs,
  requestNotificationPermission,
  sendTestNotification,
  setNotificationsEnabledInPrefs,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

export function NotificationsSection() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(() => isNotificationsEnabledInPrefs());
  const [permission, setPermission] = useState<"denied" | "granted" | "prompt" | "unsupported">(
    "prompt",
  );
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    let active = true;
    getNotificationPermissionStatus().then((status) => {
      if (active) setPermission(status);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleToggle() {
    const next = !enabled;
    if (next && permission !== "granted") {
      const granted = await requestNotificationPermission();
      setPermission(granted ? "granted" : "denied");
      if (!granted) return;
    }
    setEnabled(next);
    setNotificationsEnabledInPrefs(next);
  }

  async function handleRequestPermission() {
    const granted = await requestNotificationPermission();
    setPermission(granted ? "granted" : "denied");
  }

  async function handleSendTest() {
    if (permission !== "granted") {
      const granted = await requestNotificationPermission();
      setPermission(granted ? "granted" : "denied");
    }
    await sendTestNotification(
      t.settings.notifications.testNotificationTitle,
      t.settings.notifications.testNotificationBody,
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {t.settings.notifications.title}
        </h1>
        <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
          {t.settings.notifications.description}
        </p>
      </div>

      <section className="divide-y divide-neutral-100 rounded-2xl bg-white p-3.5 shadow-2xs dark:divide-neutral-800/60 dark:bg-neutral-900/80">
        {/* Enable Reminders Switch */}
        <div className="flex items-center justify-between gap-3 pb-3.5">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-neutral-800 text-sm sm:text-xs dark:text-neutral-200">
              {t.settings.notifications.enableReminders}
            </p>
            <p className="text-neutral-500 text-xs sm:text-[11px] dark:text-neutral-400">
              {t.settings.notifications.enableRemindersDesc}
            </p>
          </div>
          <button
            aria-checked={enabled}
            aria-label={t.settings.notifications.enableReminders}
            role="switch"
            type="button"
            className={cn(
              "relative inline-flex h-8 w-13 shrink-0 items-center rounded-full p-1 transition-colors",
              enabled ? "bg-orange-500" : "bg-neutral-300 dark:bg-neutral-700",
            )}
            onClick={handleToggle}
          >
            <span
              className={cn(
                "h-6 w-6 rounded-full bg-white shadow-xs transition-transform",
                enabled ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>

        {/* Permission Status */}
        <div className="flex flex-col gap-2.5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs">
            <IconBell
              size={16}
              stroke={2}
              className={cn(
                permission === "granted"
                  ? "text-emerald-500"
                  : permission === "denied"
                    ? "text-rose-500"
                    : "text-amber-500",
              )}
            />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {permission === "granted"
                ? t.settings.notifications.permissionGranted
                : permission === "denied"
                  ? t.settings.notifications.permissionDenied
                  : t.settings.notifications.permissionPrompt}
            </span>
          </div>

          {permission !== "granted" && permission !== "unsupported" && (
            <Button
              className="min-h-11 w-full rounded-xl sm:min-h-9 sm:w-auto sm:rounded-lg"
              size="sm"
              type="button"
              variant="outline"
              onClick={handleRequestPermission}
            >
              {t.settings.notifications.requestPermission}
            </Button>
          )}
        </div>

        {/* Test Notification */}
        <div className="pt-3.5">
          <Button
            className="min-h-11 w-full gap-1.5 rounded-xl"
            size="sm"
            type="button"
            variant="secondary"
            onClick={handleSendTest}
          >
            {testSent ? (
              <>
                <IconCheck className="text-emerald-500" size={16} stroke={2.2} />
                <span>{t.settings.notifications.testNotificationSent}</span>
              </>
            ) : (
              <>
                <IconBellRinging size={16} stroke={2} />
                <span>{t.settings.notifications.testNotification}</span>
              </>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}
