"use client";

import { type MouseEvent, type TouchEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconFlame,
  IconNotes,
  IconTrash,
} from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { CategoryIcon } from "@/features/categories/components/category-icon";
import { getCategoryColor } from "@/features/categories/constants";
import { Category } from "@/features/categories/types";
import { habitRepository } from "@/features/habits/services/dexie-habit-repository";
import { Habit } from "@/features/habits/types";
import {
  calculateHabitStreak,
  formatDuration,
  getDurationMinutes,
  isCurrentTimeBlock,
} from "@/features/habits/utils/time-utils";
import { getStreakMultiplier } from "@/features/rewards/services/gamification";

import { useDirection } from "@/hooks/use-direction";

import { cn } from "@/lib/utils";

interface HabitItemProps {
  category?: Category;
  completedDateKeys: Set<string>;
  dateKey: string;
  habit: Habit;
  isTodayView: boolean;
  mode?: "daily" | "manage";
}

export function HabitItem({
  category,
  completedDateKeys,
  dateKey,
  habit,
  isTodayView = true,
  mode = "daily",
}: HabitItemProps) {
  const router = useRouter();
  const { language, t } = useTranslation();
  const { isRtl } = useDirection();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isSwipingRef = useRef(false);
  const ChevronIcon = isRtl ? IconChevronLeft : IconChevronRight;

  const isDaily = mode === "daily";
  const isCompleted = isDaily && completedDateKeys.has(dateKey);
  const hasDescription = Boolean(habit.description?.trim());
  const durationMinutes = getDurationMinutes(habit.startTime, habit.endTime);
  const isNow = isDaily && isTodayView && isCurrentTimeBlock(habit.startTime, habit.endTime);
  const streak = calculateHabitStreak(habit, completedDateKeys);
  const streakMultiplier = getStreakMultiplier(streak);
  const colorDetails = category ? getCategoryColor(category.color) : null;
  const hasTopRow = Boolean(habit.startTime || isNow);
  const showNotesInTopRow = hasDescription && hasTopRow;
  const showNotesInBottomRow = hasDescription && !hasTopRow;

  function handleNavigateEdit() {
    if (swipeOffset !== 0) {
      setSwipeOffset(0);
      return;
    }
    router.push(`/habits/edit?id=${habit.id}`);
  }

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    if (isDaily) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isSwipingRef.current = false;
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (isDaily || !touchStartRef.current) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;
    if (!isSwipingRef.current && Math.abs(dy) > Math.abs(dx)) {
      touchStartRef.current = null;
      return;
    }
    if (Math.abs(dx) > 8) isSwipingRef.current = true;
    const directionalDx = isRtl ? -dx : dx;
    if (directionalDx < 0) {
      setSwipeOffset(Math.max(directionalDx, -80));
    } else if (swipeOffset < 0) {
      setSwipeOffset(Math.min(0, -72 + directionalDx));
    }
  }

  function handleTouchEnd() {
    if (isDaily) return;
    touchStartRef.current = null;
    setSwipeOffset((prev) => (prev <= -44 ? -72 : 0));
  }

  async function handleSwipeDelete(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    await habitRepository.delete(habit.id);
  }

  async function handleToggle() {
    if (isDaily && !isTodayView) return;
    await habitRepository.toggleLog(habit.id, dateKey);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    await habitRepository.delete(habit.id);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {!isDaily && swipeOffset < 0 && (
        <div className="absolute inset-y-0 end-0 flex items-center pe-1 sm:hidden">
          <button
            aria-label={t.common.delete}
            className="flex h-full min-w-[64px] items-center justify-center rounded-xl bg-red-500 text-white active:bg-red-600"
            type="button"
            onClick={handleSwipeDelete}
          >
            <IconTrash size={18} stroke={2} />
          </button>
        </div>
      )}

      <div
        role={isDaily ? undefined : "button"}
        tabIndex={isDaily ? undefined : 0}
        className={cn(
          "group relative flex items-center justify-between rounded-2xl p-3.5 shadow-2xs transition-transform duration-150",
          !isDaily && "cursor-pointer",
          isCompleted
            ? "bg-neutral-100/60 dark:bg-neutral-900/35"
            : isNow
              ? "bg-orange-500/[0.05] ring-1 ring-orange-500/35 dark:bg-orange-500/[0.08]"
              : "bg-white hover:bg-neutral-50/70 dark:bg-neutral-900/80 dark:hover:bg-neutral-900",
        )}
        style={
          !isDaily && swipeOffset !== 0
            ? { transform: `translateX(${isRtl ? -swipeOffset : swipeOffset}px)` }
            : undefined
        }
        onClick={isDaily ? undefined : handleNavigateEdit}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onKeyDown={
          isDaily
            ? undefined
            : (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNavigateEdit();
                }
              }
        }
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {isDaily && (
            <div className="flex shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                aria-label={isCompleted ? t.habits.markUndone : t.habits.markDone}
                checked={isCompleted}
                className={cn(isDaily && !isTodayView && "cursor-not-allowed opacity-40")}
                disabled={isDaily && !isTodayView}
                onCheckedChange={handleToggle}
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {hasTopRow && (
                  <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px] tabular-nums">
                    {habit.startTime && (
                      <span className="inline-flex items-center gap-1 font-medium text-neutral-500 dark:text-neutral-400">
                        <IconClock size={12} stroke={2} />
                        <span>
                          {habit.startTime}
                          {habit.endTime ? ` – ${habit.endTime}` : ""}
                        </span>
                        {durationMinutes !== null && (
                          <span className="text-neutral-400 dark:text-neutral-500">
                            · {formatDuration(durationMinutes, language)}
                          </span>
                        )}
                      </span>
                    )}
                    {isNow && (
                      <span className="rounded-md bg-orange-500/15 px-1.5 py-0.5 font-semibold text-[10px] text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                        {t.habits.nowBadge}
                      </span>
                    )}
                    {showNotesInTopRow && (
                      <span
                        aria-label={t.habits.description}
                        title={t.habits.description}
                        className={cn(
                          "inline-flex items-center text-neutral-400 dark:text-neutral-500",
                          isCompleted && "opacity-50",
                        )}
                      >
                        <IconNotes size={12} stroke={1.9} />
                      </span>
                    )}
                  </div>
                )}

                <p
                  className={cn(
                    "break-words font-medium text-[15px] leading-snug sm:text-sm",
                    isCompleted
                      ? "text-neutral-400 line-through dark:text-neutral-500"
                      : "text-neutral-800 dark:text-neutral-100",
                  )}
                >
                  {habit.title}
                </p>
              </div>
            </div>

            {(category || streak > 0 || showNotesInBottomRow) && (
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                {showNotesInBottomRow && (
                  <span
                    aria-label={t.habits.description}
                    title={t.habits.description}
                    className={cn(
                      "inline-flex items-center text-neutral-400 dark:text-neutral-500",
                      isCompleted && "opacity-50",
                    )}
                  >
                    <IconNotes size={13} stroke={1.9} />
                  </span>
                )}
                {category && colorDetails && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-[11px]",
                      colorDetails.badgeClass,
                    )}
                  >
                    <CategoryIcon iconId={category.icon} size={11} stroke={2.2} />
                    <span>{category.name}</span>
                  </span>
                )}
                {streak > 0 && (
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-orange-500/10 px-1.5 py-0.5 font-medium text-[11px] text-orange-600 tabular-nums dark:bg-orange-500/15 dark:text-orange-400">
                    <IconFlame size={12} stroke={2} />
                    <span>
                      {streak}
                      {t.habits.streakDays}
                      {streakMultiplier > 1 ? ` · ${streakMultiplier}x` : ""}
                    </span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {!isDaily && (
          <div
            className="-me-1 ms-2 flex shrink-0 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ChevronIcon
              stroke={2}
              className={cn(
                "h-4 w-4 text-neutral-400/70 dark:text-neutral-500/70",
                "sm:group-hover:hidden",
                confirmingDelete && "sm:hidden",
              )}
            />
            <Button
              aria-label={t.common.delete}
              aria-pressed={confirmingDelete}
              size="icon"
              type="button"
              variant="ghost"
              className={cn(
                "relative hidden h-9 w-9 rounded-lg transition-all after:absolute after:-inset-1 after:content-[''] sm:flex",
                confirmingDelete
                  ? "bg-red-500 text-white opacity-100 hover:bg-red-600 hover:text-white dark:bg-red-600"
                  : "text-neutral-500 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:text-neutral-400 dark:hover:bg-red-950/40 dark:hover:text-red-400",
              )}
              onBlur={() => setConfirmingDelete(false)}
              onClick={handleDelete}
            >
              <IconTrash size={15} stroke={1.75} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
