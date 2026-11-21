import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { db } from "@/db/database";

import { TagsManager } from "./index";

describe("TagsManager", () => {
  beforeEach(async () => {
    await db.tags.clear();
  });

  it("renders empty state and allows creating a new tag", async () => {
    render(
      <SettingsProvider>
        <TagsManager />
      </SettingsProvider>,
    );

    expect(screen.getByText("No tags yet")).toBeInTheDocument();

    const newTagBtn = screen.getByRole("button", { name: /New Tag/i });
    fireEvent.click(newTagBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/e\.g\. Work, Urgent, Personal/i);
    fireEvent.change(input, { target: { value: "Priority" } });

    const emeraldBtn = screen.getByRole("button", { name: "Emerald" });
    fireEvent.click(emeraldBtn);

    const createBtn = screen.getByRole("button", { name: "Create Tag" });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.getByText("Priority")).toBeInTheDocument();
    });
  });
});
