"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="mb-6 flex items-center justify-between border-b border-neutral-200/80 pb-4 dark:border-neutral-800/80">
      <div className="flex items-center gap-2.5">
        {/* Minimalist Solid Fox Mark (Linear / Things 3 style - no gradient slop) */}
        <div className="flex h-8 w-8 select-none items-center justify-center rounded-lg bg-orange-500 text-white shadow-[0_1px_2px_rgba(234,88,12,0.2)]">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 18.5l-4-3-4.5 4 1-8.5-3.5-3 5-.5L12 3l2 4.5 5 .5-3.5 3 1 8.5-4.5-4-4 3z" />
          </svg>
        </div>
        <div>
          <h1 className="flex items-center gap-1 font-semibold text-lg text-neutral-900 tracking-tight dark:text-neutral-100">
            Fox<span className="text-orange-500 font-bold">Track</span>
          </h1>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Offline-first tasks</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
      </div>
    </header>
  );
}
