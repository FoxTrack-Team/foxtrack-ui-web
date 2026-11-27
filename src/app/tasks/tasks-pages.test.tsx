import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { db } from "@/db/database";

import EditTaskPage from "./edit/page";
import NewTaskPage from "./new/page";

const mockPush = vi.fn();
let currentSearchParamId: string | null = null;
let currentSearchParamDueDate: string | null = null;

vi.mock("next/navigation", () => ({
  usePathname: () => "/tasks",
  useRouter: () => ({
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: mockPush,
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "id") return currentSearchParamId;
      if (key === "dueDate") return currentSearchParamDueDate;
      return null;
    },
  }),
}));

describe("New & Edit Task Pages", () => {
  beforeEach(async () => {
    mockPush.mockClear();
    currentSearchParamId = null;
    currentSearchParamDueDate = null;
    await db.tasks.clear();
  });

  it("renders NewTaskPage and creates a new task", async () => {
    render(
      <SettingsProvider>
        <NewTaskPage />
      </SettingsProvider>,
    );

    expect(screen.getByRole("heading", { name: /New Task/i })).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/What needs to be done\?/i);
    fireEvent.change(titleInput, { target: { value: "Build dedicated task page" } });

    const descInput = screen.getByPlaceholderText(/Add notes or description/i);
    fireEvent.change(descInput, { target: { value: "Using App Router and shared TaskForm" } });

    // Pick High priority
    const highBtn = screen.getByRole("button", { name: /^high$/i });
    fireEvent.click(highBtn);

    // Submit
    const submitBtn = screen.getByRole("button", { name: /^Add Task$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/tasks");
    });

    const all = await db.tasks.toArray();
    expect(all.some((t) => t.title === "Build dedicated task page")).toBe(true);
  });

  it("renders EditTaskPage and updates an existing task", async () => {
    const taskId = "task-edit-test-1";
    await db.tasks.add({
      completed: false,
      createdAt: 1000,
      description: "Initial description",
      dueDate: null,
      id: taskId,
      priority: "low",
      title: "Initial Title",
      updatedAt: 1000,
    });

    currentSearchParamId = taskId;

    render(
      <SettingsProvider>
        <EditTaskPage />
      </SettingsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Initial Title")).toBeInTheDocument();
    });

    const input = screen.getByDisplayValue("Initial Title");
    fireEvent.change(input, { target: { value: "Updated Task Title" } });

    const doneToggle = screen.getByRole("checkbox", { name: /Mark as completed/i });
    fireEvent.click(doneToggle);
    expect(doneToggle).toHaveAttribute("aria-checked", "true");

    const submitBtn = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/tasks");
    });

    const updated = await db.tasks.get(taskId);
    expect(updated?.title).toBe("Updated Task Title");
    expect(updated?.completed).toBe(true);
  });
});
