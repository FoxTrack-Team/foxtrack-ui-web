import { Task, TaskPriority } from "../types";

export const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Default sorting function for FoxTrack tasks:
 * 1. Active before completed
 * 2. Higher priority first
 * 3. Earlier due date first (tasks with due dates appear before tasks without)
 * 4. Created date descending (newer first)
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // 1. Completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // 2. Priority
    const priorityDiff = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    // 3. Due date
    if (a.dueDate !== null && b.dueDate !== null) {
      if (a.dueDate !== b.dueDate) {
        return a.dueDate - b.dueDate;
      }
    } else if (a.dueDate !== null && b.dueDate === null) {
      return -1;
    } else if (a.dueDate === null && b.dueDate !== null) {
      return 1;
    }

    // 4. Creation date (newer first)
    return b.createdAt - a.createdAt;
  });
}
