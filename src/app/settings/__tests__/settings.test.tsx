import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import AboutSettingsPage from "../about/page";
import AppearanceSettingsPage from "../appearance/page";
import DataSettingsPage from "../data/page";
import SettingsPage from "../page";
import SettingsTemplate from "../template";

const mockUsePathname = vi.fn(() => "/settings");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("Settings Routes & Subpages", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("SettingsPage (Overview)", () => {
    it("renders all settings sections as navigation links", () => {
      render(
        <SettingsProvider>
          <SettingsPage />
        </SettingsProvider>,
      );

      expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Appearance & Language" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Data & Storage" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "About FoxTrack" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Tags" })).not.toBeInTheDocument();

      expect(screen.getByRole("link", { name: /Appearance & Language/i })).toHaveAttribute(
        "href",
        "/settings/appearance",
      );
      expect(screen.queryByRole("link", { name: /^Tags/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Data & Storage/i })).toHaveAttribute(
        "href",
        "/settings/data",
      );
      expect(screen.getByRole("link", { name: /About FoxTrack/i })).toHaveAttribute(
        "href",
        "/settings/about",
      );
    });
  });

  describe("AppearanceSettingsPage (/settings/appearance)", () => {
    it("renders back button to /settings and changes language", () => {
      render(
        <SettingsProvider>
          <AppearanceSettingsPage />
        </SettingsProvider>,
      );

      const backLink = screen.getByRole("link", { name: /Settings/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/settings");

      const farsiBtn = screen.getByRole("button", { name: "فارسی" });
      fireEvent.click(farsiBtn);

      expect(document.documentElement.dir).toBe("rtl");
      expect(document.documentElement.lang).toBe("fa");
    });

    it("changes theme to dark", () => {
      render(
        <SettingsProvider>
          <AppearanceSettingsPage />
        </SettingsProvider>,
      );

      const darkBtn = screen.getByRole("button", { name: "Dark" });
      fireEvent.click(darkBtn);

      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(localStorage.getItem("foxtrack-theme")).toBe("dark");
    });
  });

  describe("DataSettingsPage (/settings/data)", () => {
    it("renders back link and storage controls", () => {
      render(
        <SettingsProvider>
          <DataSettingsPage />
        </SettingsProvider>,
      );

      expect(screen.getByRole("link", { name: /Settings/i })).toHaveAttribute("href", "/settings");
      expect(screen.getByText("Tasks")).toBeInTheDocument();
      expect(screen.getByText("Habits")).toBeInTheDocument();
      expect(screen.getByText("Categories")).toBeInTheDocument();
    });
  });

  describe("AboutSettingsPage (/settings/about)", () => {
    it("renders back link and about information", () => {
      render(
        <SettingsProvider>
          <AboutSettingsPage />
        </SettingsProvider>,
      );

      expect(screen.getByRole("link", { name: /Settings/i })).toHaveAttribute("href", "/settings");
      expect(screen.getByRole("button", { name: /Check for Updates/i })).toBeInTheDocument();
      expect(screen.getByText("GitHub Repository")).toBeInTheDocument();
    });
  });

  describe("SettingsTemplate", () => {
    it("applies backward transition on root /settings page", () => {
      mockUsePathname.mockReturnValue("/settings");
      const { container } = render(
        <SettingsTemplate>
          <div>Settings Content</div>
        </SettingsTemplate>,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("animate-settings-backward");
    });

    it("applies forward transition on subpages", () => {
      mockUsePathname.mockReturnValue("/settings/appearance");
      const { container } = render(
        <SettingsTemplate>
          <div>Appearance Content</div>
        </SettingsTemplate>,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("animate-settings-forward");
    });
  });
});
