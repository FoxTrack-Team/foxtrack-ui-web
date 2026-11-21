import { describe, expect, it } from "vitest";

import { FoxTrackDatabase } from "@/db/database";

import { DexieTagRepository } from "../dexie-tag-repository";

describe("DexieTagRepository", () => {
  const DB_NAME = `FoxTrackTagTest-${Date.now()}`;

  it("creates, retrieves, updates, and deletes tags while preserving data integrity", async () => {
    const testDb = new FoxTrackDatabase(DB_NAME);
    const repo = new DexieTagRepository(testDb);

    // 1. Create tag
    const created = await repo.create({
      color: "emerald",
      name: "Work",
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe("Work");
    expect(created.color).toBe("emerald");
    expect(created.createdAt).toBeTypeOf("number");

    // 2. Retrieve by ID
    const found = await repo.getById(created.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe("Work");

    // 3. Update tag
    const updated = await repo.update(created.id, {
      color: "blue",
      name: "Deep Work",
    });
    expect(updated.name).toBe("Deep Work");
    expect(updated.color).toBe("blue");

    // 4. Retrieve all
    const all = await repo.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe("Deep Work");

    // 5. Delete tag
    await repo.delete(created.id);
    const afterDelete = await repo.getAll();
    expect(afterDelete).toHaveLength(0);

    testDb.close();
  });

  it("removes deleted tag from tasks while preserving the tasks themselves", async () => {
    const testDb = new FoxTrackDatabase(`FoxTrackTagCascade-${Date.now()}`);
    const repo = new DexieTagRepository(testDb);

    const tag1 = await repo.create({ color: "emerald", name: "Work" });
    const tag2 = await repo.create({ color: "blue", name: "Urgent" });

    await testDb.tasks.add({
      completed: false,
      createdAt: 1000,
      dueDate: null,
      id: "task-1",
      priority: "high",
      tagIds: [tag1.id, tag2.id],
      title: "Task with tags",
      updatedAt: 1000,
    });

    // Delete tag1
    await repo.delete(tag1.id);

    // Verify tag1 is deleted
    expect(await repo.getById(tag1.id)).toBeUndefined();
    // Verify tag2 remains
    expect(await repo.getById(tag2.id)).toBeDefined();

    // Verify task still exists and now only has tag2
    const task = await testDb.tasks.get("task-1");
    expect(task).toBeDefined();
    expect(task?.tagIds).toEqual([tag2.id]);
    expect(task?.title).toBe("Task with tags");

    testDb.close();
  });

  it("creates a tag with fallback ID when crypto.randomUUID is not available", async () => {
    const testDb = new FoxTrackDatabase(`FoxTrackTagFallback-${Date.now()}`);
    const repo = new DexieTagRepository(testDb);

    // Temporarily delete or stub crypto.randomUUID
    const originalRandomUUID = crypto.randomUUID;
    // @ts-expect-error simulating environment where crypto.randomUUID is undefined
    crypto.randomUUID = undefined;

    try {
      const tag = await repo.create({ color: "amber", name: "Fallback Tag" });
      expect(tag.id).toBeDefined();
      expect(tag.id.startsWith("tag-")).toBe(true);
      expect(tag.name).toBe("Fallback Tag");

      const fetched = await repo.getById(tag.id);
      expect(fetched).toBeDefined();
      expect(fetched?.id).toBe(tag.id);
    } finally {
      crypto.randomUUID = originalRandomUUID;
      testDb.close();
    }
  });
});
