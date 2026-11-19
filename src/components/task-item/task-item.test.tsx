import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { Task } from "@/features/tasks/types";

import { TaskItem } from "./index";

describe("TaskItem", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("displays task details, handles toggle, edit, and delete", async () => {
    const mockTask: Task = {
      id: "task-123",
      title: "Review pull request",
      completed: false,
      priority: "high",
      dueDate: 1735689600000,
      createdAt: 1000,
      updatedAt: 1000,
    };

    const toggleSpy = vi.spyOn(taskRepository, "toggleComplete").mockResolvedValue({
      ...mockTask,
      completed: true,
    });
    const updateSpy = vi.spyOn(taskRepository, "update").mockResolvedValue({
      ...mockTask,
      title: "Review PR #42",
      priority: "medium",
    });
    const deleteSpy = vi.spyOn(taskRepository, "delete").mockResolvedValue();

    render(<TaskItem task={mockTask} />);

    expect(screen.getByText("Review pull request")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();

    const checkbox = screen.getByLabelText("Mark as completed");
    fireEvent.click(checkbox);
    expect(toggleSpy).toHaveBeenCalledWith("task-123");

    const editBtn = screen.getByLabelText("Edit task");
    fireEvent.click(editBtn);

    const editInput = screen.getByDisplayValue("Review pull request");
    fireEvent.change(editInput, { target: { value: "Review PR #42" } });

    const mediumBtn = screen.getByRole("button", { name: /^medium$/i });
    fireEvent.click(mediumBtn);

    const saveBtn = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(
        "task-123",
        expect.objectContaining({
          title: "Review PR #42",
          priority: "medium",
        }),
      );
    });

    const deleteBtn = screen.getByLabelText("Delete task");
    fireEvent.click(deleteBtn);
    expect(deleteSpy).toHaveBeenCalledWith("task-123");
  });
});
