import { createClient } from "@/lib/supabase/server";

export interface AdminProductImages {
  coverImage: string | null;
  gallery: string[];
}

export async function getAdminProductImages(productId: string): Promise<AdminProductImages> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("cover_image, gallery").eq("id", productId).single();

  return {
    coverImage: data?.cover_image ?? null,
    gallery: data?.gallery ?? [],
  };
}
