"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { IconChecklist, IconChevronLeft, IconChevronRight, IconRepeat } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";
import { TaskFab } from "@/components/task-fab";

import { useDirection } from "@/hooks/use-direction";

interface DashboardAddFabProps {
  defaultDueDate?: number | null;
}

export function DashboardAddFab({ defaultDueDate = null }: DashboardAddFabProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRtl } = useDirection();
  const [isOpen, setIsOpen] = useState(false);

  const ForwardChevron = isRtl ? IconChevronLeft : IconChevronRight;

  function handleAddTask() {
    setIsOpen(false);
    if (defaultDueDate) {
      router.push(`/tasks/new?dueDate=${defaultDueDate}`);
    } else {
      router.push("/tasks/new");
    }
  }

  function handleAddHabit() {
    setIsOpen(false);
    router.push("/habits/new");
  }

  return (
    <>
      <TaskFab ariaLabel={t.tasks.addNewTask} onClick={() => setIsOpen(true)} />

      <Modal
        headerClassName="pb-1.5"
        isOpen={isOpen}
        maxWidth="sm"
        showCloseButton={false}
        title={t.dashboard.addChoiceTitle}
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-2.5 pt-1">
          <button
            className="group flex min-h-[64px] w-full items-center justify-between gap-3 rounded-xl bg-neutral-100/80 px-3.5 py-3 text-start transition-colors hover:bg-neutral-200/70 active:scale-[0.99] dark:bg-neutral-800/70 dark:hover:bg-neutral-800"
            type="button"
            onClick={handleAddTask}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                <IconChecklist size={20} stroke={1.9} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-neutral-900 text-sm dark:text-neutral-100">
                  {t.tasks.newTask}
                </p>
                <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
                  {t.dashboard.addTaskDesc}
                </p>
              </div>
            </div>
            <ForwardChevron
              className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 dark:text-neutral-500"
              stroke={2}
            />
          </button>

          <button
            className="group flex min-h-[64px] w-full items-center justify-between gap-3 rounded-xl bg-neutral-100/80 px-3.5 py-3 text-start transition-colors hover:bg-neutral-200/70 active:scale-[0.99] dark:bg-neutral-800/70 dark:hover:bg-neutral-800"
            type="button"
            onClick={handleAddHabit}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <IconRepeat size={20} stroke={1.9} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-neutral-900 text-sm dark:text-neutral-100">
                  {t.habits.newHabit}
                </p>
                <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
                  {t.dashboard.addHabitDesc}
                </p>
              </div>
            </div>
            <ForwardChevron
              className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 dark:text-neutral-500"
              stroke={2}
            />
          </button>
        </div>
      </Modal>
    </>
  );
}
