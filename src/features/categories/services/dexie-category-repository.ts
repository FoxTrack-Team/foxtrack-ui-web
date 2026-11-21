import { db, FoxTrackDatabase } from "@/db/database";

import { HABITNOW_DEFAULT_CATEGORIES } from "../constants/habitica-defaults";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "../types";

import { CategoryRepository } from "./category-repository";

function generateCategoryId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "cat-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

export class DexieCategoryRepository implements CategoryRepository {
  constructor(private database: FoxTrackDatabase = db) {}

  async getAll(): Promise<Category[]> {
    return this.database.categories.orderBy("order").toArray();
  }

  async getById(id: string): Promise<Category | null> {
    const category = await this.database.categories.get(id);
    return category ?? null;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const now = new Date().toISOString();
    const count = await this.database.categories.count();

    const category: Category = {
      color: input.color || "orange",
      createdAt: now,
      icon: input.icon || "target",
      id: input.id || generateCategoryId(),
      isDefault: Boolean(input.isDefault),
      name: input.name.trim(),
      order: input.order ?? count,
      updatedAt: now,
    };

    await this.database.categories.add(category);
    return category;
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Category with id ${id} not found`);
    }

    if (
      existing.isDefault ||
      existing.id.startsWith("habitnow-") ||
      existing.id.startsWith("habitica-")
    ) {
      throw new Error("Default categories cannot be updated");
    }

    const updated: Category = {
      ...existing,
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.color !== undefined && { color: input.color }),
      ...(input.icon !== undefined && { icon: input.icon }),
      ...(input.order !== undefined && { order: input.order }),
      updatedAt: new Date().toISOString(),
    };

    await this.database.categories.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.getById(id);
    if (
      existing?.isDefault ||
      existing?.id?.startsWith("habitnow-") ||
      existing?.id?.startsWith("habitica-")
    ) {
      throw new Error("Default categories cannot be deleted");
    }
    await this.database.categories.delete(id);
  }

  async ensureDefaults(lang = "fa"): Promise<Category[]> {
    const isFa = lang === "fa";
    const now = new Date().toISOString();

    await this.database.transaction("rw", this.database.categories, async () => {
      const allCategories = await this.database.categories.toArray();
      const officialIds = new Set(HABITNOW_DEFAULT_CATEGORIES.map((c) => c.id));
      const officialNamesFa = new Set(HABITNOW_DEFAULT_CATEGORIES.map((c) => c.nameFa));
      const officialNamesEn = new Set(HABITNOW_DEFAULT_CATEGORIES.map((c) => c.nameEn));
      const legacyNames = new Set([
        "سلامتی",
        "کار و حرفه",
        "یادگیری و مطالعه",
        "ورزش و تناسب اندام",
        "شخصی و زندگی",
        "کار و شغل",
        "کارهای خانه",
        "خلاقیت",
        "تیم و همکاری",
        "Personal",
        "Fitness",
        "Chores",
        "Creativity",
        "Teams",
        "Health + Wellness",
      ]);

      // Remove legacy or duplicate defaults that don't match our official IDs
      const toDelete: string[] = [];
      for (const cat of allCategories) {
        if (!officialIds.has(cat.id)) {
          const isLegacyDefault =
            cat.isDefault === true ||
            cat.id.startsWith("habitica-") ||
            officialNamesFa.has(cat.name) ||
            officialNamesEn.has(cat.name) ||
            legacyNames.has(cat.name);

          if (isLegacyDefault) {
            toDelete.push(cat.id);
          }
        }
      }

      if (toDelete.length > 0) {
        await this.database.categories.bulkDelete(toDelete);
      }

      // Upsert the 14 official HabitNow defaults with deterministic IDs
      for (let i = 0; i < HABITNOW_DEFAULT_CATEGORIES.length; i++) {
        const def = HABITNOW_DEFAULT_CATEGORIES[i];
        const targetName = isFa ? def.nameFa : def.nameEn;

        await this.database.categories.put({
          color: def.color,
          createdAt: now,
          icon: def.icon,
          id: def.id,
          isDefault: true,
          name: targetName,
          order: i,
          updatedAt: now,
        });
      }
    });

    return this.getAll();
  }

  async seedDefaults(lang = "fa"): Promise<Category[]> {
    return this.ensureDefaults(lang);
  }
}

export const categoryRepository = new DexieCategoryRepository();
