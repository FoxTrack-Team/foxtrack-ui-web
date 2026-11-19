"use client";

import { useEffect, useState } from "react";

import {
  IconChevronLeft,
  IconChevronRight,
  IconDatabase,
  IconInfoCircle,
  IconPalette,
} from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useSettings } from "@/providers/settings-provider";

import { cn } from "@/lib/utils";

import { db } from "@/db/database";

import { AboutSection } from "./_components/about-section";
import { AppearanceSection } from "./_components/appearance-section";
import { DataSection } from "./_components/data-section";

export type SettingsSectionId = "appearance" | "data" | "about";

export default function SettingsPage() {
  const { isRtl, language, t, theme } = useSettings();
  const [activeSection, setActiveSection] = useState<SettingsSectionId | null>(null);

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const totalTasks = tasks.length;
  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.5";

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && activeSection) {
        setActiveSection(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection]);

  const ForwardChevron = isRtl ? IconChevronLeft : IconChevronRight;
  const BackChevron = isRtl ? IconChevronRight : IconChevronLeft;

  const themeLabel =
    theme === "system"
      ? t.settings.appearance.themeSystem
      : theme === "light"
        ? t.settings.appearance.themeLight
        : t.settings.appearance.themeDark;
  const languageLabel = language === "fa" ? "فارسی" : "English";

  const sections: {
    badge: string;
    description: string;
    icon: typeof IconPalette;
    iconContainerClass: string;
    id: SettingsSectionId;
    title: string;
  }[] = [
    {
      badge: `${themeLabel} · ${languageLabel}`,
      description: t.settings.appearance.description,
      icon: IconPalette,
      iconContainerClass:
        "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 ring-1 ring-orange-500/15",
      id: "appearance",
      title: t.settings.appearance.title,
    },
    {
      badge: `${totalTasks} ${language === "fa" ? "تسک" : "tasks"}`,
      description: t.settings.data.description,
      icon: IconDatabase,
      iconContainerClass:
        "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 ring-1 ring-blue-500/15",
      id: "data",
      title: t.settings.data.title,
    },
    {
      badge: `v${currentVersion.replace(/^v/i, "")}`,
      description: t.about.description,
      icon: IconInfoCircle,
      iconContainerClass:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/15",
      id: "about",
      title: t.about.title,
    },
  ];

  if (activeSection !== null) {
    return (
      <div className="space-y-3">
        {/* Compact iOS-style drilldown back header */}
        <div className="flex items-center">
          <button
            aria-label={t.settings.back}
            className="group inline-flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white px-2.5 py-1 font-medium text-[11px] text-neutral-700 shadow-2xs transition-all hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-600 active:scale-95 dark:border-neutral-800/80 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:border-orange-900/50 dark:hover:bg-orange-950/30 dark:hover:text-orange-400"
            type="button"
            onClick={() => setActiveSection(null)}
          >
            <BackChevron
              className="transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
              size={13}
              stroke={2.25}
            />
            <span>{t.settings.back}</span>
          </button>
        </div>

        <div className="animate-page-enter">
          {activeSection === "appearance" && <AppearanceSection />}
          {activeSection === "data" && <DataSection />}
          {activeSection === "about" && <AboutSection />}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mb-1.5">
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {t.settings.title}
        </h1>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{t.settings.subtitle}</p>
      </div>

      {/* Compact iOS-inspired Grouped List Card */}
      <div className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-2xs dark:divide-neutral-800/60 dark:border-neutral-800/80 dark:bg-neutral-900/60">
        {sections.map((section) => {
          const IconComp = section.icon;
          return (
            <button
              className="group flex w-full items-center justify-between px-3 py-2.5 text-start transition-colors hover:bg-neutral-50/80 active:bg-neutral-100/80 sm:px-3.5 dark:hover:bg-neutral-800/30 dark:active:bg-neutral-800/60"
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    section.iconContainerClass,
                  )}
                >
                  <IconComp size={15} stroke={2} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-medium text-neutral-900 text-xs tracking-tight leading-snug dark:text-neutral-100">
                    {section.title}
                  </h2>
                  <p className="truncate text-[11px] text-neutral-400 leading-tight dark:text-neutral-500">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 ps-2.5">
                <span className="hidden rounded-md bg-neutral-100/90 px-2 py-0.5 font-medium text-[10px] text-neutral-500 sm:inline-flex dark:bg-neutral-800/90 dark:text-neutral-400">
                  {section.badge}
                </span>
                <ForwardChevron
                  className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 dark:text-neutral-500"
                  stroke={2}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
