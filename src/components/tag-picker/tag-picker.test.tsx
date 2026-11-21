import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { db } from "@/db/database";

import { SelectedTag, TagPicker } from "./index";

describe("TagPicker", () => {
  beforeEach(async () => {
    await db.tags.clear();
    await db.tags.add({
      color: "emerald",
      createdAt: 1000,
      id: "tag-1",
      name: "Work",
      updatedAt: 1000,
    });
  });

  it("renders selected tags and allows removing a tag", () => {
    const handleChange = vi.fn();
    const value: SelectedTag[] = [{ color: "emerald", id: "tag-1", name: "Work" }];

    render(
      <SettingsProvider>
        <TagPicker value={value} onChange={handleChange} />
      </SettingsProvider>,
    );

    expect(screen.getByText("Work")).toBeInTheDocument();
    const removeBtn = screen.getByRole("button", { name: /Remove tag Work/i });
    fireEvent.click(removeBtn);

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it("opens dropdown and allows creating a new tag", () => {
    const handleChange = vi.fn();
    render(
      <SettingsProvider>
        <TagPicker value={[]} onChange={handleChange} />
      </SettingsProvider>,
    );

    // Open dropdown
    const trigger = screen.getByRole("button", { name: /add tag/i });
    fireEvent.click(trigger);

    // Type new tag name
    const input = screen.getByPlaceholderText(/search or create tag/i);
    fireEvent.change(input, { target: { value: "Urgent" } });

    // Click create tag option
    const createBtn = screen.getByRole("button", { name: /create tag/i });
    fireEvent.click(createBtn);

    expect(handleChange).toHaveBeenCalledWith([
      expect.objectContaining({
        color: "orange",
        isNew: true,
        name: "Urgent",
      }),
    ]);
  });
});
