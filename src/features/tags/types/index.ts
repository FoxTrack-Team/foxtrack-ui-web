export interface Tag {
  color: string;
  createdAt: number;
  id: string;
  name: string;
  updatedAt: number;
}

export type CreateTagDTO = Omit<Tag, "createdAt" | "id" | "updatedAt">;
export type UpdateTagDTO = Partial<CreateTagDTO>;

export interface TagColorOption {
  badgeClass: string;
  bgClass: string;
  hex: string;
  id: string;
  name: string;
  textClass: string;
}

export const TAG_COLORS: readonly TagColorOption[] = [
  {
    badgeClass:
      "bg-orange-500/10 text-orange-700 border-orange-500/25 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30",
    bgClass: "bg-orange-500",
    hex: "#f97316",
    id: "orange",
    name: "Orange",
    textClass: "text-orange-600 dark:text-orange-400",
  },
  {
    badgeClass:
      "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    bgClass: "bg-amber-500",
    hex: "#f59e0b",
    id: "amber",
    name: "Amber",
    textClass: "text-amber-600 dark:text-amber-400",
  },
  {
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    bgClass: "bg-emerald-500",
    hex: "#10b981",
    id: "emerald",
    name: "Emerald",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    badgeClass:
      "bg-teal-500/10 text-teal-700 border-teal-500/25 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30",
    bgClass: "bg-teal-500",
    hex: "#14b8a6",
    id: "teal",
    name: "Teal",
    textClass: "text-teal-600 dark:text-teal-400",
  },
  {
    badgeClass:
      "bg-blue-500/10 text-blue-700 border-blue-500/25 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30",
    bgClass: "bg-blue-500",
    hex: "#3b82f6",
    id: "blue",
    name: "Blue",
    textClass: "text-blue-600 dark:text-blue-400",
  },
  {
    badgeClass:
      "bg-indigo-500/10 text-indigo-700 border-indigo-500/25 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30",
    bgClass: "bg-indigo-500",
    hex: "#6366f1",
    id: "indigo",
    name: "Indigo",
    textClass: "text-indigo-600 dark:text-indigo-400",
  },
  {
    badgeClass:
      "bg-purple-500/10 text-purple-700 border-purple-500/25 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30",
    bgClass: "bg-purple-500",
    hex: "#a855f7",
    id: "purple",
    name: "Purple",
    textClass: "text-purple-600 dark:text-purple-400",
  },
  {
    badgeClass:
      "bg-rose-500/10 text-rose-700 border-rose-500/25 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
    bgClass: "bg-rose-500",
    hex: "#f43f5e",
    id: "rose",
    name: "Rose",
    textClass: "text-rose-600 dark:text-rose-400",
  },
  {
    badgeClass:
      "bg-neutral-500/10 text-neutral-700 border-neutral-500/25 dark:bg-neutral-500/15 dark:text-neutral-300 dark:border-neutral-500/30",
    bgClass: "bg-neutral-500",
    hex: "#737373",
    id: "neutral",
    name: "Slate",
    textClass: "text-neutral-600 dark:text-neutral-400",
  },
] as const;

export function getTagColor(colorId?: string): TagColorOption {
  return TAG_COLORS.find((c) => c.id === colorId) || TAG_COLORS[0];
}
