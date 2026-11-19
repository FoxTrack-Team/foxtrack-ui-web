"use client";

import Link from "next/link";

import { IconFolders } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <EmptyState
      description={t.emptyStates.projectsDesc}
      icon={IconFolders}
      title={t.emptyStates.projectsTitle}
      action={
        <Button asChild size="sm" variant="outline">
          <Link href="/tasks">{t.common.back}</Link>
        </Button>
      }
    />
  );
}
