import { createClient } from "@/lib/supabase/server";

export interface AdminOverview {
  totalOrders: number;
  pendingOrders: number;
  totalRevenuePkr: number;
  ordersLast7Days: number;
  revenueLast7DaysPkr: number;
  lowStockProducts: { id: string; name: string; slug: string; inventoryCount: number }[];
  recentOrders: { id: string; orderNumber: string; customerName: string; totalPkr: number; status: string; createdAt: string }[];
  totalCustomers: number;
  totalProducts: number;
}

const REVENUE_STATUSES = ["paid", "dispatched", "delivered", "completed"];

export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = await createClient();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [ordersRes, recentRes, lowStockRes, customersRes, productsRes] = await Promise.all([
    supabase.from("orders").select("id, status, total_pkr, created_at"),
    supabase
      .from("orders")
      .select("id, order_number, shipping_name, total_pkr, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("products")
      .select("id, name, slug, inventory_count")
      .eq("is_active", true)
      .lte("inventory_count", 5)
      .order("inventory_count", { ascending: true })
      .limit(8),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const orders = ordersRes.data ?? [];
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalRevenuePkr = orders
    .filter((o) => REVENUE_STATUSES.includes(o.status ?? ""))
    .reduce((sum, o) => sum + (o.total_pkr ?? 0), 0);

  const recentWindow = orders.filter((o) => (o.created_at ?? "") >= sevenDaysAgo);
  const ordersLast7Days = recentWindow.length;
  const revenueLast7DaysPkr = recentWindow
    .filter((o) => REVENUE_STATUSES.includes(o.status ?? ""))
    .reduce((sum, o) => sum + (o.total_pkr ?? 0), 0);

  return {
    totalOrders,
    pendingOrders,
    totalRevenuePkr,
    ordersLast7Days,
    revenueLast7DaysPkr,
    lowStockProducts: (lowStockRes.data ?? []).map((p) => ({
      id: p.id,
      name: p.name ?? "",
      slug: p.slug ?? "",
      inventoryCount: p.inventory_count ?? 0,
    })),
    recentOrders: (recentRes.data ?? []).map((o) => ({
      id: o.id,
      orderNumber: o.order_number ?? "",
      customerName: o.shipping_name ?? "—",
      totalPkr: o.total_pkr ?? 0,
      status: o.status ?? "pending",
      createdAt: o.created_at ?? "",
    })),
    totalCustomers: customersRes.count ?? 0,
    totalProducts: productsRes.count ?? 0,
  };
}
