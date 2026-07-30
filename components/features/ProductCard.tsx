import Link from "next/link";
import { Heart } from "lucide-react";
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

export function ProductCard({
  product,
  className,
}: {
  product: ProductCardData;
  className?: string;
}) {
  const chipVariant = product.color as ChipVariant;

  return (
    <Link
      href={`/shop/${product.categoryHref}/${product.slug}`}
      className={cn(
        "group flex flex-col rounded-3xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-2xl",
          COLOR_TO_SOFT_BG[product.color] ?? "bg-surface-2"
        )}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-ink-2">
          {product.brand ?? product.category}
        </span>
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-ink-2 transition-colors hover:text-orange"
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
