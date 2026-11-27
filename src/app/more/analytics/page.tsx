"use client";

import { IconChartBar } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { EmptyState } from "@/components/empty-state";
import { SubpageHeader } from "@/components/subpage-header";

export default function MoreAnalyticsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <SubpageHeader backHref="/more" backLabel={t.more.title} />
      <EmptyState
        framed
        description={t.more.upcomingAnalyticsDesc}
        icon={IconChartBar}
        title={t.more.upcomingAnalyticsTitle}
        badge={
          <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2.5 py-0.5 font-semibold text-[10px] text-orange-600 uppercase tracking-wider dark:bg-orange-500/15 dark:text-orange-400">
            {t.more.upcomingSoon}
          </span>
        }
      />
    </div>
  );
}
