export interface Category {
  color: string;
  createdAt: string;
  icon: string;
  id: string;
  isDefault?: boolean;
  name: string;
  order: number;
  updatedAt: string;
}

export interface CreateCategoryInput {
  color?: string;
  icon?: string;
  id?: string;
  isDefault?: boolean;
  name: string;
  order?: number;
}

export interface UpdateCategoryInput {
  color?: string;
  icon?: string;
  name?: string;
  order?: number;
}

export interface CategoryColorOption {
  badgeClass: string;
  bgClass: string;
  iconBgClass: string;
  id: string;
  name: string;
  textClass: string;
}
