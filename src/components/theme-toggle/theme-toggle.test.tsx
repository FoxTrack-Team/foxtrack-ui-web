import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeToggle } from "./index";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("renders toggle button with accessible label", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("toggles theme between light and dark when clicked", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });

    // Initial state: light
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Click to toggle to dark
    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("foxtrack-theme")).toBe("dark");

    // Click to toggle back to light
    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("foxtrack-theme")).toBe("light");
  });
});
