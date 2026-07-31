import { createAdminClient } from "@/lib/supabase/admin";

export interface OrderConfirmation {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string | null;
  subtotalPkr: number;
  deliveryFeePkr: number;
  totalPkr: number;
  shippingName: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  createdAt: string;
  items: { name: string; quantity: number; unitPricePkr: number; lineTotalPkr: number }[];
}

// Guest order lookups are gated by possession of the guest_access_token
// (a capability URL, not RLS) since anonymous requests can never satisfy
// orders' `user_id = auth.uid()` policy — see supabase/migrations.
export async function getOrderByNumberAndToken(
  orderNumber: string,
  token: string
): Promise<OrderConfirmation | null> {
  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, payment_method, subtotal_pkr, delivery_fee_pkr, total_pkr, shipping_name, shipping_city, shipping_province, created_at"
    )
    .eq("order_number", orderNumber)
    .eq("guest_access_token", token)
    .maybeSingle();

  if (error || !order || !order.order_number) {
    if (error) console.error("getOrderByNumberAndToken query failed:", error.message);
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_name_snapshot, quantity, unit_price_pkr, line_total_pkr")
    .eq("order_id", order.id);

  if (itemsError) {
    console.error("getOrderByNumberAndToken items query failed:", itemsError.message);
  }

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    paymentMethod: order.payment_method,
    subtotalPkr: order.subtotal_pkr ?? 0,
    deliveryFeePkr: order.delivery_fee_pkr ?? 0,
    totalPkr: order.total_pkr ?? 0,
    shippingName: order.shipping_name,
    shippingCity: order.shipping_city,
    shippingProvince: order.shipping_province,
    createdAt: order.created_at,
    items: (items ?? []).map((i) => ({
      name: i.product_name_snapshot ?? "Item",
      quantity: i.quantity ?? 0,
      unitPricePkr: i.unit_price_pkr ?? 0,
      lineTotalPkr: i.line_total_pkr ?? 0,
    })),
  };
}
