import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/db/database";

import { sortTasks } from "../services/task-sorter";
import { TaskFilter } from "../types";

export interface TaskCounts {
  all: number;
  active: number;
  completed: number;
}

export function useTasks(filter: TaskFilter = "all") {
  const tasks = useLiveQuery(async () => {
    const all = await db.tasks.toArray();
    const filtered = all.filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
    return sortTasks(filtered);
  }, [filter]);

  const counts = useLiveQuery(async () => {
    const all = await db.tasks.toArray();
    const active = all.filter((t) => !t.completed).length;
    const completed = all.filter((t) => t.completed).length;
    return {
      all: all.length,
      active,
      completed,
    };
  }, []);

  return {
    tasks: tasks ?? [],
    isLoading: tasks === undefined,
    counts: counts ?? { all: 0, active: 0, completed: 0 },
  };
}
