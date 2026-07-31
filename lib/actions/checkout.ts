"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { calculateDeliveryFee } from "@/lib/shipping";
import { sendOrderConfirmationEmail } from "@/lib/email/send-order-confirmation";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email(),
  province: z.string().min(2, "Select a province"),
  city: z.string().min(2, "Enter your city"),
  address: z.string().min(5, "Enter your full address"),
  landmark: z.string().optional(),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer"]),
  items: z
    .array(z.object({ slug: z.string(), quantity: z.number().min(1) }))
    .min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutResult =
  | { ok: true; orderNumber: string; guestAccessToken: string }
  | { ok: false; error: string };

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  const data = parsed.data;

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const supabase = createAdminClient();

  // never trust client-supplied prices — re-fetch authoritative data
  const slugs = data.items.map((i) => i.slug);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, slug, name, price_pkr, inventory_count, is_active")
    .in("slug", slugs);

  if (productsError || !products) {
    console.error("createOrder: product lookup failed:", productsError?.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  const bySlug = new Map(products.map((p) => [p.slug, p]));

  for (const item of data.items) {
    const product = bySlug.get(item.slug);
    if (!product || !product.is_active) {
      return { ok: false, error: `One of your items is no longer available. Please review your cart.` };
    }
    if (product.inventory_count < item.quantity) {
      return { ok: false, error: `${product.name} — only ${product.inventory_count} left in stock. Please update your cart.` };
    }
  }

  const subtotalPkr = data.items.reduce((sum, item) => {
    const product = bySlug.get(item.slug)!;
    return sum + (product.price_pkr ?? 0) * item.quantity;
  }, 0);
  const deliveryFeePkr = calculateDeliveryFee(subtotalPkr);
  const totalPkr = subtotalPkr + deliveryFeePkr;

  const orderId = randomUUID();
  const orderNumber = `BZ-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      order_number: orderNumber,
      user_id: user?.id ?? null,
      guest_email: data.email,
      guest_phone: data.phone,
      status: "pending",
      payment_method: data.paymentMethod,
      subtotal_pkr: subtotalPkr,
      delivery_fee_pkr: deliveryFeePkr,
      total_pkr: totalPkr,
      shipping_name: data.fullName,
      shipping_phone: data.phone,
      shipping_address: `${data.address}${data.landmark ? ` (near ${data.landmark})` : ""}`,
      shipping_city: data.city,
      shipping_province: data.province,
      notes: data.deliveryNotes || null,
    })
    .select("guest_access_token")
    .single();

  if (orderError || !orderRow) {
    console.error("createOrder: order insert failed:", orderError?.message);
    return { ok: false, error: "Something went wrong placing your order. Please try again." };
  }

  const orderItems = data.items.map((item) => {
    const product = bySlug.get(item.slug)!;
    return {
      order_id: orderId,
      product_id: product.id,
      product_type: "physical",
      product_name_snapshot: product.name,
      quantity: item.quantity,
      unit_price_pkr: product.price_pkr,
      line_total_pkr: (product.price_pkr ?? 0) * item.quantity,
    };
  });

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    console.error("createOrder: order_items insert failed:", itemsError.message);
    return { ok: false, error: "Something went wrong placing your order. Please try again." };
  }

  // best-effort inventory decrement (small-scale demo storefront — not
  // wrapped in a DB transaction, so a mid-loop failure could under-decrement;
  // acceptable at this volume, worth revisiting with an RPC before launch)
  for (const item of data.items) {
    const product = bySlug.get(item.slug)!;
    await supabase
      .from("products")
      .update({ inventory_count: product.inventory_count - item.quantity })
      .eq("id", product.id);
  }

  // TODO(SMS): send order confirmation SMS + a fulfillment team alert,
  // once an SMS provider is configured.

  await sendOrderConfirmationEmail({
    to: data.email,
    orderNumber,
    guestAccessToken: orderRow.guest_access_token,
    customerName: data.fullName,
    items: orderItems.map((item) => ({
      name: item.product_name_snapshot ?? "Item",
      quantity: item.quantity,
      lineTotalPkr: item.line_total_pkr,
    })),
    subtotalPkr,
    deliveryFeePkr,
    totalPkr,
    paymentMethod: data.paymentMethod,
    shippingCity: data.city,
    shippingProvince: data.province,
  });

  return { ok: true, orderNumber, guestAccessToken: orderRow.guest_access_token };
}
