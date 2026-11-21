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
    mockUsePathname.mockReturnValue("/dashboard");
    render(<BottomNav />);

    const dashboardLink = screen.getByRole("link", { name: /^dashboard$/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
    expect(dashboardLink).toHaveAttribute("aria-current", "page");

    expect(screen.getByRole("link", { name: /^tasks$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^habits$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^more$/i })).toBeInTheDocument();
  });

  it("marks current route with aria-current='page'", () => {
    mockUsePathname.mockReturnValue("/habits");
    render(<BottomNav />);

    const habitsLink = screen.getByRole("link", { name: /^habits$/i });
    expect(habitsLink).toHaveAttribute("aria-current", "page");
    expect(habitsLink.className).toContain("bg-orange-500");

    const dashboardLink = screen.getByRole("link", { name: /^dashboard$/i });
    expect(dashboardLink).not.toHaveAttribute("aria-current");
    expect(dashboardLink.className).not.toContain("bg-orange-500");
  });

  it("does not render any Soon badges on the navigation items", () => {
    mockUsePathname.mockReturnValue("/");
    render(<BottomNav />);

    expect(screen.queryByText(/soon/i)).not.toBeInTheDocument();
  });

  it("correctly identifies active route with trailing slash", () => {
    mockUsePathname.mockReturnValue("/dashboard/");
    render(<BottomNav />);

    const dashboardLink = screen.getByRole("link", { name: /^dashboard$/i });
    expect(dashboardLink).toHaveAttribute("aria-current", "page");
    expect(dashboardLink.className).toContain("bg-orange-500");

    const tasksLink = screen.getByRole("link", { name: /^tasks$/i });
    expect(tasksLink).not.toHaveAttribute("aria-current");
  });

  it("does not select any item when on /settings route", () => {
    mockUsePathname.mockReturnValue("/settings");
    render(<BottomNav />);

    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link).not.toHaveAttribute("aria-current");
      expect(link.className).not.toContain("text-white");
    }
  });
});
