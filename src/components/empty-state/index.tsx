import type { Icon } from "@tabler/icons-react";
import { IconChecklist, IconCircleCheck, IconSparkles } from "@tabler/icons-react";

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
  let title = customTitle ?? "No tasks yet";
  let description = customDescription ?? "Type a task above and press Enter.";
  let IconComponent = CustomIcon ?? IconChecklist;

  if (!customTitle && filter === "active") {
    title = "All clear";
    description = customDescription ?? "You have caught up with your active tasks.";
    IconComponent = CustomIcon ?? IconSparkles;
  } else if (!customTitle && filter === "completed") {
    title = "No completed tasks";
    description = customDescription ?? "Completed tasks will be archived here.";
    IconComponent = CustomIcon ?? IconCircleCheck;
  }

  return (
    <div className="my-8 flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
        <IconComponent size={18} stroke={1.75} />
      </div>
      <h3 className="font-medium text-sm text-neutral-800 dark:text-neutral-200">{title}</h3>
      <p className="mt-0.5 max-w-xs text-xs text-neutral-400 dark:text-neutral-500">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
