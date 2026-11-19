import Link from "next/link";

import { IconSettings } from "@tabler/icons-react";

import { EmptyState } from "@/components/empty-state";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      <Header />
      <EmptyState
        description="Data sync, backup export, shortcuts, and custom preferences will arrive soon."
        icon={IconSettings}
        title="Settings & Preferences coming soon"
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/tasks">Back to Tasks</Link>
          </Button>
        }
      />
    </div>
  );
}
