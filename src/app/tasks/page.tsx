"use client";

import { useState } from "react";

import { useTranslation } from "@/providers/settings-provider";

import { TaskFab } from "@/components/task-fab";
import { TaskFilters } from "@/components/task-filters";
import { TaskList } from "@/components/task-list";

import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { TaskFilter } from "@/features/tasks/types";

export default function TasksPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const { counts, isLoading, tasks } = useTasks(filter);

  return (
    <>
      <h1 className="mb-3 font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
        {t.bottomNav.tasks}
      </h1>
      <TaskFilters counts={counts} currentFilter={filter} onFilterChange={setFilter} />
      <TaskList filter={filter} isLoading={isLoading} tasks={tasks} />
      <TaskFab />
    </>
  );
}
