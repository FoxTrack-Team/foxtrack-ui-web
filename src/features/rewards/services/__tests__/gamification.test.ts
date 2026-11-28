import { beforeEach, describe, expect, it } from "vitest";

import { db } from "@/db/database";

import {
  awardHabitCompletion,
  awardTaskCompletion,
  buyStreakFreeze,
  createReward,
  estimateDailyCoins,
  FREEZE_COST,
  getGamificationProfile,
  getStreakMultiplier,
  redeemReward,
} from "../gamification";

import "fake-indexeddb/auto";

describe("gamification", () => {
  beforeEach(async () => {
    await db.settings.clear();
    await db.rewards.clear();
    await db.coinLogs.clear();
  });

  it("computes streak multipliers accurately", () => {
    expect(getStreakMultiplier(0)).toBe(1);
    expect(getStreakMultiplier(2)).toBe(1);
    expect(getStreakMultiplier(3)).toBe(1.2);
    expect(getStreakMultiplier(7)).toBe(1.5);
    expect(getStreakMultiplier(21)).toBe(2);
  });

  it("estimates daily coins dynamically based on active habits count", () => {
    expect(estimateDailyCoins(0)).toBe(30);
    expect(estimateDailyCoins(5)).toBe(70);
  });

  it("awards and reverts coins on task and habit completion", async () => {
    await awardTaskCompletion("t1", true);
    await awardHabitCompletion("h1", "2026-11-28", true, 7); // 10 * 1.5 = 15

    let profile = await getGamificationProfile();
    expect(profile.coins).toBe(20);

    await awardTaskCompletion("t1", false);
    profile = await getGamificationProfile();
    expect(profile.coins).toBe(15);
  });

  it("allows buying streak freeze and redeeming rewards when coins suffice", async () => {
    // Earn 100 coins
    for (let i = 0; i < 5; i++) {
      await awardHabitCompletion(`h-${i}`, "2026-11-28", true, 21); // 20 each
    }

    const freezeRes = await buyStreakFreeze();
    expect(freezeRes.ok).toBe(true);
    expect(freezeRes.profile.freezes).toBe(1);
    expect(freezeRes.profile.coins).toBe(100 - FREEZE_COST);

    const reward = await createReward("Coffee", 40);
    const redeemRes = await redeemReward(reward.id);
    expect(redeemRes.ok).toBe(true);
    expect(redeemRes.profile.coins).toBe(10);

    const updatedReward = await db.rewards.get(reward.id);
    expect(updatedReward?.redeemedCount).toBe(1);
  });
});
