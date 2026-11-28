"use client";

import { type ChangeEvent, useRef, useState } from "react";

import {
  IconAlertTriangle,
  IconCheck,
  IconDownload,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { Category } from "@/features/categories/types";
import { Habit, HabitLog } from "@/features/habits/types";
import { CoinLog, Reward } from "@/features/rewards/types";
import { Task } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

import { AppSetting, db } from "@/db/database";

export function DataSection() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const habits = useLiveQuery(() => db.habits.toArray(), []) ?? [];
  const categories = useLiveQuery(() => db.categories.toArray(), []) ?? [];
  const totalCount = tasks.length;

  async function handleExport() {
    try {
      const [habits, habitLogs, categories, settings, rewards, coinLogs] = await Promise.all([
        db.habits.toArray(),
        db.habitLogs.toArray(),
        db.categories.toArray(),
        db.settings.toArray(),
        db.rewards.toArray(),
        db.coinLogs.toArray(),
      ]);
      const backup = {
        app: "FoxTrack",
        categories,
        coinLogs,
        exportedAt: new Date().toISOString(),
        habitLogs,
        habits,
        rewards,
        settings,
        tasks,
        version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.7",
      };
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `foxtrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus({ message: t.settings.data.exportSuccess, type: "success" });
    } catch (err) {
      console.error("Export failed", err);
    }
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        const tasksToImport: Task[] = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.tasks)
            ? parsed.tasks
            : [];
        const habitsToImport: Habit[] = Array.isArray(parsed.habits) ? parsed.habits : [];
        const habitLogsToImport: HabitLog[] = Array.isArray(parsed.habitLogs)
          ? parsed.habitLogs
          : [];
        const categoriesToImport: Category[] = Array.isArray(parsed.categories)
          ? parsed.categories
          : [];
        const settingsToImport: AppSetting[] = Array.isArray(parsed.settings)
          ? parsed.settings
          : [];
        const rewardsToImport: Reward[] = Array.isArray(parsed.rewards) ? parsed.rewards : [];
        const coinLogsToImport: CoinLog[] = Array.isArray(parsed.coinLogs) ? parsed.coinLogs : [];

        if (
          tasksToImport.length === 0 &&
          habitsToImport.length === 0 &&
          habitLogsToImport.length === 0 &&
          categoriesToImport.length === 0 &&
          settingsToImport.length === 0 &&
          rewardsToImport.length === 0
        ) {
          setStatus({ message: t.settings.data.importError, type: "error" });
          return;
        }

        const validTasks = tasksToImport.filter((item) => item && typeof item.title === "string");
        const validHabits = habitsToImport.filter((item) => item && typeof item.title === "string");
        const validHabitLogs = habitLogsToImport.filter(
          (item) => item && typeof item.habitId === "string" && typeof item.dateKey === "string",
        );
        const validCategories = categoriesToImport.filter(
          (item) => item && typeof item.id === "string" && typeof item.name === "string",
        );
        const validSettings = settingsToImport.filter(
          (item) => item && typeof item.key === "string" && typeof item.value === "string",
        );
        const validRewards = rewardsToImport.filter(
          (item) => item && typeof item.id === "string" && typeof item.title === "string",
        );
        const validCoinLogs = coinLogsToImport.filter(
          (item) => item && typeof item.id === "string" && typeof item.amount === "number",
        );

        await db.transaction(
          "rw",
          [db.tasks, db.habits, db.habitLogs, db.categories, db.settings, db.rewards, db.coinLogs],
          async () => {
            for (const item of validTasks) {
              await db.tasks.put(item);
            }
            for (const habit of validHabits) {
              await db.habits.put(habit);
            }
            for (const log of validHabitLogs) {
              await db.habitLogs.put(log);
            }
            for (const category of validCategories) {
              await db.categories.put(category);
            }
            for (const setting of validSettings) {
              await db.settings.put(setting);
              if (setting.key === "notificationsEnabled") {
                try {
                  localStorage.setItem("foxtrack-notifications-enabled", setting.value);
                } catch {
                  /* ignore */
                }
              }
            }
            for (const reward of validRewards) {
              await db.rewards.put(reward);
            }
            for (const log of validCoinLogs) {
              await db.coinLogs.put(log);
            }
          },
        );

        setStatus({
          message: t.settings.data.importSuccess.replace(
            "{count}",
            String(validTasks.length + validHabits.length),
          ),
          type: "success",
        });
      } catch (err) {
        console.error("Import failed", err);
        setStatus({ message: t.settings.data.importError, type: "error" });
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  }

  async function handleConfirmReset() {
    try {
      await db.transaction("rw", [db.tasks, db.habits, db.habitLogs], async () => {
        await db.tasks.clear();
        await db.habits.clear();
        await db.habitLogs.clear();
      });
      setIsResetModalOpen(false);
      setStatus({ message: t.settings.data.resetSuccess, type: "success" });
    } catch (err) {
      console.error("Failed to clear database", err);
    }
  }

  return (
    <div className="space-y-4">
      {/* Title & Description directly on canvas */}
      <div>
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {t.settings.data.title}
        </h1>
        <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
          {t.settings.data.description}
        </p>
      </div>

      {/* Real-time stats */}
      <div className="grid grid-cols-3 gap-2 tabular-nums">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-2 py-2.5 text-center shadow-2xs dark:bg-neutral-900/80">
          <span className="font-bold text-base text-neutral-900 dark:text-neutral-100">
            {totalCount}
          </span>
          <span className="mt-0.5 font-medium text-[11px] text-neutral-500 dark:text-neutral-400">
            {t.bottomNav.tasks}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-2 py-2.5 text-center shadow-2xs dark:bg-neutral-900/80">
          <span className="font-bold text-base text-neutral-900 dark:text-neutral-100">
            {habits.length}
          </span>
          <span className="mt-0.5 font-medium text-[11px] text-neutral-500 dark:text-neutral-400">
            {t.habits.title}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-2 py-2.5 text-center shadow-2xs dark:bg-neutral-900/80">
          <span className="font-bold text-base text-neutral-900 dark:text-neutral-100">
            {categories.length}
          </span>
          <span className="mt-0.5 font-medium text-[11px] text-neutral-500 dark:text-neutral-400">
            {t.categories.title}
          </span>
        </div>
      </div>

      {/* Feedback message (success or inline error replacing native alert) */}
      {status && (
        <div
          role={status.type === "error" ? "alert" : "status"}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs",
            status.type === "error"
              ? "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
              : "bg-orange-50 text-orange-800 dark:bg-orange-950/30 dark:text-orange-300",
          )}
        >
          {status.type === "error" ? (
            <IconAlertTriangle className="shrink-0" size={15} stroke={2} />
          ) : (
            <IconCheck className="shrink-0" size={15} stroke={2} />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Backup & Restore Card */}
      <section className="rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-neutral-900/80">
        <div className="space-y-3.5">
          {/* Export */}
          <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-neutral-800 text-sm sm:text-xs dark:text-neutral-200">
                {t.settings.data.exportBackup}
              </p>
              <p className="text-neutral-500 text-xs sm:text-[11px] dark:text-neutral-400">
                {t.settings.data.exportBackupDesc}
              </p>
            </div>
            <Button
              className="min-h-11 w-full gap-1.5 rounded-xl sm:min-h-9 sm:w-auto sm:rounded-lg"
              size="sm"
              type="button"
              variant="outline"
              onClick={handleExport}
            >
              <IconDownload size={15} stroke={2} />
              <span>{t.settings.data.exportBackup}</span>
            </Button>
          </div>

          {/* Import */}
          <div className="flex flex-col items-stretch justify-between gap-2.5 border-neutral-100 border-t pt-3.5 sm:flex-row sm:items-center sm:gap-3 dark:border-neutral-800/40">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-neutral-800 text-sm sm:text-xs dark:text-neutral-200">
                {t.settings.data.importBackup}
              </p>
              <p className="text-neutral-500 text-xs sm:text-[11px] dark:text-neutral-400">
                {t.settings.data.importBackupDesc}
              </p>
            </div>
            <Button
              className="min-h-11 w-full gap-1.5 rounded-xl sm:min-h-9 sm:w-auto sm:rounded-lg"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <IconUpload size={15} stroke={2} />
              <span>{t.settings.data.importBackup}</span>
            </Button>
            <input
              accept=".json,application/json"
              className="hidden"
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </section>

      {/* Danger Zone Card */}
      <section className="rounded-2xl bg-red-50/45 p-3.5 shadow-2xs ring-1 ring-red-500/15 dark:bg-red-950/15 dark:ring-red-500/20">
        <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-red-600 text-sm sm:text-xs dark:text-red-400">
              {t.settings.data.resetData}
            </p>
            <p className="text-neutral-500 text-xs sm:text-[11px] dark:text-neutral-400">
              {t.settings.data.resetDataDesc}
            </p>
          </div>
          <Button
            className="min-h-11 w-full gap-1.5 rounded-xl bg-white text-red-600 shadow-2xs ring-1 ring-red-500/20 hover:bg-red-50 hover:text-red-700 sm:min-h-9 sm:w-auto sm:rounded-lg dark:bg-red-950/30 dark:text-red-400 dark:ring-red-500/25 dark:hover:bg-red-950/60"
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => setIsResetModalOpen(true)}
          >
            <IconTrash size={15} stroke={1.75} />
            <span>{t.settings.data.resetData}</span>
          </Button>
        </div>
      </section>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        maxWidth="sm"
        title={t.settings.data.resetConfirmTitle}
        onClose={() => setIsResetModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <IconAlertTriangle size={20} stroke={2} />
            </div>
            <p className="text-neutral-600 text-xs leading-relaxed dark:text-neutral-300">
              {t.settings.data.resetConfirmDesc}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              className="min-h-11 w-full rounded-xl bg-neutral-200/70 text-neutral-700 hover:bg-neutral-200 sm:min-h-9 sm:w-auto dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => setIsResetModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              className="min-h-11 w-full rounded-xl bg-red-600 text-white hover:bg-red-700 sm:min-h-9 sm:w-auto dark:bg-red-600 dark:hover:bg-red-700"
              size="sm"
              type="button"
              onClick={handleConfirmReset}
            >
              {t.settings.data.resetConfirmButton}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
