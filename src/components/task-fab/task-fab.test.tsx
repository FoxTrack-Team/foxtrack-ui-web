import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TaskFab } from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("TaskFab", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders the floating action button and navigates to /tasks/new when clicked", () => {
    render(<TaskFab />);

    const fab = screen.getByRole("button", { name: /Add new task/i });
    expect(fab).toBeInTheDocument();

    fireEvent.click(fab);
    expect(mockPush).toHaveBeenCalledWith("/tasks/new");
  });

  it("navigates to /tasks/new with dueDate query parameter when defaultDueDate is provided", () => {
    render(<TaskFab defaultDueDate={1735689600000} />);

    const fab = screen.getByRole("button", { name: /Add new task/i });
    fireEvent.click(fab);
    expect(mockPush).toHaveBeenCalledWith("/tasks/new?dueDate=1735689600000");
  });
});
