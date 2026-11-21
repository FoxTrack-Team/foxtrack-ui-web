"use client";

import { useRouter } from "next/navigation";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";

import { categoryRepository } from "@/features/categories/services/dexie-category-repository";

import { CategoryForm } from "../_components/category-form";

export default function NewCategoryPage() {
  const router = useRouter();
  const { t } = useTranslation();

  async function handleCreate(values: { color: string; icon: string; name: string }) {
    await categoryRepository.create(values);
    router.push("/more/categories");
  }

  return (
    <div className="space-y-4 pb-20">
      <SubpageHeader backHref="/more/categories" backLabel={t.categories.title} />
      <CategoryForm
        title={t.categories.newCategory}
        onCancel={() => router.push("/more/categories")}
        onSubmit={handleCreate}
      />
    </div>
  );
}
