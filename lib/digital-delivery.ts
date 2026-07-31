import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24; // 24h, matches the brief's delivery link expiry

export interface DownloadableFile {
  fileName: string;
  url: string;
}

export interface DownloadableProduct {
  productId: string;
  productName: string;
  files: DownloadableFile[];
}

export async function getSignedFilesForProducts(productIds: string[]): Promise<Map<string, DownloadableFile[]>> {
  const byProduct = new Map<string, DownloadableFile[]>();
  if (productIds.length === 0) return byProduct;

  const supabase = createAdminClient();
  const { data: files } = await supabase
    .from("digital_files")
    .select("product_id, file_name, file_path")
    .in("product_id", productIds)
    .eq("is_preview", false)
    .order("order_index");

  for (const file of files ?? []) {
    if (!file.product_id || !file.file_path) continue;
    const { data: signed } = await supabase.storage
      .from("digital-source")
      .createSignedUrl(file.file_path, SIGNED_URL_TTL_SECONDS);
    if (!signed?.signedUrl) continue;

    const list = byProduct.get(file.product_id) ?? [];
    list.push({ fileName: file.file_name ?? "download", url: signed.signedUrl });
    byProduct.set(file.product_id, list);
  }

  return byProduct;
}

// Caller must have already verified the requester is allowed to see this
// order (guest_access_token match, or session ownership) — this function
// does not check authorization itself.
export async function getOrderDownloads(orderId: string): Promise<DownloadableProduct[]> {
  const supabase = createAdminClient();
  const { data: items } = await supabase
    .from("order_items")
    .select("product_id, product_name_snapshot")
    .eq("order_id", orderId)
    .eq("product_type", "digital");

  if (!items || items.length === 0) return [];

  const productIds = items.map((i) => i.product_id).filter((id): id is string => Boolean(id));
  const filesByProduct = await getSignedFilesForProducts(productIds);

  return items
    .filter((i): i is typeof i & { product_id: string } => Boolean(i.product_id))
    .map((i) => ({
      productId: i.product_id,
      productName: i.product_name_snapshot ?? "Digital product",
      files: filesByProduct.get(i.product_id) ?? [],
    }));
}
