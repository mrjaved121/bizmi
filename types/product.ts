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

export interface ProductDetailData extends ProductCardData {
  sku?: string;
  shortDescription?: string;
  longDescription?: string;
  coverImage?: string;
  gallery: string[];
  specs: Record<string, string>;
  components: { name: string; qty: number; note?: string }[];
  inventoryCount: number;
}
