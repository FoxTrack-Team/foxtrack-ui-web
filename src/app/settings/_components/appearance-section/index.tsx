"use client";

import {
  IconDeviceDesktop,
  IconLanguage,
  IconMoon,
  IconPalette,
  IconSun,
} from "@tabler/icons-react";

import { AppTheme, useSettings } from "@/providers/settings-provider";

import { cn } from "@/lib/utils";

export function AppearanceSection() {
  const { language, setLanguage, setTheme, t, theme } = useSettings();

  const themes: { icon: typeof IconSun; key: AppTheme; label: string }[] = [
    { icon: IconDeviceDesktop, key: "system", label: t.settings.appearance.themeSystem },
    { icon: IconSun, key: "light", label: t.settings.appearance.themeLight },
    { icon: IconMoon, key: "dark", label: t.settings.appearance.themeDark },
  ];

  return (
    <div className="space-y-4">
      {/* Title & Description directly on canvas */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
            {t.settings.appearance.title}
          </h1>
          <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
            {t.settings.appearance.description}
          </p>
        </div>
      </div>

      {/* Settings Card */}
      <section className="rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-neutral-900/80">
        <div className="space-y-4">
          {/* Theme Picker */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 font-medium text-neutral-700 text-xs dark:text-neutral-300">
              <IconPalette size={15} stroke={1.75} />
              <span>{t.settings.appearance.theme}</span>
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-200/70 p-1 dark:bg-neutral-800/80">
              {themes.map((item) => {
                const IconComp = item.icon;
                const isActive = theme === item.key;
                return (
                  <button
                    aria-pressed={isActive}
                    key={item.key}
                    type="button"
                    className={cn(
                      "flex min-h-10 items-center justify-center gap-1.5 rounded-lg py-2 font-medium text-xs transition-all active:scale-[0.98]",
                      isActive
                        ? "bg-white text-neutral-900 shadow-xs ring-1 ring-black/5 dark:bg-neutral-700/90 dark:text-white dark:ring-white/10"
                        : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
                    )}
                    onClick={() => setTheme(item.key)}
                  >
                    <IconComp size={15} stroke={isActive ? 2 : 1.75} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Picker */}
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-medium text-neutral-700 text-xs dark:text-neutral-300">
                <IconLanguage size={15} stroke={1.75} />
                <span>{t.settings.appearance.language}</span>
              </label>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl bg-neutral-200/70 p-1 dark:bg-neutral-800/80">
              <button
                aria-pressed={language === "en"}
                type="button"
                className={cn(
                  "flex min-h-10 items-center justify-center rounded-lg py-2 font-medium text-xs transition-all active:scale-[0.98]",
                  language === "en"
                    ? "bg-white text-neutral-900 shadow-xs ring-1 ring-black/5 dark:bg-neutral-700/90 dark:text-white dark:ring-white/10"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
                )}
                onClick={() => setLanguage("en")}
              >
                English
              </button>
              <button
                aria-pressed={language === "fa"}
                type="button"
                className={cn(
                  "flex min-h-10 items-center justify-center rounded-lg py-2 font-medium text-xs transition-all active:scale-[0.98]",
                  language === "fa"
                    ? "bg-white text-neutral-900 shadow-xs ring-1 ring-black/5 dark:bg-neutral-700/90 dark:text-white dark:ring-white/10"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
                )}
                onClick={() => setLanguage("fa")}
              >
                فارسی
              </button>
            </div>
            <p className="mt-1.5 text-neutral-500 text-[11px] dark:text-neutral-400">
              {t.settings.appearance.directionNote}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
