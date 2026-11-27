"use client";

import Link from "next/link";

import { IconRepeat } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function HabitsPage() {
  const { t } = useTranslation();

  return (
    <EmptyState
      framed
      description={t.emptyStates.habitsDesc}
      icon={IconRepeat}
      title={t.emptyStates.habitsTitle}
      action={
        <Button asChild className="min-h-10 rounded-xl px-6" size="sm" variant="outline">
          <Link href="/dashboard">{t.common.back}</Link>
        </Button>
      }
      badge={
        <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2.5 py-0.5 font-semibold text-[10px] text-orange-600 uppercase tracking-wider dark:bg-orange-500/15 dark:text-orange-400">
          {t.more.upcomingSoon}
        </span>
      }
    />
  );
}
