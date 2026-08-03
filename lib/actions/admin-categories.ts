"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, ForbiddenError } from "@/lib/auth/require-staff";

const baseSchema = z.object({
  name: z.string().min(2, "Enter a category name"),
  nameUr: z.string().optional(),
  slug: z
    .string()
    .min(2, "Enter a slug")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  parentId: z.string().uuid().optional().or(z.literal("")),
  color: z.string().optional(),
  orderIndex: z.number().min(0, "Enter a position"),
  isActive: z.boolean(),
});

export type AdminCategoryInput = z.infer<typeof baseSchema>;
export type ActionResult = { ok: true } | { ok: false; error: string };

function toRow(data: AdminCategoryInput) {
  return {
    name: data.name,
    name_ur: data.nameUr || null,
    slug: data.slug,
    description: data.description || null,
    parent_id: data.parentId || null,
    color: data.color || null,
    order_index: data.orderIndex,
    is_active: data.isActive,
  };
}

export async function createCategory(input: AdminCategoryInput): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const parsed = baseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("categories")
    .insert(toRow(parsed.data))
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "A category with this slug already exists." };
    }
    return { ok: false, error: "Something went wrong creating the category." };
  }

  revalidatePath("/admin/categories");
  redirect(`/admin/categories/${row.id}`);
}

export async function updateCategory(id: string, input: AdminCategoryInput): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const parsed = baseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  // a category can't be its own parent — the deeper cycle case (choosing a
  // descendant as parent) is prevented upstream by excluding it from the
  // picker's options (getAdminParentCategoryOptions), not re-checked here
  if (parsed.data.parentId === id) {
    return { ok: false, error: "A category can't be its own parent." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").update(toRow(parsed.data)).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "A category with this slug already exists." };
    }
    return { ok: false, error: "Something went wrong updating the category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${id}`);
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    // categories.id is referenced by products.category_id with no ON DELETE
    // clause (default RESTRICT) — a category still assigned to products
    // can't be hard deleted without orphaning them
    if (error.code === "23503" || error.message.includes("foreign key constraint")) {
      return {
        ok: false,
        error:
          "This category still has products assigned — move or delete them first, or set the category to inactive instead.",
      };
    }
    return { ok: false, error: "Something went wrong deleting the category." };
  }

  revalidatePath("/admin/categories");
  return { ok: true };
}
