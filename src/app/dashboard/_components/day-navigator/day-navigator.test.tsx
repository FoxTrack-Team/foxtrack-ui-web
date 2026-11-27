import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DayNavigator } from "./index";

describe("DayNavigator", () => {
  it("renders header and navigates to previous and next days", () => {
    const onSelectDate = vi.fn();
    const testDate = new Date(2026, 10, 20); // Nov 20, 2026

    render(
      <DayNavigator selectedDate={testDate} taskDatesSet={new Set()} onSelectDate={onSelectDate} />,
    );

    const prevButton = screen.getByRole("button", { name: /previous day/i });
    const nextButton = screen.getByRole("button", { name: /next day/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    fireEvent.click(prevButton);
    expect(onSelectDate).toHaveBeenCalled();

    fireEvent.click(nextButton);
    expect(onSelectDate).toHaveBeenCalledTimes(2);

    const calendarButton = screen.getByRole("button", { name: /open calendar/i });
    expect(calendarButton).toBeInTheDocument();

    fireEvent.click(calendarButton);
    const dialog = screen.getByRole("dialog", { name: /calendar/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: /^today$/i })).not.toBeInTheDocument();
  });
});
