import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { taskRepository } from "@/features/tasks/services/dexie-task-repository";

import { TaskInput } from "./index";

describe("TaskInput", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a new task on Enter with selected priority", async () => {
    const createSpy = vi.spyOn(taskRepository, "create").mockResolvedValue({
      id: "test-1",
      title: "Walk the dog",
      completed: false,
      priority: "high",
      dueDate: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    render(<TaskInput />);

    const input = screen.getByPlaceholderText(/New task|Add a task/i);
    fireEvent.change(input, { target: { value: "Walk the dog" } });

    const highButton = screen.getByRole("button", { name: /High/i });
    fireEvent.click(highButton);

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Walk the dog",
          priority: "high",
        }),
      );
    });

    expect(input).toHaveValue("");
  });
});
