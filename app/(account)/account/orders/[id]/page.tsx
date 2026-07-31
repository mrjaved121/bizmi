import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMyOrderDetail } from "@/lib/data/account";
import { formatPkr } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order detail | Bizmi",
};

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getMyOrderDetail(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-mono text-lg text-ink">{order.orderNumber}</h2>
        <span
          className={cn(
            "rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wide",
            ORDER_STATUS_STYLE[order.status] ?? "bg-surface-2 text-ink-2"
          )}
        >
          {ORDER_STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>

      {order.trackingNumber && (
        <p className="mt-2 text-sm text-ink-2">
          Tracking: <span className="font-mono text-ink">{order.trackingNumber}</span>
          {order.courier ? ` via ${order.courier}` : ""}
        </p>
      )}

      <div className="mt-6 rounded-3xl border border-line bg-white p-6">
        <h3 className="font-serif text-lg text-ink">Items</h3>
        <ul className="mt-4 flex flex-col divide-y divide-line">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center justify-between py-2 text-sm">
              <span className="text-ink-2">
                {item.name} <span className="font-mono">× {item.quantity}</span>
              </span>
              <span className="font-mono text-ink">{formatPkr(item.lineTotalPkr)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm text-ink-2">
          <span>Subtotal</span>
          <span className="font-mono text-ink">{formatPkr(order.subtotalPkr)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-ink-2">
          <span>Delivery</span>
          <span className="font-mono text-ink">
            {order.deliveryFeePkr === 0 ? "Free" : formatPkr(order.deliveryFeePkr)}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="font-serif text-lg text-ink">Total</span>
          <span className="font-mono text-xl text-ink">{formatPkr(order.totalPkr)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-line bg-white p-6">
        <h3 className="font-serif text-lg text-ink">Shipping</h3>
        <p className="mt-2 text-sm text-ink-2">{order.shippingName}</p>
        <p className="text-sm text-ink-2">{order.shippingPhone}</p>
        <p className="text-sm text-ink-2">{order.shippingAddress}</p>
        <p className="text-sm text-ink-2">
          {order.shippingCity}, {order.shippingProvince}
        </p>
        <p className="mt-2 text-sm text-ink-2">
          Payment: {order.paymentMethod === "bank_transfer" ? "Bank transfer" : "Cash on delivery"}
        </p>
      </div>
    </div>
  );
}
