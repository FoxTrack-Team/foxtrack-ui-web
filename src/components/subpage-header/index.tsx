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
        className="group inline-flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white px-2.5 py-1 font-medium text-[11px] text-neutral-700 shadow-2xs transition-all hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-600 active:scale-95 dark:border-neutral-800/80 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:border-orange-900/50 dark:hover:bg-orange-950/30 dark:hover:text-orange-400"
        href={backHref}
      >
        <BackChevron
          className="transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
          size={13}
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
