"use client";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";

import { NotificationsSection } from "../_components/notifications-section";

export default function NotificationsSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <SubpageHeader backHref="/settings" backLabel={t.settings.title} />
      <NotificationsSection />
    </div>
  );
}
