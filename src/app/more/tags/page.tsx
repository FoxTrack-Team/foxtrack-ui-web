"use client";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";

import { TagsManager } from "../_components/tags-manager";

export default function MoreTagsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3 pb-20">
      <SubpageHeader backHref="/more" backLabel={t.more.title} />
      <TagsManager />
    </div>
  );
}
