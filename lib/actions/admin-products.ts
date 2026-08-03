"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, ForbiddenError } from "@/lib/auth/require-staff";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

// Digital products don't track physical stock — this sentinel keeps the
// existing "in stock" checks in checkout/cart harmless for them without
// needing a separate code path there.
const DIGITAL_INVENTORY_SENTINEL = 999_999;

const baseSchema = z.object({
  name: z.string().min(2, "Enter a product name"),
  nameUr: z.string().optional(),
  slug: z
    .string()
    .min(2, "Enter a slug")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  sku: z.string().optional(),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  brand: z.string().optional(),
  shortDescription: z.string().optional(),
  shortDescriptionUr: z.string().optional(),
  longDescription: z.string().optional(),
  longDescriptionUr: z.string().optional(),
  pricePkr: z.number().min(0, "Enter a price"),
  compareAtPricePkr: z.number().min(0).optional(),
  costPkr: z.number().min(0).optional(),
  weightGrams: z.number().min(0).optional(),
  inventoryCount: z.number().min(0, "Enter a stock count"),
  lowStockThreshold: z.number().min(0).optional(),
  ageMin: z.number().min(0).optional(),
  ageMax: z.number().min(0).optional(),
  gradeTags: z.array(z.string()).optional(),
  difficulty: z.string().optional(),
  featured: z.boolean(),
  isBestseller: z.boolean(),
  isNew: z.boolean(),
  isActive: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
});

const createSchema = baseSchema.extend({
  productType: z.enum(["physical", "digital"]),
});

export type AdminProductInput = z.infer<typeof baseSchema>;
export type AdminCreateProductInput = z.infer<typeof createSchema>;
export type ActionResult = { ok: true } | { ok: false; error: string };

function toRow(data: AdminProductInput, productType: "physical" | "digital") {
  const isDigital = productType === "digital";
  return {
    name: data.name,
    name_ur: data.nameUr || null,
    slug: data.slug,
    sku: data.sku || null,
    category_id: data.categoryId || null,
    brand: data.brand || null,
    short_description: data.shortDescription || null,
    short_description_ur: data.shortDescriptionUr || null,
    long_description: data.longDescription || null,
    long_description_ur: data.longDescriptionUr || null,
    price_pkr: data.pricePkr,
    compare_at_price_pkr: data.compareAtPricePkr || null,
    cost_pkr: data.costPkr ?? null,
    weight_grams: data.weightGrams ?? null,
    inventory_count: isDigital ? DIGITAL_INVENTORY_SENTINEL : data.inventoryCount,
    // unlike the other optional numeric columns, low_stock_threshold's
    // generated type is non-nullable (it has a DB default of 5) — omit it
    // entirely when unset instead of writing null
    low_stock_threshold: data.lowStockThreshold ?? undefined,
    age_min: data.ageMin ?? null,
    age_max: data.ageMax ?? null,
    grade_tags: data.gradeTags?.length ? data.gradeTags : null,
    difficulty: isDigital
      ? null
      : DIFFICULTIES.includes(data.difficulty as Difficulty)
        ? (data.difficulty as Difficulty)
        : null,
    featured: data.featured,
    is_bestseller: data.isBestseller,
    is_new: data.isNew,
    is_active: data.isActive,
    meta_title: data.metaTitle || null,
    meta_description: data.metaDescription || null,
    og_image: data.ogImage || null,
  };
}

export async function createProduct(input: AdminCreateProductInput): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("products")
    .insert({ ...toRow(parsed.data, parsed.data.productType), product_type: parsed.data.productType })
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

  const parsed = baseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();

  // product_type is fixed at creation — read it rather than trust the form
  const { data: existing } = await supabase.from("products").select("product_type").eq("id", id).single();
  const productType = existing?.product_type === "digital" ? "digital" : "physical";

  const { error } = await supabase.from("products").update(toRow(parsed.data, productType)).eq("id", id);

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

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    // products.id is referenced by order_items with no ON DELETE clause
    // (default RESTRICT) — a product that's ever been ordered can't be hard
    // deleted without orphaning that order's line items, so this is
    // intentional, not a bug to work around
    if (error.code === "23503" || error.message.includes("foreign key constraint")) {
      return {
        ok: false,
        error: "This product has order history and can't be deleted — set it to Inactive instead to hide it from the shop.",
      };
    }
    return { ok: false, error: "Something went wrong deleting the product." };
  }

  revalidatePath("/admin/products");
  return { ok: true };
}
