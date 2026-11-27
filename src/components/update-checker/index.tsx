"use client";

import { useEffect, useState } from "react";

import { IconDownload, IconSparkles } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { isNewerVersion } from "@/lib/version-utils";

interface UpdateInfo {
  downloadUrl?: string;
  latestVersion: string;
  releaseNotes?: string;
  releaseUrl: string;
}

const GITHUB_REPO = "FoxTrack-Team/foxtrack-ui-web";
const DISMISSED_KEY = "foxtrack_dismissed_update_version";

export function UpdateChecker() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

  useEffect(() => {
    let isMounted = true;

    async function checkForUpdates() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) return;

        const data = await response.json();
        const latestTag = data.tag_name || data.name;
        if (!latestTag) return;

        if (isNewerVersion(latestTag, currentVersion)) {
          const dismissedVersion = sessionStorage.getItem(DISMISSED_KEY);
          if (dismissedVersion === latestTag) {
            return;
          }

          const apkAsset = Array.isArray(data.assets)
            ? data.assets.find((asset: { name?: string }) => asset.name?.endsWith(".apk"))
            : null;

          if (isMounted) {
            setUpdateInfo({
              downloadUrl: apkAsset?.browser_download_url,
              latestVersion: latestTag,
              releaseNotes: data.body,
              releaseUrl: data.html_url || `https://github.com/${GITHUB_REPO}/releases`,
            });
            setIsOpen(true);
          }
        }
      } catch {
        // Silently ignore network or CORS errors
      }
    }

    checkForUpdates();

    return () => {
      isMounted = false;
    };
  }, [currentVersion]);

  function handleDismiss() {
    if (updateInfo) {
      sessionStorage.setItem(DISMISSED_KEY, updateInfo.latestVersion);
    }
    setIsOpen(false);
  }

  function handleDownload() {
    if (!updateInfo) return;
    const targetUrl = updateInfo.downloadUrl || updateInfo.releaseUrl;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    handleDismiss();
  }

  if (!isOpen || !updateInfo) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      maxWidth="sm"
      showCloseButton={false}
      showHandle={false}
      onClose={handleDismiss}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
          <IconSparkles size={20} stroke={2} />
        </div>
        <div>
          <h2
            className="font-semibold text-base text-neutral-900 dark:text-neutral-100"
            id="update-dialog-title"
          >
            {t.update.dialogTitle}
          </h2>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium text-orange-600 dark:text-orange-400">
              {updateInfo.latestVersion}
            </span>
            <span>•</span>
            <span>
              {t.update.currentVersion}: v{currentVersion.replace(/^v/i, "")}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-neutral-600 text-xs leading-relaxed dark:text-neutral-300">
        {t.update.message}
      </p>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Button
          className="h-10 w-full rounded-full text-neutral-600 hover:bg-neutral-100 sm:h-9 sm:w-auto dark:text-neutral-400 dark:hover:bg-neutral-800"
          size="sm"
          type="button"
          variant="ghost"
          onClick={handleDismiss}
        >
          {t.update.laterButton}
        </Button>

        <Button
          className="flex h-10 w-full items-center gap-1.5 rounded-full bg-orange-500 font-medium text-white shadow-xs hover:bg-orange-600 active:scale-[0.98] sm:h-9 sm:w-auto"
          size="sm"
          type="button"
          onClick={handleDownload}
        >
          <IconDownload size={14} stroke={2.5} />
          <span>{t.update.downloadButton}</span>
        </Button>
      </div>
    </Modal>
  );
}
