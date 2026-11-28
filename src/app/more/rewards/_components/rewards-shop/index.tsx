"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { IconCoin, IconGift, IconSparkles, IconTrash } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { EmptyState } from "@/components/empty-state";
import { TaskFab } from "@/components/task-fab";

import { deleteReward, redeemReward } from "@/features/rewards/services/gamification";

import { cn } from "@/lib/utils";

import { db } from "@/db/database";

export function RewardsShop() {
  const router = useRouter();
  const { language, t } = useTranslation();
  const isFa = language === "fa";

  const coinsRow = useLiveQuery(() => db.settings.get("gamification_coins"), []);
  const rewards = useLiveQuery(() => db.rewards.orderBy("cost").toArray(), []) ?? [];
  const [redeemFeedback, setRedeemFeedback] = useState<string | null>(null);

  const coins = Math.max(0, Number(coinsRow?.value ?? 0) || 0);

  async function handleRedeem(rewardId: string, title: string) {
    const res = await redeemReward(rewardId);
    if (res.ok) {
      setRedeemFeedback(isFa ? `پاداش «${title}» دریافت شد!` : `Redeemed "${title}"!`);
      setTimeout(() => setRedeemFeedback(null), 2500);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
            {isFa ? "فروشگاه پاداش‌ها" : "Rewards Shop"}
          </h1>
          <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
            {isFa
              ? "پاداش‌های شخصی بساز و با سکه‌هات بگیر"
              : "Create personal rewards and redeem with FoxCoins"}
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1.5 font-bold text-amber-700 text-xs tabular-nums ring-1 ring-amber-500/20 dark:bg-amber-500/20 dark:text-amber-300">
          <IconCoin className="text-amber-500" size={15} stroke={2.2} />
          <span>{coins}</span>
        </span>
      </div>

      {redeemFeedback && (
        <div
          className="fade-in flex animate-in items-center gap-2 rounded-2xl bg-orange-500/12 px-3.5 py-2.5 font-medium text-orange-700 text-xs ring-1 ring-orange-500/20 duration-150 dark:bg-orange-500/15 dark:text-orange-300"
          role="status"
        >
          <IconSparkles className="shrink-0" size={16} stroke={2} />
          <span>{redeemFeedback}</span>
        </div>
      )}

      {rewards.length === 0 ? (
        <EmptyState
          framed
          icon={IconGift}
          title={isFa ? "هنوز پاداشی نساختی" : "No rewards yet"}
          description={
            isFa
              ? "پاداش‌های دلخواهت (مثل قهوه یا فیلم) رو بساز و با سکه‌هات بگیر."
              : "Create personal rewards (like coffee or movie time) and redeem them with FoxCoins."
          }
        />
      ) : (
        <div className="space-y-2">
          {rewards.map((reward) => {
            const canAfford = coins >= reward.cost;
            return (
              <div
                className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-neutral-900/80"
                key={reward.id}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400">
                    <IconGift size={18} stroke={1.9} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-neutral-900 text-sm dark:text-neutral-100">
                      {reward.title}
                    </p>
                    <p className="text-[11px] text-neutral-500 tabular-nums dark:text-neutral-400">
                      {isFa
                        ? `${reward.redeemedCount} بار دریافت‌شده`
                        : `Redeemed ${reward.redeemedCount}x`}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    aria-label={t.common.delete}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-colors after:absolute after:-inset-1 after:content-[''] hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30"
                    type="button"
                    onClick={() => void deleteReward(reward.id)}
                  >
                    <IconTrash size={15} stroke={1.8} />
                  </button>
                  <button
                    disabled={!canAfford}
                    type="button"
                    className={cn(
                      "inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 font-semibold text-xs tabular-nums transition-all active:scale-95",
                      canAfford
                        ? "bg-orange-500 text-white shadow-xs hover:bg-orange-600"
                        : "cursor-not-allowed bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500",
                    )}
                    onClick={() => void handleRedeem(reward.id, reward.title)}
                  >
                    <IconCoin size={14} stroke={2.1} />
                    <span>{reward.cost}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskFab
        ariaLabel={isFa ? "افزودن پاداش جدید" : "Add new reward"}
        onClick={() => router.push("/more/rewards/shop/new")}
      />
    </div>
  );
}
