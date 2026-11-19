"use client";

import { useEffect, useState } from "react";

import { IconDownload, IconSparkles, IconX } from "@tabler/icons-react";

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
          // Check if user already dismissed this specific version in this session
          const dismissedVersion = sessionStorage.getItem(DISMISSED_KEY);
          if (dismissedVersion === latestTag) {
            return;
          }

          // Look for an attached .apk file in the assets
          const apkAsset = Array.isArray(data.assets)
            ? data.assets.find((asset: { name?: string }) => asset.name?.endsWith(".apk"))
            : null;

          if (isMounted) {
            setUpdateInfo({
              latestVersion: latestTag,
              releaseUrl: data.html_url || `https://github.com/${GITHUB_REPO}/releases`,
              downloadUrl: apkAsset?.browser_download_url,
              releaseNotes: data.body,
            });
            setIsOpen(true);
          }
        }
      } catch {
        // Silently ignore network or CORS errors (offline-first resilience)
      }
    }

    // Check on startup
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-backdrop-fade-in"
        onClick={handleDismiss}
      />

      {/* Dialog Card */}
      <div
        aria-labelledby="update-dialog-title"
        aria-modal="true"
        className="relative z-50 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-900"
        role="dialog"
      >
        {/* Close Button */}
        <button
          aria-label="Close"
          className="absolute top-4 right-4 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          type="button"
          onClick={handleDismiss}
        >
          <IconX size={16} stroke={2} />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            <IconSparkles size={20} stroke={2} />
          </div>
          <div>
            <h2
              className="font-semibold text-base text-neutral-900 dark:text-neutral-100"
              id="update-dialog-title"
            >
              نسخه جدید در دسترس است
            </h2>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-medium text-orange-600 dark:text-orange-400">
                {updateInfo.latestVersion}
              </span>
              <span>•</span>
              <span>نسخه فعلی: v{currentVersion.replace(/^v/i, "")}</span>
            </div>
          </div>
        </div>

        {/* Message / Description */}
        <p className="mt-3 text-neutral-600 text-xs leading-relaxed dark:text-neutral-300">
          نسخه جدیدتر برنامه فاکس‌ترک منتشر شده است. برای دسترسی به جدیدترین تغییرات و بهبودهای
          عملکردی، می‌توانید آن را دریافت کنید.
        </p>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            className="text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            size="sm"
            type="button"
            variant="ghost"
            onClick={handleDismiss}
          >
            بعداً
          </Button>

          <Button
            className="flex items-center gap-1.5 bg-orange-500 font-medium text-white shadow-xs hover:bg-orange-600 active:scale-[0.98]"
            size="sm"
            type="button"
            onClick={handleDownload}
          >
            <IconDownload size={14} stroke={2.5} />
            <span>دانلود نسخه جدید</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
