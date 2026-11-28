import { db } from "@/db/database";

import type { CoinLog, Reward } from "../types";

export const FREEZE_COST = 50;
export const MAX_FREEZES = 2;
export const PENALTY_PER_MISSED_HABIT = 5;
export const TASK_COIN_REWARD = 5;
export const HABIT_BASE_COIN_REWARD = 10;
export const DAILY_ALL_DONE_BONUS = 20;

const SETTING_KEYS = {
  coins: "gamification_coins",
  freezes: "gamification_freezes",
  strictMode: "gamification_strict_mode",
} as const;

export interface GamificationProfile {
  coins: number;
  freezes: number;
  strictMode: boolean;
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 21) return 2;
  if (streak >= 7) return 1.5;
  if (streak >= 3) return 1.2;
  return 1;
}

export function estimateDailyCoins(activeHabitsCount: number): number {
  return Math.max(30, activeHabitsCount * HABIT_BASE_COIN_REWARD + DAILY_ALL_DONE_BONUS);
}

function generateId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getGamificationProfile(): Promise<GamificationProfile> {
  const rows = await db.settings
    .where("key")
    .anyOf([SETTING_KEYS.coins, SETTING_KEYS.freezes, SETTING_KEYS.strictMode])
    .toArray();

  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    coins: Math.max(0, Number(map.get(SETTING_KEYS.coins) ?? 0) || 0),
    freezes: Math.max(0, Math.min(MAX_FREEZES, Number(map.get(SETTING_KEYS.freezes) ?? 0) || 0)),
    strictMode: map.get(SETTING_KEYS.strictMode) === "true",
  };
}

async function saveProfile(profile: GamificationProfile): Promise<void> {
  await db.settings.bulkPut([
    { key: SETTING_KEYS.coins, value: String(Math.max(0, Math.round(profile.coins))) },
    {
      key: SETTING_KEYS.freezes,
      value: String(Math.max(0, Math.min(MAX_FREEZES, profile.freezes))),
    },
    { key: SETTING_KEYS.strictMode, value: String(profile.strictMode) },
  ]);
}

async function appendCoinLog(
  amount: number,
  reason: CoinLog["reason"],
  dateKey: string,
  entityId?: string,
): Promise<void> {
  await db.coinLogs.add({
    amount,
    createdAt: Date.now(),
    dateKey,
    entityId,
    id: generateId("log"),
    reason,
  });
}

export async function awardTaskCompletion(taskId: string, completed: boolean): Promise<number> {
  const profile = await getGamificationProfile();
  const delta = completed ? TASK_COIN_REWARD : -TASK_COIN_REWARD;

  await saveProfile({
    ...profile,
    coins: Math.max(0, profile.coins + delta),
  });
  await appendCoinLog(delta, "task", new Date().toISOString().slice(0, 10), taskId);
  return delta;
}

export async function awardHabitCompletion(
  habitId: string,
  dateKey: string,
  completed: boolean,
  streak: number,
): Promise<number> {
  const profile = await getGamificationProfile();
  const multiplier = getStreakMultiplier(streak);
  const baseCoins = Math.round(HABIT_BASE_COIN_REWARD * multiplier);
  const delta = completed ? baseCoins : -baseCoins;

  await saveProfile({
    ...profile,
    coins: Math.max(0, profile.coins + delta),
  });
  await appendCoinLog(delta, "habit", dateKey, habitId);
  return delta;
}

export async function buyStreakFreeze(): Promise<{ ok: boolean; profile: GamificationProfile }> {
  const profile = await getGamificationProfile();
  if (profile.freezes >= MAX_FREEZES || profile.coins < FREEZE_COST) {
    return { ok: false, profile };
  }
  const next: GamificationProfile = {
    ...profile,
    coins: profile.coins - FREEZE_COST,
    freezes: profile.freezes + 1,
  };
  await saveProfile(next);
  await appendCoinLog(-FREEZE_COST, "freeze", new Date().toISOString().slice(0, 10));
  return { ok: true, profile: next };
}

export async function setStrictMode(enabled: boolean): Promise<void> {
  const profile = await getGamificationProfile();
  await saveProfile({ ...profile, strictMode: enabled });
}

export async function createReward(title: string, cost: number): Promise<Reward> {
  const now = Date.now();
  const reward: Reward = {
    cost: Math.max(5, Math.round(cost)),
    createdAt: now,
    id: generateId("reward"),
    redeemedCount: 0,
    title: title.trim(),
    updatedAt: now,
  };
  await db.rewards.add(reward);
  return reward;
}

export async function redeemReward(
  rewardId: string,
): Promise<{ ok: boolean; profile: GamificationProfile }> {
  const [profile, reward] = await Promise.all([getGamificationProfile(), db.rewards.get(rewardId)]);
  if (!reward || profile.coins < reward.cost) {
    return { ok: false, profile };
  }
  const next: GamificationProfile = {
    ...profile,
    coins: profile.coins - reward.cost,
  };
  await Promise.all([
    saveProfile(next),
    db.rewards.update(rewardId, {
      redeemedCount: (reward.redeemedCount ?? 0) + 1,
      updatedAt: Date.now(),
    }),
    appendCoinLog(-reward.cost, "redeem", new Date().toISOString().slice(0, 10), rewardId),
  ]);
  return { ok: true, profile: next };
}

export async function deleteReward(rewardId: string): Promise<void> {
  await db.rewards.delete(rewardId);
}
