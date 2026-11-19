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
    <section className="rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/60">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
          <IconPalette size={15} stroke={2} />
        </div>
        <div>
          <h2 className="font-semibold text-neutral-900 text-xs dark:text-neutral-100">
            {t.settings.appearance.title}
          </h2>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
            {t.settings.appearance.description}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-3 pt-0.5">
        {/* Theme Picker */}
        <div>
          <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {t.settings.appearance.theme}
          </label>
          <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800/60">
            {themes.map((item) => {
              const IconComp = item.icon;
              const isActive = theme === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium text-xs transition-all",
                    isActive
                      ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-700 dark:text-neutral-100"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
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
        <div className="border-neutral-100 border-t pt-3 dark:border-neutral-800/60">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 font-medium text-neutral-700 text-xs dark:text-neutral-300">
              <IconLanguage size={15} stroke={1.75} />
              <span>{t.settings.appearance.language}</span>
            </label>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800/60">
            <button
              type="button"
              className={cn(
                "flex items-center justify-center rounded-lg py-1.5 font-medium text-xs transition-all",
                language === "en"
                  ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-700 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
              )}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
            <button
              type="button"
              className={cn(
                "flex items-center justify-center rounded-lg py-1.5 font-medium text-xs transition-all",
                language === "fa"
                  ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-700 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
              )}
              onClick={() => setLanguage("fa")}
            >
              فارسی
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            {t.settings.appearance.directionNote}
          </p>
        </div>
      </div>
    </section>
  );
}
