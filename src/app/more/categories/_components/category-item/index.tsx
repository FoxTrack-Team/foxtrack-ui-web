"use client";

import { useRouter } from "next/navigation";

import { IconPencil, IconTrash } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { CategoryIcon } from "@/features/categories/components/category-icon";
import { getCategoryColor } from "@/features/categories/constants";
import { Category } from "@/features/categories/types";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  category: Category;
  itemCount?: number;
  onDelete?: (category: Category) => void;
  onEdit?: (category: Category) => void;
}

export function CategoryItem({ category, itemCount = 0, onDelete, onEdit }: CategoryItemProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const colorDetails = getCategoryColor(category.color);

  function handleNavigateEdit() {
    if (category.isDefault) return;
    if (onEdit) {
      onEdit(category);
    } else {
      router.push(`/more/categories/edit?id=${category.id}`);
    }
  }

  return (
    <div
      className={cn(
        "group flex h-full flex-col justify-between rounded-2xl p-3 sm:px-3.5 sm:py-3 transition-all",
        "border border-neutral-200/70 bg-white/90 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/60",
        !category.isDefault &&
          "cursor-pointer hover:border-neutral-300 hover:bg-neutral-50/80 active:bg-neutral-100/70 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/60",
      )}
      onClick={handleNavigateEdit}
    >
      {/* Top Row: Name + Count & Icon Tile */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 text-start">
          <span className="line-clamp-2 block font-medium text-neutral-800 text-xs leading-snug sm:text-[13px] dark:text-neutral-100">
            {category.name}
          </span>
          <span className="mt-0.5 block whitespace-nowrap font-normal text-[11px] text-neutral-500 tabular-nums dark:text-neutral-400">
            {itemCount} {itemCount === 1 ? t.categories.itemsCount : t.categories.itemsCountPlural}
          </span>
        </div>

        {/* Category Icon Tile */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-2xs sm:h-10 sm:w-10",
            !category.isDefault && "transition-transform group-hover:scale-105",
            colorDetails.iconBgClass,
          )}
        >
          <CategoryIcon iconId={category.icon} size={18} stroke={2} />
        </div>
      </div>

      {/* Custom Category Actions Strip (full touch area without cramping card title) */}
      {!category.isDefault && (
        <div className="mt-2.5 flex items-center justify-end gap-1.5 border-neutral-100 border-t pt-2 dark:border-neutral-800/60">
          <button
            aria-label={`${t.common.edit} ${category.name}`}
            className="flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-neutral-100/80 px-2 font-medium text-[11px] text-neutral-600 transition-colors hover:bg-neutral-200/80 hover:text-neutral-900 active:scale-95 dark:bg-neutral-800/70 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateEdit();
            }}
          >
            <IconPencil size={13} stroke={2} />
            <span>{t.common.edit}</span>
          </button>
          {onDelete && (
            <button
              aria-label={`${t.common.delete} ${category.name}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:text-neutral-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(category);
              }}
            >
              <IconTrash size={14} stroke={2} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
