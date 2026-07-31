import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, Wallet, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { getAdminOverview } from "@/lib/data/admin-analytics";
import { formatPkr } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin dashboard | Bizmi",
  robots: { index: false },
};

export default async function AdminDashboardPage() {
  const overview = await getAdminOverview();

  const stats = [
    { label: "Total revenue", value: formatPkr(overview.totalRevenuePkr), icon: Wallet, sub: `${formatPkr(overview.revenueLast7DaysPkr)} last 7 days` },
    { label: "Orders", value: String(overview.totalOrders), icon: ShoppingBag, sub: `${overview.pendingOrders} pending` },
    { label: "Orders (7d)", value: String(overview.ordersLast7Days), icon: TrendingUp, sub: "last 7 days" },
    { label: "Customers", value: String(overview.totalCustomers), icon: Users, sub: `${overview.totalProducts} active products` },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-ink-2">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-orange" />
            </div>
            <p className="mt-2 font-mono text-2xl text-ink">{stat.value}</p>
            <p className="mt-1 text-xs text-ink-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-ink">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-ink-2 underline underline-offset-2 hover:text-ink">
              View all
            </Link>
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-line">
            {overview.recentOrders.length === 0 && <p className="py-6 text-sm text-ink-2">No orders yet.</p>}
            {overview.recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-ink"
                >
                  <div>
                    <p className="font-mono text-ink">{order.orderNumber}</p>
                    <p className="text-xs text-ink-2">{order.customerName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide",
                        ORDER_STATUS_STYLE[order.status] ?? "bg-surface-2 text-ink-2"
                      )}
                    >
                      {ORDER_STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <span className="font-mono text-ink">{formatPkr(order.totalPkr)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-line bg-white p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange" />
            <h2 className="font-serif text-lg text-ink">Low stock</h2>
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-line">
            {overview.lowStockProducts.length === 0 && <p className="py-6 text-sm text-ink-2">Nothing running low.</p>}
            {overview.lowStockProducts.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between py-3 text-sm transition-colors hover:text-ink"
                >
                  <span className="text-ink-2">{product.name}</span>
                  <span className="font-mono text-red">{product.inventoryCount} left</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
