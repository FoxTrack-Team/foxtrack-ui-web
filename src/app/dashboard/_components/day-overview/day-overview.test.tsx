import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Task } from "@/features/tasks/types";

import { DayOverview } from "./index";

describe("DayOverview", () => {
  const mockTasks: Task[] = [
    {
      completed: true,
      createdAt: 1000,
      dueDate: 2000,
      id: "1",
      priority: "medium",
      title: "Completed Task",
      updatedAt: 1000,
    },
    {
      completed: false,
      createdAt: 1000,
      dueDate: 2000,
      id: "2",
      priority: "high",
      title: "High Priority Pending",
      updatedAt: 1000,
    },
  ];

  it("calculates progress and renders counts accurately", () => {
    render(<DayOverview tasks={mockTasks} />);

    // Total 2, 1 completed (50%)
    expect(screen.getAllByText("1/2").length).toBeGreaterThanOrEqual(1);

    // Check progressbar value
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "50");
  });

  it("shows all-done celebration when all tasks are completed", () => {
    const allDoneTasks: Task[] = [
      {
        completed: true,
        createdAt: 1000,
        dueDate: 2000,
        id: "1",
        priority: "low",
        title: "Done",
        updatedAt: 1000,
      },
    ];

    render(<DayOverview tasks={allDoneTasks} />);
    expect(screen.getByText("1/1")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("combines tasks and habits progress when habitsTotal > 0", () => {
    render(<DayOverview habitsCompleted={1} habitsTotal={2} tasks={mockTasks} />);

    // 1 task completed + 1 habit completed = 2 / 4 (50%)
    expect(screen.getByText("2/4")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
  });
});
