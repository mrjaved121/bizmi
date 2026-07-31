"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import type { DigitalProductDetail } from "@/lib/data/digital";

export function DigitalProductActions({ product }: { product: DigitalProductDetail }) {
  const addItem = useCart((s) => s.addItem);

  function addToCart() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        categoryHref: "digital",
        color: "yellow",
        pricePkr: product.pricePkr,
        compareAtPricePkr: product.compareAtPricePkr ?? undefined,
        maxQuantity: 1,
        productType: "digital",
      },
      1
    );
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Button
      size="lg"
      onClick={addToCart}
      className="gap-2 rounded-full bg-orange px-8 py-3.5 text-white hover:bg-orange/90"
    >
      <Download className="h-4 w-4" />
      Buy &amp; download
    </Button>
  );
}
