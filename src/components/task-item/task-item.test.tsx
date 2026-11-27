import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";
import { Task } from "@/features/tasks/types";

import { TaskItem } from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("TaskItem", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockClear();
  });

  it("displays task details, handles toggle, delete, and navigates to edit page", async () => {
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
    const deleteSpy = vi.spyOn(taskRepository, "delete").mockResolvedValue();

    render(<TaskItem task={mockTask} />);

    expect(screen.getByText("Review pull request")).toBeInTheDocument();
    expect(screen.getByLabelText("High")).toBeInTheDocument();

    const checkbox = screen.getByLabelText("Mark as completed");
    fireEvent.click(checkbox);
    expect(toggleSpy).toHaveBeenCalledWith("task-123");

    const editBtn = screen.getByLabelText("Edit task");
    fireEvent.click(editBtn);
    expect(mockPush).toHaveBeenCalledWith("/tasks/edit?id=task-123");

    const deleteBtn = screen.getByLabelText("Delete task");
    expect(deleteBtn).toHaveAttribute("aria-pressed", "false");

    // First click arms confirmation (turns red) without deleting
    fireEvent.click(deleteBtn);
    expect(deleteBtn).toHaveAttribute("aria-pressed", "true");
    expect(deleteBtn.className).toContain("bg-red-500");
    expect(deleteSpy).not.toHaveBeenCalled();

    // Second click confirms and deletes the task
    fireEvent.click(deleteBtn);
    expect(deleteSpy).toHaveBeenCalledWith("task-123");
  });

  it("renders description and handles card click navigation to edit page", async () => {
    const mockTaskWithDetails: Task = {
      completed: false,
      createdAt: 1000,
      description: "Remember to check responsive mobile styles",
      dueDate: null,
      id: "task-456",
      priority: "low",
      title: "UI Design Polish",
      updatedAt: 1000,
    };

    render(<TaskItem task={mockTaskWithDetails} />);

    expect(screen.getByText("UI Design Polish")).toBeInTheDocument();
    expect(screen.getByText("Remember to check responsive mobile styles")).toBeInTheDocument();

    fireEvent.click(screen.getByText("UI Design Polish"));
    expect(mockPush).toHaveBeenCalledWith("/tasks/edit?id=task-456");
  });

  it("requires two clicks to uncheck a completed task", async () => {
    const completedTask: Task = {
      completed: true,
      createdAt: 1000,
      dueDate: null,
      id: "task-done",
      priority: "medium",
      title: "Completed task",
      updatedAt: 1000,
    };

    const toggleSpy = vi.spyOn(taskRepository, "toggleComplete").mockResolvedValue({
      ...completedTask,
      completed: false,
    });

    render(<TaskItem task={completedTask} />);

    const checkbox = screen.getByLabelText("Mark as active");

    // First click arms undo confirmation (turns red) without toggling
    fireEvent.click(checkbox);
    expect(checkbox.className).toContain("data-[state=checked]:bg-red-500");
    expect(toggleSpy).not.toHaveBeenCalled();

    // Second click confirms and unchecks the task
    fireEvent.click(checkbox);
    expect(toggleSpy).toHaveBeenCalledWith("task-done");
  });
});
