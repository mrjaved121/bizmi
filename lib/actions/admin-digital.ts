"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaff, ForbiddenError } from "@/lib/auth/require-staff";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function uploadDigitalFile(productId: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a file to upload." };
  }

  const supabase = createAdminClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  const path = `${productId}/${randomUUID()}${ext ? `.${ext}` : ""}`;

  const { error: uploadError } = await supabase.storage
    .from("digital-source")
    .upload(path, file, { contentType: file.type || undefined });

  if (uploadError) {
    return { ok: false, error: "Upload failed. Please try again." };
  }

  const { error: insertError } = await supabase.from("digital_files").insert({
    product_id: productId,
    file_name: file.name,
    file_path: path,
    file_size_bytes: file.size,
    file_type: file.type || null,
    is_preview: false,
  });

  if (insertError) {
    await supabase.storage.from("digital-source").remove([path]);
    return { ok: false, error: "Something went wrong saving the file. Please try again." };
  }

  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}

export async function deleteDigitalFile(fileId: string, productId: string): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const supabase = createAdminClient();
  const { data: file } = await supabase.from("digital_files").select("file_path").eq("id", fileId).single();

  if (file?.file_path) {
    await supabase.storage.from("digital-source").remove([file.file_path]);
  }
  await supabase.from("digital_files").delete().eq("id", fileId);

  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}
