"use client";

import { useState } from "react";

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

  const categories = useLiveQuery(() => db.categories.orderBy("order").toArray(), []) ?? [];
  const selectedCategory = categories.find((c) => c.id === value);
  const colorDetails = selectedCategory ? getCategoryColor(selectedCategory.color) : null;

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
      <div className="flex items-center gap-1.5">
        <button
          aria-label={t.tasks.selectCategory}
          disabled={disabled}
          type="button"
          className={cn(
            "flex h-9 min-w-0 flex-1 items-center justify-between rounded-xl border px-3 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
            selectedCategory
              ? "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-neutral-800",
            disabled && "cursor-not-allowed opacity-50",
          )}
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedCategory && colorDetails ? (
              <>
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md shadow-2xs",
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
                <span className="text-neutral-400 dark:text-neutral-500">
                  {t.tasks.selectCategory}
                </span>
              </>
            )}
          </div>

          <IconChevronDown className="h-3.5 w-3.5 shrink-0 text-neutral-400" stroke={2} />
        </button>

        {selectedCategory && !disabled && (
          <button
            aria-label={t.tasks.noCategory}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 active:scale-95 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            type="button"
            onClick={() => onChange(null)}
          >
            <IconX size={15} stroke={2} />
          </button>
        )}
      </div>

      {/* Category Selection Modal */}
      <Modal
        description={t.categories.subtitle}
        isOpen={isOpen}
        maxWidth="md"
        title={t.tasks.selectCategory}
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto p-0.5 sm:grid-cols-2">
            {/* Clear option */}
            <button
              type="button"
              className={cn(
                "flex items-center gap-2.5 rounded-xl border p-2.5 text-start transition-all active:scale-[0.98]",
                !value
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-neutral-200/80 bg-neutral-50/60 hover:bg-neutral-100 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-400 dark:hover:bg-neutral-800/60",
              )}
              onClick={() => handleSelect(null)}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-200/70 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                <IconX size={15} stroke={2} />
              </div>
              <span className="text-xs truncate">{t.tasks.noCategory}</span>
            </button>

            {categories.map((cat) => {
              const isSelected = cat.id === value;
              const catColor = getCategoryColor(cat.color);
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border p-2.5 text-start transition-all active:scale-[0.98]",
                    isSelected
                      ? "border-primary bg-primary/10 font-semibold ring-1 ring-primary/30"
                      : "border-neutral-200/80 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/80 dark:hover:border-neutral-700",
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

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <a
              className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-600 transition-colors hover:border-primary hover:text-primary dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-primary dark:hover:text-primary"
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
