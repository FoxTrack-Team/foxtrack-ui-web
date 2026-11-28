import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { habitRepository } from "@/features/habits/services/dexie-habit-repository";

import { db } from "@/db/database";

import { HabitsManager } from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/habits",
  useRouter: () => ({
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: mockPush,
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("HabitsManager", () => {
  beforeEach(async () => {
    mockPush.mockClear();
    await db.habits.clear();
    await db.habitLogs.clear();
  });

  it("renders empty state when no habits exist and navigates to /habits/new", async () => {
    render(
      <SettingsProvider>
        <HabitsManager />
      </SettingsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("No habits yet")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole("button", { name: /Add Habit/i })[0]);
    expect(mockPush).toHaveBeenCalledWith("/habits/new");
  });

  it("renders scheduled routines in logical daily timeline order", async () => {
    await habitRepository.create({
      endTime: "06:00",
      frequencyType: "daily",
      startTime: "00:00",
      title: "Sleep",
    });
    await habitRepository.create({
      endTime: "06:15",
      frequencyType: "daily",
      startTime: "06:00",
      title: "Wake up",
    });

    render(
      <SettingsProvider>
        <HabitsManager />
      </SettingsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Wake up")).toBeInTheDocument();
      expect(screen.getByText("Sleep")).toBeInTheDocument();
    });

    const wakeEl = screen.getByText("Wake up");
    const sleepEl = screen.getByText("Sleep");
    expect(wakeEl.compareDocumentPosition(sleepEl) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
