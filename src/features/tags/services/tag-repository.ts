import { CreateTagDTO, Tag, UpdateTagDTO } from "../types";

export interface ITagRepository {
  create(dto: CreateTagDTO): Promise<Tag>;
  delete(id: string): Promise<void>;
  getAll(): Promise<Tag[]>;
  getById(id: string): Promise<Tag | undefined>;
  update(id: string, dto: UpdateTagDTO): Promise<Tag>;
}
