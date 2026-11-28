import { calculateHabitStreak, sortHabitsBySchedule } from "@/features/habits/utils/time-utils";
import { awardHabitCompletion } from "@/features/rewards/services/gamification";

import { cancelHabitReminder, scheduleHabitReminder } from "@/lib/notifications";

import { db as defaultDb, FoxTrackDatabase } from "@/db/database";

import {
  CreateHabitInput,
  CreateHabitInputSchema,
  Habit,
  HabitLog,
  HabitLogSchema,
  HabitSchema,
  UpdateHabitInput,
  UpdateHabitInputSchema,
} from "../types";

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "habit-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

export function buildHabitLogId(habitId: string, dateKey: string): string {
  return `${habitId}_${dateKey}`;
}

export class DexieHabitRepository {
  private database: FoxTrackDatabase;

  constructor(database: FoxTrackDatabase = defaultDb) {
    this.database = database;
  }

  async getAll(): Promise<Habit[]> {
    const habits = await this.database.habits.toArray();
    return sortHabitsBySchedule(habits);
  }

  async getById(id: string): Promise<Habit | undefined> {
    return await this.database.habits.get(id);
  }

  async create(input: CreateHabitInput): Promise<Habit> {
    const validated = CreateHabitInputSchema.parse(input);
    const now = Date.now();
    const currentCount = await this.database.habits.count();

    const habit: Habit = {
      archived: false,
      categoryId: validated.categoryId ?? null,
      createdAt: now,
      description: validated.description ? validated.description.trim() || undefined : undefined,
      endTime: validated.endTime ?? null,
      frequencyType: validated.frequencyType,
      id: generateId(),
      order: validated.order ?? currentCount,
      reminderEnabled: validated.reminderEnabled ?? true,
      reminderTime: validated.reminderTime ?? null,
      startTime: validated.startTime ?? null,
      targetDays:
        validated.frequencyType === "daily" ? [0, 1, 2, 3, 4, 5, 6] : validated.targetDays,
      title: validated.title,
      updatedAt: now,
    };

    HabitSchema.parse(habit);
    await this.database.habits.add(habit);
    void scheduleHabitReminder(habit);
    return habit;
  }

  async update(id: string, input: UpdateHabitInput): Promise<Habit> {
    const validated = UpdateHabitInputSchema.parse(input);
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Habit with id ${id} not found`);
    }

    const nextFrequency = validated.frequencyType ?? existing.frequencyType;
    const nextTargetDays =
      nextFrequency === "daily"
        ? [0, 1, 2, 3, 4, 5, 6]
        : (validated.targetDays ?? existing.targetDays);

    const updated: Habit = {
      ...existing,
      ...validated,
      categoryId: validated.categoryId !== undefined ? validated.categoryId : existing.categoryId,
      description:
        validated.description !== undefined
          ? validated.description.trim() || undefined
          : existing.description,
      endTime: validated.endTime !== undefined ? validated.endTime : existing.endTime,
      frequencyType: nextFrequency,
      startTime: validated.startTime !== undefined ? validated.startTime : existing.startTime,
      targetDays: nextTargetDays,
      updatedAt: Date.now(),
    };

    HabitSchema.parse(updated);
    await this.database.habits.put(updated);
    void scheduleHabitReminder(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.database.transaction(
      "rw",
      [this.database.habits, this.database.habitLogs],
      async () => {
        await this.database.habitLogs.where("habitId").equals(id).delete();
        await this.database.habits.delete(id);
      },
    );
    void cancelHabitReminder(id);
  }

  async toggleArchive(id: string): Promise<Habit> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Habit with id ${id} not found`);
    }
    return this.update(id, { archived: !existing.archived });
  }

  async toggleLog(habitId: string, dateKey: string): Promise<HabitLog> {
    const logId = buildHabitLogId(habitId, dateKey);
    const existing = await this.database.habitLogs.get(logId);
    const nextLog: HabitLog = {
      completed: existing ? !existing.completed : true,
      dateKey,
      habitId,
      id: logId,
      updatedAt: Date.now(),
    };

    HabitLogSchema.parse(nextLog);
    await this.database.habitLogs.put(nextLog);

    const [habit, logs] = await Promise.all([
      this.database.habits.get(habitId),
      this.database.habitLogs.where("habitId").equals(habitId).toArray(),
    ]);
    const completedKeys = new Set(logs.filter((l) => l.completed).map((l) => l.dateKey));
    const streak = habit ? calculateHabitStreak(habit, completedKeys) : 0;
    void awardHabitCompletion(habitId, dateKey, nextLog.completed, streak);

    return nextLog;
  }
}

export const habitRepository = new DexieHabitRepository();
