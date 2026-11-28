"use client";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";

import { RewardsManager } from "./_components/rewards-manager";

export default function MoreRewardsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <SubpageHeader backHref="/more" backLabel={t.more.title} />
      <RewardsManager />
    </div>
  );
}
