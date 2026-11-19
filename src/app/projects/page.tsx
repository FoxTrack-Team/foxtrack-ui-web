import Link from "next/link";

import { IconFolders } from "@tabler/icons-react";

import { EmptyState } from "@/components/empty-state";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      <Header />
      <EmptyState
        description="Organize your tasks into lists, projects, and tags in upcoming updates."
        icon={IconFolders}
        title="Projects & Lists coming soon"
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/tasks">Back to Tasks</Link>
          </Button>
        }
      />
    </div>
  );
}
