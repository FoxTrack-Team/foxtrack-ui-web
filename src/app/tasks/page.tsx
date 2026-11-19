"use client";

import { useState } from "react";

import { TaskFab } from "@/components/task-fab";
import { TaskFilters } from "@/components/task-filters";
import { TaskList } from "@/components/task-list";

import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { TaskFilter } from "@/features/tasks/types";

export default function TasksPage() {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const { counts, isLoading, tasks } = useTasks(filter);

  return (
    <>
      <TaskFilters counts={counts} currentFilter={filter} onFilterChange={setFilter} />
      <TaskList filter={filter} isLoading={isLoading} tasks={tasks} />
      <TaskFab />
    </>
  );
}
