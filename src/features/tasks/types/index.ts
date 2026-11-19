import { z } from "zod";

export const TaskPriorityEnum = z.enum(["low", "medium", "high"]);
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;

export const TaskSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  title: z.string().trim().min(1, "Title cannot be empty"),
  completed: z.boolean(),
  priority: TaskPriorityEnum,
  dueDate: z.number().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskInputSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty"),
  priority: TaskPriorityEnum.default("medium"),
  dueDate: z.number().nullable().default(null),
});

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

export const UpdateTaskInputSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
  completed: z.boolean().optional(),
  priority: TaskPriorityEnum.optional(),
  dueDate: z.number().nullable().optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;

export type TaskFilter = "all" | "active" | "completed";
