import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { searchProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/features/ProductCard";
import { RobotMascot } from "@/components/brand/RobotMascot";
import { Eyebrow } from "@/components/features/Eyebrow";

export const metadata: Metadata = {
  title: "Search | Bizmi",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchProducts(query) : [];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Eyebrow>Search</Eyebrow>
        <form method="get" action="/search" className="mt-5 max-w-xl">
          <div className="flex items-center gap-3 rounded-full border border-line bg-white px-5 py-3.5 focus-within:border-ink">
            <SearchIcon className="h-5 w-5 shrink-0 text-ink-2" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for kits, boards, sensors…"
              autoFocus
              className="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted-foreground"
            />
          </div>
        </form>

        {query && (
          <p className="mt-6 text-sm text-ink-2">
            {results.length > 0
              ? `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`
              : `No results for "${query}"`}
          </p>
        )}

        {query && results.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-32">
              <RobotMascot pose="confused" />
            </div>
            <p className="mt-6 font-serif text-2xl text-ink">
              Nothing matched that search.
            </p>
            <p className="mt-2 text-ink-2">
              Try a different term, or browse{" "}
              <Link href="/shop" className="text-orange hover:underline">
                the full catalog
              </Link>
              .
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
