"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Icon } from "@tabler/icons-react";
import { IconCalendar, IconChecklist, IconFolders, IconSettings } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { cn } from "@/lib/utils";

interface NavItemConfig {
  href: string;
  icon: Icon;
  key: "tasks" | "calendar" | "projects" | "settings";
}

const NAV_CONFIG: readonly NavItemConfig[] = [
  {
    href: "/tasks",
    icon: IconChecklist,
    key: "tasks",
  },
  {
    href: "/calendar",
    icon: IconCalendar,
    key: "calendar",
  },
  {
    href: "/projects",
    icon: IconFolders,
    key: "projects",
  },
  {
    href: "/settings",
    icon: IconSettings,
    key: "settings",
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
  const { language, t } = useTranslation();
  const navRef = useRef<HTMLElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<{
    height: number;
    left: number;
    top: number;
    width: number;
  } | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);

  useEffect(() => {
    function updateIndicator() {
      if (!navRef.current) return;
      const activeEl = navRef.current.querySelector<HTMLElement>('[aria-current="page"]');
      if (activeEl) {
        const navRect = navRef.current.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();

        if (elRect.width > 0 && elRect.height > 0) {
          setIndicatorStyle({
            height: elRect.height,
            left: elRect.left - navRect.left,
            top: elRect.top - navRect.top,
            width: elRect.width,
          });
          setHasMeasured(true);
        }
      }
    }

    const frameId = requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", updateIndicator);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [currentPath, language]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] sm:bottom-6">
      <nav
        aria-label="Bottom navigation"
        className="pointer-events-auto relative flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/90 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/90 dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
        ref={navRef}
      >
        {hasMeasured && indicatorStyle && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0 rounded-full bg-orange-500 shadow-[0_2px_12px_rgba(249,115,22,0.4)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              height: `${indicatorStyle.height}px`,
              left: `${indicatorStyle.left}px`,
              top: `${indicatorStyle.top}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        )}

        {NAV_CONFIG.map((item) => {
          const isActive =
            currentPath === item.href || (item.href === "/tasks" && currentPath === "");
          const IconComponent = item.icon;
          const label = t.bottomNav[item.key];

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              href={item.href}
              key={item.href}
              className={cn(
                "relative z-10 flex select-none items-center gap-2 rounded-full px-4 py-2 font-medium text-xs transition-colors duration-200",
                isActive
                  ? cn(
                      "text-white",
                      !hasMeasured && "bg-orange-500 shadow-[0_2px_10px_rgba(249,115,22,0.3)]",
                    )
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
              )}
            >
              <IconComponent size={17} stroke={isActive ? 2.25 : 1.75} />
              <span className={cn(isActive ? "font-semibold" : "hidden sm:inline")}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
