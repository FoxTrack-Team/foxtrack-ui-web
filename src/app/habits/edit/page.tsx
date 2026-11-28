"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { HabitForm, HabitFormValues } from "@/components/habit-form";
import { SubpageHeader } from "@/components/subpage-header";
import { Button } from "@/components/ui/button";

import { habitRepository } from "@/features/habits/services/dexie-habit-repository";

import { db } from "@/db/database";

function HabitEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { t } = useTranslation();

  const habit = useLiveQuery(
    () => (id ? db.habits.get(id).then((item) => item ?? null) : null),
    [id],
  );

  if (habit === undefined) {
    return null;
  }

  if (!id || habit === null) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-neutral-600 text-sm dark:text-neutral-400">{t.common.retry}</p>
        <Button
          className="mt-4 rounded-xl text-xs"
          type="button"
          variant="outline"
          onClick={() => router.push("/habits")}
        >
          {t.common.back}
        </Button>
      </div>
    );
  }

  async function handleUpdate(values: HabitFormValues) {
    if (!id) return;
    await habitRepository.update(id, values);
    router.push("/habits");
  }

  async function handleDelete() {
    if (!id) return;
    await habitRepository.delete(id);
    router.push("/habits");
  }

  return (
    <HabitForm
      isEdit
      subtitle={t.habits.editHabitSubtitle}
      title={t.habits.editHabit}
      initialValues={{
        categoryId: habit.categoryId ?? null,
        description: habit.description ?? "",
        endTime: habit.endTime ?? "",
        frequencyType: habit.frequencyType,
        startTime: habit.startTime ?? "",
        targetDays: habit.targetDays,
        title: habit.title,
      }}
      onCancel={() => router.push("/habits")}
      onDelete={handleDelete}
      onSubmit={handleUpdate}
    />
  );
}

export default function EditHabitPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <SubpageHeader backHref="/habits" backLabel={t.habits.title} />
      <Suspense fallback={null}>
        <HabitEditContent />
      </Suspense>
    </div>
  );
}
