import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { getMyOrders } from "@/lib/data/account";
import { formatPkr } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your orders | Bizmi",
};

export default async function AccountOrdersPage() {
  const orders = await getMyOrders();

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white p-10 text-center">
        <Package className="mx-auto h-8 w-8 text-ink-2" />
        <p className="mt-4 text-ink-2">You haven&apos;t placed any orders yet.</p>
        <Link href="/shop" className="mt-4 inline-block text-sm text-ink underline underline-offset-2">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-line rounded-3xl border border-line bg-white">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/account/orders/${order.id}`}
            className="flex flex-wrap items-center justify-between gap-3 p-5 transition-colors hover:bg-surface-2"
          >
            <div>
              <p className="font-mono text-sm text-ink">{order.orderNumber}</p>
              <p className="mt-1 text-xs text-ink-2">
                {order.itemCount} item{order.itemCount === 1 ? "" : "s"} ·{" "}
                {new Date(order.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wide",
                  ORDER_STATUS_STYLE[order.status] ?? "bg-surface-2 text-ink-2"
                )}
              >
                {ORDER_STATUS_LABEL[order.status] ?? order.status}
              </span>
              <span className="font-mono text-sm text-ink">{formatPkr(order.totalPkr)}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
