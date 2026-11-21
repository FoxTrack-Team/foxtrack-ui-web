import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { db } from "@/db/database";

import EditCategoryPage from "./edit/page";
import NewCategoryPage from "./new/page";

const mockPush = vi.fn();
let currentSearchParamId: string | null = null;

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
  useSearchParams: () => ({
    get: (key: string) => (key === "id" ? currentSearchParamId : null),
  }),
}));

describe("New & Edit Category Pages", () => {
  beforeEach(async () => {
    mockPush.mockClear();
    currentSearchParamId = null;
    await db.categories.clear();
  });

  it("renders NewCategoryPage and creates a category", async () => {
    render(
      <SettingsProvider>
        <NewCategoryPage />
      </SettingsProvider>,
    );

    expect(screen.getByRole("heading", { name: /New Category/i })).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/e\.g\. Health, Work, Study/i);
    fireEvent.change(input, { target: { value: "Gaming" } });

    // Pick Art icon
    const artIconBtn = screen.getByRole("button", { name: "Art" });
    fireEvent.click(artIconBtn);

    // Submit
    const submitBtn = screen.getByRole("button", { name: "Create Category" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/more/categories");
    });

    const all = await db.categories.toArray();
    expect(all.some((c) => c.name === "Gaming")).toBe(true);
  });

  it("renders EditCategoryPage and updates an existing custom category", async () => {
    const customId = "cat-custom-123";
    await db.categories.add({
      color: "blue",
      createdAt: new Date().toISOString(),
      icon: "briefcase",
      id: customId,
      isDefault: false,
      name: "Old Name",
      order: 10,
      updatedAt: new Date().toISOString(),
    });

    currentSearchParamId = customId;

    render(
      <SettingsProvider>
        <EditCategoryPage />
      </SettingsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Old Name")).toBeInTheDocument();
    });

    const input = screen.getByDisplayValue("Old Name");
    fireEvent.change(input, { target: { value: "Updated Name" } });

    const submitBtn = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/more/categories");
    });

    const updated = await db.categories.get(customId);
    expect(updated?.name).toBe("Updated Name");
  });
});
