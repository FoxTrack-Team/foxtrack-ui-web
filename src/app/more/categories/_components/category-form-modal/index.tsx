"use client";

import { type FormEvent, useState } from "react";

import { useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { CategoryIcon } from "@/features/categories/components/category-icon";
import { CATEGORY_COLORS, CATEGORY_ICONS, getCategoryColor } from "@/features/categories/constants";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/features/categories/types";

import { cn } from "@/lib/utils";

interface CategoryFormModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateCategoryInput | UpdateCategoryInput) => Promise<void>;
}

export function CategoryFormModal({ category, isOpen, onClose, onSubmit }: CategoryFormModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(category?.name ?? "");
  const [selectedColor, setSelectedColor] = useState<string>(category?.color ?? "orange");
  const [selectedIcon, setSelectedIcon] = useState<string>(category?.icon ?? "target");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorDetails = getCategoryColor(selectedColor);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        color: selectedColor,
        icon: selectedIcon,
        name: trimmed,
      });
      onClose();
    } catch (err) {
      console.error("Failed to save category", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      maxWidth="md"
      title={category ? t.categories.editCategory : t.categories.newCategory}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* HabitNow Live Preview */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-50/90 py-3.5 dark:bg-neutral-800/50">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs transition-all",
              colorDetails.iconBgClass,
            )}
          >
            <CategoryIcon iconId={selectedIcon} size={24} stroke={2} />
          </div>
          <span className="mt-2 font-semibold text-neutral-900 text-xs tracking-tight dark:text-neutral-100">
            {name.trim() || t.categories.namePlaceholder}
          </span>
        </div>

        {/* Name Input */}
        <div>
          <label className="mb-1 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {t.categories.nameLabel}
          </label>
          <input
            autoFocus
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 text-xs focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-orange-500 dark:focus:bg-neutral-900"
            placeholder={t.categories.namePlaceholder}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Color Palette (HabitNow Swatches) */}
        <div>
          <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {t.categories.colorLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((col) => {
              const isSelected = selectedColor === col.id;
              const buttonClass = cn(
                "flex h-7 w-7 items-center justify-center rounded-full transition-transform active:scale-95",
                col.bgClass,
                isSelected
                  ? "ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-neutral-900"
                  : "opacity-80 hover:opacity-100",
              );
              return (
                <button
                  aria-label={col.name}
                  className={buttonClass}
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedColor(col.id)}
                />
              );
            })}
          </div>
        </div>

        {/* Icon Grid (HabitNow Style Icon Selector) */}
        <div>
          <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
            {t.categories.iconLabel}
          </label>
          <div className="grid max-h-36 grid-cols-7 gap-1.5 overflow-y-auto rounded-xl border border-neutral-200/60 bg-neutral-50/40 p-2 sm:grid-cols-9 dark:border-neutral-800/60 dark:bg-neutral-900/30">
            {CATEGORY_ICONS.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = selectedIcon === item.id;
              const buttonClass = cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                isSelected
                  ? "bg-orange-500 text-white shadow-xs"
                  : "text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800",
              );
              return (
                <button
                  aria-label={item.name}
                  className={buttonClass}
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIcon(item.id)}
                >
                  <ItemIcon size={16} stroke={1.8} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            className="h-9 rounded-xl text-xs"
            type="button"
            variant="outline"
            onClick={onClose}
          >
            {t.categories.cancel}
          </Button>
          <Button
            className="h-9 rounded-xl text-xs"
            disabled={!name.trim() || isSubmitting}
            type="submit"
          >
            {category ? t.categories.saveCategory : t.categories.createCategory}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
