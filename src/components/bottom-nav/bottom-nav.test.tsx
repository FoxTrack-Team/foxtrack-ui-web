import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { BottomNav } from "./index";

const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("BottomNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all navigation items", () => {
    mockUsePathname.mockReturnValue("/tasks");
    render(<BottomNav />);

    const tasksLink = screen.getByRole("link", { name: /^tasks$/i });
    expect(tasksLink).toBeInTheDocument();
    expect(tasksLink).toHaveAttribute("href", "/tasks");
    expect(tasksLink).toHaveAttribute("aria-current", "page");

    expect(screen.getByRole("link", { name: /^calendar$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^projects$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^settings$/i })).toBeInTheDocument();
  });

  it("marks current route with aria-current='page'", () => {
    mockUsePathname.mockReturnValue("/calendar");
    render(<BottomNav />);

    const calendarLink = screen.getByRole("link", { name: /^calendar$/i });
    expect(calendarLink).toHaveAttribute("aria-current", "page");
    expect(calendarLink.className).toContain("bg-orange-500");

    const tasksLink = screen.getByRole("link", { name: /^tasks$/i });
    expect(tasksLink).not.toHaveAttribute("aria-current");
    expect(tasksLink.className).not.toContain("bg-orange-500");
  });

  it("does not render any Soon badges on the navigation items", () => {
    mockUsePathname.mockReturnValue("/");
    render(<BottomNav />);

    expect(screen.queryByText(/soon/i)).not.toBeInTheDocument();
  });

  it("correctly identifies active route with trailing slash", () => {
    mockUsePathname.mockReturnValue("/projects/");
    render(<BottomNav />);

    const projectsLink = screen.getByRole("link", { name: /^projects$/i });
    expect(projectsLink).toHaveAttribute("aria-current", "page");
    expect(projectsLink.className).toContain("bg-orange-500");

    const tasksLink = screen.getByRole("link", { name: /^tasks$/i });
    expect(tasksLink).not.toHaveAttribute("aria-current");
  });
});
