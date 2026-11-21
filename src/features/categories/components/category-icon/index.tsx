"use client";

import { createElement } from "react";

import { getCategoryIcon } from "../../constants";

interface CategoryIconProps {
  className?: string;
  iconId: string;
  size?: number;
  stroke?: number;
}

export function CategoryIcon({ className, iconId, size = 20, stroke = 2 }: CategoryIconProps) {
  const IconComponent = getCategoryIcon(iconId);
  return createElement(IconComponent, { className, size, stroke });
}
