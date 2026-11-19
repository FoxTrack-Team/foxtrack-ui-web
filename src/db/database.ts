import Dexie, { type EntityTable } from "dexie";

import { Task } from "@/features/tasks/types";

export interface AppSetting {
  key: string;
  value: string;
}

export class FoxTrackDatabase extends Dexie {
  tasks!: EntityTable<Task, "id">;
  settings!: EntityTable<AppSetting, "key">;

  constructor(dbName = "FoxTrackDB") {
    super(dbName);

    // Version 1: Initial schema for FoxTrack Phase 1
    this.version(1).stores({
      tasks: "id, completed, priority, dueDate, createdAt, updatedAt",
    });

    // Version 2: Add settings table for persistent preferences (backward compatible)
    this.version(2).stores({
      settings: "key",
      tasks: "id, completed, priority, dueDate, createdAt, updatedAt",
    });
  }
}

// Singleton database instance for the application
export const db = new FoxTrackDatabase();
