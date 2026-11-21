import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DatePicker } from "./index";

describe("DatePicker", () => {
  it("renders default trigger button when no date is selected", () => {
    render(<DatePicker value={null} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /due date/i })).toBeInTheDocument();
  });

  it("opens modal sheet when trigger button is clicked", () => {
    render(<DatePicker value={null} onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /due date/i }));

    expect(screen.getByRole("dialog", { name: /select due date/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /today/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tomorrow/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next week/i })).toBeInTheDocument();
  });

  it("calls onChange when Today preset is clicked", () => {
    const handleChange = vi.fn();
    render(<DatePicker value={null} onChange={handleChange} />);

    fireEvent.click(screen.getByRole("button", { name: /due date/i }));
    fireEvent.click(screen.getByRole("button", { name: /today/i }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(typeof handleChange.mock.calls[0][0]).toBe("number");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders formatted date and allows clearing it", () => {
    const handleChange = vi.fn();
    const testTimestamp = new Date(2026, 10, 25, 23, 59, 59).getTime();

    render(<DatePicker value={testTimestamp} onChange={handleChange} />);

    const clearButton = screen.getByRole("button", { name: /clear date/i });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it("locks document.body scroll when open and restores on close", () => {
    render(<DatePicker value={null} onChange={vi.fn()} />);

    expect(document.body.style.overflow).toBe("");

    fireEvent.click(screen.getByRole("button", { name: /due date/i }));
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.touchAction).toBe("none");

    const closeBtn = screen.getByRole("button", { name: /^close$/i });
    fireEvent.click(closeBtn);

    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.touchAction).toBe("");
  });

  it("closes modal sheet when drag handle is clicked or swiped down", () => {
    render(<DatePicker value={null} onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /due date/i }));
    const handle = screen.getByLabelText(/drag down to close/i);
    expect(handle).toBeInTheDocument();

    // Click handle to close
    fireEvent.click(handle);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Reopen and test swipe gesture
    fireEvent.click(screen.getByRole("button", { name: /due date/i }));
    const handleReopened = screen.getByLabelText(/drag down to close/i);

    fireEvent.touchStart(handleReopened, {
      touches: [{ clientY: 100 }],
    });
    fireEvent.touchMove(handleReopened, {
      touches: [{ clientY: 200 }], // 100px delta > 60px threshold
    });
    fireEvent.touchEnd(handleReopened);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports custom title and disables quick presets when showQuickPresets is false", () => {
    render(
      <DatePicker
        showQuickPresets={false}
        title="Custom Calendar"
        value={null}
        onChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /due date/i }));

    expect(screen.getByRole("dialog", { name: /custom calendar/i })).toBeInTheDocument();
    expect(screen.getByText("Custom Calendar")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^today$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^tomorrow$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^next week$/i })).not.toBeInTheDocument();
  });
});
