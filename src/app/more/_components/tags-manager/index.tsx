"use client";

import { type FormEvent, useState } from "react";

import { IconCheck, IconPencil, IconPlus, IconTag, IconTrash } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

import { tagRepository } from "@/features/tags/services/dexie-tag-repository";
import { Tag, TAG_COLORS, TagColorOption } from "@/features/tags/types";

import { cn } from "@/lib/utils";

import { db } from "@/db/database";

export function TagsManager() {
  const { t } = useTranslation();
  const tags = useLiveQuery(() => db.tags.orderBy("createdAt").reverse().toArray(), []) ?? [];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("orange");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

  function openCreateModal() {
    setEditingTag(null);
    setName("");
    setSelectedColor("orange");
    setIsFormOpen(true);
  }

  function openEditModal(tag: Tag) {
    setEditingTag(tag);
    setName(tag.name);
    setSelectedColor(tag.color);
    setIsFormOpen(true);
  }

  function closeFormModal() {
    setIsFormOpen(false);
    setEditingTag(null);
    setName("");
  }

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (editingTag) {
        await tagRepository.update(editingTag.id, {
          color: selectedColor,
          name: trimmed,
        });
      } else {
        await tagRepository.create({
          color: selectedColor,
          name: trimmed,
        });
      }
      closeFormModal();
    } catch (err) {
      console.error("Failed to save tag", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingTag) return;
    try {
      await tagRepository.delete(deletingTag.id);
      setDeletingTag(null);
    } catch (err) {
      console.error("Failed to delete tag", err);
    }
  }

  function getColorDetails(colorId: string): TagColorOption {
    return TAG_COLORS.find((c) => c.id === colorId) || TAG_COLORS[0];
  }

  const selectedColorDetails = getColorDetails(selectedColor);

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-base text-neutral-900 tracking-tight dark:text-neutral-100">
            {t.more.tagsTitle}
          </h2>
          <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            {t.more.tagsSubtitle}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="shrink-0 whitespace-nowrap rounded-md bg-neutral-100/90 px-2 py-0.5 font-medium text-[10px] text-neutral-500 dark:bg-neutral-800/90 dark:text-neutral-400">
            {tags.length} {t.tags.tagCount}
          </span>
        </div>
      </div>

      {/* Tag Items / Empty State */}
      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200/70 border-dashed bg-white/60 px-4 py-8 text-center dark:border-neutral-800/80 dark:bg-neutral-900/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <IconTag className="h-5 w-5 text-neutral-400 dark:text-neutral-500" stroke={1.75} />
          </div>
          <p className="mt-2.5 font-semibold text-neutral-800 text-xs dark:text-neutral-200">
            {t.tags.emptyTitle}
          </p>
          <p className="mt-0.5 max-w-xs text-[11px] text-neutral-400 dark:text-neutral-500">
            {t.tags.emptyDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {tags.map((tag) => {
            const colorDetails = getColorDetails(tag.color);
            return (
              <div
                className="group flex items-center justify-between rounded-xl border border-neutral-200/70 bg-white px-3.5 py-2.5 shadow-2xs transition-all hover:border-neutral-300 dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
                key={tag.id}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-medium text-xs tracking-tight shadow-2xs",
                      colorDetails.badgeClass,
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", colorDetails.bgClass)} />
                    <span className="truncate">{tag.name}</span>
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1 ps-2">
                  <button
                    aria-label={`${t.common.edit} ${tag.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 active:scale-95 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                    type="button"
                    onClick={() => openEditModal(tag)}
                  >
                    <IconPencil size={13} stroke={2} />
                  </button>
                  <button
                    aria-label={`${t.common.delete} ${tag.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:text-neutral-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                    type="button"
                    onClick={() => setDeletingTag(tag)}
                  >
                    <IconTrash size={13} stroke={2} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-22 z-30 mx-auto max-w-xl px-5 sm:bottom-24 sm:px-6">
        <div className="flex justify-end">
          <button
            aria-label={t.tags.newTag}
            type="button"
            className={cn(
              "pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full",
              "bg-primary text-primary-foreground shadow-[0_6px_20px_rgba(249,115,22,0.4)]",
              "transition-all duration-200 hover:scale-105 hover:bg-primary/90 active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950",
              (isFormOpen || deletingTag !== null) && "pointer-events-none scale-75 opacity-0",
            )}
            onClick={openCreateModal}
          >
            <IconPlus size={26} stroke={2.5} />
          </button>
        </div>
      </div>

      {/* Create / Edit Tag Modal */}
      <Modal
        isOpen={isFormOpen}
        maxWidth="sm"
        title={editingTag ? t.tags.editTag : t.tags.newTag}
        onClose={closeFormModal}
      >
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          {/* Live Tag Preview */}
          <div className="flex justify-center py-1">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-semibold text-xs shadow-2xs transition-all",
                selectedColorDetails.badgeClass,
              )}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full", selectedColorDetails.bgClass)} />
              <span>{name.trim() || t.tags.namePlaceholder}</span>
            </span>
          </div>

          {/* Name Input */}
          <div>
            <label className="mb-1 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
              {t.tags.nameLabel}
            </label>
            <input
              autoFocus
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 text-xs focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-orange-500"
              placeholder={t.tags.namePlaceholder}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="mb-1.5 block font-medium text-neutral-700 text-xs dark:text-neutral-300">
              {t.tags.colorLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((color) => {
                const isSelected = selectedColor === color.id;
                const buttonClass = cn(
                  "flex h-7 w-7 items-center justify-center rounded-full transition-transform active:scale-95",
                  color.bgClass,
                  isSelected
                    ? "ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-neutral-900"
                    : "opacity-80 hover:opacity-100",
                );
                return (
                  <button
                    aria-label={color.name}
                    className={buttonClass}
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                  >
                    {isSelected && <IconCheck className="text-white" size={13} stroke={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              className="h-8 text-xs"
              type="button"
              variant="outline"
              onClick={closeFormModal}
            >
              {t.tags.cancel}
            </Button>
            <Button className="h-8 text-xs" disabled={!name.trim() || isSubmitting} type="submit">
              {editingTag ? t.tags.saveTag : t.tags.createTag}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        description={t.tags.deleteConfirmDesc}
        isOpen={deletingTag !== null}
        maxWidth="sm"
        title={t.tags.deleteConfirmTitle}
        onClose={() => setDeletingTag(null)}
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button
            className="h-8 text-xs"
            type="button"
            variant="outline"
            onClick={() => setDeletingTag(null)}
          >
            {t.tags.cancel}
          </Button>
          <Button
            className="h-8 text-xs"
            type="button"
            variant="destructive"
            onClick={handleDeleteConfirm}
          >
            {t.tags.deleteConfirmButton}
          </Button>
        </div>
      </Modal>
    </section>
  );
}
