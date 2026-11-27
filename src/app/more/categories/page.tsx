"use client";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";

import { CategoriesManager } from "./_components/categories-manager";

export default function MoreCategoriesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <SubpageHeader backHref="/more" backLabel={t.more.title} />
      <CategoriesManager />
    </div>
  );
}
