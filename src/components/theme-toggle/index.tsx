"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";

import { useSettings } from "@/providers/settings-provider";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, t } = useSettings();

  function toggleTheme() {
    const isDark =
      typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    setTheme(next);
  }

  return (
    <Button
      aria-label={t.header.toggleTheme}
      className="h-8 w-8 text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
      size="icon"
      type="button"
      variant="ghost"
      onClick={toggleTheme}
    >
      {resolvedTheme === "light" ? (
        <IconMoon className="text-neutral-700" size={17} stroke={1.75} />
      ) : (
        <IconSun className="text-amber-400" size={17} stroke={1.75} />
      )}
    </Button>
  );
}
