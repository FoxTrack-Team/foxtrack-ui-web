import { z } from "zod";

export const TaskPriorityEnum = z.enum(["low", "medium", "high"]);
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;

export const TaskSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  title: z.string().trim().min(1, "Title cannot be empty"),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  completed: z.boolean(),
  priority: TaskPriorityEnum,
  dueDate: z.number().nullable(),
  dueTime: z.string().nullable().optional(),
  reminderEnabled: z.boolean().optional(),
  reminderTime: z.string().nullable().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskInputSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty"),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  priority: TaskPriorityEnum.default("medium"),
  dueDate: z.number().nullable().default(null),
  dueTime: z.string().nullable().optional(),
  reminderEnabled: z.boolean().optional(),
  reminderTime: z.string().nullable().optional(),
});

export type CreateTaskInput = z.input<typeof CreateTaskInputSchema>;

export const UpdateTaskInputSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  completed: z.boolean().optional(),
  priority: TaskPriorityEnum.optional(),
  dueDate: z.number().nullable().optional(),
  dueTime: z.string().nullable().optional(),
  reminderEnabled: z.boolean().optional(),
  reminderTime: z.string().nullable().optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;

export type TaskFilter = "all" | "active" | "completed";
