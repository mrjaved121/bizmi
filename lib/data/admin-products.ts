import { createClient } from "@/lib/supabase/server";
import { getCategoryOptionTree } from "@/lib/data/admin-categories";

export interface AdminProductSummary {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  categoryName: string | null;
  pricePkr: number;
  inventoryCount: number;
  isActive: boolean;
  productType: string;
}

export async function getAdminProducts(): Promise<AdminProductSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, sku, name, price_pkr, inventory_count, is_active, product_type, categories(name)")
    .order("name");

  if (error || !data) return [];

  return data.map((p) => ({
    id: p.id,
    slug: p.slug ?? "",
    sku: p.sku,
    name: p.name ?? "",
    categoryName: p.categories?.name ?? null,
    pricePkr: p.price_pkr ?? 0,
    inventoryCount: p.inventory_count ?? 0,
    isActive: p.is_active ?? false,
    productType: p.product_type ?? "physical",
  }));
}

export interface AdminProductDetail {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  nameUr: string | null;
  shortDescription: string | null;
  shortDescriptionUr: string | null;
  longDescription: string | null;
  longDescriptionUr: string | null;
  categoryId: string | null;
  brand: string | null;
  pricePkr: number;
  compareAtPricePkr: number | null;
  costPkr: number | null;
  weightGrams: number | null;
  inventoryCount: number;
  lowStockThreshold: number | null;
  ageMin: number | null;
  ageMax: number | null;
  gradeTags: string[];
  difficulty: string | null;
  featured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  isActive: boolean;
  productType: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
}

const ADMIN_PRODUCT_DETAIL_COLUMNS =
  "id, slug, sku, name, name_ur, short_description, short_description_ur, long_description, long_description_ur, category_id, brand, price_pkr, compare_at_price_pkr, cost_pkr, weight_grams, inventory_count, low_stock_threshold, age_min, age_max, grade_tags, difficulty, featured, is_bestseller, is_new, is_active, product_type, meta_title, meta_description, og_image";

export async function getAdminProductDetail(id: string): Promise<AdminProductDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_DETAIL_COLUMNS)
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug ?? "",
    sku: data.sku,
    name: data.name ?? "",
    nameUr: data.name_ur,
    shortDescription: data.short_description,
    shortDescriptionUr: data.short_description_ur,
    longDescription: data.long_description,
    longDescriptionUr: data.long_description_ur,
    categoryId: data.category_id,
    brand: data.brand,
    pricePkr: data.price_pkr ?? 0,
    compareAtPricePkr: data.compare_at_price_pkr,
    costPkr: data.cost_pkr,
    weightGrams: data.weight_grams,
    inventoryCount: data.inventory_count ?? 0,
    lowStockThreshold: data.low_stock_threshold,
    ageMin: data.age_min,
    ageMax: data.age_max,
    gradeTags: data.grade_tags ?? [],
    difficulty: data.difficulty,
    featured: data.featured ?? false,
    isBestseller: data.is_bestseller ?? false,
    isNew: data.is_new ?? false,
    isActive: data.is_active ?? true,
    productType: data.product_type ?? "physical",
    metaTitle: data.meta_title,
    metaDescription: data.meta_description,
    ogImage: data.og_image,
  };
}

export interface CategoryOption {
  id: string;
  name: string;
  depth: number;
}

export async function getAdminCategoryOptions(): Promise<CategoryOption[]> {
  return getCategoryOptionTree();
}
