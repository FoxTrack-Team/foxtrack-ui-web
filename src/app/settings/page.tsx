"use client";

import Link from "next/link";

import {
  IconChevronLeft,
  IconChevronRight,
  IconDatabase,
  IconInfoCircle,
  IconPalette,
} from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useSettings } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";

import { cn } from "@/lib/utils";

import { db } from "@/db/database";

export default function SettingsPage() {
  const { isRtl, language, t, theme } = useSettings();

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const totalTasks = tasks.length;

  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.6";

  const ForwardChevron = isRtl ? IconChevronLeft : IconChevronRight;

  const themeLabel =
    theme === "system"
      ? t.settings.appearance.themeSystem
      : theme === "light"
        ? t.settings.appearance.themeLight
        : t.settings.appearance.themeDark;
  const languageLabel = language === "fa" ? "فارسی" : "English";

  const sections = [
    {
      badge: `${themeLabel} · ${languageLabel}`,
      description: t.settings.appearance.description,
      href: "/settings/appearance",
      icon: IconPalette,
      iconContainerClass:
        "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 ring-1 ring-orange-500/15",
      id: "appearance",
      title: t.settings.appearance.title,
    },
    {
      badge: `${totalTasks} ${totalTasks === 1 ? t.dashboard.taskSingular : t.dashboard.tasksCount}`,
      description: t.settings.data.description,
      href: "/settings/data",
      icon: IconDatabase,
      iconContainerClass:
        "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 ring-1 ring-blue-500/15",
      id: "data",
      title: t.settings.data.title,
    },
    {
      badge: `v${currentVersion.replace(/^v/i, "")}`,
      description: t.about.description,
      href: "/settings/about",
      icon: IconInfoCircle,
      iconContainerClass:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/15",
      id: "about",
      title: t.about.title,
    },
  ];

  return (
    <div className="space-y-3">
      <SubpageHeader backHref="/dashboard" backLabel={t.common.back} />
      <div className="mb-1.5">
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {t.settings.title}
        </h1>
        <p className="text-neutral-500 text-xs dark:text-neutral-400">{t.settings.subtitle}</p>
      </div>

      {/* iOS-inspired Grouped List Card */}
      <div className="divide-y divide-neutral-100 overflow-hidden rounded-2xl bg-white shadow-2xs dark:divide-neutral-800/60 dark:bg-neutral-900/80">
        {sections.map((section) => {
          const IconComp = section.icon;
          return (
            <Link
              className="group flex min-h-[52px] w-full items-center justify-between gap-2 px-3.5 py-2.5 text-start transition-colors hover:bg-neutral-50/80 active:bg-neutral-100/80 dark:hover:bg-neutral-800/30 dark:active:bg-neutral-800/60"
              href={section.href}
              key={section.id}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    section.iconContainerClass,
                  )}
                >
                  <IconComp size={17} stroke={2} />
                </div>
                <h2 className="truncate font-medium text-neutral-900 text-sm tracking-tight dark:text-neutral-100">
                  {section.title}
                </h2>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 ps-2">
                <span className="font-normal text-neutral-500 text-xs tabular-nums dark:text-neutral-400">
                  {section.badge}
                </span>
                <ForwardChevron
                  className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 dark:text-neutral-500"
                  stroke={2}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
