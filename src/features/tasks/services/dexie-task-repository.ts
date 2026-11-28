import { awardTaskCompletion } from "@/features/rewards/services/gamification";

import { cancelTaskReminder, scheduleTaskReminder } from "@/lib/notifications";

import { db as defaultDb, FoxTrackDatabase } from "@/db/database";

import {
  CreateTaskInput,
  CreateTaskInputSchema,
  Task,
  TaskFilter,
  TaskSchema,
  UpdateTaskInput,
  UpdateTaskInputSchema,
} from "../types";

import { TaskRepository } from "./task-repository";
import { sortTasks } from "./task-sorter";

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "task-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

export class DexieTaskRepository implements TaskRepository {
  private database: FoxTrackDatabase;

  constructor(database: FoxTrackDatabase = defaultDb) {
    this.database = database;
  }

  async getAll(): Promise<Task[]> {
    const tasks = await this.database.tasks.toArray();
    return sortTasks(tasks);
  }

  async getById(id: string): Promise<Task | undefined> {
    return await this.database.tasks.get(id);
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const validatedInput = CreateTaskInputSchema.parse(input);
    const now = Date.now();

    const task: Task = {
      id: generateId(),
      title: validatedInput.title,
      description: validatedInput.description ? validatedInput.description.trim() : undefined,
      categoryId: validatedInput.categoryId ?? null,
      tagIds: validatedInput.tagIds ?? [],
      completed: false,
      priority: validatedInput.priority,
      dueDate: validatedInput.dueDate,
      dueTime: validatedInput.dueTime ?? null,
      reminderEnabled: validatedInput.reminderEnabled ?? true,
      reminderTime: validatedInput.reminderTime ?? null,
      createdAt: now,
      updatedAt: now,
    };

    // Full validation before writing to IndexedDB
    TaskSchema.parse(task);

    await this.database.tasks.add(task);
    void scheduleTaskReminder(task);
    return task;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const validatedInput = UpdateTaskInputSchema.parse(input);
    const existing = await this.getById(id);

    if (!existing) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updatedTask: Task = {
      ...existing,
      ...validatedInput,
      description:
        validatedInput.description !== undefined
          ? validatedInput.description.trim() || undefined
          : existing.description,
      categoryId:
        validatedInput.categoryId !== undefined
          ? validatedInput.categoryId
          : (existing.categoryId ?? null),
      tagIds: validatedInput.tagIds !== undefined ? validatedInput.tagIds : (existing.tagIds ?? []),
      updatedAt: Date.now(),
    };

    // Full validation before updating
    TaskSchema.parse(updatedTask);

    await this.database.tasks.put(updatedTask);
    void scheduleTaskReminder(updatedTask);
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Task with id ${id} not found`);
    }
    await this.database.tasks.delete(id);
    void cancelTaskReminder(id);
  }

  async toggleComplete(id: string): Promise<Task> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updated = await this.update(id, { completed: !existing.completed });
    void awardTaskCompletion(id, updated.completed);
    return updated;
  }

  async getFiltered(filter: TaskFilter): Promise<Task[]> {
    const all = await this.database.tasks.toArray();
    const filtered = all.filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
    return sortTasks(filtered);
  }
}

export const taskRepository = new DexieTaskRepository();
