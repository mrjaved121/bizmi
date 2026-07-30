import type { DepartmentColor } from "@/components/features/DepartmentCard";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ProductCardData {
  slug: string;
  name: string;
  category: string;
  categoryHref: string;
  color: DepartmentColor;
  brand?: string;
  pricePkr: number;
  compareAtPricePkr?: number;
  difficulty?: Difficulty;
  ageMin?: number;
  ageMax?: number;
  isBestseller?: boolean;
  isNew?: boolean;
}
