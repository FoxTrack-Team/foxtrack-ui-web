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
    <div className="space-y-3 pb-20">
      <div className="mb-1.5">
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {t.more.title}
        </h1>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{t.more.subtitle}</p>
      </div>

      {/* Grouped List Card */}
      <div className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-2xs dark:divide-neutral-800/60 dark:border-neutral-800/80 dark:bg-neutral-900/60">
        {sections.map((section) => {
          const IconComp = section.icon;
          return (
            <Link
              className="group flex w-full items-center justify-between px-3 py-2.5 text-start transition-colors hover:bg-neutral-50/80 active:bg-neutral-100/80 sm:px-3.5 dark:hover:bg-neutral-800/30 dark:active:bg-neutral-800/60"
              href={section.href}
              key={section.id}
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
