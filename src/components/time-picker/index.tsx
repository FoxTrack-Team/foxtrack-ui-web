"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";

import { IconClock, IconX } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";

import { cn } from "@/lib/utils";

interface TimePickerProps {
  ariaLabel?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  value: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function parseTime(value: string): { hour: number; minute: number } {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return { hour: 9, minute: 0 };
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (Number.isNaN(h) || Number.isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
    return { hour: 9, minute: 0 };
  }
  return { hour: h, minute: m };
}

export function TimePicker({
  ariaLabel,
  disabled = false,
  onChange,
  placeholder,
  title,
  value,
}: TimePickerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const initial = parseTime(value);
  const [draftHour, setDraftHour] = useState(initial.hour);
  const [draftMinute, setDraftMinute] = useState(initial.minute);

  const selectedHourRef = useRef<HTMLButtonElement>(null);
  const selectedMinuteRef = useRef<HTMLButtonElement>(null);

  function handleOpen() {
    if (disabled) return;
    const parsed = parseTime(value);
    setDraftHour(parsed.hour);
    setDraftMinute(parsed.minute);
    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => {
      selectedHourRef.current?.scrollIntoView?.({ block: "center" });
      selectedMinuteRef.current?.scrollIntoView?.({ block: "center" });
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  function handleConfirm() {
    onChange(`${pad2(draftHour)}:${pad2(draftMinute)}`);
    setIsOpen(false);
  }

  function handleClear(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onChange("");
  }

  const triggerLabel = ariaLabel ?? title ?? t.timePicker.selectTime;

  return (
    <>
      <div className="relative flex w-full items-center">
        <button
          aria-label={triggerLabel}
          disabled={disabled}
          type="button"
          className={cn(
            "inline-flex min-h-11 w-full min-w-0 items-center justify-start gap-2 rounded-xl px-3.5 text-sm tabular-nums shadow-2xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 sm:min-h-10 sm:text-xs",
            value
              ? "bg-orange-500/12 font-medium text-orange-600 ring-1 ring-orange-500/20 hover:bg-orange-500/15 dark:bg-orange-500/15 dark:text-orange-400 dark:ring-orange-500/25"
              : "bg-white font-normal text-neutral-500 ring-1 ring-black/[0.04] hover:bg-neutral-50 dark:bg-neutral-900/80 dark:text-neutral-400 dark:ring-white/[0.06] dark:hover:bg-neutral-800/80",
            value && !disabled && "pe-10",
            disabled && "cursor-not-allowed opacity-50",
          )}
          onClick={handleOpen}
        >
          <IconClock
            className={cn("shrink-0", value ? "" : "text-neutral-400")}
            size={15}
            stroke={value ? 2 : 1.75}
          />
          <span className="truncate" dir="ltr">
            {value || placeholder || t.timePicker.selectTime}
          </span>
        </button>

        {value && !disabled && (
          <button
            aria-label={t.timePicker.clearTime}
            className="absolute end-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-orange-500/20 text-orange-600 transition-colors after:absolute after:-inset-2.5 after:content-[''] hover:bg-orange-500/30 active:scale-95 dark:bg-orange-500/25 dark:text-orange-300 dark:hover:bg-orange-500/35"
            type="button"
            onClick={handleClear}
          >
            <IconX size={13} stroke={2.4} />
          </button>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        maxWidth="sm"
        title={title ?? ariaLabel ?? t.timePicker.selectTime}
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-3 pt-1">
          {/* Selected Time Readout */}
          <div
            className="flex items-center justify-center rounded-2xl bg-neutral-100/80 py-2.5 font-semibold text-2xl text-neutral-900 tracking-tight tabular-nums dark:bg-neutral-800/70 dark:text-neutral-100"
            dir="ltr"
          >
            {pad2(draftHour)}:{pad2(draftMinute)}
          </div>

          {/* Dual-Column Scrollable Wheel */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2" dir="ltr">
            <div className="flex flex-col items-center">
              <span className="mb-1 font-medium text-[11px] text-neutral-500 dark:text-neutral-400">
                {t.timePicker.hour}
              </span>
              <div
                aria-label={t.timePicker.hour}
                className="no-scrollbar h-48 w-full snap-y snap-mandatory space-y-1 overflow-y-auto rounded-2xl bg-neutral-50/90 p-1.5 dark:bg-neutral-800/50"
              >
                {HOURS.map((h) => {
                  const isSelected = h === draftHour;
                  return (
                    <button
                      aria-pressed={isSelected}
                      key={h}
                      ref={isSelected ? selectedHourRef : null}
                      type="button"
                      className={cn(
                        "flex min-h-10 w-full snap-center items-center justify-center rounded-xl font-medium text-sm tabular-nums transition-colors",
                        isSelected
                          ? "bg-orange-500 font-semibold text-white shadow-2xs"
                          : "text-neutral-700 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-700/60",
                      )}
                      onClick={() => setDraftHour(h)}
                    >
                      {pad2(h)}
                    </button>
                  );
                })}
              </div>
            </div>

            <span className="pt-5 font-bold text-lg text-neutral-400 dark:text-neutral-500">:</span>

            <div className="flex flex-col items-center">
              <span className="mb-1 font-medium text-[11px] text-neutral-500 dark:text-neutral-400">
                {t.timePicker.minute}
              </span>
              <div
                aria-label={t.timePicker.minute}
                className="no-scrollbar h-48 w-full snap-y snap-mandatory space-y-1 overflow-y-auto rounded-2xl bg-neutral-50/90 p-1.5 dark:bg-neutral-800/50"
              >
                {MINUTES.map((m) => {
                  const isSelected = m === draftMinute;
                  return (
                    <button
                      aria-pressed={isSelected}
                      key={m}
                      ref={isSelected ? selectedMinuteRef : null}
                      type="button"
                      className={cn(
                        "flex min-h-10 w-full snap-center items-center justify-center rounded-xl font-medium text-sm tabular-nums transition-colors",
                        isSelected
                          ? "bg-orange-500 font-semibold text-white shadow-2xs"
                          : "text-neutral-700 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-700/60",
                      )}
                      onClick={() => setDraftMinute(m)}
                    >
                      {pad2(m)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              className="flex min-h-11 items-center justify-center rounded-xl bg-neutral-100 px-3 py-2.5 font-medium text-neutral-700 text-xs transition-colors hover:bg-neutral-200/70 active:scale-[0.98] dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              {t.common.close}
            </button>
            <button
              className="flex min-h-11 items-center justify-center rounded-xl bg-orange-500 px-3 py-2.5 font-semibold text-white text-xs shadow-xs transition-colors hover:bg-orange-600 active:scale-[0.98]"
              type="button"
              onClick={handleConfirm}
            >
              {t.common.confirm}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
