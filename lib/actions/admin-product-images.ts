"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, ForbiddenError } from "@/lib/auth/require-staff";

export type ActionResult = { ok: true } | { ok: false; error: string };

// the "products" bucket is public with a staff-write storage policy (unlike
// "digital-source", which only ever accepts writes from the service-role
// client) — so plain createClient() is correct here, same as the products
// table writes in admin-products.ts.
const BUCKET = "products";

export async function uploadProductImage(productId: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an image to upload." };
  }

  const supabase = await createClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  const path = `${productId}/${randomUUID()}${ext ? `.${ext}` : ""}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || undefined });

  if (uploadError) {
    return { ok: false, error: "Upload failed. Please try again." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { data: existing } = await supabase
    .from("products")
    .select("cover_image, gallery")
    .eq("id", productId)
    .single();

  const gallery = [...(existing?.gallery ?? []), publicUrl];
  const coverImage = existing?.cover_image ?? publicUrl;

  const { error: updateError } = await supabase
    .from("products")
    .update({ cover_image: coverImage, gallery })
    .eq("id", productId);

  if (updateError) {
    await supabase.storage.from(BUCKET).remove([path]);
    return { ok: false, error: "Something went wrong saving the image. Please try again." };
  }

  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}

export async function removeProductImage(productId: string, url: string): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("products")
    .select("cover_image, gallery")
    .eq("id", productId)
    .single();

  const gallery = (existing?.gallery ?? []).filter((g) => g !== url);
  const coverImage = existing?.cover_image === url ? (gallery[0] ?? null) : (existing?.cover_image ?? null);

  const { error } = await supabase.from("products").update({ cover_image: coverImage, gallery }).eq("id", productId);
  if (error) {
    return { ok: false, error: "Something went wrong removing the image." };
  }

  // best-effort — derive the storage path from the public URL so the
  // underlying object doesn't linger in the bucket after removal
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    await supabase.storage.from(BUCKET).remove([url.slice(idx + marker.length)]);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}

export async function setCoverImage(productId: string, url: string): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ cover_image: url }).eq("id", productId);
  if (error) {
    return { ok: false, error: "Something went wrong updating the cover image." };
  }

  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}

export async function reorderProductGallery(productId: string, gallery: string[]): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ gallery }).eq("id", productId);
  if (error) {
    return { ok: false, error: "Something went wrong reordering the gallery." };
  }

  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}
