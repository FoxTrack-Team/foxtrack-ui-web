"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Icon } from "@tabler/icons-react";
import { IconChecklist, IconGridDots, IconLayoutDashboard, IconRepeat } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { cn } from "@/lib/utils";

interface NavItemConfig {
  href: string;
  icon: Icon;
  key: "dashboard" | "tasks" | "habits" | "more";
}

const NAV_CONFIG: readonly NavItemConfig[] = [
  {
    href: "/dashboard",
    icon: IconLayoutDashboard,
    key: "dashboard",
  },
  {
    href: "/tasks",
    icon: IconChecklist,
    key: "tasks",
  },
  {
    href: "/habits",
    icon: IconRepeat,
    key: "habits",
  },
  {
    href: "/more",
    icon: IconGridDots,
    key: "more",
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
      } else {
        setIndicatorStyle(null);
        setHasMeasured(false);
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
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-3 sm:bottom-6 sm:px-4">
      <nav
        aria-label="Bottom navigation"
        className="pointer-events-auto relative grid w-[min(calc(100vw-1.5rem),23rem)] grid-cols-4 items-center gap-1 rounded-full border border-neutral-200/80 bg-white/95 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:flex sm:w-auto dark:border-neutral-800/80 dark:bg-neutral-900/95 dark:shadow-[0_10px_32px_rgba(0,0,0,0.45)]"
        ref={navRef}
      >
        {hasMeasured && indicatorStyle && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0 rounded-full bg-orange-500/12 ring-1 ring-orange-500/20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-orange-500/16 dark:ring-orange-500/25"
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
            currentPath === item.href ||
            (item.href === "/dashboard" && (currentPath === "" || currentPath === "/")) ||
            (item.href !== "/" && currentPath.startsWith(item.href + "/"));
          const IconComponent = item.icon;
          const label = t.bottomNav[item.key];

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              href={item.href}
              key={item.href}
              className={cn(
                "relative z-10 flex min-h-[50px] min-w-0 select-none flex-col items-center justify-center gap-1 rounded-full px-2 py-1.5 font-medium transition-colors duration-200 sm:min-h-[42px] sm:flex-row sm:gap-2 sm:px-4 sm:py-2",
                isActive
                  ? cn(
                      "text-orange-600 dark:text-orange-400",
                      !hasMeasured &&
                        "bg-orange-500/12 ring-1 ring-orange-500/20 dark:bg-orange-500/16 dark:ring-orange-500/25",
                    )
                  : "text-neutral-500 hover:bg-neutral-100/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:hover:text-neutral-100",
              )}
            >
              <IconComponent size={19} stroke={isActive ? 2.15 : 1.7} />
              <span
                className={cn(
                  "whitespace-nowrap text-[11px] leading-none tracking-tight sm:text-xs",
                  isActive && "font-semibold",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
