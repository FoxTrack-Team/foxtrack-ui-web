"use client";

import { type ReactNode, useCallback } from "react";

import { SettingsProvider, useSettings } from "@/providers/settings-provider";

import { TextDirection } from "@/lib/i18n";

export type { TextDirection };

export type DirectionContextValue = {
  direction: TextDirection;
  isRtl: boolean;
  setDirection: (next: TextDirection) => void;
  toggleDirection: () => void;
};

export function DirectionProvider({ children }: { children: ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>;
}

export function useDirection(): DirectionContextValue {
  const { direction, isRtl, setLanguage } = useSettings();

  const setDirection = useCallback(
    (next: TextDirection) => {
      setLanguage(next === "rtl" ? "fa" : "en");
    },
    [setLanguage],
  );

  const toggleDirection = useCallback(() => {
    setLanguage(direction === "rtl" ? "en" : "fa");
  }, [direction, setLanguage]);

  return {
    direction,
    isRtl,
    setDirection,
    toggleDirection,
  };
}
