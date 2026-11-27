"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import { categoryRepository } from "@/features/categories/services/dexie-category-repository";

import {
  DEFAULT_LANGUAGE,
  Dictionary,
  getDictionary,
  getDirection,
  SupportedLanguage,
  TextDirection,
} from "@/lib/i18n";

import { db } from "@/db/database";

export type AppTheme = "system" | "light" | "dark";

export interface SettingsContextValue {
  direction: TextDirection;
  isRtl: boolean;
  language: SupportedLanguage;
  resolvedTheme: "light" | "dark";
  setLanguage: (lang: SupportedLanguage) => void;
  setTheme: (theme: AppTheme) => void;
  t: Dictionary;
  theme: AppTheme;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_THEME_KEY = "foxtrack-theme";
const STORAGE_LANG_KEY = "foxtrack-language";
export const SETTINGS_CHANGE_EVENT = "foxtrack:settings";

const settingsListeners = new Set<() => void>();

function emitSettingsStoreChange() {
  for (const listener of settingsListeners) {
    listener();
  }
}

function subscribeSettingsStore(callback: () => void) {
  settingsListeners.add(callback);
  if (typeof window === "undefined") {
    return () => {
      settingsListeners.delete(callback);
    };
  }
  function onStorage(e: StorageEvent) {
    if (e.key === STORAGE_THEME_KEY || e.key === STORAGE_LANG_KEY || e.key === null) {
      callback();
    }
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(SETTINGS_CHANGE_EVENT, callback);
  return () => {
    settingsListeners.delete(callback);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SETTINGS_CHANGE_EVENT, callback);
  };
}

function getServerThemeSnapshot(): AppTheme {
  return "system";
}

function getServerLanguageSnapshot(): SupportedLanguage {
  return DEFAULT_LANGUAGE;
}

function subscribeHydration() {
  return () => {};
}

function getClientHydrated(): boolean {
  return true;
}

function getServerHydrated(): boolean {
  return false;
}

function readInitialTheme(): AppTheme {
  if (typeof window === "undefined") return "system";
  try {
    const raw = localStorage.getItem(STORAGE_THEME_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") {
      return raw;
    }
  } catch {
    /* ignore */
  }
  return "system";
}

function readInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const raw = localStorage.getItem(STORAGE_LANG_KEY);
    if (raw === "en" || raw === "fa") {
      return raw;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE;
}

function subscribeSystemTheme(callback: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSystemSnapshot(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSystemSnapshot(): boolean {
  return false;
}

function applyDomTheme(theme: AppTheme, isSystemDark: boolean): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const isDark = theme === "dark" || (theme === "system" && isSystemDark);

  if (isDark) {
    document.documentElement.classList.add("dark");
    return "dark";
  }
  document.documentElement.classList.remove("dark");
  return "light";
}

function applyDomLanguage(lang: SupportedLanguage) {
  if (typeof window === "undefined") return;
  document.documentElement.lang = lang;
  document.documentElement.dir = getDirection(lang);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const isHydrated = useSyncExternalStore(subscribeHydration, getClientHydrated, getServerHydrated);
  const theme = useSyncExternalStore(
    subscribeSettingsStore,
    readInitialTheme,
    getServerThemeSnapshot,
  );
  const language = useSyncExternalStore(
    subscribeSettingsStore,
    readInitialLanguage,
    getServerLanguageSnapshot,
  );
  const isSystemDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemSnapshot,
    getServerSystemSnapshot,
  );

  const resolvedTheme = useMemo<"light" | "dark">(() => {
    return theme === "dark" || (theme === "system" && isSystemDark) ? "dark" : "light";
  }, [theme, isSystemDark]);

  // Sync with IndexedDB Dexie backup on mount
  useEffect(() => {
    let active = true;

    async function syncFromDb() {
      try {
        const storedTheme = await db.settings.get("theme");
        if (active && storedTheme?.value) {
          const valid = storedTheme.value as AppTheme;
          if (
            (valid === "system" || valid === "light" || valid === "dark") &&
            valid !== readInitialTheme()
          ) {
            try {
              localStorage.setItem(STORAGE_THEME_KEY, valid);
            } catch {
              /* ignore */
            }
            emitSettingsStoreChange();
          }
        }

        const storedLang = await db.settings.get("language");
        if (active && storedLang?.value) {
          const validLang = storedLang.value as SupportedLanguage;
          if ((validLang === "en" || validLang === "fa") && validLang !== readInitialLanguage()) {
            try {
              localStorage.setItem(STORAGE_LANG_KEY, validLang);
            } catch {
              /* ignore */
            }
            emitSettingsStoreChange();
          }
        }
      } catch {
        /* ignore Dexie read errors */
      }
    }

    syncFromDb();
    return () => {
      active = false;
    };
  }, []);

  // Ensure default Habitica categories are created on system startup
  useEffect(() => {
    categoryRepository.ensureDefaults(language).catch((err) => {
      console.error("Failed to seed default categories on startup", err);
    });
  }, [language]);

  // Update DOM when theme or language changes after hydration
  useEffect(() => {
    if (!isHydrated) return;
    applyDomTheme(theme, isSystemDark);
  }, [isHydrated, theme, isSystemDark]);

  useEffect(() => {
    if (!isHydrated) return;
    applyDomLanguage(language);
  }, [isHydrated, language]);

  const setTheme = useCallback(
    (nextTheme: AppTheme) => {
      try {
        localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
      } catch {
        /* ignore */
      }
      applyDomTheme(nextTheme, isSystemDark);
      emitSettingsStoreChange();

      db.settings.put({ key: "theme", value: nextTheme }).catch(() => {});
      window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
    },
    [isSystemDark],
  );

  const setLanguage = useCallback((nextLang: SupportedLanguage) => {
    try {
      localStorage.setItem(STORAGE_LANG_KEY, nextLang);
    } catch {
      /* ignore */
    }
    applyDomLanguage(nextLang);
    emitSettingsStoreChange();

    db.settings.put({ key: "language", value: nextLang }).catch(() => {});
    window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  }, []);

  const direction = useMemo(() => getDirection(language), [language]);
  const isRtl = direction === "rtl";
  const t = useMemo(() => getDictionary(language), [language]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      direction,
      isRtl,
      language,
      resolvedTheme,
      setLanguage,
      setTheme,
      t,
      theme,
    }),
    [direction, isRtl, language, resolvedTheme, setLanguage, setTheme, t, theme],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    // Graceful fallback for standalone testing or pre-provider rendering
    const isDark =
      typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    return {
      direction: "ltr",
      isRtl: false,
      language: "en",
      resolvedTheme: isDark ? "dark" : "light",
      setLanguage: () => {},
      setTheme: (next) => {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_THEME_KEY, next);
          } catch {
            /* ignore */
          }
          if (next === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },
      t: getDictionary("en"),
      theme: "system",
    };
  }
  return ctx;
}

export function useTranslation() {
  const { direction, isRtl, language, setLanguage, t } = useSettings();
  return { direction, isRtl, language, setLanguage, t };
}
