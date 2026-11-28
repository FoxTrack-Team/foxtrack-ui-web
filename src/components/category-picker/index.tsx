"use client";

import { useEffect, useRef, useState } from "react";

import { IconCategory, IconChevronDown, IconPlus, IconX } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";

import { CategoryIcon } from "@/features/categories/components/category-icon";
import { getCategoryColor } from "@/features/categories/constants";
import { Category } from "@/features/categories/types";

import { cn } from "@/lib/utils";

import { db } from "@/db/database";

interface CategoryPickerProps {
  disabled?: boolean;
  onChange: (categoryId: string | null) => void;
  value: string | null;
}

export function CategoryPicker({ disabled = false, onChange, value }: CategoryPickerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const selectedTileRef = useRef<HTMLButtonElement>(null);

  const categories = useLiveQuery(() => db.categories.orderBy("order").toArray(), []) ?? [];
  const selectedCategory = categories.find((c) => c.id === value);
  const colorDetails = selectedCategory ? getCategoryColor(selectedCategory.color) : null;

  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => {
      selectedTileRef.current?.scrollIntoView?.({ block: "nearest" });
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  function handleSelect(category: Category | null) {
    onChange(category ? category.id : null);
    setIsOpen(false);
  }

  return (
    <div>
      <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
        {t.tasks.categoryLabel}
      </label>

      {/* Trigger Button */}
      <div className="relative">
        <button
          aria-label={t.tasks.selectCategory}
          disabled={disabled}
          type="button"
          className={cn(
            "flex h-11 w-full min-w-0 items-center justify-between rounded-xl px-3.5 text-sm shadow-2xs ring-1 ring-black/[0.04] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 sm:h-10 sm:text-xs dark:ring-white/[0.06]",
            selectedCategory && !disabled && "pe-11",
            selectedCategory
              ? "bg-white dark:bg-neutral-900/80"
              : "bg-white text-neutral-500 hover:bg-neutral-50 dark:bg-neutral-900/80 dark:text-neutral-400 dark:hover:bg-neutral-800/80",
            disabled && "cursor-not-allowed opacity-50",
          )}
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedCategory && colorDetails ? (
              <>
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md shadow-2xs sm:h-5 sm:w-5",
                    colorDetails.iconBgClass,
                  )}
                >
                  <CategoryIcon iconId={selectedCategory.icon} size={13} stroke={2.2} />
                </div>
                <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedCategory.name}
                </span>
              </>
            ) : (
              <>
                <IconCategory className="h-4 w-4 shrink-0 text-neutral-400" stroke={1.75} />
                <span className="text-neutral-500 dark:text-neutral-400">
                  {t.tasks.selectCategory}
                </span>
              </>
            )}
          </div>

          {!selectedCategory && (
            <IconChevronDown className="h-4 w-4 shrink-0 text-neutral-400" stroke={2} />
          )}
        </button>

        {selectedCategory && !disabled && (
          <button
            aria-label={t.tasks.noCategory}
            className="absolute end-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-500 transition-colors after:absolute after:-inset-2.5 after:content-[''] hover:bg-neutral-300/80 hover:text-neutral-700 active:scale-95 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
            type="button"
            onClick={() => onChange(null)}
          >
            <IconX size={13} stroke={2.4} />
          </button>
        )}
      </div>

      {/* Category Selection Modal */}
      <Modal
        isOpen={isOpen}
        maxWidth="md"
        title={t.tasks.selectCategory}
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-2 p-0.5 sm:grid-cols-2">
            {/* Clear option */}
            <button
              type="button"
              className={cn(
                "flex min-h-12 items-center gap-2.5 rounded-xl p-2.5 text-start transition-all active:scale-[0.98]",
                !value
                  ? "bg-primary/10 font-medium text-primary ring-1 ring-primary/35"
                  : "bg-neutral-50/90 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800/60 dark:text-neutral-400 dark:hover:bg-neutral-800",
              )}
              onClick={() => handleSelect(null)}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-200/70 text-neutral-500 dark:bg-neutral-700/70 dark:text-neutral-400">
                <IconX size={15} stroke={2} />
              </div>
              <span className="truncate text-xs">{t.tasks.noCategory}</span>
            </button>

            {categories.map((cat) => {
              const isSelected = cat.id === value;
              const catColor = getCategoryColor(cat.color);
              return (
                <button
                  key={cat.id}
                  ref={isSelected ? selectedTileRef : null}
                  type="button"
                  className={cn(
                    "flex min-h-12 items-center gap-2.5 rounded-xl p-2.5 text-start transition-all active:scale-[0.98]",
                    isSelected
                      ? "bg-primary/10 font-semibold ring-1 ring-primary/35"
                      : "bg-neutral-50/90 hover:bg-neutral-100 dark:bg-neutral-800/60 dark:hover:bg-neutral-800",
                  )}
                  onClick={() => handleSelect(cat)}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-2xs",
                      catColor.iconBgClass,
                    )}
                  >
                    <CategoryIcon iconId={cat.icon} size={16} stroke={2} />
                  </div>
                  <span className="text-xs truncate text-neutral-800 dark:text-neutral-100">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              className="flex min-h-11 items-center justify-center rounded-xl bg-neutral-100 px-3 py-2.5 font-medium text-neutral-700 text-xs transition-colors hover:bg-neutral-200/70 active:scale-[0.98] dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              {t.common.close}
            </button>
            <a
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-orange-500/12 px-3 py-2.5 font-medium text-orange-600 text-xs transition-colors hover:bg-orange-500/18 active:scale-[0.98] dark:bg-orange-500/15 dark:text-orange-400 dark:hover:bg-orange-500/22"
              href="/more/categories/new"
            >
              <IconPlus size={15} stroke={2} />
              <span>{t.categories.newCategory}</span>
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
