import { createClient } from "@/lib/supabase/server";

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, phone, city, province, address")
    .eq("id", user.id)
    .single();

  return profile ? { ...profile, email: user.email ?? null } : null;
}

export interface AccountOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalPkr: number;
  createdAt: string;
  itemCount: number;
}

export async function getMyOrders(): Promise<AccountOrderSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total_pkr, created_at, order_items(quantity)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((order) => ({
    id: order.id,
    orderNumber: order.order_number ?? "",
    status: order.status ?? "pending",
    totalPkr: order.total_pkr ?? 0,
    createdAt: order.created_at ?? "",
    itemCount: (order.order_items ?? []).reduce((sum: number, i: { quantity: number | null }) => sum + (i.quantity ?? 0), 0),
  }));
}

export interface AccountOrderDetail extends AccountOrderSummary {
  subtotalPkr: number;
  deliveryFeePkr: number;
  paymentMethod: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  trackingNumber: string | null;
  courier: string | null;
  items: { name: string; quantity: number; lineTotalPkr: number }[];
}

export async function getMyOrderDetail(orderId: string): Promise<AccountOrderDetail | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, subtotal_pkr, delivery_fee_pkr, total_pkr, created_at, payment_method, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_province, tracking_number, courier, order_items(product_name_snapshot, quantity, line_total_pkr)"
    )
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error || !order) return null;

  return {
    id: order.id,
    orderNumber: order.order_number ?? "",
    status: order.status ?? "pending",
    totalPkr: order.total_pkr ?? 0,
    subtotalPkr: order.subtotal_pkr ?? 0,
    deliveryFeePkr: order.delivery_fee_pkr ?? 0,
    createdAt: order.created_at ?? "",
    paymentMethod: order.payment_method,
    shippingName: order.shipping_name,
    shippingPhone: order.shipping_phone,
    shippingAddress: order.shipping_address,
    shippingCity: order.shipping_city,
    shippingProvince: order.shipping_province,
    trackingNumber: order.tracking_number,
    courier: order.courier,
    itemCount: (order.order_items ?? []).reduce((sum, i) => sum + (i.quantity ?? 0), 0),
    items: (order.order_items ?? []).map((i) => ({
      name: i.product_name_snapshot ?? "Item",
      quantity: i.quantity ?? 0,
      lineTotalPkr: i.line_total_pkr ?? 0,
    })),
  };
}
