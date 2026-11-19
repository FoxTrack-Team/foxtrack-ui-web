import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";

import { TaskFab } from "./index";

describe("TaskFab", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the floating action button and opens modal when clicked", () => {
    render(<TaskFab />);

    const fab = screen.getByRole("button", { name: /Add new task/i });
    expect(fab).toBeInTheDocument();

    // Modal is initially not in document
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Click FAB to open
    fireEvent.click(fab);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("New Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/What needs to be done\?/i)).toBeInTheDocument();
  });

  it("creates a task and closes the modal on submit", async () => {
    const createSpy = vi.spyOn(taskRepository, "create").mockResolvedValue({
      id: "fab-1",
      title: "Buy groceries",
      completed: false,
      priority: "high",
      dueDate: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    render(<TaskFab />);

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /Add new task/i }));

    const input = screen.getByPlaceholderText(/What needs to be done\?/i);
    fireEvent.change(input, { target: { value: "Buy groceries" } });

    // Select high priority
    fireEvent.click(screen.getByRole("button", { name: /High/i }));

    // Click Add Task button
    const submitBtn = screen.getByRole("button", { name: /Add Task/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Buy groceries",
          priority: "high",
        }),
      );
    });

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes modal on Cancel click without creating task", () => {
    const createSpy = vi.spyOn(taskRepository, "create");
    render(<TaskFab />);

    fireEvent.click(screen.getByRole("button", { name: /Add new task/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();
  });
});
