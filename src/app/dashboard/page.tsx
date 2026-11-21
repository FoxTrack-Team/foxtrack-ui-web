"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { isToday } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";

import { TaskFab } from "@/components/task-fab";

import { isTaskOverdue, toDayInterval, toHtmlDateValue } from "@/lib/date-utils";

import { db } from "@/db/database";

import { DayNavigator } from "./_components/day-navigator";
import { DayOverview } from "./_components/day-overview";
import { DayTasks } from "./_components/day-tasks";

export default function DashboardPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const tasksInDb = useLiveQuery(() => db.tasks.toArray(), []);
  const allTasks = useMemo(() => tasksInDb ?? [], [tasksInDb]);

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

  return (
    <div className="space-y-4">
      <DayNavigator
        selectedDate={selectedDate}
        taskDatesSet={taskDatesSet}
        onSelectDate={setSelectedDate}
      />
      <DayOverview tasks={dayTasks} />
      <DayTasks
        isTodaySelected={isTodaySelected}
        overdueCount={overdueCount}
        tasks={dayTasks}
        onAddTask={() => router.push(`/tasks/new?dueDate=${dayInterval.end}`)}
      />
      <TaskFab defaultDueDate={dayInterval.end} />
    </div>
  );
}
