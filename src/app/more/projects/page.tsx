"use client";

import { IconFolder } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { EmptyState } from "@/components/empty-state";
import { SubpageHeader } from "@/components/subpage-header";

export default function MoreProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3 pb-20">
      <SubpageHeader backHref="/more" backLabel={t.more.title} />
      <EmptyState
        description={t.more.upcomingProjectsDesc}
        icon={IconFolder}
        title={t.more.upcomingProjectsTitle}
      />
    </div>
  );
}
