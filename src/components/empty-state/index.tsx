"use client";

import type { Icon } from "@tabler/icons-react";
import { IconChecklist, IconCircleCheck, IconSparkles } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { TaskFilter } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  action?: React.ReactNode;
  badge?: React.ReactNode;
  description?: string;
  filter?: TaskFilter;
  framed?: boolean;
  icon?: Icon;
  title?: string;
}

export function EmptyState({
  action,
  badge,
  description: customDescription,
  filter,
  framed = false,
  icon: CustomIcon,
  title: customTitle,
}: EmptyStateProps) {
  const { t } = useTranslation();

  let title = customTitle ?? t.tasks.emptyAllTitle;
  let description = customDescription ?? t.tasks.emptyAllDesc;
  let IconComponent = CustomIcon ?? IconChecklist;

  if (!customTitle && filter === "active") {
    title = t.tasks.emptyActiveTitle;
    description = customDescription ?? t.tasks.emptyActiveDesc;
    IconComponent = CustomIcon ?? IconSparkles;
  } else if (!customTitle && filter === "completed") {
    title = t.tasks.emptyCompletedTitle;
    description = customDescription ?? t.tasks.emptyCompletedDesc;
    IconComponent = CustomIcon ?? IconCircleCheck;
  }

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        framed
          ? "w-full max-w-sm rounded-2xl bg-white px-6 py-8 shadow-2xs dark:bg-neutral-900/80"
          : "my-8 py-10",
      )}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800/80 dark:text-neutral-400">
        <IconComponent size={22} stroke={1.75} />
      </div>
      {badge ? <div className="mb-2">{badge}</div> : null}
      <h2 className="font-semibold text-base text-neutral-800 tracking-tight dark:text-neutral-200">
        {title}
      </h2>
      <p className="mt-1.5 max-w-[260px] text-neutral-500 text-xs leading-relaxed dark:text-neutral-400">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );

  if (framed) {
    return (
      <div className="flex min-h-[calc(100dvh-17rem)] items-center justify-center py-4">
        {content}
      </div>
    );
  }

  return content;
}
