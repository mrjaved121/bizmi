"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useCart, cartCount, cartSubtotalPkr, cartItemHref } from "@/lib/cart";
import { formatPkr } from "@/lib/format";
import { ProductThumb } from "@/components/features/shop/ProductThumb";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const count = cartCount(items);
  const subtotal = cartSubtotalPkr(items);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={`Cart, ${count} items`} className="relative" />
        }
      >
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange px-1 font-mono text-[10px] text-white">
            {count}
          </span>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart {count > 0 && `(${count})`}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingCart className="h-10 w-10 text-line" strokeWidth={1.5} />
            <p className="mt-4 text-ink-2">Your cart is empty.</p>
            <Button
              className="mt-4 rounded-full bg-orange px-6 text-white hover:bg-orange/90"
              nativeButton={false}
              render={<Link href="/shop" onClick={() => setOpen(false)} />}
            >
              Explore kits
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="flex flex-col divide-y divide-line">
                {items.map((item) => (
                  <li key={item.slug} className="flex gap-3 py-4">
                    <ProductThumb
                      coverImage={item.coverImage}
                      brand={item.brand}
                      name={item.name}
                      color={item.color}
                      className="h-16 w-16 shrink-0 rounded-xl"
                      sizes="64px"
                      iconClassName="h-8 w-8"
                    />

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={cartItemHref(item)}
                          onClick={() => setOpen(false)}
                          className="font-serif text-sm text-ink hover:underline"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.slug)}
                          className="text-ink-2 hover:text-red"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQuantity(item.slug, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-ink-2 hover:text-ink"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-mono text-xs text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQuantity(item.slug, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center text-ink-2 hover:text-ink"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-mono text-sm text-ink">
                          {formatPkr(item.pricePkr * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line px-4 py-4">
              <div className="flex items-center justify-between font-mono text-sm text-ink-2">
                <span>Subtotal</span>
                <span className="text-lg text-ink">{formatPkr(subtotal)}</span>
              </div>
              <Button
                className="mt-4 w-full rounded-full bg-orange py-3.5 text-white hover:bg-orange/90"
                nativeButton={false}
                render={<Link href="/cart" onClick={() => setOpen(false)} />}
              >
                View cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
