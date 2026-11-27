"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";
import { TaskForm, TaskFormValues } from "@/components/task-form";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";

function NewTaskContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dueDateParam = searchParams.get("dueDate");
  const defaultDueDate = dueDateParam ? Number(dueDateParam) : null;
  const { t } = useTranslation();

  async function handleCreate(values: TaskFormValues) {
    await taskRepository.create(values);
    router.push("/tasks");
  }

  return (
    <TaskForm
      initialValues={{ dueDate: defaultDueDate }}
      subtitle={t.tasks.newTaskSubtitle}
      title={t.tasks.newTask}
      onCancel={() => router.push("/tasks")}
      onSubmit={handleCreate}
    />
  );
}

export default function NewTaskPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <SubpageHeader backHref="/tasks" backLabel={t.tasks.title} />
      <Suspense fallback={null}>
        <NewTaskContent />
      </Suspense>
    </div>
  );
}
