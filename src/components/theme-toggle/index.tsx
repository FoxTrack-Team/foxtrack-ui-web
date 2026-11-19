"use client";

import { useSyncExternalStore } from "react";

import { IconMoon, IconSun } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";
const STORAGE_KEY = "foxtrack-theme";
const THEME_CHANGE_EVENT = "foxtrack:theme";

function getSnapshot(): Theme {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  const mediaQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

  function handleMediaChange() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved && mediaQuery) {
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        callback();
      }
    } catch {
      /* ignore */
    }
  }

  mediaQuery?.addEventListener("change", handleMediaChange);

  return function unsubscribe() {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
    mediaQuery?.removeEventListener("change", handleMediaChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme: Theme = isDark ? "light" : "dark";

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      /* ignore */
    }

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <Button
      aria-label="Toggle theme"
      className="h-8 w-8 text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <IconMoon className="text-neutral-700" size={17} stroke={1.75} />
      ) : (
        <IconSun className="text-amber-400" size={17} stroke={1.75} />
      )}
    </Button>
  );
}
