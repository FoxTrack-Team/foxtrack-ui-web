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
        "group flex items-center justify-between rounded-2xl p-3 sm:px-3.5 sm:py-3 transition-all",
        "border border-neutral-200/70 bg-white/90 shadow-2xs hover:border-neutral-300 hover:bg-neutral-50/80",
        "dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/60",
        !category.isDefault && "cursor-pointer",
      )}
      onClick={handleNavigateEdit}
    >
      {/* Category Name & Items Count */}
      <div className="min-w-0 pe-2 text-start">
        <span className="block font-medium text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-100 line-clamp-1 leading-snug">
          {category.name}
        </span>
        <span className="mt-0.5 block font-normal text-[10px] text-neutral-400 whitespace-nowrap dark:text-neutral-500">
          {itemCount} {t.categories.itemsCount}
        </span>
      </div>

      {/* Category Actions (for custom) + Icon Tile */}
      <div className="flex shrink-0 items-center gap-1.5">
        {!category.isDefault && (
          <div className="flex items-center gap-0.5">
            <button
              aria-label={`${t.common.edit} ${category.name}`}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 active:scale-95 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateEdit();
              }}
            >
              <IconPencil size={13} stroke={2} />
            </button>
            {onDelete && (
              <button
                aria-label={`${t.common.delete} ${category.name}`}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:text-neutral-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(category);
                }}
              >
                <IconTrash size={13} stroke={2} />
              </button>
            )}
          </div>
        )}

        {/* HabitNow Category Icon Tile */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-2xs transition-transform group-hover:scale-105",
            colorDetails.iconBgClass,
          )}
        >
          <CategoryIcon iconId={category.icon} size={20} stroke={2} />
        </div>
      </div>
    </div>
  );
}
