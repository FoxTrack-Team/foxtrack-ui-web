"use client";

import { useMemo, useState } from "react";

import { isToday } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";

import { isHabitScheduledForDate, sortHabitsBySchedule } from "@/features/habits/utils/time-utils";

import { isTaskOverdue, toDayInterval, toHtmlDateValue } from "@/lib/date-utils";

import { db } from "@/db/database";

import { CompletionCelebration } from "./_components/completion-celebration";
import { DashboardAddFab } from "./_components/dashboard-add-fab";
import { DayHabits } from "./_components/day-habits";
import { DayNavigator } from "./_components/day-navigator";
import { DayOverview } from "./_components/day-overview";
import { DayTasks } from "./_components/day-tasks";
import { RewardsSummaryCard } from "./_components/rewards-summary-card";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const tasksInDb = useLiveQuery(() => db.tasks.toArray(), []);
  const habitsInDb = useLiveQuery(() => db.habits.toArray(), []);
  const habitLogsInDb = useLiveQuery(() => db.habitLogs.toArray(), []);
  const categoriesInDb = useLiveQuery(() => db.categories.orderBy("order").toArray(), []);

  const allTasks = useMemo(() => tasksInDb ?? [], [tasksInDb]);
  const allHabits = useMemo(() => sortHabitsBySchedule(habitsInDb ?? []), [habitsInDb]);
  const allHabitLogs = useMemo(() => habitLogsInDb ?? [], [habitLogsInDb]);
  const categories = useMemo(() => categoriesInDb ?? [], [categoriesInDb]);

  const dateKey = toHtmlDateValue(selectedDate.getTime());

  const logsByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const log of allHabitLogs) {
      if (!log.completed) continue;
      let set = map.get(log.habitId);
      if (!set) {
        set = new Set<string>();
        map.set(log.habitId, set);
      }
      set.add(log.dateKey);
    }
    return map;
  }, [allHabitLogs]);

  const dayHabits = useMemo(
    () => allHabits.filter((h) => isHabitScheduledForDate(h, selectedDate)),
    [allHabits, selectedDate],
  );

  const habitsCompleted = useMemo(
    () => dayHabits.filter((h) => logsByHabit.get(h.id)?.has(dateKey)).length,
    [dayHabits, logsByHabit, dateKey],
  );

  const taskDatesSet = useMemo(() => {
    const dates = new Set<string>();
    for (const task of allTasks) {
      if (task.dueDate) {
        dates.add(toHtmlDateValue(task.dueDate));
      }
    }
    return dates;
  }, [allTasks]);

  const dayInterval = useMemo(() => toDayInterval(selectedDate), [selectedDate]);

  const dayTasks = useMemo(() => {
    return allTasks.filter(
      (task) =>
        task.dueDate !== null &&
        task.dueDate >= dayInterval.start &&
        task.dueDate <= dayInterval.end,
    );
  }, [allTasks, dayInterval]);

  const overdueCount = useMemo(() => {
    return allTasks.filter((task) => !task.completed && isTaskOverdue(task.dueDate, false)).length;
  }, [allTasks]);

  const isTodaySelected = isToday(selectedDate);
  const taskCompletedCount = dayTasks.filter((item) => item.completed).length;

  return (
    <div className="space-y-4">
      <CompletionCelebration
        completed={taskCompletedCount + habitsCompleted}
        dateKey={dateKey}
        total={dayTasks.length + dayHabits.length}
      />
      <DayNavigator
        selectedDate={selectedDate}
        taskDatesSet={taskDatesSet}
        onSelectDate={setSelectedDate}
      />
      <DayOverview
        dateKey={dateKey}
        habitsCompleted={habitsCompleted}
        habitsTotal={dayHabits.length}
        tasks={dayTasks}
      />
      <RewardsSummaryCard />
      <DayTasks isTodaySelected={isTodaySelected} overdueCount={overdueCount} tasks={dayTasks} />
      <DayHabits
        categories={categories}
        dateKey={dateKey}
        habits={dayHabits}
        isTodaySelected={isTodaySelected}
        logsByHabit={logsByHabit}
      />
      <DashboardAddFab defaultDueDate={dayInterval.end} />
    </div>
  );
}
