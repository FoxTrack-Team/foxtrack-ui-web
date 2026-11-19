"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Icon } from "@tabler/icons-react";
import { IconCalendar, IconChecklist, IconFolders, IconSettings } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: Icon;
  label: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  {
    href: "/tasks",
    icon: IconChecklist,
    label: "Tasks",
  },
  {
    href: "/calendar",
    icon: IconCalendar,
    label: "Calendar",
  },
  {
    href: "/projects",
    icon: IconFolders,
    label: "Projects",
  },
  {
    href: "/settings",
    icon: IconSettings,
    label: "Settings",
  },
];

function normalizePath(path: string | null): string {
  if (!path) return "";
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

export function BottomNav() {
  const pathname = usePathname();
  const currentPath = normalizePath(pathname);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] sm:bottom-6">
      <nav
        aria-label="Bottom navigation"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/90 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/90 dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/" && currentPath.startsWith(`${item.href}/`)) ||
            (item.href === "/tasks" && currentPath === "/");
          const IconComponent = item.icon;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              href={item.href}
              key={item.href}
              className={cn(
                "relative flex min-w-[70px] flex-col items-center justify-center rounded-full px-3 py-1.5 text-center transition-all duration-200 active:scale-95 sm:min-w-[76px]",
                isActive
                  ? "bg-orange-500 font-medium text-white shadow-[0_2px_10px_rgba(249,115,22,0.35)]"
                  : "text-neutral-400 hover:bg-neutral-100/60 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-200",
              )}
            >
              <IconComponent
                className="transition-transform duration-200"
                size={18}
                stroke={isActive ? 2.25 : 1.75}
              />
              <span className="mt-0.5 text-[10px] leading-tight tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
