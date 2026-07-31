import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, PhoneCall, Truck, PackageCheck } from "lucide-react";
import { getOrderByNumberAndToken } from "@/lib/data/orders";
import { RobotMascot } from "@/components/brand/RobotMascot";
import { Button } from "@/components/ui/button";
import { formatPkr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Order confirmed | Bizmi",
  robots: { index: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; token?: string }>;
}) {
  const { order: orderNumber, token } = await searchParams;

  if (!orderNumber || !token) {
    notFound();
  }

  const order = await getOrderByNumberAndToken(orderNumber, token);

  if (!order) {
    notFound();
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-32">
            <RobotMascot pose="waving" />
          </div>
          <CheckCircle2 className="mt-2 h-8 w-8 text-green" />
          <h1 className="mt-4 font-serif text-3xl text-ink">
            Thanks — order {order.orderNumber} is in.
          </h1>
          <p className="mt-2 text-ink-2">
            {order.paymentMethod === "bank_transfer"
              ? "Share your payment receipt on WhatsApp and we'll confirm shortly."
              : "We'll call to confirm before dispatch."}
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-line bg-white p-6">
          <h2 className="font-serif text-lg text-ink">Order summary</h2>
          <ul className="mt-4 flex flex-col gap-2 divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.name} className="flex items-center justify-between py-2 text-sm">
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
          {order.shippingCity && (
            <p className="mt-4 text-sm text-ink-2">
              Shipping to {order.shippingName} — {order.shippingCity}, {order.shippingProvince}
            </p>
          )}
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-lg text-ink">What happens next</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-4">
              <CheckCircle2 className="h-5 w-5 text-green" />
              <p className="mt-2 font-serif text-sm text-ink">Now</p>
              <p className="text-xs text-ink-2">We received your order</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <PhoneCall className="h-5 w-5 text-orange" />
              <p className="mt-2 font-serif text-sm text-ink">Soon</p>
              <p className="text-xs text-ink-2">We&apos;ll call to confirm</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <Truck className="h-5 w-5 text-ink-2" />
              <p className="mt-2 font-serif text-sm text-ink">24–48h</p>
              <p className="text-xs text-ink-2">Ships via courier</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-[1.5px] border-ink px-6 py-3.5 text-ink hover:bg-ink hover:text-white"
            nativeButton={false}
            render={<Link href="/shop" />}
          >
            <PackageCheck className="h-4 w-4" />
            Keep shopping
          </Button>
        </div>
      </div>
    </section>
  );
}
