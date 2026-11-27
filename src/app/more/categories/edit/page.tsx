"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";
import { Button } from "@/components/ui/button";

import { categoryRepository } from "@/features/categories/services/dexie-category-repository";

import { db } from "@/db/database";

import { CategoryForm } from "../_components/category-form";

function CategoryEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { t } = useTranslation();

  const category = useLiveQuery(() => (id ? db.categories.get(id) : undefined), [id]);

  if (!id || (category && category.isDefault)) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {category?.isDefault ? t.categories.defaultReadOnly : t.common.retry}
        </p>
        <Button
          className="mt-4 text-xs rounded-full"
          variant="outline"
          onClick={() => router.push("/more/categories")}
        >
          {t.common.back}
        </Button>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  async function handleUpdate(values: { color: string; icon: string; name: string }) {
    if (!id) return;
    await categoryRepository.update(id, values);
    router.push("/more/categories");
  }

  async function handleDelete() {
    if (!id) return;
    await categoryRepository.delete(id);
    router.push("/more/categories");
  }

  return (
    <CategoryForm
      isEdit
      title={t.categories.editCategory}
      initialValues={{
        color: category.color,
        icon: category.icon,
        name: category.name,
      }}
      onCancel={() => router.push("/more/categories")}
      onDelete={handleDelete}
      onSubmit={handleUpdate}
    />
  );
}

export default function EditCategoryPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <SubpageHeader backHref="/more/categories" backLabel={t.categories.title} />
      <Suspense fallback={null}>
        <CategoryEditContent />
      </Suspense>
    </div>
  );
}
