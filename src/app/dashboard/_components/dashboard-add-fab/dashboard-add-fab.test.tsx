import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { DashboardAddFab } from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("DashboardAddFab", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("opens chooser drawer on FAB click and navigates to selected creation route", () => {
    render(
      <SettingsProvider>
        <DashboardAddFab defaultDueDate={1735689600000} />
      </SettingsProvider>,
    );

    const fab = screen.getByRole("button", { name: /Add new task/i });
    fireEvent.click(fab);

    const dialog = screen.getByRole("dialog", { name: /What would you like to add\?/i });
    expect(dialog).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: /New Task/i }));
    expect(mockPush).toHaveBeenCalledWith("/tasks/new?dueDate=1735689600000");

    // Reopen and choose New Habit
    fireEvent.click(fab);
    const reopenedDialog = screen.getByRole("dialog", { name: /What would you like to add\?/i });
    fireEvent.click(within(reopenedDialog).getByRole("button", { name: /New Habit/i }));
    expect(mockPush).toHaveBeenCalledWith("/habits/new");
  });
});
