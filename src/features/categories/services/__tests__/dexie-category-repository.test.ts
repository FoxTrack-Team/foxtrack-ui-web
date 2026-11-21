import { beforeEach, describe, expect, it } from "vitest";

import { db } from "@/db/database";

import { DexieCategoryRepository } from "../dexie-category-repository";

describe("DexieCategoryRepository", () => {
  let repository: DexieCategoryRepository;

  beforeEach(async () => {
    await db.categories.clear();
    repository = new DexieCategoryRepository(db);
  });

  it("creates and retrieves a category", async () => {
    const created = await repository.create({
      color: "blue",
      icon: "briefcase",
      name: "Work",
    });

    expect(created.name).toBe("Work");
    expect(created.color).toBe("blue");
    expect(created.icon).toBe("briefcase");
    expect(created.id).toBeDefined();

    const retrieved = await repository.getById(created.id);
    expect(retrieved?.name).toBe("Work");
  });

  it("updates a category", async () => {
    const created = await repository.create({
      color: "rose",
      icon: "heart",
      name: "Health",
    });

    const updated = await repository.update(created.id, {
      color: "emerald",
      name: "Wellness",
    });

    expect(updated.name).toBe("Wellness");
    expect(updated.color).toBe("emerald");
    expect(updated.icon).toBe("heart");
  });

  it("deletes a category", async () => {
    const created = await repository.create({
      name: "Temporary",
    });

    await repository.delete(created.id);
    const retrieved = await repository.getById(created.id);
    expect(retrieved).toBeNull();
  });

  it("seeds HabitNow defaults with isDefault true", async () => {
    const defaults = await repository.seedDefaults("en");
    expect(defaults.length).toBe(14);
    expect(defaults.every((c) => c.isDefault)).toBe(true);

    const all = await repository.getAll();
    expect(all.length).toBe(14);
    expect(all.map((c) => c.name)).toContain("Quit a bad habit");
    expect(all.map((c) => c.name)).toContain("Art");
    expect(all.map((c) => c.name)).toContain("Meditation");
    expect(all.map((c) => c.name)).toContain("Study");
    expect(all.map((c) => c.name)).toContain("Sports");
    expect(all.map((c) => c.name)).toContain("Entertainment");
    expect(all.map((c) => c.name)).toContain("Social");
    expect(all.map((c) => c.name)).toContain("Finance");
    expect(all.map((c) => c.name)).toContain("Health");
    expect(all.map((c) => c.name)).toContain("Work");
    expect(all.map((c) => c.name)).toContain("Nutrition");
    expect(all.map((c) => c.name)).toContain("Home");
    expect(all.map((c) => c.name)).toContain("Outdoor");
    expect(all.map((c) => c.name)).toContain("Other");
  });

  it("prevents updating or deleting default categories", async () => {
    const defaults = await repository.seedDefaults("en");
    const defaultCat = defaults[0];

    await expect(repository.update(defaultCat.id, { name: "Renamed" })).rejects.toThrow(
      "Default categories cannot be updated",
    );

    await expect(repository.delete(defaultCat.id)).rejects.toThrow(
      "Default categories cannot be deleted",
    );
  });

  it("ensureDefaults seeds 14 categories, removes duplicates, and preserves custom categories", async () => {
    // Add a custom category
    const custom = await repository.create({
      color: "orange",
      name: "My Custom Project",
    });

    // Add a legacy duplicate default category
    await db.categories.add({
      color: "blue",
      createdAt: new Date().toISOString(),
      icon: "briefcase",
      id: "habitica-work",
      isDefault: true,
      name: "Work",
      order: 99,
      updatedAt: new Date().toISOString(),
    });

    const categories = await repository.ensureDefaults("en");
    // Should have 14 official defaults + 1 custom category = 15 total
    expect(categories.length).toBe(15);
    expect(categories.some((c) => c.id === custom.id)).toBe(true);
    expect(categories.some((c) => c.id === "habitica-work")).toBe(false);

    // Call again, should still be 15
    const second = await repository.ensureDefaults("en");
    expect(second.length).toBe(15);
  });

  it("creates a category with fallback ID when crypto.randomUUID is not available", async () => {
    const originalRandomUUID = crypto.randomUUID;
    // @ts-expect-error simulating environment where crypto.randomUUID is undefined
    crypto.randomUUID = undefined;

    try {
      const created = await repository.create({
        color: "amber",
        name: "Fallback Test",
      });
      expect(created.id).toBeDefined();
      expect(created.id.startsWith("cat-")).toBe(true);

      const retrieved = await repository.getById(created.id);
      expect(retrieved?.name).toBe("Fallback Test");
    } finally {
      crypto.randomUUID = originalRandomUUID;
    }
  });
});
