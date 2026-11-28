import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { habitRepository } from "@/features/habits/services/dexie-habit-repository";

import { db } from "@/db/database";

import { HabitItem } from "./index";

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

describe("HabitItem", () => {
  beforeEach(async () => {
    mockPush.mockClear();
    await db.habits.clear();
    await db.habitLogs.clear();
  });

  it("displays schedule, duration, execution note, and toggles completion", async () => {
    const habit = await habitRepository.create({
      description: "Actionable note",
      endTime: "06:15",
      frequencyType: "daily",
      startTime: "06:00",
      title: "Wake up",
    });

    render(
      <SettingsProvider>
        <HabitItem
          completedDateKeys={new Set()}
          dateKey="2026-11-28"
          habit={habit}
          isTodayView={true}
        />
      </SettingsProvider>,
    );

    expect(screen.getByText("Wake up")).toBeInTheDocument();
    expect(screen.queryByText("Actionable note")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Execution Note")).toBeInTheDocument();
    expect(screen.getByText("06:00 – 06:15")).toBeInTheDocument();
    expect(screen.getByText(/15m/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: /Mark habit completed/i }));

    await waitFor(async () => {
      const log = await db.habitLogs.get(`${habit.id}_2026-11-28`);
      expect(log?.completed).toBe(true);
    });
  });

  it("shows edit and delete actions without checkbox in manage mode", () => {
    const habit = {
      archived: false,
      createdAt: 1,
      endTime: "06:15",
      frequencyType: "daily" as const,
      id: "h-manage",
      order: 0,
      startTime: "06:00",
      targetDays: [0, 1, 2, 3, 4, 5, 6],
      title: "Morning Walk",
      updatedAt: 1,
    };

    render(
      <SettingsProvider>
        <HabitItem
          completedDateKeys={new Set()}
          dateKey="2026-11-28"
          habit={habit}
          isTodayView={true}
          mode="manage"
        />
      </SettingsProvider>,
    );

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Morning Walk"));
    expect(mockPush).toHaveBeenCalledWith("/habits/edit?id=h-manage");
  });
});
