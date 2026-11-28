"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconSettings } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isSettingsPage = Boolean(pathname?.startsWith("/settings"));

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

      {!isSettingsPage && (
        <Link
          aria-label={t.bottomNav.settings}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 active:scale-95 active:bg-neutral-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:active:bg-neutral-800"
          href="/settings"
        >
          <IconSettings aria-hidden="true" className="h-5 w-5" stroke={1.8} />
        </Link>
      )}
    </header>
  );
}
