"use client";

import Link from "next/link";

import {
  IconCategory,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconFolder,
} from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useSettings } from "@/providers/settings-provider";

import { cn } from "@/lib/utils";

import { db } from "@/db/database";

export default function MorePage() {
  const { isRtl, t } = useSettings();

  const categories = useLiveQuery(() => db.categories.toArray(), []) ?? [];
  const totalCategories = categories.length;

  const ForwardChevron = isRtl ? IconChevronLeft : IconChevronRight;

  const sections = [
    {
      badge: `${totalCategories} ${t.categories.categoryCount}`,
      description: t.categories.subtitle,
      href: "/more/categories",
      icon: IconCategory,
      iconContainerClass:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/15",
      id: "categories",
      title: t.categories.title,
    },
    {
      badge: t.more.upcomingSoon,
      description: t.more.upcomingProjectsDesc,
      href: "/more/projects",
      icon: IconFolder,
      iconContainerClass:
        "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 ring-1 ring-amber-500/15",
      id: "projects",
      title: t.more.upcomingProjectsTitle,
    },
    {
      badge: t.more.upcomingSoon,
      description: t.more.upcomingAnalyticsDesc,
      href: "/more/analytics",
      icon: IconChartBar,
      iconContainerClass:
        "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 ring-1 ring-indigo-500/15",
      id: "analytics",
      title: t.more.upcomingAnalyticsTitle,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="mb-1.5">
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {t.more.title}
        </h1>
        <p className="text-neutral-500 text-xs dark:text-neutral-400">{t.more.subtitle}</p>
      </div>

      {/* Grouped List Card */}
      <div className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-2xs dark:divide-neutral-800/60 dark:border-neutral-800/80 dark:bg-neutral-900/60">
        {sections.map((section) => {
          const IconComp = section.icon;
          const isUpcoming = section.href !== "/more/categories";
          return (
            <Link
              className="group flex min-h-[60px] w-full items-center justify-between gap-2 px-3.5 py-3 text-start transition-colors hover:bg-neutral-50/80 active:bg-neutral-100/80 dark:hover:bg-neutral-800/30 dark:active:bg-neutral-800/60"
              href={section.href}
              key={section.id}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    section.iconContainerClass,
                  )}
                >
                  <IconComp size={18} stroke={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium text-neutral-900 text-sm tracking-tight leading-snug dark:text-neutral-100">
                    {section.title}
                  </h2>
                  <p className="mt-0.5 line-clamp-2 text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 ps-2">
                <span
                  className={cn(
                    "inline-flex rounded-md px-2 py-0.5 font-medium text-[11px] tabular-nums",
                    isUpcoming
                      ? "bg-orange-500/10 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
                      : "bg-neutral-100/90 text-neutral-600 dark:bg-neutral-800/90 dark:text-neutral-300",
                  )}
                >
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
