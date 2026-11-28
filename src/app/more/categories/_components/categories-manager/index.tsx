"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { IconCategory } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useSettings, useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";
import { TaskFab } from "@/components/task-fab";
import { Button } from "@/components/ui/button";

import { categoryRepository } from "@/features/categories/services/dexie-category-repository";
import { Category } from "@/features/categories/types";

import { db } from "@/db/database";

import { CategoryItem } from "../category-item";

export function CategoriesManager() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useSettings();
  const categories = useLiveQuery(() => db.categories.orderBy("order").toArray(), []) ?? [];
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];

  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    categoryRepository.ensureDefaults(language).catch((err) => {
      console.error("Failed to ensure default categories", err);
    });
  }, [language]);

  function handleNavigateNew() {
    router.push("/more/categories/new");
  }

  function handleNavigateEdit(cat: Category) {
    router.push(`/more/categories/edit?id=${cat.id}`);
  }

  async function handleDeleteConfirm() {
    if (!deletingCategory) return;
    try {
      await categoryRepository.delete(deletingCategory.id);
      setDeletingCategory(null);
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  }

  return (
    <section className="space-y-3.5 pb-4">
      {/* Section Header */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
            {t.categories.title}
          </h1>
          <span className="rounded-md bg-neutral-100/90 px-2 py-0.5 font-medium text-[11px] text-neutral-500 tabular-nums dark:bg-neutral-800/90 dark:text-neutral-400">
            {categories.length}
          </span>
        </div>
        <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
          {t.categories.subtitle}
        </p>
      </div>

      {/* Category Grid */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white/75 px-4 py-8 text-center shadow-2xs dark:bg-neutral-900/55">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <IconCategory
              className="h-5 w-5 text-neutral-400 dark:text-neutral-500"
              stroke={1.75}
            />
          </div>
          <p className="mt-2.5 font-semibold text-neutral-800 text-xs dark:text-neutral-200">
            {t.categories.emptyTitle}
          </p>
          <p className="mt-0.5 max-w-xs text-[11px] text-neutral-400 dark:text-neutral-500">
            {t.categories.emptyDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {categories.map((cat) => {
            const count = tasks.filter((t) => t.categoryId === cat.id).length;
            return (
              <CategoryItem
                category={cat}
                itemCount={count}
                key={cat.id}
                onDelete={setDeletingCategory}
                onEdit={handleNavigateEdit}
              />
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        description={t.categories.deleteConfirmDesc}
        isOpen={deletingCategory !== null}
        maxWidth="sm"
        title={t.categories.deleteConfirmTitle}
        onClose={() => setDeletingCategory(null)}
      >
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            className="h-11 w-full rounded-xl bg-neutral-200/70 text-neutral-700 text-xs hover:bg-neutral-200 sm:h-9 sm:w-auto dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            type="button"
            variant="ghost"
            onClick={() => setDeletingCategory(null)}
          >
            {t.categories.cancel}
          </Button>
          <Button
            className="h-11 w-full rounded-xl text-xs sm:h-9 sm:w-auto"
            type="button"
            variant="destructive"
            onClick={handleDeleteConfirm}
          >
            {t.categories.deleteConfirmButton}
          </Button>
        </div>
      </Modal>
      {/* Floating Action Button */}
      <TaskFab ariaLabel={t.categories.newCategory} onClick={handleNavigateNew} />
    </section>
  );
}
