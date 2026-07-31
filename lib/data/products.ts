import { createClient } from "@/lib/supabase/server";
import type { ProductCardData } from "@/types/product";
import type { DepartmentColor } from "@/components/features/DepartmentCard";

export type ProductSort = "featured" | "newest" | "price_asc" | "price_desc";

export interface ProductQueryOptions {
  categorySlug?: string;
  sort?: ProductSort;
}

interface ProductRow {
  slug: string | null;
  name: string | null;
  brand: string | null;
  price_pkr: number | null;
  compare_at_price_pkr: number | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  age_min: number | null;
  age_max: number | null;
  is_bestseller: boolean;
  is_new: boolean;
  categories: { slug: string | null; name: string | null; color: string | null } | null;
}

function toCardData(row: ProductRow): ProductCardData | null {
  if (!row.slug || !row.name || !row.categories?.slug || !row.categories?.name) {
    return null;
  }
  return {
    slug: row.slug,
    name: row.name,
    category: row.categories.name,
    categoryHref: row.categories.slug,
    color: (row.categories.color as DepartmentColor) ?? "orange",
    brand: row.brand ?? undefined,
    pricePkr: row.price_pkr ?? 0,
    compareAtPricePkr: row.compare_at_price_pkr ?? undefined,
    difficulty: row.difficulty ?? undefined,
    ageMin: row.age_min ?? undefined,
    ageMax: row.age_max ?? undefined,
    isBestseller: row.is_bestseller,
    isNew: row.is_new,
  };
}

export async function getProducts(
  options: ProductQueryOptions = {}
): Promise<ProductCardData[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      "slug, name, brand, price_pkr, compare_at_price_pkr, difficulty, age_min, age_max, is_bestseller, is_new, featured, created_at, categories!inner(slug, name, color)"
    )
    .eq("is_active", true);

  if (options.categorySlug) {
    query = query.eq("categories.slug", options.categorySlug);
  }

  switch (options.sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price_pkr", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("price_pkr", { ascending: false, nullsFirst: false });
      break;
    case "featured":
    default:
      query = query
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("getProducts query failed:", error.message);
    return [];
  }

  return (data as unknown as ProductRow[])
    .map(toCardData)
    .filter((p): p is ProductCardData => p !== null);
}

export interface CategorySummary {
  slug: string;
  name: string;
  color: DepartmentColor;
  productCount: number;
}

export async function getCategories(): Promise<CategorySummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("slug, name, color, products(count)")
    .eq("is_active", true)
    .order("order_index");

  if (error) {
    console.error("getCategories query failed:", error.message);
    return [];
  }

  return (
    data as unknown as {
      slug: string;
      name: string;
      color: string;
      products: { count: number }[];
    }[]
  ).map((row) => ({
    slug: row.slug,
    name: row.name,
    color: (row.color as DepartmentColor) ?? "orange",
    productCount: row.products?.[0]?.count ?? 0,
  }));
}
