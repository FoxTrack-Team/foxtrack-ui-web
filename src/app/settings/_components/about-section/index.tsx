"use client";

import { useState } from "react";

import {
  IconBrandGithub,
  IconCheck,
  IconDeviceMobile,
  IconExternalLink,
  IconInfoCircle,
  IconRefresh,
  IconSparkles,
  IconWorld,
} from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { Button } from "@/components/ui/button";

import { isNewerVersion } from "@/lib/version-utils";

const GITHUB_REPO = "FoxTrack-Team/foxtrack-ui-web";

export function AboutSection() {
  const { t } = useTranslation();
  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.5";
  const [isChecking, setIsChecking] = useState(false);
  const [updateResult, setUpdateResult] = useState<{
    latestTag: string;
    newer: boolean;
    releaseUrl: string;
  } | null>(null);

  async function handleCheckForUpdates() {
    setIsChecking(true);
    setUpdateResult(null);

    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      if (response.ok) {
        const data = await response.json();
        const latestTag = data.tag_name || data.name || "";
        const newer = isNewerVersion(latestTag, currentVersion);
        setUpdateResult({
          latestTag,
          newer,
          releaseUrl: data.html_url || `https://github.com/${GITHUB_REPO}/releases`,
        });
      }
    } catch {
      /* ignore */
    } finally {
      setIsChecking(false);
    }
  }

  const isAndroid =
    typeof window !== "undefined" &&
    (
      window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }
    ).Capacitor?.isNativePlatform?.();

  const formattedVersion = `v${currentVersion.replace(/^v/i, "")}`;
  const platformLabel = isAndroid ? t.about.platformAndroid : t.about.platformWeb;
  const PlatformIcon = isAndroid ? IconDeviceMobile : IconWorld;

  return (
    <div className="space-y-4">
      {/* Title & Description directly on canvas */}
      <div>
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {t.about.title}
        </h1>
        <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">
          {t.about.description}
        </p>
      </div>

      {/* App Identity & Update Check Card */}
      <section className="rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20 dark:bg-orange-500/15 dark:ring-orange-500/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="FoxTrack Logo"
                className="h-6 w-6 select-none"
                height={24}
                src="/favicon.svg"
                width={24}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 text-sm tracking-tight dark:text-neutral-100">
                  Fox<span className="text-orange-500">Track</span>
                </span>
                <span className="rounded-md bg-orange-50 px-1.5 py-0.5 font-mono font-medium text-[10px] text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  {formattedVersion}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                {platformLabel}
              </p>
            </div>
          </div>

          <Button
            className="w-full gap-1.5 rounded-lg sm:w-auto"
            disabled={isChecking}
            size="sm"
            type="button"
            variant="outline"
            onClick={handleCheckForUpdates}
          >
            <IconRefresh className={isChecking ? "animate-spin" : ""} size={14} stroke={2} />
            <span>{isChecking ? t.about.checking : t.about.checkForUpdates}</span>
          </Button>
        </div>

        {updateResult && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-neutral-100 border-t pt-2.5 text-xs dark:border-neutral-800/60">
            {updateResult.newer ? (
              <>
                <span className="inline-flex items-center gap-1.5 font-medium text-[11px] text-orange-600 dark:text-orange-400">
                  <IconSparkles size={13} stroke={2} />
                  <span>
                    {t.about.updateAvailable}: {updateResult.latestTag}
                  </span>
                </span>
                <Button asChild className="rounded-lg" size="sm" variant="default">
                  <a href={updateResult.releaseUrl} rel="noopener noreferrer" target="_blank">
                    {t.update.downloadButton}
                  </a>
                </Button>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                <IconCheck size={13} stroke={2.5} />
                <span>{t.about.upToDate}</span>
              </span>
            )}
          </div>
        )}
      </section>

      {/* Grouped App Info & Links Card */}
      <section className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-2xs dark:divide-neutral-800/60 dark:border-neutral-800/80 dark:bg-neutral-900/60">
        {/* Version */}
        <div className="flex items-center justify-between px-3.5 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/15 dark:bg-orange-500/20 dark:text-orange-400">
              <IconInfoCircle size={15} stroke={1.8} />
            </div>
            <span className="font-medium text-neutral-700 text-xs dark:text-neutral-300">
              {t.about.version}
            </span>
          </div>
          <span className="font-mono font-medium text-neutral-600 text-xs dark:text-neutral-300">
            {formattedVersion}
          </span>
        </div>

        {/* Platform */}
        <div className="flex items-center justify-between px-3.5 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/15 dark:bg-blue-500/20 dark:text-blue-400">
              <PlatformIcon size={15} stroke={1.8} />
            </div>
            <span className="font-medium text-neutral-700 text-xs dark:text-neutral-300">
              {t.about.platform}
            </span>
          </div>
          <span className="font-medium text-neutral-600 text-xs dark:text-neutral-300">
            {platformLabel}
          </span>
        </div>

        {/* GitHub Repository */}
        <a
          className="group flex items-center justify-between px-3.5 py-2.5 transition-colors hover:bg-neutral-50/80 active:bg-neutral-100/80 dark:hover:bg-neutral-800/30 dark:active:bg-neutral-800/60"
          href={`https://github.com/${GITHUB_REPO}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700/60">
              <IconBrandGithub size={15} stroke={1.8} />
            </div>
            <span className="font-medium text-neutral-700 text-xs dark:text-neutral-300">
              {t.about.githubRepo}
            </span>
          </div>
          <span className="flex items-center gap-1 font-medium text-orange-600 text-xs dark:text-orange-400">
            <span>GitHub</span>
            <IconExternalLink size={13} stroke={2} />
          </span>
        </a>
      </section>
    </div>
  );
}
