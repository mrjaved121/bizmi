"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingCart, Truck, ShieldCheck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useCart, cartCount, cartSubtotalPkr } from "@/lib/cart";
import { formatPkr } from "@/lib/format";
import { BrandIcon, COLOR_TO_SOFT_BG, COLOR_TO_ICON_TEXT } from "@/lib/product-visuals";
import { Button } from "@/components/ui/button";
import { RobotMascot } from "@/components/brand/RobotMascot";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const count = cartCount(items);
  const subtotal = cartSubtotalPkr(items);

  if (items.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto flex max-w-lg flex-col items-center px-6 text-center">
          <div className="w-40">
            <RobotMascot pose="confused" />
          </div>
          <h1 className="mt-6 font-serif text-3xl text-ink">Your cart is empty.</h1>
          <p className="mt-2 text-ink-2">Let&apos;s find something worth building.</p>
          <Button
            size="lg"
            className="mt-8 rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
            nativeButton={false}
            render={<Link href="/shop" />}
          >
            Explore kits
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="font-serif text-4xl text-ink">
          Your cart <span className="text-ink-2">({count})</span>
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
          <ul className="flex flex-col divide-y divide-line rounded-3xl border border-line bg-white">
            {items.map((item) => (
              <li key={item.slug} className="flex gap-4 p-5">
                <Link
                  href={`/shop/${item.categoryHref}/${item.slug}`}
                  className={cn(
                    "flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl",
                    COLOR_TO_SOFT_BG[item.color] ?? "bg-surface-2"
                  )}
                >
                  <BrandIcon
                    brand={item.brand}
                    className={cn("h-10 w-10", COLOR_TO_ICON_TEXT[item.color] ?? "text-ink-2")}
                    strokeWidth={1.5}
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/shop/${item.categoryHref}/${item.slug}`}
                        className="font-serif text-lg text-ink hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 font-mono text-sm text-ink-2">
                        {formatPkr(item.pricePkr)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.slug)}
                      className="text-ink-2 hover:text-red"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(item.slug, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center text-ink-2 hover:text-ink"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono text-sm text-ink">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity(item.slug, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center text-ink-2 hover:text-ink"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-mono text-base text-ink">
                      {formatPkr(item.pricePkr * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-line bg-white p-6">
              <h2 className="font-serif text-xl text-ink">Order summary</h2>

              <div className="mt-4 flex items-center justify-between text-sm text-ink-2">
                <span>Subtotal</span>
                <span className="font-mono text-ink">{formatPkr(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-2">
                Delivery fee calculated at checkout, based on your city.
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="font-serif text-lg text-ink">Total</span>
                <span className="font-mono text-xl text-ink">{formatPkr(subtotal)}</span>
              </div>

              <Button
                size="lg"
                className="mt-6 w-full gap-2 rounded-full bg-orange py-3.5 text-white hover:bg-orange/90"
                onClick={() =>
                  toast.info("Checkout launches in the next phase — your cart is saved.")
                }
              >
                <ShoppingCart className="h-4 w-4" />
                Proceed to checkout
              </Button>

              <p className="mt-3 text-center text-xs text-ink-2">
                Guest checkout available — no account required.
              </p>

              <div className="mt-6 flex flex-col gap-2 border-t border-line pt-4">
                <span className="flex items-center gap-2 text-sm text-ink-2">
                  <Wallet className="h-4 w-4 text-orange" />
                  Cash on delivery
                </span>
                <span className="flex items-center gap-2 text-sm text-ink-2">
                  <Truck className="h-4 w-4 text-orange" />
                  Nationwide shipping
                </span>
                <span className="flex items-center gap-2 text-sm text-ink-2">
                  <ShieldCheck className="h-4 w-4 text-orange" />
                  Secure checkout
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
