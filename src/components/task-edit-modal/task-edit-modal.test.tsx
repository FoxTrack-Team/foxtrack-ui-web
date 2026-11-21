import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { Task } from "@/features/tasks/types";

import { TaskEditModal } from "./index";

describe("TaskEditModal", () => {
  const mockTask: Task = {
    id: "task-101",
    title: "Draft weekly update",
    completed: false,
    priority: "low",
    dueDate: null,
    createdAt: 1000,
    updatedAt: 1000,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders when open and saves updated task", async () => {
    const updateSpy = vi.spyOn(taskRepository, "update").mockResolvedValue({
      ...mockTask,
      priority: "high",
      title: "Draft weekly report",
    });
    const handleClose = vi.fn();

    render(<TaskEditModal isOpen={true} task={mockTask} onClose={handleClose} />);

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    const input = screen.getByDisplayValue("Draft weekly update");
    fireEvent.change(input, { target: { value: "Draft weekly report" } });

    const highBtn = screen.getByRole("button", { name: /^high$/i });
    fireEvent.click(highBtn);

    const saveBtn = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(
        "task-101",
        expect.objectContaining({
          dueDate: null,
          priority: "high",
          title: "Draft weekly report",
        }),
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("handles deletion from within the modal", async () => {
    const deleteSpy = vi.spyOn(taskRepository, "delete").mockResolvedValue();
    const handleClose = vi.fn();

    render(<TaskEditModal isOpen={true} task={mockTask} onClose={handleClose} />);

    const deleteBtn = screen.getByRole("button", { name: /delete task/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("task-101");
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("handles Enter key to save", async () => {
    const updateSpy = vi.spyOn(taskRepository, "update").mockResolvedValue(mockTask);
    const handleClose = vi.fn();

    render(<TaskEditModal isOpen={true} task={mockTask} onClose={handleClose} />);

    const input = screen.getByDisplayValue("Draft weekly update");
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(
        "task-101",
        expect.objectContaining({
          dueDate: null,
          priority: "low",
          title: "Draft weekly update",
        }),
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("updates task description", async () => {
    const updateSpy = vi.spyOn(taskRepository, "update").mockResolvedValue({
      ...mockTask,
      description: "Updated notes",
    });
    const handleClose = vi.fn();

    render(<TaskEditModal isOpen={true} task={mockTask} onClose={handleClose} />);

    const textarea = screen.getByPlaceholderText(/Add notes or description/i);
    fireEvent.change(textarea, { target: { value: "Updated notes" } });

    const saveBtn = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(
        "task-101",
        expect.objectContaining({
          description: "Updated notes",
        }),
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
