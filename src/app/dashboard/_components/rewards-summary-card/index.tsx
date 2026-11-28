"use client";

import Link from "next/link";

import {
  IconChevronLeft,
  IconChevronRight,
  IconCoin,
  IconGift,
  IconShield,
} from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useSettings } from "@/providers/settings-provider";

import { MAX_FREEZES } from "@/features/rewards/services/gamification";

import { db } from "@/db/database";

export function RewardsSummaryCard() {
  const { isRtl, language, t } = useSettings();
  const isFa = language === "fa";
  const ForwardChevron = isRtl ? IconChevronLeft : IconChevronRight;

  const settingsRows = useLiveQuery(() => db.settings.toArray(), []) ?? [];
  const rewards = useLiveQuery(() => db.rewards.orderBy("cost").toArray(), []) ?? [];
  const settingsMap = new Map(settingsRows.map((r) => [r.key, r.value]));

  const coins = Math.max(0, Number(settingsMap.get("gamification_coins") ?? 0) || 0);
  const freezes = Math.max(
    0,
    Math.min(MAX_FREEZES, Number(settingsMap.get("gamification_freezes") ?? 0) || 0),
  );
  const nextReward = rewards[0];
  const isRewardReady = nextReward ? coins >= nextReward.cost : false;

  return (
    <Link
      className="group block rounded-2xl bg-gradient-to-r from-orange-500/[0.08] via-amber-500/[0.05] to-white p-3 shadow-2xs ring-1 ring-orange-500/15 transition-all hover:ring-orange-500/30 active:scale-[0.99] dark:from-orange-500/12 dark:via-amber-500/6 dark:to-neutral-900/90 dark:ring-orange-500/20"
      href="/more/rewards"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-bold text-amber-700 text-xs tabular-nums dark:bg-amber-500/20 dark:text-amber-300">
            <IconCoin className="text-amber-500" size={15} stroke={2.2} />
            <span>{coins}</span>
          </span>
          <span className="truncate font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {t.more.rewardsTitle}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 tabular-nums">
          <span
            aria-label={isFa ? "سپر محافظ" : "Streak Freeze"}
            className="inline-flex items-center gap-1 font-semibold text-sky-600 text-xs dark:text-sky-400"
          >
            <IconShield size={14} stroke={2} />
            <span>
              {freezes}/{MAX_FREEZES}
            </span>
          </span>

          <ForwardChevron
            className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 dark:text-neutral-500"
            stroke={2}
          />
        </div>
      </div>

      {nextReward && (
        <div className="mt-2.5 flex items-center justify-between gap-2 border-orange-500/10 border-t pt-2 text-[11px] tabular-nums">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
            <IconGift
              className={isRewardReady ? "shrink-0 text-orange-500" : "shrink-0 text-amber-500"}
              size={13}
              stroke={2}
            />
            <span className="truncate">
              {isRewardReady
                ? isFa
                  ? `آماده دریافت: ${nextReward.title}`
                  : `Ready to redeem: ${nextReward.title}`
                : isFa
                  ? `جایزه بعدی: ${nextReward.title}`
                  : `Next reward: ${nextReward.title}`}
            </span>
          </span>
          <span
            className={
              isRewardReady
                ? "shrink-0 font-semibold text-orange-600 dark:text-orange-400"
                : "shrink-0 font-medium text-neutral-500 dark:text-neutral-400"
            }
          >
            {Math.min(coins, nextReward.cost)}/{nextReward.cost}
          </span>
        </div>
      )}
    </Link>
  );
}
