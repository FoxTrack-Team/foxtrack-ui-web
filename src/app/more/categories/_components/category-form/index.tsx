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
  const [selectedIcon, setSelectedIcon] = useState<string>(initialValues?.icon ?? "target");
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
        <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">
          {t.categories.subtitle}
        </p>
      </div>

      {/* Category Name Input */}
      <div>
        <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
          {t.categories.nameLabel}
        </label>
        <input
          autoFocus
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-neutral-900 text-xs focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-primary"
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
        <div className="flex flex-wrap gap-2">
          {CATEGORY_COLORS.map((color) => {
            const isSelected = selectedColor === color.id;
            return (
              <button
                aria-label={color.name}
                key={color.id}
                type="button"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95",
                  color.bgClass,
                  isSelected
                    ? "ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-neutral-900 scale-105"
                    : "opacity-80 hover:opacity-100",
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
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-2.5 max-h-56 overflow-y-auto dark:border-neutral-800/80 dark:bg-neutral-900/30">
          {CATEGORY_ICONS.map((opt) => {
            const isSelected = selectedIcon === opt.id;
            return (
              <button
                aria-label={opt.name}
                key={opt.id}
                type="button"
                className={cn(
                  "flex h-10 w-full items-center justify-center rounded-xl transition-all active:scale-95",
                  isSelected
                    ? cn("shadow-2xs scale-105", colorDetails.iconBgClass)
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
      <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-3 sm:order-1">
          {isEdit && onDelete && (
            <Button
              className="w-full sm:w-auto gap-1 h-10 sm:h-9 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-full"
              disabled={isSubmitting}
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <IconTrash size={14} stroke={2} />
              <span>{t.categories.deleteCategory}</span>
            </Button>
          )}
        </div>

        <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-center gap-2">
          <Button
            className="w-full sm:w-auto order-2 sm:order-1 h-10 sm:h-9 text-xs rounded-full"
            disabled={isSubmitting}
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t.categories.cancel}
          </Button>
          <Button
            className="w-full sm:w-auto order-1 sm:order-2 h-10 sm:h-9 text-xs sm:min-w-[100px] rounded-full"
            disabled={!name.trim() || isSubmitting}
            type="submit"
          >
            {isEdit ? t.categories.saveCategory : t.categories.createCategory}
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
          <div className="flex justify-end gap-2 pt-2">
            <Button
              className="h-8 text-xs rounded-full"
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t.categories.cancel}
            </Button>
            <Button
              className="h-8 text-xs rounded-full"
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
