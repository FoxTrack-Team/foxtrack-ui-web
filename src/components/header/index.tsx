"use client";

import { useMemo } from "react";

import { IconCalendar } from "@tabler/icons-react";

import { useSettings } from "@/providers/settings-provider";

export function Header() {
  const { language } = useSettings();

  const formattedDate = useMemo(() => {
    const now = new Date();
    const locale = language === "fa" ? "fa-IR" : "en-US";
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(now);
  }, [language]);

  return (
    <header className="mb-4 flex items-center justify-between py-1 select-none">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20 dark:bg-orange-500/15 dark:ring-orange-500/25">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="FoxTrack Logo"
            className="h-5 w-5 select-none"
            height={20}
            src="/favicon.svg"
            width={20}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight text-neutral-900 leading-none dark:text-neutral-100">
            Fox<span className="text-orange-500">Track</span>
          </span>
        </div>
      </div>

      <div
        aria-label="Today's date"
        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-white/80 px-2.5 py-1 text-xs font-medium text-neutral-600 shadow-2xs backdrop-blur-xs transition-colors dark:border-neutral-800/80 dark:bg-neutral-900/80 dark:text-neutral-400"
      >
        <IconCalendar
          aria-hidden="true"
          className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500"
          stroke={2}
        />
        <span suppressHydrationWarning className="tabular-nums">
          {formattedDate}
        </span>
      </div>
    </header>
  );
}
