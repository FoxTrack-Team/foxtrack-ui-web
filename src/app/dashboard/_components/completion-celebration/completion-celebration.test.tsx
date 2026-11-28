import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SettingsProvider } from "@/providers/settings-provider";

import { CompletionCelebration } from "./index";

describe("CompletionCelebration", () => {
  it("does not render on initial mount and celebrates when completed increases on the same day", () => {
    const { rerender } = render(
      <SettingsProvider>
        <CompletionCelebration completed={0} dateKey="2026-11-28" total={2} />
      </SettingsProvider>,
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    rerender(
      <SettingsProvider>
        <CompletionCelebration completed={1} dateKey="2026-11-28" total={2} />
      </SettingsProvider>,
    );

    expect(screen.getByRole("status")).toHaveTextContent(/Nice job! Keep going/i);
    expect(screen.getByRole("status")).toHaveTextContent("1/2");

    rerender(
      <SettingsProvider>
        <CompletionCelebration completed={2} dateKey="2026-11-28" total={2} />
      </SettingsProvider>,
    );

    expect(screen.getByRole("status")).toHaveTextContent(/Everything done for today!/i);
    expect(screen.getByRole("status")).toHaveTextContent("2/2");
  });

  it("does not trigger celebration when switching to another day", () => {
    const { rerender } = render(
      <SettingsProvider>
        <CompletionCelebration completed={0} dateKey="2026-11-28" total={2} />
      </SettingsProvider>,
    );

    rerender(
      <SettingsProvider>
        <CompletionCelebration completed={2} dateKey="2026-11-29" total={2} />
      </SettingsProvider>,
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
