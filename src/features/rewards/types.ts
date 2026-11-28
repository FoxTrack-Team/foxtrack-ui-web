import { z } from "zod";

export const RewardSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Title cannot be empty"),
  cost: z.number().int().min(5),
  redeemedCount: z.number().int().min(0).default(0),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Reward = z.infer<typeof RewardSchema>;

export const CoinLogSchema = z.object({
  id: z.string().min(1),
  dateKey: z.string(),
  amount: z.number().int(),
  reason: z.enum(["habit", "task", "daily_bonus", "penalty", "freeze", "redeem"]),
  entityId: z.string().optional(),
  createdAt: z.number(),
});

export type CoinLog = z.infer<typeof CoinLogSchema>;
