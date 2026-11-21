import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "./index";

const mockUsePathname = vi.fn(() => "/dashboard");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the FoxTrack brand logo and title", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<Header />);

    expect(screen.getByAltText("FoxTrack Logo")).toBeInTheDocument();
    expect(screen.getByText("Fox")).toBeInTheDocument();
    expect(screen.getByText("Track")).toBeInTheDocument();
  });

  it("renders settings button linking to /settings when not on settings page", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<Header />);

    const settingsLink = screen.getByRole("link", { name: /settings|تنظیمات/i });
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute("href", "/settings");
  });

  it("does not render settings button when on /settings route", () => {
    mockUsePathname.mockReturnValue("/settings");
    render(<Header />);

    expect(screen.queryByRole("link", { name: /settings|تنظیمات/i })).not.toBeInTheDocument();
  });
});
