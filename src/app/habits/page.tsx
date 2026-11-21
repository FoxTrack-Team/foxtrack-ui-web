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
      description={t.emptyStates.habitsDesc}
      icon={IconRepeat}
      title={t.emptyStates.habitsTitle}
      action={
        <Button asChild size="sm" variant="outline">
          <Link href="/dashboard">{t.common.back}</Link>
        </Button>
      }
    />
  );
}
