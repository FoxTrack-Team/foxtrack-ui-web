import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { HabitForm } from "./index";

describe("HabitForm", () => {
  it("calculates duration live including overnight spans and submits valid input", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <SettingsProvider>
        <HabitForm title="New Habit" onCancel={vi.fn()} onSubmit={handleSubmit} />
      </SettingsProvider>,
    );

    const titleInput = screen.getByPlaceholderText(/Morning planning/i);
    fireEvent.change(titleInput, { target: { value: "Deep Work" } });

    fireEvent.click(screen.getByRole("button", { name: "Start Time" }));
    fireEvent.click(within(screen.getByLabelText("Hour")).getByRole("button", { name: "22" }));
    fireEvent.click(within(screen.getByLabelText("Minute")).getByRole("button", { name: "30" }));
    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    fireEvent.click(screen.getByRole("button", { name: "End Time" }));
    fireEvent.click(within(screen.getByLabelText("Hour")).getByRole("button", { name: "00" }));
    fireEvent.click(within(screen.getByLabelText("Minute")).getByRole("button", { name: "00" }));
    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    expect(screen.getByText(/Duration: 1.5h/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Add Habit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          endTime: "00:00",
          frequencyType: "daily",
          startTime: "22:30",
          title: "Deep Work",
        }),
      );
    });
  });

  it("allows selecting specific days of the week", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <SettingsProvider>
        <HabitForm title="New Habit" onCancel={vi.fn()} onSubmit={handleSubmit} />
      </SettingsProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText(/Morning planning/i), {
      target: { value: "Gym" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Specific days/i }));

    expect(screen.getByRole("button", { name: "Mon" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sun" })).toBeInTheDocument();
  });
});
