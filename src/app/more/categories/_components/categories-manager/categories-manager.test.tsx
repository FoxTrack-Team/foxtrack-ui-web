import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { db } from "@/db/database";

import { CategoriesManager } from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/more/categories",
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

describe("CategoriesManager (HabitNow Style)", () => {
  beforeEach(async () => {
    mockPush.mockClear();
    await db.categories.clear();
  });

  it("automatically seeds all 14 HabitNow default categories with 0 items count", async () => {
    render(
      <SettingsProvider>
        <CategoriesManager />
      </SettingsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Quit a bad habit")).toBeInTheDocument();
      expect(screen.getByText("Art")).toBeInTheDocument();
      expect(screen.getByText("Meditation")).toBeInTheDocument();
      expect(screen.getByText("Study")).toBeInTheDocument();
      expect(screen.getByText("Sports")).toBeInTheDocument();
      expect(screen.getByText("Entertainment")).toBeInTheDocument();
      expect(screen.getByText("Social")).toBeInTheDocument();
      expect(screen.getByText("Finance")).toBeInTheDocument();
      expect(screen.getByText("Health")).toBeInTheDocument();
      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Nutrition")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Outdoor")).toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument();
    });

    // Check that items count (0 entries) is shown under each category
    const zeroHabitsList = screen.getAllByText("0 entries");
    expect(zeroHabitsList.length).toBe(14);

    // Default categories should be read-only without delete or edit buttons
    expect(screen.queryByRole("button", { name: /Delete Work/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Edit Work/i })).not.toBeInTheDocument();
  });

  it("navigates to /more/categories/new when clicking the FAB button", async () => {
    render(
      <SettingsProvider>
        <CategoriesManager />
      </SettingsProvider>,
    );

    // Click FAB button
    const fabButton = screen.getByRole("button", { name: /New Category/i });
    fireEvent.click(fabButton);

    expect(mockPush).toHaveBeenCalledWith("/more/categories/new");
  });

  it("navigates to /more/categories/edit when clicking on a custom category", async () => {
    await db.categories.add({
      color: "orange",
      createdAt: new Date().toISOString(),
      icon: "target",
      id: "custom-test-1",
      isDefault: false,
      name: "My Side Project",
      order: 99,
      updatedAt: new Date().toISOString(),
    });

    render(
      <SettingsProvider>
        <CategoriesManager />
      </SettingsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("My Side Project")).toBeInTheDocument();
    });

    const editBtn = screen.getByRole("button", { name: /Edit My Side Project/i });
    fireEvent.click(editBtn);

    expect(mockPush).toHaveBeenCalledWith("/more/categories/edit?id=custom-test-1");
  });
});
