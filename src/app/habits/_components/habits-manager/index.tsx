"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { IconPlus, IconRepeat } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { EmptyState } from "@/components/empty-state";
import { TaskFab } from "@/components/task-fab";
import { Button } from "@/components/ui/button";

import { sortHabitsBySchedule } from "@/features/habits/utils/time-utils";

import { toHtmlDateValue } from "@/lib/date-utils";

import { db } from "@/db/database";

import { HabitItem } from "../habit-item";

export function HabitsManager() {
  const router = useRouter();
  const { t } = useTranslation();

  const [todayKey] = useState(() => toHtmlDateValue(Date.now()));

  const habitsInDb = useLiveQuery(() => db.habits.toArray(), []);
  const logsInDb = useLiveQuery(() => db.habitLogs.toArray(), []);
  const categoriesInDb = useLiveQuery(() => db.categories.orderBy("order").toArray(), []);

  const allHabits = useMemo(() => sortHabitsBySchedule(habitsInDb ?? []), [habitsInDb]);
  const allLogs = useMemo(() => logsInDb ?? [], [logsInDb]);
  const categories = useMemo(() => categoriesInDb ?? [], [categoriesInDb]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const logsByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const log of allLogs) {
      if (!log.completed) continue;
      let set = map.get(log.habitId);
      if (!set) {
        set = new Set<string>();
        map.set(log.habitId, set);
      }
      set.add(log.dateKey);
    }
    return map;
  }, [allLogs]);

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
        {t.habits.title}
      </h1>

      {/* List or Empty State */}
      {allHabits.length === 0 ? (
        <EmptyState
          framed
          description={t.habits.emptyAllDesc}
          icon={IconRepeat}
          title={t.habits.emptyAllTitle}
          action={
            <Button
              className="min-h-10 gap-1.5 rounded-xl px-5"
              size="sm"
              type="button"
              onClick={() => router.push("/habits/new")}
            >
              <IconPlus size={15} stroke={2.4} />
              <span>{t.habits.addHabit}</span>
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {allHabits.map((habit) => (
            <HabitItem
              category={habit.categoryId ? categoryMap.get(habit.categoryId) : undefined}
              completedDateKeys={logsByHabit.get(habit.id) ?? new Set()}
              dateKey={todayKey}
              habit={habit}
              isTodayView={false}
              key={habit.id}
              mode="manage"
            />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <TaskFab ariaLabel={t.habits.addHabit} onClick={() => router.push("/habits/new")} />
    </div>
  );
}
