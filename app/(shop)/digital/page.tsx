import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { getDigitalProducts } from "@/lib/data/digital";
import { formatPkr } from "@/lib/format";
import { Eyebrow } from "@/components/features/Eyebrow";

export const metadata: Metadata = {
  title: "Digital projects | Bizmi",
  description: "Downloadable project packs — source code, wiring diagrams, and video walkthroughs.",
};

export default async function DigitalCatalogPage() {
  const products = await getDigitalProducts();

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Eyebrow>Digital projects</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl text-ink">Build faster with ready-made packs.</h1>
        <p className="mt-2 max-w-xl text-ink-2">
          Source code, wiring diagrams, and video walkthroughs — delivered instantly, yours forever.
        </p>

        {products.length === 0 ? (
          <p className="mt-10 text-ink-2">No digital packs available yet — check back soon.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/digital/${product.slug}`}
                className="flex flex-col rounded-3xl border border-line bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-soft">
                  <FileText className="h-6 w-6 text-yellow" />
                </div>
                <h2 className="mt-4 font-serif text-xl text-ink">{product.name}</h2>
                {product.shortDescription && (
                  <p className="mt-2 line-clamp-3 text-sm text-ink-2">{product.shortDescription}</p>
                )}
                <div className="mt-4 flex flex-1 items-end justify-between">
                  <span className="font-mono text-lg text-ink">{formatPkr(product.pricePkr)}</span>
                  <span className="flex items-center gap-1.5 text-sm text-orange">
                    <Download className="h-4 w-4" />
                    Instant
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
