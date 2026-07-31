"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductDetailData } from "@/types/product";

export function ProductActions({ product }: { product: ProductDetailData }) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const outOfStock = product.inventoryCount <= 0;

  function addToCart() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        categoryHref: product.categoryHref,
        color: product.color,
        brand: product.brand,
        pricePkr: product.pricePkr,
        compareAtPricePkr: product.compareAtPricePkr,
        maxQuantity: product.inventoryCount,
        productType: "physical",
      },
      quantity
    );
    toast.success(`${quantity} × ${product.name} added to cart`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-line">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-ink-2 hover:text-ink"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-mono text-sm text-ink">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() =>
              setQuantity((q) => Math.min(product.inventoryCount || 99, q + 1))
            }
            className="flex h-11 w-11 items-center justify-center text-ink-2 hover:text-ink"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          size="lg"
          disabled={outOfStock}
          onClick={addToCart}
          className="flex-1 gap-2 rounded-full bg-orange py-3.5 text-white hover:bg-orange/90 disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => setWishlisted((w) => !w)}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
            wishlisted
              ? "border-orange bg-orange-soft text-orange"
              : "border-line text-ink-2 hover:text-orange"
          )}
        >
          <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
        </button>
      </div>
    </div>
  );
}
