"use client";

import Link from "next/link";

import { IconCalendar } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const { t } = useTranslation();

  return (
    <EmptyState
      description={t.emptyStates.calendarDesc}
      icon={IconCalendar}
      title={t.emptyStates.calendarTitle}
      action={
        <Button asChild size="sm" variant="outline">
          <Link href="/tasks">{t.common.back}</Link>
        </Button>
      }
    />
  );
}
