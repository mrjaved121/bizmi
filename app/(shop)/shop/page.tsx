import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getCategories, type ProductSort } from "@/lib/data/products";
import { PageHero } from "@/components/features/PageHero";
import { ProductCard } from "@/components/features/ProductCard";
import { RobotMascot } from "@/components/brand/RobotMascot";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop | Bizmi",
  description: "Robotics kits, dev boards, and sensors for schools and curious kids at home.",
};

export const revalidate = 3600;

const SORTS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

function isProductSort(value: string | undefined): value is ProductSort {
  return !!value && SORTS.some((s) => s.value === value);
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const sort = isProductSort(params.sort) ? params.sort : "featured";

  const [products, categories] = await Promise.all([
    getProducts({ categorySlug: params.category, sort }),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === params.category);

  return (
    <>
      <PageHero
        eyebrow="Shop"
        headline={activeCategory ? activeCategory.name : "All products"}
        subhead={`Showing ${products.length} product${products.length === 1 ? "" : "s"}${activeCategory ? ` in ${activeCategory.name}` : ""}.`}
      />

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/shop"
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
                  !params.category
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink-2 hover:border-ink"
                )}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop?category=${cat.slug}`}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
                    params.category === cat.slug
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-ink-2 hover:border-ink"
                  )}
                >
                  {cat.name} ({cat.productCount})
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {SORTS.map((s) => (
                <Link
                  key={s.value}
                  href={{
                    pathname: "/shop",
                    query: {
                      ...(params.category ? { category: params.category } : {}),
                      sort: s.value,
                    },
                  }}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
                    sort === s.value
                      ? "border-orange bg-orange-soft text-orange"
                      : "border-line bg-white text-ink-2 hover:border-ink"
                  )}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="w-32">
                <RobotMascot pose="confused" />
              </div>
              <p className="mt-6 font-serif text-2xl text-ink">
                Nothing here yet — check back soon.
              </p>
              <Link
                href="/shop"
                className="mt-3 text-sm font-medium text-orange hover:underline"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
