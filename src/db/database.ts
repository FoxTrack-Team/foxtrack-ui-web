import Dexie, { type EntityTable } from "dexie";

import { Category } from "@/features/categories/types";
import { Habit, HabitLog } from "@/features/habits/types";
import { CoinLog, Reward } from "@/features/rewards/types";
import { Task } from "@/features/tasks/types";

export interface AppSetting {
  key: string;
  value: string;
}

export class FoxTrackDatabase extends Dexie {
  tasks!: EntityTable<Task, "id">;
  settings!: EntityTable<AppSetting, "key">;
  categories!: EntityTable<Category, "id">;
  habits!: EntityTable<Habit, "id">;
  habitLogs!: EntityTable<HabitLog, "id">;
  rewards!: EntityTable<Reward, "id">;
  coinLogs!: EntityTable<CoinLog, "id">;

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

    // Version 3: Add tags table for task & future entities organization (backward compatible)
    this.version(3).stores({
      settings: "key",
      tags: "id, name, color, createdAt, updatedAt",
      tasks: "id, completed, priority, dueDate, createdAt, updatedAt",
    });

    // Version 4: Add *tagIds multi-entry index and description support for tasks (backward compatible)
    this.version(4)
      .stores({
        settings: "key",
        tags: "id, name, color, createdAt, updatedAt",
        tasks: "id, completed, priority, dueDate, createdAt, updatedAt, *tagIds",
      })
      .upgrade(async (tx) => {
        await tx
          .table("tasks")
          .toCollection()
          .modify((task) => {
            if (!task.tagIds) task.tagIds = [];
          });
      });

    // Version 5: Add categories table for HabitNow-style category management (backward compatible)
    this.version(5).stores({
      categories: "id, name, color, icon, order, createdAt, updatedAt",
      settings: "key",
      tags: "id, name, color, createdAt, updatedAt",
      tasks: "id, completed, priority, dueDate, createdAt, updatedAt, *tagIds",
    });

    // Version 6: Add isDefault flag for categories protection (backward compatible)
    this.version(6)
      .stores({
        categories: "id, name, color, icon, order, createdAt, updatedAt, isDefault",
        settings: "key",
        tags: "id, name, color, createdAt, updatedAt",
        tasks: "id, completed, priority, dueDate, createdAt, updatedAt, *tagIds",
      })
      .upgrade(async (tx) => {
        const defaultNamesFa = [
          "کار و شغل",
          "ورزش",
          "سلامت و تندرستی",
          "آموزش و تحصیل",
          "تیم و همکاری",
          "کارهای خانه",
          "خلاقیت",
          "سلامتی",
          "کار و حرفه",
          "یادگیری و مطالعه",
          "ورزش و تناسب اندام",
          "شخصی و زندگی",
        ];
        const defaultNamesEn = [
          "Work",
          "Exercise",
          "Health + Wellness",
          "School",
          "Teams",
          "Chores",
          "Creativity",
          "Health",
          "Fitness",
          "Study",
          "Personal",
        ];
        await tx
          .table("categories")
          .toCollection()
          .modify((cat) => {
            if (cat.isDefault === undefined) {
              cat.isDefault =
                defaultNamesFa.includes(cat.name) || defaultNamesEn.includes(cat.name);
            }
          });
      });

    // Version 7: Full 14 HabitNow default categories & deduplicate legacy categories
    this.version(7)
      .stores({
        categories: "id, name, color, icon, order, createdAt, updatedAt, isDefault",
        settings: "key",
        tags: "id, name, color, createdAt, updatedAt",
        tasks: "id, completed, priority, dueDate, createdAt, updatedAt, *tagIds",
      })
      .upgrade(async (tx) => {
        const legacyNames = [
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
        ];
        await tx
          .table("categories")
          .toCollection()
          .modify((cat, ref) => {
            if (cat.id?.startsWith("habitica-") || legacyNames.includes(cat.name)) {
              delete ref.value;
            }
          });
      });

    // Version 8: Add categoryId index to tasks for category organization (backward compatible)
    this.version(8)
      .stores({
        categories: "id, name, color, icon, order, createdAt, updatedAt, isDefault",
        settings: "key",
        tags: "id, name, color, createdAt, updatedAt",
        tasks: "id, completed, priority, dueDate, createdAt, updatedAt, *tagIds, categoryId",
      })
      .upgrade(async (tx) => {
        await tx
          .table("tasks")
          .toCollection()
          .modify((task) => {
            if (task.categoryId === undefined) {
              task.categoryId = null;
            }
          });
      });

    // Version 9: Add habits and habitLogs tables for time-blocked daily routines & habits
    this.version(9).stores({
      categories: "id, name, color, icon, order, createdAt, updatedAt, isDefault",
      habitLogs: "id, habitId, dateKey, [habitId+dateKey], completed, updatedAt",
      habits: "id, categoryId, frequencyType, archived, startTime, order, createdAt, updatedAt",
      settings: "key",
      tags: "id, name, color, createdAt, updatedAt",
      tasks: "id, completed, priority, dueDate, createdAt, updatedAt, *tagIds, categoryId",
    });

    // Version 10: Add rewards and coinLogs tables for habit/task gamification
    this.version(10).stores({
      categories: "id, name, color, icon, order, createdAt, updatedAt, isDefault",
      coinLogs: "id, dateKey, reason, entityId, createdAt",
      habitLogs: "id, habitId, dateKey, [habitId+dateKey], completed, updatedAt",
      habits: "id, categoryId, frequencyType, archived, startTime, order, createdAt, updatedAt",
      rewards: "id, title, cost, redeemedCount, createdAt, updatedAt",
      settings: "key",
      tags: "id, name, color, createdAt, updatedAt",
      tasks: "id, completed, priority, dueDate, createdAt, updatedAt, *tagIds, categoryId",
    });
  }
}

// Singleton database instance for the application
export const db = new FoxTrackDatabase();
