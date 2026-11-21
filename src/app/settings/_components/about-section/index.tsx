"use client";

import { useState } from "react";

import {
  IconBrandGithub,
  IconCheck,
  IconExternalLink,
  IconRefresh,
  IconSparkles,
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

  return (
    <div className="space-y-4">
      {/* Title & Description directly on canvas */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
            {t.about.title}
          </h1>
          <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            {t.about.description}
          </p>
        </div>

        <span className="rounded-md bg-orange-50 px-2 py-0.5 font-mono font-medium text-[10px] text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
          v{currentVersion.replace(/^v/i, "")}
        </span>
      </div>

      {/* About Info Card */}
      <section className="rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/60">
        <div className="space-y-2.5 text-xs">
          {/* Version & Platform */}
          <div className="flex items-center justify-between py-1">
            <span className="text-neutral-500 dark:text-neutral-400">{t.about.version}</span>
            <span className="font-mono font-medium text-neutral-800 text-xs dark:text-neutral-200">
              v{currentVersion.replace(/^v/i, "")}
            </span>
          </div>

          <div className="flex items-center justify-between border-neutral-100 border-t py-1 dark:border-neutral-800/40">
            <span className="text-neutral-500 dark:text-neutral-400">{t.about.platform}</span>
            <span className="font-medium text-neutral-800 text-xs dark:text-neutral-200">
              {isAndroid ? t.about.platformAndroid : t.about.platformWeb}
            </span>
          </div>

          {/* Check for updates */}
          <div className="flex flex-col gap-2 border-neutral-100 border-t pt-2 dark:border-neutral-800/40 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-neutral-800 text-xs dark:text-neutral-200">
                {t.about.checkForUpdates}
              </p>
              {updateResult && (
                <p className="mt-0.5 text-[11px]">
                  {updateResult.newer ? (
                    <span className="inline-flex items-center gap-1 font-medium text-orange-600 dark:text-orange-400">
                      <IconSparkles size={12} stroke={2} />
                      <span>
                        {t.about.updateAvailable}: {updateResult.latestTag}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <IconCheck size={12} stroke={2.5} />
                      <span>{t.about.upToDate}</span>
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {updateResult?.newer && (
                <Button asChild size="sm" variant="default">
                  <a href={updateResult.releaseUrl} rel="noopener noreferrer" target="_blank">
                    {t.update.downloadButton}
                  </a>
                </Button>
              )}
              <Button
                className="gap-1.5"
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
          </div>

          {/* GitHub link */}
          <div className="flex items-center justify-between border-neutral-100 border-t pt-2 dark:border-neutral-800/40">
            <div className="flex items-center gap-2">
              <IconBrandGithub className="text-neutral-500 dark:text-neutral-400" size={16} />
              <span className="font-medium text-neutral-700 text-xs dark:text-neutral-300">
                {t.about.githubRepo}
              </span>
            </div>
            <a
              className="flex items-center gap-1 font-medium text-orange-600 text-xs hover:underline dark:text-orange-400"
              href={`https://github.com/${GITHUB_REPO}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>GitHub</span>
              <IconExternalLink size={13} stroke={2} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
