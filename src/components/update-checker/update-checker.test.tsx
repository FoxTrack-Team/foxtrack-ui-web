import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { UpdateChecker } from "./index";

describe("UpdateChecker", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not render dialog when no newer version exists", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        tag_name: "v1.0.0",
        html_url: "https://github.com/FoxTrack-Team/foxtrack-ui-web/releases/v1.0.0",
      }),
    } as Response);

    render(<UpdateChecker />);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("renders update dialog when newer version is found", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        tag_name: "v9.9.9",
        html_url: "https://github.com/FoxTrack-Team/foxtrack-ui-web/releases/v9.9.9",
        assets: [
          {
            name: "foxtrack-v9.9.9.apk",
            browser_download_url: "https://download.url/foxtrack.apk",
          },
        ],
      }),
    } as Response);

    render(<UpdateChecker />);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("v9.9.9")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /دانلود نسخه جدید/i })).toBeInTheDocument();
  });

  it("dismisses and does not reappear in the same session", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        tag_name: "v9.9.9",
        html_url: "https://github.com/FoxTrack-Team/foxtrack-ui-web/releases/v9.9.9",
      }),
    } as Response);

    const { unmount } = render(<UpdateChecker />);
    const laterBtn = await screen.findByRole("button", { name: /بعداً/i });

    fireEvent.click(laterBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    unmount();

    // Rerender in same session
    render(<UpdateChecker />);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
