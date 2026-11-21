"use client";

import type { Icon } from "@tabler/icons-react";
import { IconChecklist, IconCircleCheck, IconSparkles } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { TaskFilter } from "@/features/tasks/types";

interface EmptyStateProps {
  action?: React.ReactNode;
  description?: string;
  filter?: TaskFilter;
  icon?: Icon;
  title?: string;
}

export function EmptyState({
  action,
  description: customDescription,
  filter,
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

  return (
    <div className="my-8 flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 ring-1 ring-neutral-200/50 dark:bg-neutral-850 dark:text-neutral-500 dark:ring-neutral-800">
        <IconComponent size={20} stroke={1.75} />
      </div>
      <h3 className="font-semibold text-neutral-800 text-sm tracking-tight dark:text-neutral-200">
        {title}
      </h3>
      <p className="mt-1 max-w-xs text-neutral-400 text-xs leading-relaxed dark:text-neutral-500">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
