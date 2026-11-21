import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { SubpageHeader } from "./index";

describe("SubpageHeader", () => {
  it("renders with default settings back link", () => {
    render(
      <SettingsProvider>
        <SubpageHeader />
      </SettingsProvider>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/settings");
  });

  it("renders custom backHref and backLabel", () => {
    render(
      <SettingsProvider>
        <SubpageHeader backHref="/more" backLabel="More" title="Custom Title" />
      </SettingsProvider>,
    );

    const link = screen.getByRole("link", { name: "More" });
    expect(link).toHaveAttribute("href", "/more");
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });
});
