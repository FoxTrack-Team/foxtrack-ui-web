import { Category, CreateCategoryInput, UpdateCategoryInput } from "../types";

export interface CategoryRepository {
  create(input: CreateCategoryInput): Promise<Category>;
  delete(id: string): Promise<void>;
  ensureDefaults(lang?: string): Promise<Category[]>;
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  seedDefaults(lang?: string): Promise<Category[]>;
  update(id: string, input: UpdateCategoryInput): Promise<Category>;
}
