import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FoxTrackDatabase } from "@/db/database";

import { DexieTaskRepository } from "../dexie-task-repository";

describe("DexieTaskRepository", () => {
  let db: FoxTrackDatabase;
  let repo: DexieTaskRepository;

  beforeEach(() => {
    // Unique in-memory database name per test to prevent interference
    db = new FoxTrackDatabase(`FoxTrackTestDB-${Date.now()}-${Math.random()}`);
    repo = new DexieTaskRepository(db);
  });

  afterEach(async () => {
    await db.delete();
  });

  it("creates a task with default values and persists to Dexie", async () => {
    const task = await repo.create({
      title: "Buy groceries",
      priority: "high",
      dueDate: 1735689600000,
    });

    expect(task.id).toBeDefined();
    expect(task.title).toBe("Buy groceries");
    expect(task.priority).toBe("high");
    expect(task.dueDate).toBe(1735689600000);
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBeTypeOf("number");
    expect(task.updatedAt).toBeTypeOf("number");

    const fromDb = await repo.getById(task.id);
    expect(fromDb).toEqual(task);
  });

  it("validates empty title on creation", async () => {
    await expect(
      repo.create({
        title: "   ",
        priority: "medium",
        dueDate: null,
      }),
    ).rejects.toThrow();
  });

  it("updates task fields", async () => {
    const task = await repo.create({
      title: "Initial title",
      priority: "low",
      dueDate: null,
    });

    const updated = await repo.update(task.id, {
      title: "Updated title",
      priority: "high",
      dueDate: 1735700000000,
    });

    expect(updated.title).toBe("Updated title");
    expect(updated.priority).toBe("high");
    expect(updated.dueDate).toBe(1735700000000);
    expect(updated.updatedAt).toBeGreaterThanOrEqual(task.updatedAt);

    const reloaded = await repo.getById(task.id);
    expect(reloaded?.title).toBe("Updated title");
  });

  it("toggles completion status", async () => {
    const task = await repo.create({
      title: "Task to complete",
      priority: "medium",
      dueDate: null,
    });

    expect(task.completed).toBe(false);

    const completed = await repo.toggleComplete(task.id);
    expect(completed.completed).toBe(true);

    const reopened = await repo.toggleComplete(task.id);
    expect(reopened.completed).toBe(false);
  });

  it("deletes a task", async () => {
    const task = await repo.create({
      title: "Task to delete",
      priority: "low",
      dueDate: null,
    });

    await repo.delete(task.id);
    const found = await repo.getById(task.id);
    expect(found).toBeUndefined();
  });

  it("filters tasks correctly by all, active, completed", async () => {
    const t1 = await repo.create({ title: "Task 1", priority: "low", dueDate: null });
    const t2 = await repo.create({ title: "Task 2", priority: "medium", dueDate: null });
    await repo.toggleComplete(t2.id);

    const all = await repo.getFiltered("all");
    expect(all).toHaveLength(2);

    const active = await repo.getFiltered("active");
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe(t1.id);

    const completed = await repo.getFiltered("completed");
    expect(completed).toHaveLength(1);
    expect(completed[0].id).toBe(t2.id);
  });

  it("sorts active before completed, high before low, earlier due dates first", async () => {
    // Low priority, no due date
    const lowNoDate = await repo.create({ title: "Low No Date", priority: "low", dueDate: null });
    // High priority, later due date
    const highLater = await repo.create({ title: "High Later", priority: "high", dueDate: 2000 });
    // High priority, earlier due date
    const highEarlier = await repo.create({
      title: "High Earlier",
      priority: "high",
      dueDate: 1000,
    });
    // Completed high priority
    const completedHigh = await repo.create({
      title: "Completed High",
      priority: "high",
      dueDate: 500,
    });
    await repo.toggleComplete(completedHigh.id);

    const sorted = await repo.getAll();

    // 1. highEarlier (active, high, earlier due date)
    // 2. highLater (active, high, later due date)
    // 3. lowNoDate (active, low)
    // 4. completedHigh (completed)
    expect(sorted[0].id).toBe(highEarlier.id);
    expect(sorted[1].id).toBe(highLater.id);
    expect(sorted[2].id).toBe(lowNoDate.id);
    expect(sorted[3].id).toBe(completedHigh.id);
  });
});
