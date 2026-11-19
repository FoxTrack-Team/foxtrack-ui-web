import { describe, expect, it } from "vitest";

import { FoxTrackDatabase } from "@/db/database";

import { DexieTaskRepository } from "../dexie-task-repository";

describe("Offline Persistence & Lifecycle Verification", () => {
  const DB_NAME = `FoxTrackPersistenceTest-${Date.now()}`;

  it("persists all tasks across database close, reopen, and simulates offline browser restarts", async () => {
    // 1. First session: Create tasks
    const db1 = new FoxTrackDatabase(DB_NAME);
    const repo1 = new DexieTaskRepository(db1);

    const task1 = await repo1.create({
      title: "Task created before app close",
      priority: "high",
      dueDate: 1735689600000,
    });

    const task2 = await repo1.create({
      title: "Completed task before app close",
      priority: "medium",
      dueDate: null,
    });
    await repo1.toggleComplete(task2.id);

    // Verify created in session 1
    const session1Tasks = await repo1.getAll();
    expect(session1Tasks).toHaveLength(2);

    // 2. Simulate closing the application / browser restart
    db1.close();

    // 3. Second session: Open database as a new instance (simulating restart / offline open)
    const db2 = new FoxTrackDatabase(DB_NAME);
    const repo2 = new DexieTaskRepository(db2);

    const reloadedTasks = await repo2.getAll();
    expect(reloadedTasks).toHaveLength(2);

    // Verify task1 state
    const loadedTask1 = await repo2.getById(task1.id);
    expect(loadedTask1).toBeDefined();
    expect(loadedTask1?.title).toBe("Task created before app close");
    expect(loadedTask1?.priority).toBe("high");
    expect(loadedTask1?.dueDate).toBe(1735689600000);
    expect(loadedTask1?.completed).toBe(false);

    // Verify task2 completed state
    const loadedTask2 = await repo2.getById(task2.id);
    expect(loadedTask2).toBeDefined();
    expect(loadedTask2?.completed).toBe(true);

    // 4. Perform offline modifications: Edit, complete, delete, add
    await repo2.update(task1.id, {
      title: "Task modified while offline",
      priority: "low",
    });

    const task3 = await repo2.create({
      title: "Task created while offline",
      priority: "high",
      dueDate: 1735700000000,
    });

    await repo2.delete(task2.id);

    // 5. Close session 2
    db2.close();

    // 6. Third session: Re-open again
    const db3 = new FoxTrackDatabase(DB_NAME);
    const repo3 = new DexieTaskRepository(db3);

    const session3Tasks = await repo3.getAll();
    expect(session3Tasks).toHaveLength(2);

    const finalTask1 = await repo3.getById(task1.id);
    expect(finalTask1?.title).toBe("Task modified while offline");
    expect(finalTask1?.priority).toBe("low");

    const finalTask2 = await repo3.getById(task2.id);
    expect(finalTask2).toBeUndefined(); // Successfully deleted

    const finalTask3 = await repo3.getById(task3.id);
    expect(finalTask3?.title).toBe("Task created while offline");

    // Clean up
    await db3.delete();
  });
});
