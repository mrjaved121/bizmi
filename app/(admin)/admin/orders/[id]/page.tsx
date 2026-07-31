import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminOrderDetail } from "@/lib/data/admin-orders";
import { formatPkr } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/order-status";
import { OrderStatusForm } from "@/components/features/admin/OrderStatusForm";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order detail | Bizmi Admin",
  robots: { index: false },
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrderDetail(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-mono text-2xl text-ink">{order.orderNumber}</h1>
        <span
          className={cn(
            "rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wide",
            ORDER_STATUS_STYLE[order.status] ?? "bg-surface-2 text-ink-2"
          )}
        >
          {ORDER_STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-serif text-lg text-ink">Items</h2>
            <ul className="mt-4 flex flex-col divide-y divide-line">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-ink-2">
                    {item.name} <span className="font-mono">× {item.quantity}</span>{" "}
                    <span className="text-xs">@ {formatPkr(item.unitPricePkr)}</span>
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

          <div className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-serif text-lg text-ink">Customer &amp; shipping</h2>
            <p className="mt-2 text-sm text-ink-2">{order.customerName}</p>
            <p className="text-sm text-ink-2">{order.shippingPhone}</p>
            {order.guestEmail && <p className="text-sm text-ink-2">{order.guestEmail}</p>}
            <p className="text-sm text-ink-2">{order.shippingAddress}</p>
            <p className="text-sm text-ink-2">
              {order.shippingCity}, {order.shippingProvince}
            </p>
            {order.notes && <p className="mt-2 text-sm text-ink-2">Notes: {order.notes}</p>}
            <p className="mt-2 text-sm text-ink-2">
              Payment: {order.paymentMethod === "bank_transfer" ? "Bank transfer" : "Cash on delivery"}
            </p>
          </div>

          {order.statusLog.length > 0 && (
            <div className="rounded-3xl border border-line bg-white p-6">
              <h2 className="font-serif text-lg text-ink">History</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {order.statusLog.map((entry, i) => (
                  <li key={i} className="text-sm text-ink-2">
                    <span className="font-mono text-ink">{ORDER_STATUS_LABEL[entry.toStatus ?? ""] ?? entry.toStatus}</span>
                    {" — "}
                    {new Date(entry.createdAt).toLocaleString("en-PK")}
                    {entry.note && <span className="block text-xs">{entry.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-serif text-lg text-ink">Update order</h2>
          <div className="mt-4">
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status}
              trackingNumber={order.trackingNumber}
              courier={order.courier}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
