export interface DefaultCategoryDefinition {
  color: string;
  icon: string;
  id: string;
  nameEn: string;
  nameFa: string;
}

export const HABITNOW_DEFAULT_CATEGORIES: readonly DefaultCategoryDefinition[] = [
  {
    color: "rose",
    icon: "ban",
    id: "habitnow-quit-bad-habit",
    nameEn: "Quit a bad habit",
    nameFa: "ترک عادت بد",
  },
  {
    color: "rose",
    icon: "brush",
    id: "habitnow-art",
    nameEn: "Art",
    nameFa: "هنر",
  },
  {
    color: "violet",
    icon: "yoga",
    id: "habitnow-meditation",
    nameEn: "Meditation",
    nameFa: "مدیتیشن",
  },
  {
    color: "indigo",
    icon: "school",
    id: "habitnow-study",
    nameEn: "Study",
    nameFa: "یادگیری و مطالعه",
  },
  {
    color: "blue",
    icon: "bike",
    id: "habitnow-sports",
    nameEn: "Sports",
    nameFa: "ورزش",
  },
  {
    color: "teal",
    icon: "ticket",
    id: "habitnow-entertainment",
    nameEn: "Entertainment",
    nameFa: "سرگرمی",
  },
  {
    color: "cyan",
    icon: "message",
    id: "habitnow-social",
    nameEn: "Social",
    nameFa: "روابط اجتماعی",
  },
  {
    color: "emerald",
    icon: "currency-dollar",
    id: "habitnow-finance",
    nameEn: "Finance",
    nameFa: "امور مالی",
  },
  {
    color: "emerald",
    icon: "cross",
    id: "habitnow-health",
    nameEn: "Health",
    nameFa: "سلامتی",
  },
  {
    color: "amber",
    icon: "briefcase",
    id: "habitnow-work",
    nameEn: "Work",
    nameFa: "کار و حرفه",
  },
  {
    color: "orange",
    icon: "utensils",
    id: "habitnow-nutrition",
    nameEn: "Nutrition",
    nameFa: "تغذیه",
  },
  {
    color: "orange",
    icon: "home",
    id: "habitnow-home",
    nameEn: "Home",
    nameFa: "خانه و زندگی",
  },
  {
    color: "amber",
    icon: "mountain",
    id: "habitnow-outdoor",
    nameEn: "Outdoor",
    nameFa: "فضای باز و طبیعت",
  },
  {
    color: "rose",
    icon: "category",
    id: "habitnow-other",
    nameEn: "Other",
    nameFa: "سایر",
  },
];

// Alias for backwards compatibility
export const HABITICA_DEFAULT_CATEGORIES = HABITNOW_DEFAULT_CATEGORIES;
