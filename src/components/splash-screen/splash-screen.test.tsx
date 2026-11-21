import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SplashScreen } from "./index";

describe("SplashScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders brand logo and name initially", () => {
    render(<SplashScreen minDuration={500} />);

    expect(screen.getByRole("status", { name: /application loading/i })).toBeInTheDocument();
    expect(screen.getByAltText("FoxTrack Logo")).toBeInTheDocument();
    expect(screen.getByText("Personal Productivity")).toBeInTheDocument();
  });

  it("fades out and unmounts after duration", () => {
    render(<SplashScreen minDuration={500} />);

    const splash = screen.getByRole("status");
    expect(splash).toBeInTheDocument();

    // Advance to fade out start
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(splash.className).toContain("opacity-0");

    // Advance to unmount
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
