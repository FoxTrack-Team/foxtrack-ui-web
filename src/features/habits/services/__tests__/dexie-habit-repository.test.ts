import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FoxTrackDatabase } from "@/db/database";

import { DexieHabitRepository } from "../dexie-habit-repository";

describe("DexieHabitRepository", () => {
  let testDb: FoxTrackDatabase;
  let repo: DexieHabitRepository;

  beforeEach(async () => {
    testDb = new FoxTrackDatabase("TestHabitsDB_" + Math.random().toString(36).slice(2));
    repo = new DexieHabitRepository(testDb);
  });

  afterEach(async () => {
    await testDb.delete();
  });

  it("creates, sorts by logical schedule, updates, and toggles daily logs", async () => {
    const sleep = await repo.create({
      endTime: "06:00",
      frequencyType: "daily",
      startTime: "00:00",
      title: "Sleep",
    });
    const wake = await repo.create({
      description: "Water and coffee",
      endTime: "06:15",
      frequencyType: "daily",
      startTime: "06:00",
      title: "Wake up",
    });

    const list = await repo.getAll();
    expect(list.map((h) => h.id)).toEqual([wake.id, sleep.id]);

    const updated = await repo.update(wake.id, { title: "Wake up early" });
    expect(updated.title).toBe("Wake up early");

    const logOn = await repo.toggleLog(wake.id, "2026-11-28");
    expect(logOn.completed).toBe(true);

    const logOff = await repo.toggleLog(wake.id, "2026-11-28");
    expect(logOff.completed).toBe(false);
  });

  it("archives and deletes habits along with their logs", async () => {
    const habit = await repo.create({
      frequencyType: "specific_days",
      targetDays: [1, 3],
      title: "Gym",
    });
    await repo.toggleLog(habit.id, "2026-11-28");

    const archived = await repo.toggleArchive(habit.id);
    expect(archived.archived).toBe(true);

    await repo.delete(habit.id);
    expect(await repo.getById(habit.id)).toBeUndefined();
    expect(await testDb.habitLogs.where("habitId").equals(habit.id).count()).toBe(0);
  });
});
