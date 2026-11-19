import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import SettingsPage from "../page";

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders all settings sections in the overview hub", () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>,
    );

    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Appearance & Language" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Data & Storage" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About FoxTrack" })).toBeInTheDocument();
  });

  it("drills down into Appearance subpage and changes language", () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>,
    );

    // Click Appearance row
    const appearanceRow = screen.getByRole("button", { name: /Appearance & Language/i });
    fireEvent.click(appearanceRow);

    // Verify subpage content is visible
    const farsiBtn = screen.getByRole("button", { name: "فارسی" });
    expect(farsiBtn).toBeInTheDocument();
    fireEvent.click(farsiBtn);

    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("fa");
  });

  it("drills down into Appearance subpage and changes theme", () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>,
    );

    const appearanceRow = screen.getByRole("button", { name: /Appearance & Language/i });
    fireEvent.click(appearanceRow);

    const darkBtn = screen.getByRole("button", { name: "Dark" });
    fireEvent.click(darkBtn);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("foxtrack-theme")).toBe("dark");
  });

  it("navigates back to the settings overview when clicking the back button", () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>,
    );

    const dataRow = screen.getByRole("button", { name: /Data & Storage/i });
    fireEvent.click(dataRow);

    // Back button is rendered
    const backBtn = screen.getByRole("button", { name: /Settings/i });
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);

    // Back in overview
    expect(screen.getByRole("button", { name: /Appearance & Language/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Data & Storage/i })).toBeInTheDocument();
  });

  it("navigates back to the overview when Escape key is pressed", () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>,
    );

    const aboutRow = screen.getByRole("button", { name: /About FoxTrack/i });
    fireEvent.click(aboutRow);

    expect(screen.getByRole("button", { name: /Settings/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.getByRole("button", { name: /Appearance & Language/i })).toBeInTheDocument();
  });
});
