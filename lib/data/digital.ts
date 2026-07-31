import { createStaticClient } from "@/lib/supabase/static";

export interface DigitalProductCard {
  slug: string;
  name: string;
  shortDescription: string | null;
  pricePkr: number;
  compareAtPricePkr: number | null;
}

export async function getDigitalProducts(): Promise<DigitalProductCard[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug, name, short_description, price_pkr, compare_at_price_pkr")
    .eq("is_active", true)
    .eq("product_type", "digital")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data
    .filter((p) => p.slug && p.name)
    .map((p) => ({
      slug: p.slug!,
      name: p.name!,
      shortDescription: p.short_description,
      pricePkr: p.price_pkr ?? 0,
      compareAtPricePkr: p.compare_at_price_pkr,
    }));
}

export interface DigitalProductDetail {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  longDescription: string | null;
  pricePkr: number;
  compareAtPricePkr: number | null;
  previewFiles: { fileName: string; fileType: string | null }[];
}

export async function getDigitalProductBySlug(slug: string): Promise<DigitalProductDetail | null> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, short_description, long_description, price_pkr, compare_at_price_pkr, digital_files(file_name, file_type, is_preview)")
    .eq("is_active", true)
    .eq("product_type", "digital")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data || !data.slug || !data.name) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    shortDescription: data.short_description,
    longDescription: data.long_description,
    pricePkr: data.price_pkr ?? 0,
    compareAtPricePkr: data.compare_at_price_pkr,
    previewFiles: (data.digital_files ?? [])
      .filter((f) => f.is_preview)
      .map((f) => ({ fileName: f.file_name ?? "Preview", fileType: f.file_type })),
  };
}

export async function getDigitalProductSlugsForStaticParams(): Promise<{ slug: string }[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true)
    .eq("product_type", "digital");
  return (data ?? []).filter((p) => p.slug).map((p) => ({ slug: p.slug! }));
}
