import { z } from "zod";

export const HabitFrequencyEnum = z.enum(["daily", "specific_days"]);
export type HabitFrequency = z.infer<typeof HabitFrequencyEnum>;

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const HabitTimeSchema = z
  .string()
  .regex(TIME_PATTERN, "Time must be in HH:mm format")
  .nullable()
  .optional();

export const HabitSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Title cannot be empty"),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  startTime: HabitTimeSchema,
  endTime: HabitTimeSchema,
  reminderEnabled: z.boolean().optional(),
  reminderTime: HabitTimeSchema,
  frequencyType: HabitFrequencyEnum,
  targetDays: z.array(z.number().int().min(0).max(6)),
  archived: z.boolean(),
  order: z.number().int().min(0),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Habit = z.infer<typeof HabitSchema>;

export const CreateHabitInputSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty"),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  startTime: HabitTimeSchema,
  endTime: HabitTimeSchema,
  reminderEnabled: z.boolean().optional(),
  reminderTime: HabitTimeSchema,
  frequencyType: HabitFrequencyEnum.default("daily"),
  targetDays: z.array(z.number().int().min(0).max(6)).default([0, 1, 2, 3, 4, 5, 6]),
  order: z.number().int().min(0).optional(),
});

export type CreateHabitInput = z.input<typeof CreateHabitInputSchema>;

export const UpdateHabitInputSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  startTime: HabitTimeSchema,
  endTime: HabitTimeSchema,
  reminderEnabled: z.boolean().optional(),
  reminderTime: HabitTimeSchema,
  frequencyType: HabitFrequencyEnum.optional(),
  targetDays: z.array(z.number().int().min(0).max(6)).optional(),
  archived: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export type UpdateHabitInput = z.infer<typeof UpdateHabitInputSchema>;

export const HabitLogSchema = z.object({
  id: z.string().min(1),
  habitId: z.string().min(1),
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "dateKey must be YYYY-MM-DD"),
  completed: z.boolean(),
  updatedAt: z.number(),
});

export type HabitLog = z.infer<typeof HabitLogSchema>;

export type HabitFilter = "today" | "all" | "archived";
