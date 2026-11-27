import { EmptyState } from "@/components/empty-state";
import { TaskItem } from "@/components/task-item";

import { Task, TaskFilter } from "@/features/tasks/types";

interface TaskListProps {
  filter: TaskFilter;
  isLoading: boolean;
  tasks: Task[];
}

export function TaskList({ tasks, isLoading, filter }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div
            className="h-16 rounded-xl border border-neutral-200/50 bg-neutral-200/70 dark:border-neutral-800 dark:bg-neutral-800/60"
            key={i}
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
