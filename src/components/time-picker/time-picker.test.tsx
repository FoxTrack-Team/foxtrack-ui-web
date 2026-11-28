import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { TimePicker } from "./index";

describe("TimePicker", () => {
  it("renders placeholder when empty and opens modal to pick hour & minute", () => {
    const handleChange = vi.fn();

    render(
      <SettingsProvider>
        <TimePicker ariaLabel="Start Time" value="" onChange={handleChange} />
      </SettingsProvider>,
    );

    const trigger = screen.getByRole("button", { name: "Start Time" });
    expect(trigger).toHaveTextContent("Select time");

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Start Time" })).toBeInTheDocument();

    fireEvent.click(within(screen.getByLabelText("Hour")).getByRole("button", { name: "06" }));
    fireEvent.click(within(screen.getByLabelText("Minute")).getByRole("button", { name: "30" }));
    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    expect(handleChange).toHaveBeenCalledWith("06:30");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("displays selected time and clears it when clear button is clicked", () => {
    const handleChange = vi.fn();

    render(
      <SettingsProvider>
        <TimePicker ariaLabel="Start Time" value="08:15" onChange={handleChange} />
      </SettingsProvider>,
    );

    expect(screen.getByRole("button", { name: "Start Time" })).toHaveTextContent("08:15");
    fireEvent.click(screen.getByRole("button", { name: /Clear time/i }));
    expect(handleChange).toHaveBeenCalledWith("");
  });
});
