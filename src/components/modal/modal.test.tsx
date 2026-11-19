import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "./index";

describe("Modal", () => {
  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true with title and children", () => {
    render(
      <Modal isOpen={true} title="Test Title" onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} title="Test Title" onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    const closeBtn = screen.getByRole("button", { name: /^close$/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} title="Test Title" onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when drag handle is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} title="Test Title" onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    const handle = screen.getByLabelText(/drag down to close/i);
    fireEvent.click(handle);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("locks and restores document.body overflow", () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.touchAction).toBe("none");

    rerender(
      <Modal isOpen={false} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.touchAction).toBe("");
  });

  it("when two modals are stacked, closing the top modal does not close the bottom modal", () => {
    const handleCloseBottom = vi.fn();
    const handleCloseTop = vi.fn();

    const { rerender } = render(
      <>
        <Modal isOpen={true} title="Bottom Modal" onClose={handleCloseBottom}>
          <div>Bottom Content</div>
        </Modal>
        <Modal isOpen={true} title="Top Modal" onClose={handleCloseTop}>
          <div>Top Content</div>
        </Modal>
      </>,
    );

    expect(screen.getByText("Bottom Modal")).toBeInTheDocument();
    expect(screen.getByText("Top Modal")).toBeInTheDocument();

    // Escape should only close the top modal
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleCloseTop).toHaveBeenCalledTimes(1);
    expect(handleCloseBottom).not.toHaveBeenCalled();

    // Rerender with top modal closed
    rerender(
      <>
        <Modal isOpen={true} title="Bottom Modal" onClose={handleCloseBottom}>
          <div>Bottom Content</div>
        </Modal>
        <Modal isOpen={false} title="Top Modal" onClose={handleCloseTop}>
          <div>Top Content</div>
        </Modal>
      </>,
    );

    // Bottom modal is still open and body scroll remains locked!
    expect(screen.getByText("Bottom Modal")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });
});
