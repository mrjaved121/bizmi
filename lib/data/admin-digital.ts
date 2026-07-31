import { createClient } from "@/lib/supabase/server";

export interface AdminDigitalFile {
  id: string;
  fileName: string;
  fileSizeBytes: number | null;
  fileType: string | null;
  isPreview: boolean;
}

export async function getDigitalFilesForProduct(productId: string): Promise<AdminDigitalFile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("digital_files")
    .select("id, file_name, file_size_bytes, file_type, is_preview")
    .eq("product_id", productId)
    .order("order_index");

  return (data ?? []).map((f) => ({
    id: f.id,
    fileName: f.file_name ?? "file",
    fileSizeBytes: f.file_size_bytes,
    fileType: f.file_type,
    isPreview: f.is_preview ?? false,
  }));
}
