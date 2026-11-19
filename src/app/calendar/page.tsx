import Link from "next/link";

import { IconCalendar } from "@tabler/icons-react";

import { EmptyState } from "@/components/empty-state";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      <Header />
      <EmptyState
        description="Schedule and time-blocking views will be available in Phase 2."
        icon={IconCalendar}
        title="Calendar view coming soon"
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/tasks">Back to Tasks</Link>
          </Button>
        }
      />
    </div>
  );
}
