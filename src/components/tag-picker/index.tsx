"use client";

import { useEffect, useRef, useState } from "react";

import { IconCheck, IconPlus, IconSearch, IconTag, IconX } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import { useTranslation } from "@/providers/settings-provider";

import { getTagColor, Tag } from "@/features/tags/types";

import { cn } from "@/lib/utils";

import { db } from "@/db/database";

export interface SelectedTag {
  color: string;
  id: string;
  isNew?: boolean;
  name: string;
}

interface TagPickerProps {
  onChange: (tags: SelectedTag[]) => void;
  value: SelectedTag[];
}

export function TagPicker({ value, onChange }: TagPickerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dbTags = useLiveQuery(() => db.tags.orderBy("name").toArray(), []) ?? [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      inputRef.current?.focus();
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleToggleTag(tag: Tag) {
    const exists = value.some((item) => item.id === tag.id);
    if (exists) {
      onChange(value.filter((item) => item.id !== tag.id));
    } else {
      onChange([...value, { color: tag.color, id: tag.id, name: tag.name }]);
    }
  }

  function handleRemove(id: string) {
    onChange(value.filter((item) => item.id !== id));
  }

  function handleCreateNewTag() {
    const trimmed = search.trim();
    if (!trimmed) return;

    // Check if matches existing tag in DB (case-insensitive)
    const existing = dbTags.find((tag) => tag.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      if (!value.some((item) => item.id === existing.id)) {
        onChange([...value, { color: existing.color, id: existing.id, name: existing.name }]);
      }
    } else {
      const tempId = "temp-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
      onChange([...value, { color: "orange", id: tempId, isNew: true, name: trimmed }]);
    }
    setSearch("");
    setIsOpen(false);
  }

  const query = search.trim().toLowerCase();
  const filteredTags = dbTags.filter((tag) => tag.name.toLowerCase().includes(query));
  const hasExactMatch = dbTags.some((tag) => tag.name.toLowerCase() === query);
  const showCreateOption = query.length > 0 && !hasExactMatch;

  return (
    <div className="relative" ref={containerRef}>
      {/* Pills & Trigger */}
      <div className="flex flex-wrap items-center gap-1.5">
        {value.map((tag) => {
          const color = getTagColor(tag.color);
          return (
            <span
              key={tag.id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 font-medium text-[11px] shadow-2xs transition-all",
                color.badgeClass,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", color.bgClass)} />
              <span>{tag.name}</span>
              <button
                aria-label={`Remove tag ${tag.name}`}
                className="opacity-70 transition-opacity hover:opacity-100"
                type="button"
                onClick={() => handleRemove(tag.id)}
              >
                <IconX size={11} stroke={2.5} />
              </button>
            </span>
          );
        })}

        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200/80 bg-neutral-50 px-2.5 py-0.5 text-[11px] text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <IconTag size={12} stroke={2} />
          <span>{value.length === 0 ? t.tasks.addTag : t.tasks.tags}</span>
          <IconPlus size={11} stroke={2.5} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute start-0 z-50 mt-1.5 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-neutral-800 dark:bg-neutral-900 dark:ring-white/10">
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200/70 bg-neutral-50 px-2 py-1 dark:border-neutral-800 dark:bg-neutral-800/60">
            <IconSearch className="text-neutral-400" size={13} stroke={2} />
            <input
              className="w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
              placeholder={t.tasks.searchTags}
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (showCreateOption) {
                    handleCreateNewTag();
                  } else if (filteredTags.length > 0) {
                    handleToggleTag(filteredTags[0]);
                  }
                }
              }}
            />
          </div>

          <div className="mt-1.5 max-h-44 space-y-0.5 overflow-y-auto">
            {showCreateOption && (
              <button
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start text-xs text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/40"
                type="button"
                onClick={handleCreateNewTag}
              >
                <IconPlus size={13} stroke={2.5} />
                <span>
                  {t.tasks.createTagPrompt} &ldquo;{search.trim()}&rdquo;
                </span>
              </button>
            )}

            {filteredTags.map((tag) => {
              const isSelected = value.some((item) => item.id === tag.id);
              const color = getTagColor(tag.color);
              return (
                <button
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  key={tag.id}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", color.bgClass)} />
                    <span className="font-medium">{tag.name}</span>
                  </div>
                  {isSelected && (
                    <IconCheck
                      className="text-orange-600 dark:text-orange-400"
                      size={13}
                      stroke={2.5}
                    />
                  )}
                </button>
              );
            })}

            {!showCreateOption && filteredTags.length === 0 && (
              <p className="py-2 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
                {t.tasks.noTags}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
