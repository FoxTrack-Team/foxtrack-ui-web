"use client";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";

import { RewardsShop } from "../_components/rewards-shop";

export default function MoreRewardsShopPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <SubpageHeader backHref="/more/rewards" backLabel={t.more.rewardsTitle} />
      <RewardsShop />
    </div>
  );
}
