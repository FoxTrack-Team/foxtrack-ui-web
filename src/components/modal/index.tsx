"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

import { IconX } from "@tabler/icons-react";
import { createPortal } from "react-dom";

import { useTranslation } from "@/providers/settings-provider";

import { cn } from "@/lib/utils";

export interface ModalProps {
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  headerClassName?: string;
  isOpen: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  onClose: () => void;
  showCloseButton?: boolean;
  showHandle?: boolean;
  title?: React.ReactNode;
}

const MAX_WIDTH_CLASSES: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
const EXIT_DURATION_MS = isTest ? 0 : 200;

// Global stack for managing multiple stacked modals
const openModalStack: string[] = [];
let scrollLockCount = 0;

function acquireScrollLock() {
  scrollLockCount++;
  if (scrollLockCount === 1) {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }
}

function releaseScrollLock() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }
}

function emptySubscribe() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function Modal({
  ariaLabel,
  children,
  className,
  description,
  headerClassName,
  isOpen,
  maxWidth = "md",
  onClose,
  showCloseButton = true,
  showHandle = true,
  title,
}: ModalProps) {
  const { t } = useTranslation();
  const modalId = useId();
  const isClient = useIsClient();
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [isExiting, setIsExiting] = useState(false);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);

  // Derive animation state during render when isOpen prop transitions
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setIsExiting(false);
      setDragY(0);
    } else if (!isTest) {
      setIsExiting(true);
    }
  }

  // Handle exit animation timer
  useEffect(() => {
    if (!isExiting) return;

    const timer = setTimeout(() => {
      setIsExiting(false);
    }, EXIT_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isExiting]);

  const isRendered = isOpen || isExiting;

  // Manage modal stack & scroll lock
  useEffect(() => {
    if (!isRendered) return;

    acquireScrollLock();
    openModalStack.push(modalId);

    return () => {
      const idx = openModalStack.indexOf(modalId);
      if (idx !== -1) {
        openModalStack.splice(idx, 1);
      }
      releaseScrollLock();
    };
  }, [isRendered, modalId]);

  // Handle ESC key - ONLY top-most modal handles Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        const topModalId = openModalStack[openModalStack.length - 1];
        if (topModalId === modalId) {
          e.stopPropagation();
          onClose();
        }
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, modalId, onClose]);

  // Touch gesture handlers for mobile swipe-to-dismiss
  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    e.stopPropagation();
    setIsDragging(false);
    if (dragY > 60) {
      setDragY(0);
      onClose();
    } else {
      setDragY(0);
    }
  }

  if (!isRendered || !isClient) {
    return null;
  }

  const dialogAriaLabel = ariaLabel || (typeof title === "string" ? title : undefined) || "Dialog";

  // Staggered z-index for stacked modals (50, 60, 70...)
  const currentStackIdx = openModalStack.indexOf(modalId);
  const stackOffset = currentStackIdx >= 0 ? currentStackIdx : openModalStack.length;
  const baseZIndex = 50 + stackOffset * 10;

  const modalNode = (
    <div
      className="fixed inset-0 flex items-end sm:items-center sm:justify-center"
      style={{ zIndex: baseZIndex }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity",
          isExiting ? "animate-backdrop-fade-out" : "animate-backdrop-fade-in",
        )}
        onTouchMove={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Sheet / Modal Container */}
      <div
        aria-label={dialogAriaLabel}
        aria-modal="true"
        role="dialog"
        className={cn(
          "relative flex max-h-[85dvh] w-full flex-col rounded-t-2xl border-t border-neutral-200/80 bg-white p-5 shadow-2xl transition-all",
          "pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:rounded-2xl sm:border sm:border-neutral-200/80 sm:pb-5",
          "dark:border-neutral-800/80 dark:bg-neutral-900",
          MAX_WIDTH_CLASSES[maxWidth],
          !isDragging &&
            (isExiting
              ? "animate-sheet-slide-down sm:animate-dialog-out"
              : "animate-sheet-slide-up sm:animate-dialog-in"),
          className,
        )}
        style={{
          zIndex: baseZIndex + 1,
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging
            ? "none"
            : isExiting
              ? undefined
              : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe-Down Handle */}
        {showHandle && (
          <div
            aria-label={t.common.dragToClose}
            className="-mt-2 mb-2.5 flex h-7 w-full shrink-0 cursor-grab items-center justify-center active:cursor-grabbing sm:hidden"
            role="button"
            tabIndex={0}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClose();
              }
            }}
          >
            <div className="h-1.5 w-12 rounded-full bg-neutral-300 transition-colors hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={cn(
              "flex shrink-0 items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800/70",
              headerClassName,
            )}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
          >
            <div>
              {title && (
                <h2 className="font-semibold text-base text-neutral-900 tracking-tight dark:text-neutral-100 sm:text-base">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                aria-label={t.common.close}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 active:scale-95 active:bg-neutral-200/70 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <IconX size={18} stroke={2} />
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div
          className={cn("min-h-0 flex-1 overflow-y-auto", (title || showCloseButton) && "pt-3.5")}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}
