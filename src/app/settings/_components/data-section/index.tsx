"use client";

import { type ChangeEvent, useRef, useState } from "react";

import {
  IconAlertTriangle,
  IconCheck,
  IconDatabase,
  IconDownload,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { Task } from "@/features/tasks/types";

import { db } from "@/db/database";

export function DataSection() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const totalCount = tasks.length;
  const activeCount = tasks.filter((item) => !item.completed).length;
  const completedCount = tasks.filter((item) => item.completed).length;

  function handleExport() {
    try {
      const backup = {
        app: "FoxTrack",
        exportedAt: new Date().toISOString(),
        tasks,
        version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.5",
      };
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `foxtrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage(t.settings.data.exportSuccess);
    } catch {
      /* ignore */
    }
  }

  async function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming: Task[] = Array.isArray(parsed) ? parsed : parsed.tasks;

      if (!Array.isArray(incoming) || incoming.length === 0) {
        throw new Error("Invalid structure");
      }

      await db.tasks.bulkPut(incoming);
      setStatusMessage(t.settings.data.importSuccess);
    } catch {
      setStatusMessage(t.settings.data.importError);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleConfirmReset() {
    try {
      await db.tasks.clear();
      setIsResetModalOpen(false);
      setStatusMessage(t.settings.data.resetSuccess);
    } catch (err) {
      console.error("Failed to clear database", err);
    }
  }

  return (
    <>
      <section className="rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/60">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            <IconDatabase size={15} stroke={2} />
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900 text-xs dark:text-neutral-100">
              {t.settings.data.title}
            </h2>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
              {t.settings.data.description}
            </p>
          </div>
        </div>

        {/* Real-time stats */}
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-neutral-50 p-2.5 text-xs dark:bg-neutral-800/40">
          <span className="font-medium text-neutral-600 text-xs dark:text-neutral-300">
            {t.settings.data.statsTotal}:
          </span>
          <span className="rounded-md bg-white px-2 py-0.5 font-semibold text-neutral-900 text-xs shadow-2xs dark:bg-neutral-700 dark:text-neutral-100">
            {totalCount}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {activeCount} {t.settings.data.statsActive}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {completedCount} {t.settings.data.statsCompleted}
          </span>
        </div>

        {/* Feedback message */}
        {statusMessage && (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-orange-800 text-xs dark:bg-orange-950/30 dark:text-orange-300">
            <IconCheck size={14} stroke={2} />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-3 space-y-2 border-neutral-100 border-t pt-3 dark:border-neutral-800/60">
          {/* Export */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-neutral-800 text-xs dark:text-neutral-200">
                {t.settings.data.exportBackup}
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {t.settings.data.exportBackupDesc}
              </p>
            </div>
            <Button
              className="gap-1.5"
              size="sm"
              type="button"
              variant="outline"
              onClick={handleExport}
            >
              <IconDownload size={14} stroke={2} />
              <span>{t.settings.data.exportBackup}</span>
            </Button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between gap-3 border-neutral-50 border-t pt-2 dark:border-neutral-800/40">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-neutral-800 text-xs dark:text-neutral-200">
                {t.settings.data.importBackup}
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {t.settings.data.importBackupDesc}
              </p>
            </div>
            <Button
              className="gap-1.5"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <IconUpload size={14} stroke={2} />
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

          {/* Reset / Danger Zone */}
          <div className="flex items-center justify-between gap-3 border-neutral-50 border-t pt-2 dark:border-neutral-800/40">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-red-600 text-xs dark:text-red-400">
                {t.settings.data.resetData}
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {t.settings.data.resetDataDesc}
              </p>
            </div>
            <Button
              className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => setIsResetModalOpen(true)}
            >
              <IconTrash size={14} stroke={1.75} />
              <span>{t.settings.data.resetData}</span>
            </Button>
          </div>
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

          <div className="flex items-center justify-end gap-2 border-neutral-100 border-t pt-3 dark:border-neutral-800/80">
            <Button
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => setIsResetModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              size="sm"
              type="button"
              onClick={handleConfirmReset}
            >
              {t.settings.data.resetConfirmButton}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
