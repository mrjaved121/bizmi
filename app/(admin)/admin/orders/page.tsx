import type { Metadata } from "next";
import Link from "next/link";
import { getAdminOrders } from "@/lib/data/admin-orders";
import { formatPkr } from "@/lib/format";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders | Bizmi Admin",
  robots: { index: false },
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await getAdminOrders(status);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={cn(
            "rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
            !status ? "bg-ink text-white" : "bg-white text-ink-2 hover:text-ink"
          )}
        >
          All
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={cn(
              "rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
              status === s ? "bg-ink text-white" : "bg-white text-ink-2 hover:text-ink"
            )}
          >
            {ORDER_STATUS_LABEL[s]}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-2">
              <th className="px-5 py-3 font-normal">Order</th>
              <th className="px-5 py-3 font-normal">Customer</th>
              <th className="px-5 py-3 font-normal">Items</th>
              <th className="px-5 py-3 font-normal">Payment</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 text-right font-normal">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-2">
                  No orders found.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-surface-2">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-mono text-ink hover:underline">
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-ink-2">
                    {new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                  </p>
                </td>
                <td className="px-5 py-3 text-ink-2">{order.customerName}</td>
                <td className="px-5 py-3 text-ink-2">{order.itemCount}</td>
                <td className="px-5 py-3 text-ink-2">
                  {order.paymentMethod === "bank_transfer" ? "Bank transfer" : "COD"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide",
                      ORDER_STATUS_STYLE[order.status] ?? "bg-surface-2 text-ink-2"
                    )}
                  >
                    {ORDER_STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-mono text-ink">{formatPkr(order.totalPkr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
