"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { IconCategory, IconPlus } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useSettings, useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { categoryRepository } from "@/features/categories/services/dexie-category-repository";
import { Category } from "@/features/categories/types";

import { cn } from "@/lib/utils";

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
    <section className="space-y-3">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
            {t.categories.title}
          </h2>
          <span className="rounded-md bg-neutral-100/90 px-1.5 py-0.5 font-medium text-[10px] text-neutral-500 dark:bg-neutral-800/90 dark:text-neutral-400">
            {categories.length}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">
          {t.categories.subtitle}
        </p>
      </div>

      {/* Category Grid */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200/70 border-dashed bg-white/60 px-4 py-8 text-center dark:border-neutral-800/80 dark:bg-neutral-900/30">
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

      {/* Floating Action Button (FAB) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-22 z-30 mx-auto max-w-xl px-5 sm:bottom-24 sm:px-6">
        <div className="flex justify-end">
          <button
            aria-label={t.categories.newCategory}
            type="button"
            className={cn(
              "pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full",
              "bg-primary text-primary-foreground shadow-[0_6px_20px_rgba(249,115,22,0.4)]",
              "transition-all duration-200 hover:scale-105 hover:bg-primary/90 active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950",
              deletingCategory !== null && "pointer-events-none scale-75 opacity-0",
            )}
            onClick={handleNavigateNew}
          >
            <IconPlus size={26} stroke={2.5} />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        description={t.categories.deleteConfirmDesc}
        isOpen={deletingCategory !== null}
        maxWidth="sm"
        title={t.categories.deleteConfirmTitle}
        onClose={() => setDeletingCategory(null)}
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button
            className="h-8 text-xs rounded-full"
            type="button"
            variant="outline"
            onClick={() => setDeletingCategory(null)}
          >
            {t.categories.cancel}
          </Button>
          <Button
            className="h-8 text-xs rounded-full"
            type="button"
            variant="destructive"
            onClick={handleDeleteConfirm}
          >
            {t.categories.deleteConfirmButton}
          </Button>
        </div>
      </Modal>
    </section>
  );
}
