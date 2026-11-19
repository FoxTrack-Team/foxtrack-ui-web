import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskList } from "./index";

describe("TaskList", () => {
  it("renders empty state when tasks list is empty", () => {
    render(<TaskList filter="active" isLoading={false} tasks={[]} />);
    expect(screen.getByText("All clear")).toBeInTheDocument();
  });
});
