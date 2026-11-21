import type { Icon } from "@tabler/icons-react";
import {
  IconApple,
  IconBan,
  IconBarbell,
  IconBath,
  IconBed,
  IconBike,
  IconBook,
  IconBottle,
  IconBrain,
  IconBriefcase,
  IconBrush,
  IconBulb,
  IconCamera,
  IconCar,
  IconCategory,
  IconChecklist,
  IconClock,
  IconCode,
  IconCoffee,
  IconCoin,
  IconCross,
  IconCup,
  IconCurrencyDollar,
  IconDeviceGamepad2,
  IconDog,
  IconFlame,
  IconHeadphones,
  IconHeart,
  IconHome,
  IconHourglass,
  IconLeaf,
  IconMessage,
  IconMicrophone,
  IconMoon,
  IconMountain,
  IconMovie,
  IconMusic,
  IconPalette,
  IconPaw,
  IconPencil,
  IconPill,
  IconPlane,
  IconPlant,
  IconPresentation,
  IconRocket,
  IconRun,
  IconScale,
  IconSchool,
  IconShirt,
  IconShoppingBag,
  IconSparkles,
  IconStar,
  IconStethoscope,
  IconSun,
  IconSwimming,
  IconTarget,
  IconTicket,
  IconToolsKitchen2,
  IconTrophy,
  IconUsers,
  IconWalk,
  IconWallet,
  IconYoga,
} from "@tabler/icons-react";

export interface CategoryIconOption {
  icon: Icon;
  id: string;
  name: string;
}

export const CATEGORY_ICONS: readonly CategoryIconOption[] = [
  // HabitNow Core 14 Icons
  { icon: IconBan, id: "ban", name: "Quit Habit" },
  { icon: IconBrush, id: "brush", name: "Art" },
  { icon: IconYoga, id: "yoga", name: "Meditation" },
  { icon: IconSchool, id: "school", name: "School" },
  { icon: IconBike, id: "bike", name: "Cycling" },
  { icon: IconTicket, id: "ticket", name: "Entertainment" },
  { icon: IconMessage, id: "message", name: "Social" },
  { icon: IconCurrencyDollar, id: "currency-dollar", name: "Finance" },
  { icon: IconCross, id: "cross", name: "Health" },
  { icon: IconBriefcase, id: "briefcase", name: "Work" },
  { icon: IconToolsKitchen2, id: "utensils", name: "Nutrition" },
  { icon: IconHome, id: "home", name: "Home" },
  { icon: IconMountain, id: "mountain", name: "Outdoor" },
  { icon: IconCategory, id: "category", name: "Other" },

  // Health, Wellness & Medical
  { icon: IconHeart, id: "heart", name: "Heart" },
  { icon: IconPill, id: "pill", name: "Medicine" },
  { icon: IconStethoscope, id: "stethoscope", name: "Doctor" },
  { icon: IconApple, id: "apple", name: "Nutrition" },
  { icon: IconBottle, id: "bottle", name: "Water" },
  { icon: IconBath, id: "bath", name: "Hygiene" },

  // Fitness & Active Lifestyle
  { icon: IconBarbell, id: "barbell", name: "Fitness" },
  { icon: IconRun, id: "run", name: "Running" },
  { icon: IconWalk, id: "walk", name: "Walking" },
  { icon: IconSwimming, id: "swimming", name: "Swimming" },
  { icon: IconFlame, id: "flame", name: "Energy" },

  // Mind, Study & Creativity
  { icon: IconBook, id: "book", name: "Reading" },
  { icon: IconBrain, id: "brain", name: "Mind" },
  { icon: IconPencil, id: "pencil", name: "Writing" },
  { icon: IconBulb, id: "bulb", name: "Idea" },
  { icon: IconPalette, id: "palette", name: "Painting" },
  { icon: IconMusic, id: "music", name: "Music" },
  { icon: IconCamera, id: "camera", name: "Photography" },
  { icon: IconMicrophone, id: "microphone", name: "Podcast" },

  // Work, Productive & Code
  { icon: IconTarget, id: "target", name: "Target" },
  { icon: IconCode, id: "code", name: "Development" },
  { icon: IconChecklist, id: "checklist", name: "Tasks" },
  { icon: IconRocket, id: "rocket", name: "Launch" },
  { icon: IconTrophy, id: "trophy", name: "Success" },
  { icon: IconPresentation, id: "presentation", name: "Presentation" },
  { icon: IconUsers, id: "users", name: "Team" },
  { icon: IconScale, id: "scale", name: "Balance" },

  // Daily Habits, Home & Leisure
  { icon: IconCoffee, id: "coffee", name: "Coffee" },
  { icon: IconCup, id: "cup", name: "Tea" },
  { icon: IconBed, id: "bed", name: "Sleep" },
  { icon: IconSun, id: "sun", name: "Morning" },
  { icon: IconMoon, id: "moon", name: "Night" },
  { icon: IconClock, id: "clock", name: "Routine" },
  { icon: IconHourglass, id: "hourglass", name: "Timer" },
  { icon: IconShirt, id: "shirt", name: "Laundry" },
  { icon: IconShoppingBag, id: "shopping-bag", name: "Shopping" },

  // Nature, Pets & Outdoors
  { icon: IconPlant, id: "plant", name: "Plants" },
  { icon: IconLeaf, id: "leaf", name: "Nature" },
  { icon: IconDog, id: "dog", name: "Dog" },
  { icon: IconPaw, id: "paw", name: "Pets" },

  // Travel & Transport
  { icon: IconCar, id: "car", name: "Drive" },
  { icon: IconPlane, id: "plane", name: "Travel" },

  // Entertainment, Fun & Finance
  { icon: IconDeviceGamepad2, id: "gamepad", name: "Gaming" },
  { icon: IconHeadphones, id: "headphones", name: "Audio" },
  { icon: IconMovie, id: "movie", name: "Cinema" },
  { icon: IconWallet, id: "wallet", name: "Wallet" },
  { icon: IconCoin, id: "coin", name: "Savings" },
  { icon: IconStar, id: "star", name: "Goals" },
  { icon: IconSparkles, id: "sparkles", name: "Special" },
];

export function getCategoryIcon(iconId: string): Icon {
  const match = CATEGORY_ICONS.find((i) => i.id === iconId);
  return match ? match.icon : IconTarget;
}
