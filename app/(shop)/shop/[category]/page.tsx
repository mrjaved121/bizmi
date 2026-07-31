import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProducts,
  getCategories,
  getCategoryBySlug,
  getCategorySlugsForStaticParams,
  type ProductSort,
} from "@/lib/data/products";
import { PageHero } from "@/components/features/PageHero";
import { ProductCard } from "@/components/features/ProductCard";
import { RobotMascot } from "@/components/brand/RobotMascot";
import { cn } from "@/lib/utils";

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

export async function generateStaticParams() {
  const categories = await getCategorySlugsForStaticParams();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: "Shop | Bizmi" };

  return {
    title: `${cat.name} | Bizmi`,
    description: cat.description ?? `Shop ${cat.name} at Bizmi.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { category: categorySlug } = await params;
  const { sort: sortParam } = await searchParams;
  const sort = isProductSort(sortParam) ? sortParam : "featured";

  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getCategories(),
    getProducts({ categorySlug, sort }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Shop"
        headline={category.name}
        subhead={
          category.description ??
          `Showing ${products.length} product${products.length === 1 ? "" : "s"}.`
        }
      />

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/shop"
                className="rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-2 transition-colors hover:border-ink"
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
                    cat.slug === categorySlug
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
                  href={{ pathname: `/shop/${categorySlug}`, query: { sort: s.value } }}
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
