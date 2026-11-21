"use client";

import { useRouter } from "next/navigation";

import { IconPlus } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { cn } from "@/lib/utils";

interface TaskFabProps {
  defaultDueDate?: number | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TaskFab({ defaultDueDate = null }: TaskFabProps = {}) {
  const router = useRouter();
  const { t } = useTranslation();

  function handleClick() {
    if (defaultDueDate) {
      router.push(`/tasks/new?dueDate=${defaultDueDate}`);
    } else {
      router.push("/tasks/new");
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-22 z-30 mx-auto max-w-xl px-5 sm:bottom-24 sm:px-6">
      <div className="flex justify-end">
        <button
          aria-label={t.tasks.addNewTask}
          type="button"
          className={cn(
            "pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full",
            "bg-primary text-primary-foreground shadow-[0_6px_20px_rgba(249,115,22,0.4)]",
            "transition-all duration-200 hover:scale-105 hover:bg-primary/90 active:scale-95",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950",
          )}
          onClick={handleClick}
        >
          <IconPlus size={26} stroke={2.5} />
        </button>
      </div>
    </div>
  );
}
