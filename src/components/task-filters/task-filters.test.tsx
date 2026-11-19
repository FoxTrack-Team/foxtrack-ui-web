import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TaskFilters } from "./index";

describe("TaskFilters", () => {
  it("renders counts and triggers filter change", () => {
    const onFilterChange = vi.fn();
    render(
      <TaskFilters
        counts={{ all: 8, active: 5, completed: 3 }}
        currentFilter="all"
        onFilterChange={onFilterChange}
      />,
    );

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    const activeTab = screen.getByRole("button", { name: /Active/i });
    fireEvent.click(activeTab);
    expect(onFilterChange).toHaveBeenCalledWith("active");
  });
});
