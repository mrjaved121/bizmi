"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, ForbiddenError } from "@/lib/auth/require-staff";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

const schema = z.object({
  name: z.string().min(2, "Enter a product name"),
  slug: z
    .string()
    .min(2, "Enter a slug")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  sku: z.string().optional(),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  brand: z.string().optional(),
  shortDescription: z.string().optional(),
  pricePkr: z.number().min(0, "Enter a price"),
  compareAtPricePkr: z.number().min(0).optional(),
  inventoryCount: z.number().min(0, "Enter a stock count"),
  difficulty: z.string().optional(),
  featured: z.boolean(),
  isBestseller: z.boolean(),
  isNew: z.boolean(),
  isActive: z.boolean(),
});

export type AdminProductInput = z.infer<typeof schema>;
export type ActionResult = { ok: true } | { ok: false; error: string };

function toRow(data: AdminProductInput) {
  return {
    name: data.name,
    slug: data.slug,
    sku: data.sku || null,
    category_id: data.categoryId || null,
    brand: data.brand || null,
    short_description: data.shortDescription || null,
    price_pkr: data.pricePkr,
    compare_at_price_pkr: data.compareAtPricePkr || null,
    inventory_count: data.inventoryCount,
    difficulty: DIFFICULTIES.includes(data.difficulty as Difficulty) ? (data.difficulty as Difficulty) : null,
    featured: data.featured,
    is_bestseller: data.isBestseller,
    is_new: data.isNew,
    is_active: data.isActive,
  };
}

export async function createProduct(input: AdminProductInput): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("products")
    .insert({ ...toRow(parsed.data), product_type: "physical" })
    .select("id")
    .single();

  if (error) {
    if (error.message.includes("duplicate key")) {
      return { ok: false, error: "A product with this slug or SKU already exists." };
    }
    return { ok: false, error: "Something went wrong creating the product." };
  }

  revalidatePath("/admin/products");
  redirect(`/admin/products/${row.id}`);
}

export async function updateProduct(id: string, input: AdminProductInput): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(toRow(parsed.data)).eq("id", id);

  if (error) {
    if (error.message.includes("duplicate key")) {
      return { ok: false, error: "A product with this slug or SKU already exists." };
    }
    return { ok: false, error: "Something went wrong updating the product." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return { ok: true };
}
