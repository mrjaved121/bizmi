"use client";

import Link from "next/link";
import { Heart, Cpu, CircuitBoard, Microchip, type LucideIcon } from "lucide-react";
import { Chip, type ChipVariant } from "@/components/features/Chip";
import { formatPkr } from "@/lib/format";
import type { ProductCardData } from "@/types/product";
import { cn } from "@/lib/utils";

const COLOR_TO_SOFT_BG: Record<string, string> = {
  orange: "bg-orange-soft",
  blue: "bg-blue-soft",
  red: "bg-red-soft",
  purple: "bg-purple-soft",
  green: "bg-green-soft",
  yellow: "bg-yellow-soft",
  pink: "bg-pink-soft",
};

const COLOR_TO_ICON_TEXT: Record<string, string> = {
  orange: "text-orange",
  blue: "text-blue",
  red: "text-red",
  purple: "text-purple",
  green: "text-green",
  yellow: "text-yellow",
  pink: "text-pink",
};

const BRAND_ICON: Record<string, LucideIcon> = {
  Arduino: Cpu,
  "Raspberry Pi": CircuitBoard,
  STM32: Microchip,
};

export function ProductCard({
  product,
  className,
}: {
  product: ProductCardData;
  className?: string;
}) {
  const chipVariant = product.color as ChipVariant;
  const Icon = (product.brand && BRAND_ICON[product.brand]) || Cpu;

  return (
    <Link
      href={`/shop/${product.categoryHref}/${product.slug}`}
      className={cn(
        "group flex flex-col rounded-3xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
        className
      )}
    >
      <div
        className={cn(
          "relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl",
          COLOR_TO_SOFT_BG[product.color] ?? "bg-surface-2"
        )}
      >
        <div
          className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/30 blur-2xl"
          aria-hidden
        />
        <Icon
          className={cn(
            "h-16 w-16 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3",
            COLOR_TO_ICON_TEXT[product.color] ?? "text-ink-2"
          )}
          strokeWidth={1.5}
        />
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-ink-2/70">
          {product.brand ?? product.category}
        </span>
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-ink-2 transition-colors hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-4 w-4" />
        </button>
        {(product.isNew || product.isBestseller) && (
          <div className="absolute left-3 top-3">
            <Chip variant={product.isNew ? "green" : "orange"}>
              {product.isNew ? "New" : "Bestseller"}
            </Chip>
          </div>
        )}
      </div>

      <div className="mt-4 flex-1">
        <Chip variant={chipVariant}>{product.category}</Chip>
        <h3 className="mt-3 font-serif text-xl text-ink">{product.name}</h3>
        {(product.ageMin || product.difficulty) && (
          <p className="mt-1 text-xs text-ink-2">
            {product.ageMin && product.ageMax
              ? `Ages ${product.ageMin}–${product.ageMax}`
              : null}
            {product.ageMin && product.difficulty ? " · " : null}
            {product.difficulty
              ? product.difficulty[0].toUpperCase() +
                product.difficulty.slice(1)
              : null}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-mono text-lg text-ink">
          {formatPkr(product.pricePkr)}
        </span>
        {product.compareAtPricePkr && (
          <span className="font-mono text-sm text-muted-foreground line-through">
            {formatPkr(product.compareAtPricePkr)}
          </span>
        )}
      </div>
    </Link>
  );
}
