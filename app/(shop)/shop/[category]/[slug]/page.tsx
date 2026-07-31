import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Truck, PackageCheck } from "lucide-react";
import {
  getProductDetail,
  getRelatedProducts,
  getProductSlugsForStaticParams,
} from "@/lib/data/products";
import { Breadcrumb } from "@/components/features/Breadcrumb";
import { Chip, type ChipVariant } from "@/components/features/Chip";
import { ProductCard } from "@/components/features/ProductCard";
import { Reveal } from "@/components/features/Reveal";
import { Eyebrow } from "@/components/features/Eyebrow";
import { ProductActions } from "@/components/features/shop/ProductActions";
import { ProductTabs } from "@/components/features/shop/ProductTabs";
import { COLOR_TO_SOFT_BG, COLOR_TO_ICON_TEXT, BrandIcon } from "@/lib/product-visuals";
import { formatPkr } from "@/lib/format";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getProductSlugsForStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProductDetail(category, slug);
  if (!product) return { title: "Product | Bizmi" };

  return {
    title: `${product.name} | Bizmi`,
    description: product.shortDescription ?? `${product.name} — ${formatPkr(product.pricePkr)} at Bizmi.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const product = await getProductDetail(categorySlug, slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(categorySlug, slug, 4);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Shop", href: "/shop" },
          { label: product.category, href: `/shop/${product.categoryHref}` },
          { label: product.name },
        ]}
      />

      <section className="py-10 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <div
              className={cn(
                "relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl",
                COLOR_TO_SOFT_BG[product.color] ?? "bg-surface-2"
              )}
            >
              <div
                className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/30 blur-3xl"
                aria-hidden
              />
              <BrandIcon
                brand={product.brand}
                className={cn("h-40 w-40", COLOR_TO_ICON_TEXT[product.color] ?? "text-ink-2")}
                strokeWidth={1.25}
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Chip variant={product.color as ChipVariant}>{product.category}</Chip>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-ink">
              {product.name}
            </h1>

            {(product.ageMin || product.difficulty) && (
              <p className="mt-2 text-sm text-ink-2">
                {product.ageMin && product.ageMax ? `Ages ${product.ageMin}–${product.ageMax}` : null}
                {product.ageMin && product.difficulty ? " · " : null}
                {product.difficulty
                  ? product.difficulty[0].toUpperCase() + product.difficulty.slice(1)
                  : null}
              </p>
            )}

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-mono text-3xl text-ink">
                {formatPkr(product.pricePkr)}
              </span>
              {product.compareAtPricePkr && (
                <span className="font-mono text-lg text-muted-foreground line-through">
                  {formatPkr(product.compareAtPricePkr)}
                </span>
              )}
            </div>

            <p className="mt-2">
              {product.inventoryCount > 0 ? (
                product.inventoryCount <= 5 ? (
                  <span className="font-mono text-xs uppercase tracking-wide text-orange">
                    Only {product.inventoryCount} left
                  </span>
                ) : (
                  <span className="font-mono text-xs uppercase tracking-wide text-green">
                    In stock
                  </span>
                )
              ) : (
                <span className="font-mono text-xs uppercase tracking-wide text-red">
                  Out of stock
                </span>
              )}
            </p>

            {product.shortDescription && (
              <p className="mt-5 leading-relaxed text-ink-2">{product.shortDescription}</p>
            )}

            <div className="mt-8">
              <ProductActions productName={product.name} inventoryCount={product.inventoryCount} />
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-ink-2">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-orange" /> Free shipping over Rs 5,000
              </span>
              <span className="flex items-center gap-1.5">
                <PackageCheck className="h-4 w-4 text-orange" /> Cash on delivery available
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <ProductTabs
            description={product.longDescription ?? product.shortDescription}
            specs={product.specs}
            components={product.components}
          />
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Eyebrow>You might also like</Eyebrow>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
