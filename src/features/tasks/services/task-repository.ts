import { CreateTaskInput, Task, TaskFilter, UpdateTaskInput } from "../types";

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | undefined>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task>;
  delete(id: string): Promise<void>;
  toggleComplete(id: string): Promise<Task>;
  getFiltered(filter: TaskFilter): Promise<Task[]>;
}
