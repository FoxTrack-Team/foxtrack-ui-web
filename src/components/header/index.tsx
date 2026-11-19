"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="mb-6 flex items-center justify-between border-b border-neutral-200/80 pb-4 dark:border-neutral-800/80">
      <div className="flex items-center gap-2.5">
        {/* FoxTrack Brand Mark */}
        <div className="flex h-8 w-8 select-none items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="FoxTrack Logo"
            className="h-8 w-8 select-none"
            height={32}
            src="/favicon.svg"
            width={32}
          />
        </div>
        <div>
          <h1 className="flex items-center gap-1 font-semibold text-lg text-neutral-900 tracking-tight dark:text-neutral-100">
            Fox<span className="text-orange-500 font-bold">Track</span>
          </h1>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Offline-first Task Tracker
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
      </div>
    </header>
  );
}
