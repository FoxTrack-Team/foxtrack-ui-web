import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Header } from "./index";

describe("Header", () => {
  it("renders the FoxTrack brand logo and title", () => {
    render(<Header />);

    expect(screen.getByAltText("FoxTrack Logo")).toBeInTheDocument();
    expect(screen.getByText("Fox")).toBeInTheDocument();
    expect(screen.getByText("Track")).toBeInTheDocument();
  });

  it("renders today's date badge and does not render theme toggle", () => {
    render(<Header />);

    expect(screen.getByLabelText("Today's date")).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/switch to dark theme|switch to light theme/i),
    ).not.toBeInTheDocument();
  });
});
