import { createClient } from "@/lib/supabase/server";

export interface AdminProductSummary {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  categoryName: string | null;
  pricePkr: number;
  inventoryCount: number;
  isActive: boolean;
}

export async function getAdminProducts(): Promise<AdminProductSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, sku, name, price_pkr, inventory_count, is_active, categories(name)")
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
  }));
}

export interface AdminProductDetail {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  shortDescription: string | null;
  categoryId: string | null;
  brand: string | null;
  pricePkr: number;
  compareAtPricePkr: number | null;
  inventoryCount: number;
  difficulty: string | null;
  featured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  isActive: boolean;
}

export async function getAdminProductDetail(id: string): Promise<AdminProductDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, sku, name, short_description, category_id, brand, price_pkr, compare_at_price_pkr, inventory_count, difficulty, featured, is_bestseller, is_new, is_active"
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug ?? "",
    sku: data.sku,
    name: data.name ?? "",
    shortDescription: data.short_description,
    categoryId: data.category_id,
    brand: data.brand,
    pricePkr: data.price_pkr ?? 0,
    compareAtPricePkr: data.compare_at_price_pkr,
    inventoryCount: data.inventory_count ?? 0,
    difficulty: data.difficulty,
    featured: data.featured ?? false,
    isBestseller: data.is_bestseller ?? false,
    isNew: data.is_new ?? false,
    isActive: data.is_active ?? true,
  };
}

export interface CategoryOption {
  id: string;
  name: string;
}

export async function getAdminCategoryOptions(): Promise<CategoryOption[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name").order("order_index");
  return (data ?? []).map((c) => ({ id: c.id, name: c.name ?? "" }));
}
