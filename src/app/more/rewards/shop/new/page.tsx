"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createReward, estimateDailyCoins } from "@/features/rewards/services/gamification";

import { cn } from "@/lib/utils";

import { db } from "@/db/database";

const PRICE_PRESETS = [50, 150, 400, 1000] as const;

export default function NewRewardPage() {
  const router = useRouter();
  const { language, t } = useTranslation();
  const isFa = language === "fa";

  const habits = useLiveQuery(() => db.habits.toArray(), []) ?? [];
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("100");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeHabitsCount = habits.filter((h) => !h.archived).length;
  const dailyEstimate = estimateDailyCoins(activeHabitsCount);
  const parsedCost = Math.max(5, Number(cost) || 50);
  const estimatedDays = Math.max(0.5, Math.round((parsedCost / dailyEstimate) * 10) / 10);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createReward(title.trim(), parsedCost);
      router.push("/more/rewards/shop");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <SubpageHeader
        backHref="/more/rewards/shop"
        backLabel={isFa ? "فروشگاه پاداش‌ها" : "Rewards Shop"}
      />

      <div>
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {isFa ? "پاداش جدید" : "New Reward"}
        </h1>
      </div>

      <form
        className="space-y-4 rounded-2xl bg-white p-4 shadow-2xs dark:bg-neutral-900/80"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {isFa ? "عنوان پاداش" : "Reward Title"}
          </label>
          <Input
            autoFocus
            className="h-11 rounded-xl"
            placeholder={isFa ? "مثلاً: ۱ ساعت فیلم دیدن" : "e.g. 1 hour movie"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {isFa ? "قیمت (سکه)" : "Cost (FoxCoins)"}
          </label>
          <Input
            className="h-11 rounded-xl tabular-nums"
            min={5}
            step={5}
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PRICE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={cn(
                  "min-h-10 rounded-full px-3 font-medium text-xs tabular-nums transition-all active:scale-95",
                  Number(cost) === preset
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
                )}
                onClick={() => setCost(String(preset))}
              >
                {preset} 🪙
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            {isFa
              ? `بر اساس ${activeHabitsCount} عادت فعال شما، این پاداش معادل حدود ${estimatedDays} روز تلاش است.`
              : `Based on your ${activeHabitsCount} active habits, this equals ~${estimatedDays} days of effort.`}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            className="min-h-11 w-full rounded-xl"
            disabled={isSubmitting || !title.trim()}
            type="submit"
          >
            {t.common.save}
          </Button>
          <Button
            className="min-h-11 w-full rounded-xl bg-neutral-200/70 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200"
            type="button"
            variant="ghost"
            onClick={() => router.push("/more/rewards/shop")}
          >
            {t.common.cancel}
          </Button>
        </div>
      </form>
    </div>
  );
}
