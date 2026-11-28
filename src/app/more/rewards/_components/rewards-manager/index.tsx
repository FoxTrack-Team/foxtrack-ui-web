"use client";

import { useState } from "react";
import Link from "next/link";

import {
  IconChevronLeft,
  IconChevronRight,
  IconCoin,
  IconFlame,
  IconGift,
  IconShield,
  IconSparkles,
} from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useSettings } from "@/providers/settings-provider";

import { Button } from "@/components/ui/button";

import {
  buyStreakFreeze,
  FREEZE_COST,
  MAX_FREEZES,
  setStrictMode,
} from "@/features/rewards/services/gamification";

import { cn } from "@/lib/utils";

import { db } from "@/db/database";

export function RewardsManager() {
  const { isRtl, language, t } = useSettings();
  const isFa = language === "fa";
  const ForwardChevron = isRtl ? IconChevronLeft : IconChevronRight;

  const settingsRows = useLiveQuery(() => db.settings.toArray(), []) ?? [];
  const rewardsCount = useLiveQuery(() => db.rewards.count(), []) ?? 0;

  const [feedback, setFeedback] = useState<string | null>(null);

  const settingsMap = new Map(settingsRows.map((r) => [r.key, r.value]));
  const coins = Math.max(0, Number(settingsMap.get("gamification_coins") ?? 0) || 0);
  const freezes = Math.max(
    0,
    Math.min(MAX_FREEZES, Number(settingsMap.get("gamification_freezes") ?? 0) || 0),
  );
  const strictMode = settingsMap.get("gamification_strict_mode") === "true";

  async function handleBuyFreeze() {
    const res = await buyStreakFreeze();
    if (res.ok) {
      setFeedback(isFa ? "سپر محافظ اضافه شد!" : "Streak Freeze added!");
      setTimeout(() => setFeedback(null), 2500);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {t.more.rewardsTitle}
        </h1>
        <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
          {t.more.rewardsDesc}
        </p>
      </div>

      {feedback && (
        <div
          className="fade-in flex animate-in items-center gap-2 rounded-2xl bg-orange-500/12 px-3.5 py-2.5 font-medium text-orange-700 text-xs ring-1 ring-orange-500/20 duration-150 dark:bg-orange-500/15 dark:text-orange-300"
          role="status"
        >
          <IconSparkles className="shrink-0" size={16} stroke={2} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Hero Wallet Card */}
      <section className="rounded-2xl bg-gradient-to-br from-orange-500/12 via-amber-500/6 to-white p-4 shadow-2xs ring-1 ring-orange-500/20 dark:from-orange-500/15 dark:via-amber-500/5 dark:to-neutral-900/90 dark:ring-orange-500/25">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
              <IconCoin size={26} stroke={2} />
            </div>
            <div>
              <p className="font-bold text-neutral-900 text-sm dark:text-neutral-100">
                {isFa ? "کیف پول فاکس‌کوین" : "FoxCoins Wallet"}
              </p>
              <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                {isFa
                  ? "با انجام تسک‌ها و عادت‌ها سکه جمع کن"
                  : "Earn coins by completing tasks & habits"}
              </p>
            </div>
          </div>

          <div className="text-end font-bold text-2xl text-neutral-900 tabular-nums dark:text-neutral-100">
            {coins}
          </div>
        </div>
      </section>

      {/* Link to Dedicated Rewards Shop */}
      <Link
        className="group flex min-h-[60px] items-center justify-between gap-3 rounded-2xl bg-white p-3.5 shadow-2xs transition-colors hover:bg-neutral-50/80 active:scale-[0.99] dark:bg-neutral-900/80 dark:hover:bg-neutral-800/40"
        href="/more/rewards/shop"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400">
            <IconGift size={20} stroke={1.9} />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-neutral-900 text-sm sm:text-xs dark:text-neutral-100">
              {isFa ? "فروشگاه پاداش‌های شخصی" : "Personal Rewards Shop"}
            </h2>
            <p className="mt-0.5 truncate text-[11px] text-neutral-500 dark:text-neutral-400">
              {isFa
                ? "ساخت و دریافت پاداش‌های دلخواه با فاکس‌کوین"
                : "Create & redeem personal rewards with FoxCoins"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="font-medium text-neutral-500 text-xs tabular-nums dark:text-neutral-400">
            {rewardsCount}
          </span>
          <ForwardChevron
            className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 dark:text-neutral-500"
            stroke={2}
          />
        </div>
      </Link>

      {/* Streak Freeze Card */}
      <section className="rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-neutral-900/80">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20 dark:bg-sky-500/15 dark:text-sky-400">
              <IconShield size={20} stroke={1.9} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-neutral-900 text-sm sm:text-xs dark:text-neutral-100">
                  {isFa ? "سپر محافظ استریک" : "Streak Freeze"}
                </h2>
                <div className="flex items-center gap-1">
                  {Array.from({ length: MAX_FREEZES }, (_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "inline-block h-2.5 w-2.5 rounded-full transition-colors",
                        i < freezes ? "bg-sky-500" : "bg-neutral-200 dark:bg-neutral-700",
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                {isFa
                  ? `محافظت خودکار از استریک در روزهای فراموش‌شده (${freezes}/${MAX_FREEZES})`
                  : `Protects your streak if you miss a day (${freezes}/${MAX_FREEZES})`}
              </p>
            </div>
          </div>

          <Button
            className="min-h-11 w-full gap-1.5 rounded-xl sm:min-h-9 sm:w-auto"
            disabled={freezes >= MAX_FREEZES || coins < FREEZE_COST}
            size="sm"
            type="button"
            variant="outline"
            onClick={handleBuyFreeze}
          >
            <IconCoin className="text-amber-500" size={15} stroke={2} />
            <span>{freezes >= MAX_FREEZES ? (isFa ? "تکمیل" : "Maxed") : `${FREEZE_COST}`}</span>
          </Button>
        </div>
      </section>

      {/* Strict Mode Penalty Toggle */}
      <section className="rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-neutral-900/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400">
              <IconFlame size={20} stroke={1.9} />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900 text-sm sm:text-xs dark:text-neutral-100">
                {isFa ? "حالت سخت‌گیرانه (جریمه)" : "Strict Mode (Penalty)"}
              </h2>
              <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                {isFa
                  ? "کسر ۵ سکه برای هر عادت انجام‌نشده (موجودی منفی نمی‌شود)"
                  : "Deduct 5 coins for missed habits (balance never goes below 0)"}
              </p>
            </div>
          </div>

          <button
            aria-checked={strictMode}
            aria-label={isFa ? "حالت سخت‌گیرانه" : "Strict Mode"}
            role="switch"
            type="button"
            className={cn(
              "relative inline-flex h-8 w-13 shrink-0 items-center rounded-full p-1 transition-colors",
              strictMode ? "bg-rose-500" : "bg-neutral-300 dark:bg-neutral-700",
            )}
            onClick={() => void setStrictMode(!strictMode)}
          >
            <span
              className={cn(
                "h-6 w-6 rounded-full bg-white shadow-xs transition-transform",
                strictMode ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>
      </section>
    </div>
  );
}
