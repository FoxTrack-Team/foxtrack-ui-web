"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";
import { TaskForm, TaskFormValues } from "@/components/task-form";
import { Button } from "@/components/ui/button";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";

import { db } from "@/db/database";

function TaskEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { t } = useTranslation();

  const task = useLiveQuery(
    () => (id ? db.tasks.get(id).then((item) => item ?? null) : null),
    [id],
  );

  if (task === undefined) {
    return null;
  }

  if (!id || task === null) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-2xs dark:bg-neutral-900/80">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{t.common.retry}</p>
        <Button
          className="mt-4 rounded-xl text-xs"
          type="button"
          variant="outline"
          onClick={() => router.push("/tasks")}
        >
          {t.common.back}
        </Button>
      </div>
    );
  }

  async function handleUpdate(values: TaskFormValues) {
    if (!id) return;
    await taskRepository.update(id, values);
    router.push("/tasks");
  }

  async function handleDelete() {
    if (!id) return;
    await taskRepository.delete(id);
    router.push("/tasks");
  }

  return (
    <TaskForm
      isEdit
      subtitle={t.tasks.editTaskSubtitle}
      title={t.tasks.editTaskTitle}
      initialValues={{
        categoryId: task.categoryId,
        completed: task.completed,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        title: task.title,
      }}
      onCancel={() => router.push("/tasks")}
      onDelete={handleDelete}
      onSubmit={handleUpdate}
    />
  );
}

export default function EditTaskPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <SubpageHeader backHref="/tasks" backLabel={t.tasks.title} />
      <Suspense fallback={null}>
        <TaskEditContent />
      </Suspense>
    </div>
  );
}
