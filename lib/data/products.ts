// This module only ever reads public catalog data (products/categories RLS
// policies check `is_active`/`is_published`, never `auth.uid()`), so every
// query here uses the cookie-free static client rather than the session-
// aware server client — that's what lets these pages stay statically
// generated / properly ISR'd instead of forced dynamic on every request.
import { createStaticClient } from "@/lib/supabase/static";
import type { ProductCardData, ProductDetailData } from "@/types/product";
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
  cover_image: string | null;
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
    coverImage: row.cover_image ?? undefined,
  };
}

export async function getProducts(
  options: ProductQueryOptions = {}
): Promise<ProductCardData[]> {
  const supabase = createStaticClient();

  let query = supabase
    .from("products")
    .select(
      "slug, name, brand, price_pkr, compare_at_price_pkr, difficulty, age_min, age_max, is_bestseller, is_new, featured, created_at, cover_image, categories!inner(slug, name, color)"
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
  const supabase = createStaticClient();

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

// For generateStaticParams — just the slugs, no need for the full query.
export async function getCategorySlugsForStaticParams(): Promise<{ slug: string }[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("categories")
    .select("slug")
    .eq("is_active", true);

  if (error || !data) {
    if (error) console.error("getCategorySlugsForStaticParams query failed:", error.message);
    return [];
  }

  return data.filter((c): c is { slug: string } => !!c.slug);
}

export async function getProductSlugsForStaticParams(): Promise<
  { category: string; slug: string }[]
> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug, categories!inner(slug)")
    .eq("is_active", true);

  if (error || !data) {
    if (error) console.error("getProductSlugsForStaticParams query failed:", error.message);
    return [];
  }

  return (
    data as unknown as { slug: string | null; categories: { slug: string | null } | null }[]
  )
    .filter((row): row is { slug: string; categories: { slug: string } } =>
      Boolean(row.slug && row.categories?.slug)
    )
    .map((row) => ({ category: row.categories.slug, slug: row.slug }));
}

export async function getCategoryBySlug(
  slug: string
): Promise<{ slug: string; name: string; description: string | null; color: DepartmentColor } | null> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name, description, color")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data || !data.slug || !data.name) {
    if (error) console.error("getCategoryBySlug query failed:", error.message);
    return null;
  }

  return {
    slug: data.slug,
    name: data.name,
    description: data.description,
    color: (data.color as DepartmentColor) ?? "orange",
  };
}

interface ProductDetailRow extends ProductRow {
  sku: string | null;
  short_description: string | null;
  long_description: string | null;
  gallery: string[] | null;
  specs: Record<string, string> | null;
  components: { name: string; qty: number; note?: string }[] | null;
  inventory_count: number;
}

const PRODUCT_DETAIL_COLUMNS =
  "slug, name, brand, sku, short_description, long_description, cover_image, gallery, specs, components, price_pkr, compare_at_price_pkr, difficulty, age_min, age_max, is_bestseller, is_new, inventory_count, categories!inner(slug, name, color)";

function toDetailData(row: ProductDetailRow): ProductDetailData | null {
  const card = toCardData(row);
  if (!card) return null;
  return {
    ...card,
    sku: row.sku ?? undefined,
    shortDescription: row.short_description ?? undefined,
    longDescription: row.long_description ?? undefined,
    gallery: row.gallery ?? [],
    specs: row.specs ?? {},
    components: row.components ?? [],
    inventoryCount: row.inventory_count,
  };
}

export async function getProductDetail(
  categorySlug: string,
  slug: string
): Promise<ProductDetailData | null> {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_DETAIL_COLUMNS)
    .eq("is_active", true)
    .eq("slug", slug)
    .eq("categories.slug", categorySlug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getProductDetail query failed:", error.message);
    return null;
  }

  return toDetailData(data as unknown as ProductDetailRow);
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 4
): Promise<ProductCardData[]> {
  const products = await getProducts({ categorySlug });
  return products.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export async function searchProducts(searchQuery: string): Promise<ProductCardData[]> {
  // strip characters that are syntactically significant in PostgREST's
  // `.or()` filter DSL (comma separates conditions, parens group them)
  const safe = searchQuery.trim().replace(/[,()%]/g, " ").slice(0, 100);
  if (!safe) return [];

  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "slug, name, brand, price_pkr, compare_at_price_pkr, difficulty, age_min, age_max, is_bestseller, is_new, cover_image, categories!inner(slug, name, color)"
    )
    .eq("is_active", true)
    .or(`name.ilike.%${safe}%,sku.ilike.%${safe}%,short_description.ilike.%${safe}%`)
    .limit(24);

  if (error) {
    console.error("searchProducts query failed:", error.message);
    return [];
  }

  return (data as unknown as ProductRow[])
    .map(toCardData)
    .filter((p): p is ProductCardData => p !== null);
}
