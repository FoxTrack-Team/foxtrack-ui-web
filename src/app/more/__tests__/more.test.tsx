import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { db } from "@/db/database";

import MoreAnalyticsPage from "../analytics/page";
import MoreCategoriesPage from "../categories/page";
import MorePage from "../page";
import MoreProjectsPage from "../projects/page";
import MoreTagsPage from "../tags/page";
import MoreTemplate from "../template";

const mockUsePathname = vi.fn(() => "/more");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("More Routes & Subpages", () => {
  beforeEach(async () => {
    await db.tags.clear();
  });

  describe("MorePage (Overview List)", () => {
    it("renders sections as a list with navigation links", () => {
      render(
        <SettingsProvider>
          <MorePage />
        </SettingsProvider>,
      );

      expect(
        screen.getByRole("heading", { name: /Features & Tools|امکانات و ابزارها/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Tag Management|مدیریت برچسب‌ها/i })).toHaveAttribute(
        "href",
        "/more/tags",
      );
      expect(screen.getByRole("link", { name: /Categories|دسته‌بندی‌ها/i })).toHaveAttribute(
        "href",
        "/more/categories",
      );
      expect(
        screen.getByRole("link", { name: /Projects & Lists|پروژه‌ها و دسته‌ها/i }),
      ).toHaveAttribute("href", "/more/projects");
      expect(
        screen.getByRole("link", { name: /Analytics & Reports|آمار و گزارش‌ها/i }),
      ).toHaveAttribute("href", "/more/analytics");
    });
  });

  describe("MoreTagsPage (/more/tags)", () => {
    it("renders back link to /more and tags manager", () => {
      render(
        <SettingsProvider>
          <MoreTagsPage />
        </SettingsProvider>,
      );

      const backLink = screen.getByRole("link", {
        name: /Features & Tools|امکانات و ابزارها/i,
      });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/more");
      expect(screen.getByText("No tags yet")).toBeInTheDocument();
    });
  });

  describe("MoreCategoriesPage (/more/categories)", () => {
    it("renders back link to /more and categories manager", () => {
      render(
        <SettingsProvider>
          <MoreCategoriesPage />
        </SettingsProvider>,
      );

      const backLink = screen.getByRole("link", {
        name: /Features & Tools|امکانات و ابزارها/i,
      });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/more");
      expect(screen.getByText("No categories yet")).toBeInTheDocument();
    });
  });

  describe("MoreProjectsPage (/more/projects)", () => {
    it("renders back link to /more and projects placeholder", () => {
      render(
        <SettingsProvider>
          <MoreProjectsPage />
        </SettingsProvider>,
      );

      const backLink = screen.getByRole("link", {
        name: /Features & Tools|امکانات و ابزارها/i,
      });
      expect(backLink).toHaveAttribute("href", "/more");
      expect(
        screen.getByRole("heading", { name: /Projects & Lists|پروژه‌ها و دسته‌ها/i }),
      ).toBeInTheDocument();
    });
  });

  describe("MoreAnalyticsPage (/more/analytics)", () => {
    it("renders back link to /more and analytics placeholder", () => {
      render(
        <SettingsProvider>
          <MoreAnalyticsPage />
        </SettingsProvider>,
      );

      const backLink = screen.getByRole("link", {
        name: /Features & Tools|امکانات و ابزارها/i,
      });
      expect(backLink).toHaveAttribute("href", "/more");
      expect(
        screen.getByRole("heading", { name: /Analytics & Reports|آمار و گزارش‌ها/i }),
      ).toBeInTheDocument();
    });
  });

  describe("MoreTemplate", () => {
    it("applies backward transition on root /more page", () => {
      mockUsePathname.mockReturnValue("/more");
      const { container } = render(
        <MoreTemplate>
          <div>More Content</div>
        </MoreTemplate>,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("animate-settings-backward");
    });

    it("applies forward transition on subpages", () => {
      mockUsePathname.mockReturnValue("/more/tags");
      const { container } = render(
        <MoreTemplate>
          <div>Tags Content</div>
        </MoreTemplate>,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("animate-settings-forward");
    });
  });
});
