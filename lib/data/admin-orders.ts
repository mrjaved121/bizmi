import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";

export interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalPkr: number;
  createdAt: string;
  customerName: string;
  paymentMethod: string | null;
  itemCount: number;
}

export async function getAdminOrders(statusFilter?: string): Promise<AdminOrderSummary[]> {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, order_number, status, total_pkr, created_at, shipping_name, payment_method, order_items(quantity)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (statusFilter && ORDER_STATUSES.includes(statusFilter as OrderStatus)) {
    query = query.eq("status", statusFilter as OrderStatus);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((order) => ({
    id: order.id,
    orderNumber: order.order_number ?? "",
    status: order.status ?? "pending",
    totalPkr: order.total_pkr ?? 0,
    createdAt: order.created_at ?? "",
    customerName: order.shipping_name ?? "—",
    paymentMethod: order.payment_method,
    itemCount: (order.order_items ?? []).reduce((sum, i) => sum + (i.quantity ?? 0), 0),
  }));
}

export interface AdminOrderDetail extends AdminOrderSummary {
  subtotalPkr: number;
  deliveryFeePkr: number;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  notes: string | null;
  trackingNumber: string | null;
  courier: string | null;
  guestEmail: string | null;
  items: { name: string; quantity: number; unitPricePkr: number; lineTotalPkr: number }[];
  statusLog: { fromStatus: string | null; toStatus: string | null; note: string | null; createdAt: string }[];
}

export async function getAdminOrderDetail(orderId: string): Promise<AdminOrderDetail | null> {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, subtotal_pkr, delivery_fee_pkr, total_pkr, created_at, payment_method, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_province, notes, tracking_number, courier, guest_email, order_items(product_name_snapshot, quantity, unit_price_pkr, line_total_pkr)"
    )
    .eq("id", orderId)
    .single();

  if (error || !order) return null;

  const { data: statusLog } = await supabase
    .from("order_status_log")
    .select("from_status, to_status, note, created_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  return {
    id: order.id,
    orderNumber: order.order_number ?? "",
    status: order.status ?? "pending",
    totalPkr: order.total_pkr ?? 0,
    subtotalPkr: order.subtotal_pkr ?? 0,
    deliveryFeePkr: order.delivery_fee_pkr ?? 0,
    createdAt: order.created_at ?? "",
    customerName: order.shipping_name ?? "—",
    paymentMethod: order.payment_method,
    shippingPhone: order.shipping_phone,
    shippingAddress: order.shipping_address,
    shippingCity: order.shipping_city,
    shippingProvince: order.shipping_province,
    notes: order.notes,
    trackingNumber: order.tracking_number,
    courier: order.courier,
    guestEmail: order.guest_email,
    itemCount: (order.order_items ?? []).reduce((sum, i) => sum + (i.quantity ?? 0), 0),
    items: (order.order_items ?? []).map((i) => ({
      name: i.product_name_snapshot ?? "Item",
      quantity: i.quantity ?? 0,
      unitPricePkr: i.unit_price_pkr ?? 0,
      lineTotalPkr: i.line_total_pkr ?? 0,
    })),
    statusLog: (statusLog ?? []).map((s) => ({
      fromStatus: s.from_status,
      toStatus: s.to_status,
      note: s.note,
      createdAt: s.created_at ?? "",
    })),
  };
}
