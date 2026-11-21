import { db as defaultDb, FoxTrackDatabase } from "@/db/database";

import { CreateTagDTO, Tag, UpdateTagDTO } from "../types";

import { ITagRepository } from "./tag-repository";

function generateTagId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "tag-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

export class DexieTagRepository implements ITagRepository {
  constructor(private db: FoxTrackDatabase = defaultDb) {}

  async getAll(): Promise<Tag[]> {
    return this.db.tags.orderBy("createdAt").reverse().toArray();
  }

  async getById(id: string): Promise<Tag | undefined> {
    return this.db.tags.get(id);
  }

  async create(dto: CreateTagDTO): Promise<Tag> {
    const now = Date.now();
    const tag: Tag = {
      color: dto.color || "orange",
      createdAt: now,
      id: generateTagId(),
      name: dto.name.trim(),
      updatedAt: now,
    };
    await this.db.tags.add(tag);
    return tag;
  }

  async update(id: string, dto: UpdateTagDTO): Promise<Tag> {
    const existing = await this.db.tags.get(id);
    if (!existing) {
      throw new Error(`Tag with id ${id} not found`);
    }

    const updated: Tag = {
      ...existing,
      ...dto,
      name: dto.name !== undefined ? dto.name.trim() : existing.name,
      updatedAt: Date.now(),
    };

    await this.db.tags.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.transaction("rw", [this.db.tags, this.db.tasks], async () => {
      await this.db.tags.delete(id);
      const tasksWithTag = await this.db.tasks
        .filter((task) => Array.isArray(task.tagIds) && task.tagIds.includes(id))
        .toArray();

      for (const task of tasksWithTag) {
        const nextTagIds = (task.tagIds || []).filter((tagId) => tagId !== id);
        await this.db.tasks.update(task.id, {
          tagIds: nextTagIds,
          updatedAt: Date.now(),
        });
      }
    });
  }
}

export const tagRepository = new DexieTagRepository();
