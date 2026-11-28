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

import type { CalendarType, WeekdayIndex } from "@/lib/calendar-utils";
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
  calendarType: CalendarType;
  direction: TextDirection;
  isRtl: boolean;
  language: SupportedLanguage;
  resolvedTheme: "light" | "dark";
  setCalendarType: (calendarType: CalendarType) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setTheme: (theme: AppTheme) => void;
  setWeekendDays: (days: WeekdayIndex[]) => void;
  setWeekStartsOn: (day: WeekdayIndex) => void;
  t: Dictionary;
  theme: AppTheme;
  weekendDays: WeekdayIndex[];
  weekStartsOn: WeekdayIndex;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_THEME_KEY = "foxtrack-theme";
const STORAGE_LANG_KEY = "foxtrack-language";
const STORAGE_CALENDAR_TYPE_KEY = "foxtrack-calendar-type";
const STORAGE_WEEK_STARTS_ON_KEY = "foxtrack-week-starts-on";
const STORAGE_WEEKEND_DAYS_KEY = "foxtrack-weekend-days";
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
    if (
      e.key === STORAGE_THEME_KEY ||
      e.key === STORAGE_LANG_KEY ||
      e.key === STORAGE_CALENDAR_TYPE_KEY ||
      e.key === STORAGE_WEEK_STARTS_ON_KEY ||
      e.key === STORAGE_WEEKEND_DAYS_KEY ||
      e.key === null
    ) {
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

function getServerCalendarTypeSnapshot(): CalendarType {
  return "gregorian";
}

function getServerWeekStartsOnSnapshot(): WeekdayIndex {
  return 0;
}

function getServerWeekendDaysRawSnapshot(): string {
  return "[0,6]";
}

function readInitialCalendarType(): CalendarType {
  if (typeof window === "undefined") return "gregorian";
  try {
    const raw = localStorage.getItem(STORAGE_CALENDAR_TYPE_KEY);
    if (raw === "gregorian" || raw === "jalali") return raw;
  } catch {
    /* ignore */
  }
  return "gregorian";
}

function readInitialWeekStartsOn(): WeekdayIndex {
  if (typeof window === "undefined") return 0;
  try {
    const raw = Number(localStorage.getItem(STORAGE_WEEK_STARTS_ON_KEY));
    if (Number.isInteger(raw) && raw >= 0 && raw <= 6) {
      return raw as WeekdayIndex;
    }
  } catch {
    /* ignore */
  }
  return 0;
}

function readInitialWeekendDaysRaw(): string {
  if (typeof window === "undefined") return "[0,6]";
  try {
    const raw = localStorage.getItem(STORAGE_WEEKEND_DAYS_KEY);
    if (raw) return raw;
  } catch {
    /* ignore */
  }
  return "[0,6]";
}

function parseWeekendDays(raw: string): WeekdayIndex[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (d): d is WeekdayIndex => typeof d === "number" && Number.isInteger(d) && d >= 0 && d <= 6,
      );
    }
  } catch {
    /* ignore */
  }
  return [0, 6];
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
  const calendarType = useSyncExternalStore(
    subscribeSettingsStore,
    readInitialCalendarType,
    getServerCalendarTypeSnapshot,
  );
  const weekStartsOn = useSyncExternalStore(
    subscribeSettingsStore,
    readInitialWeekStartsOn,
    getServerWeekStartsOnSnapshot,
  );
  const weekendDaysRaw = useSyncExternalStore(
    subscribeSettingsStore,
    readInitialWeekendDaysRaw,
    getServerWeekendDaysRawSnapshot,
  );
  const weekendDays = useMemo(() => parseWeekendDays(weekendDaysRaw), [weekendDaysRaw]);
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

  const setCalendarType = useCallback((nextType: CalendarType) => {
    const defaultWeekStart: WeekdayIndex = nextType === "jalali" ? 6 : 0;
    const defaultWeekends: WeekdayIndex[] = nextType === "jalali" ? [5] : [0, 6];
    const serializedWeekends = JSON.stringify(defaultWeekends);

    try {
      localStorage.setItem(STORAGE_CALENDAR_TYPE_KEY, nextType);
      localStorage.setItem(STORAGE_WEEK_STARTS_ON_KEY, String(defaultWeekStart));
      localStorage.setItem(STORAGE_WEEKEND_DAYS_KEY, serializedWeekends);
    } catch {
      /* ignore */
    }
    emitSettingsStoreChange();
    db.settings
      .bulkPut([
        { key: "calendarType", value: nextType },
        { key: "weekStartsOn", value: String(defaultWeekStart) },
        { key: "weekendDays", value: serializedWeekends },
      ])
      .catch(() => {});
    window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  }, []);

  const setWeekStartsOn = useCallback((nextDay: WeekdayIndex) => {
    try {
      localStorage.setItem(STORAGE_WEEK_STARTS_ON_KEY, String(nextDay));
    } catch {
      /* ignore */
    }
    emitSettingsStoreChange();
    db.settings.put({ key: "weekStartsOn", value: String(nextDay) }).catch(() => {});
    window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  }, []);

  const setWeekendDays = useCallback((nextDays: WeekdayIndex[]) => {
    const serialized = JSON.stringify(nextDays);
    try {
      localStorage.setItem(STORAGE_WEEKEND_DAYS_KEY, serialized);
    } catch {
      /* ignore */
    }
    emitSettingsStoreChange();
    db.settings.put({ key: "weekendDays", value: serialized }).catch(() => {});
    window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  }, []);

  const direction = useMemo(() => getDirection(language), [language]);
  const isRtl = direction === "rtl";
  const t = useMemo(() => getDictionary(language), [language]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      calendarType,
      direction,
      isRtl,
      language,
      resolvedTheme,
      setCalendarType,
      setLanguage,
      setTheme,
      setWeekendDays,
      setWeekStartsOn,
      t,
      theme,
      weekendDays,
      weekStartsOn,
    }),
    [
      calendarType,
      direction,
      isRtl,
      language,
      resolvedTheme,
      setCalendarType,
      setLanguage,
      setTheme,
      setWeekendDays,
      setWeekStartsOn,
      t,
      theme,
      weekendDays,
      weekStartsOn,
    ],
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
      calendarType: "gregorian",
      direction: "ltr",
      isRtl: false,
      language: "en",
      resolvedTheme: isDark ? "dark" : "light",
      setCalendarType: () => {},
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
      setWeekendDays: () => {},
      setWeekStartsOn: () => {},
      t: getDictionary("en"),
      theme: "system",
      weekendDays: [0, 6],
      weekStartsOn: 0,
    };
  }
  return ctx;
}

export function useTranslation() {
  const { direction, isRtl, language, setLanguage, t } = useSettings();
  return { direction, isRtl, language, setLanguage, t };
}
