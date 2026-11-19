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
      json: async () => ({
        html_url: "https://github.com/FoxTrack-Team/foxtrack-ui-web/releases/v1.0.0",
        tag_name: "v1.0.0",
      }),
      ok: true,
    } as Response);

    render(<UpdateChecker />);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("renders update dialog when newer version is found", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        assets: [
          {
            browser_download_url: "https://download.url/foxtrack.apk",
            name: "foxtrack-v9.9.9.apk",
          },
        ],
        html_url: "https://github.com/FoxTrack-Team/foxtrack-ui-web/releases/v9.9.9",
        tag_name: "v9.9.9",
      }),
      ok: true,
    } as Response);

    render(<UpdateChecker />);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("v9.9.9")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download update/i })).toBeInTheDocument();
  });

  it("dismisses and does not reappear in the same session", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        html_url: "https://github.com/FoxTrack-Team/foxtrack-ui-web/releases/v9.9.9",
        tag_name: "v9.9.9",
      }),
      ok: true,
    } as Response);

    const { unmount } = render(<UpdateChecker />);
    const laterBtn = await screen.findByRole("button", { name: /later/i });

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
