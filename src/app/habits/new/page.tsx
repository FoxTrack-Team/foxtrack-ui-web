"use client";

import { useRouter } from "next/navigation";

import { useTranslation } from "@/providers/settings-provider";

import { HabitForm, HabitFormValues } from "@/components/habit-form";
import { SubpageHeader } from "@/components/subpage-header";

import { habitRepository } from "@/features/habits/services/dexie-habit-repository";

export default function NewHabitPage() {
  const router = useRouter();
  const { t } = useTranslation();

  async function handleCreate(values: HabitFormValues) {
    await habitRepository.create(values);
    router.push("/habits");
  }

  return (
    <div className="space-y-4">
      <SubpageHeader backHref="/habits" backLabel={t.habits.title} />
      <HabitForm
        subtitle={t.habits.newHabitSubtitle}
        title={t.habits.newHabit}
        onCancel={() => router.push("/habits")}
        onSubmit={handleCreate}
      />
    </div>
  );
}
