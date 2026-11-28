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

import { Habit, HabitLog } from "@/features/habits/types";
import { Task } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

import { db } from "@/db/database";

export function DataSection() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const totalCount = tasks.length;
  const activeCount = tasks.filter((item) => !item.completed).length;
  const completedCount = tasks.filter((item) => item.completed).length;

  async function handleExport() {
    try {
      const [habits, habitLogs] = await Promise.all([db.habits.toArray(), db.habitLogs.toArray()]);
      const backup = {
        app: "FoxTrack",
        exportedAt: new Date().toISOString(),
        habitLogs,
        habits,
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

        if (
          tasksToImport.length === 0 &&
          habitsToImport.length === 0 &&
          habitLogsToImport.length === 0
        ) {
          setStatus({ message: t.settings.data.importError, type: "error" });
          return;
        }

        const validTasks = tasksToImport.filter((item) => item && typeof item.title === "string");
        const validHabits = habitsToImport.filter((item) => item && typeof item.title === "string");
        const validHabitLogs = habitLogsToImport.filter(
          (item) => item && typeof item.habitId === "string" && typeof item.dateKey === "string",
        );

        await db.transaction("rw", [db.tasks, db.habits, db.habitLogs], async () => {
          for (const item of validTasks) {
            await db.tasks.put(item);
          }
          for (const habit of validHabits) {
            await db.habits.put(habit);
          }
          for (const log of validHabitLogs) {
            await db.habitLogs.put(log);
          }
        });

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
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
            {t.settings.data.title}
          </h1>
          <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
            {t.settings.data.description}
          </p>
        </div>

        <span className="shrink-0 rounded-md bg-neutral-100/90 px-2 py-0.5 font-medium text-[11px] text-neutral-500 tabular-nums dark:bg-neutral-800/90 dark:text-neutral-400">
          {totalCount} {totalCount === 1 ? t.dashboard.taskSingular : t.dashboard.tasksCount}
        </span>
      </div>

      {/* Real-time stats */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-neutral-100/70 p-3 text-xs tabular-nums dark:bg-neutral-800/40">
        <span className="font-medium text-neutral-600 text-xs dark:text-neutral-300">
          {t.settings.data.statsTotal}:
        </span>
        <span className="rounded-md bg-white px-2 py-0.5 font-semibold text-neutral-900 text-xs shadow-2xs dark:bg-neutral-700 dark:text-neutral-100">
          {totalCount}
        </span>
        <span className="text-neutral-300 dark:text-neutral-700">•</span>
        <span className="text-neutral-600 dark:text-neutral-400">
          {activeCount} {t.settings.data.statsActive}
        </span>
        <span className="text-neutral-300 dark:text-neutral-700">•</span>
        <span className="text-neutral-600 dark:text-neutral-400">
          {completedCount} {t.settings.data.statsCompleted}
        </span>
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
              className="min-h-10 w-full gap-1.5 rounded-xl sm:min-h-9 sm:w-auto sm:rounded-lg"
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
              className="min-h-10 w-full gap-1.5 rounded-xl sm:min-h-9 sm:w-auto sm:rounded-lg"
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
      <section className="rounded-xl border border-red-200/70 bg-red-50/40 p-3.5 shadow-2xs dark:border-red-900/40 dark:bg-red-950/15">
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
            className="min-h-10 w-full gap-1.5 rounded-xl border border-red-200/90 bg-white text-red-600 shadow-2xs hover:bg-red-50 hover:text-red-700 sm:min-h-9 sm:w-auto sm:rounded-lg dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
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
              className="h-10 w-full rounded-xl sm:h-9 sm:w-auto"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setIsResetModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              className="h-10 w-full rounded-xl bg-red-600 text-white hover:bg-red-700 sm:h-9 sm:w-auto dark:bg-red-600 dark:hover:bg-red-700"
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
