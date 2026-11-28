"use client";

import Link from "next/link";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { useSettings } from "@/providers/settings-provider";

interface SubpageHeaderProps {
  backHref?: string;
  backLabel?: string;
  title?: string;
}

export function SubpageHeader({ backHref = "/settings", backLabel, title }: SubpageHeaderProps) {
  const { isRtl, t } = useSettings();
  const BackChevron = isRtl ? IconChevronRight : IconChevronLeft;
  const label = backLabel ?? t.settings.back;

  return (
    <div className="mb-2 flex items-center justify-between">
      <Link
        aria-label={label}
        className="group relative inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-medium text-xs text-neutral-700 shadow-2xs transition-all after:absolute after:-inset-0.5 after:content-[''] hover:bg-orange-50/70 hover:text-orange-600 active:scale-95 sm:min-h-9 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:bg-orange-950/30 dark:hover:text-orange-400"
        href={backHref}
      >
        <BackChevron
          className="transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
          size={15}
          stroke={2.25}
        />
        <span>{label}</span>
      </Link>

      {title && (
        <span className="font-semibold text-neutral-700 text-xs dark:text-neutral-300">
          {title}
        </span>
      )}
    </div>
  );
}
