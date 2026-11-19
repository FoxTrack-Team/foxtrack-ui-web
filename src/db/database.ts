import Dexie, { type EntityTable } from "dexie";

import { Task } from "@/features/tasks/types";

export class FoxTrackDatabase extends Dexie {
  tasks!: EntityTable<Task, "id">;

  constructor(dbName = "FoxTrackDB") {
    super(dbName);

    // Version 1: Initial schema for FoxTrack Phase 1
    this.version(1).stores({
      tasks: "id, completed, priority, dueDate, createdAt, updatedAt",
    });
  }
}

// Singleton database instance for the application
export const db = new FoxTrackDatabase();
