"use client";

import { useTranslation } from "@/providers/settings-provider";

import { SubpageHeader } from "@/components/subpage-header";

import { CalendarSection } from "../_components/calendar-section";

export default function CalendarSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <SubpageHeader backHref="/settings" backLabel={t.settings.title} />
      <CalendarSection />
    </div>
  );
}
