"use client";

import { type FormEvent, useState } from "react";

import { IconCheck, IconTrash } from "@tabler/icons-react";

import { useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { CategoryIcon } from "@/features/categories/components/category-icon";
import { CATEGORY_COLORS, CATEGORY_ICONS, getCategoryColor } from "@/features/categories/constants";

import { cn } from "@/lib/utils";

interface CategoryFormProps {
  initialValues?: {
    color?: string;
    icon?: string;
    name?: string;
  };
  isEdit?: boolean;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  onSubmit: (values: { color: string; icon: string; name: string }) => Promise<void>;
  title: string;
}

export function CategoryForm({
  initialValues,
  isEdit = false,
  onCancel,
  onDelete,
  onSubmit,
  title,
}: CategoryFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [selectedColor, setSelectedColor] = useState<string>(initialValues?.color ?? "orange");
  const [selectedIcon, setSelectedIcon] = useState<string>(initialValues?.icon ?? "heart");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!onDelete) return;
    try {
      setIsSubmitting(true);
      await onDelete();
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Title */}
      <div>
        <h1 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
          {title}
        </h1>
        <p className="mt-0.5 text-neutral-500 text-xs dark:text-neutral-400">
          {t.categories.subtitle}
        </p>
      </div>

      {/* Category Name Input */}
      <div>
        <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
          {t.categories.nameLabel}
        </label>
        <input
          autoFocus={!isEdit}
          className="min-h-11 w-full rounded-xl bg-white px-3.5 py-2.5 text-base text-neutral-900 shadow-2xs ring-1 ring-black/[0.04] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 sm:min-h-10 sm:text-sm dark:bg-neutral-900/80 dark:text-neutral-100 dark:ring-white/[0.06] dark:focus:ring-primary/40"
          placeholder={t.categories.namePlaceholder}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Color Palette Selector */}
      <div>
        <label className="mb-2 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
          {t.categories.colorLabel}
        </label>
        <div className="grid grid-cols-8 gap-2 pt-0.5">
          {CATEGORY_COLORS.map((color) => {
            const isSelected = selectedColor === color.id;
            return (
              <button
                aria-label={color.name}
                aria-pressed={isSelected}
                key={color.id}
                type="button"
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 sm:h-9 sm:w-9",
                  color.bgClass,
                  isSelected
                    ? "ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-neutral-950 scale-105"
                    : "opacity-85 hover:opacity-100",
                )}
                onClick={() => setSelectedColor(color.id)}
              >
                {isSelected && <IconCheck className="text-white" size={15} stroke={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Icon Grid Selector */}
      <div>
        <label className="mb-2 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
          {t.categories.iconLabel}
        </label>
        <div className="grid max-h-[204px] grid-cols-6 gap-2 overflow-y-auto rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-2.5 sm:grid-cols-8 dark:border-neutral-800/80 dark:bg-neutral-900/30">
          {CATEGORY_ICONS.map((opt) => {
            const isSelected = selectedIcon === opt.id;
            return (
              <button
                aria-label={opt.name}
                aria-pressed={isSelected}
                key={opt.id}
                type="button"
                className={cn(
                  "flex h-10 w-full items-center justify-center rounded-xl transition-all active:scale-95",
                  isSelected
                    ? cn("ring-1 ring-current/30 shadow-2xs scale-105", colorDetails.iconBgClass)
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200",
                )}
                onClick={() => setSelectedIcon(opt.id)}
              >
                <CategoryIcon iconId={opt.id} size={20} stroke={2} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-2 sm:order-1">
          {isEdit && onDelete && (
            <Button
              className="h-11 w-full gap-1.5 rounded-xl bg-rose-500/[0.08] text-rose-600 text-xs hover:bg-rose-500/[0.14] hover:text-rose-700 sm:h-10 sm:w-auto dark:bg-rose-500/[0.12] dark:text-rose-400 dark:hover:bg-rose-500/[0.2]"
              disabled={isSubmitting}
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <IconTrash size={15} stroke={2} />
              <span>{t.categories.deleteCategory}</span>
            </Button>
          )}
        </div>

        <div className="order-1 flex flex-col gap-2 sm:order-2 sm:flex-row-reverse sm:items-center sm:gap-2.5">
          <Button
            className="h-11 w-full rounded-xl text-sm sm:h-10 sm:w-auto sm:min-w-[120px] sm:text-xs"
            disabled={!name.trim() || isSubmitting}
            type="submit"
          >
            {isEdit ? t.categories.saveCategory : t.categories.createCategory}
          </Button>
          <Button
            className="h-11 w-full rounded-xl bg-neutral-200/70 text-neutral-700 text-sm hover:bg-neutral-200 sm:h-10 sm:w-auto sm:px-5 sm:text-xs dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            disabled={isSubmitting}
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            {t.categories.cancel}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isEdit && (
        <Modal
          description={t.categories.deleteConfirmDesc}
          isOpen={isDeleteModalOpen}
          maxWidth="sm"
          title={t.categories.deleteConfirmTitle}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              className="h-10 w-full rounded-xl text-xs sm:h-9 sm:w-auto"
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t.categories.cancel}
            </Button>
            <Button
              className="h-10 w-full rounded-xl text-xs sm:h-9 sm:w-auto"
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              {t.categories.deleteConfirmButton}
            </Button>
          </div>
        </Modal>
      )}
    </form>
  );
}
