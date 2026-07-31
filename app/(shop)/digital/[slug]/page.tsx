import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { getDigitalProductBySlug, getDigitalProductSlugsForStaticParams } from "@/lib/data/digital";
import { formatPkr } from "@/lib/format";
import { Breadcrumb } from "@/components/features/Breadcrumb";
import { DigitalProductActions } from "@/components/features/digital/DigitalProductActions";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getDigitalProductSlugsForStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getDigitalProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Bizmi Digital`,
    description: product.shortDescription ?? undefined,
  };
}

export default async function DigitalProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getDigitalProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Digital projects", href: "/digital" }, { label: product.name }]} />

      <section className="py-10 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-2">
          <div className="flex aspect-square items-center justify-center rounded-3xl bg-yellow-soft">
            <FileText className="h-24 w-24 text-yellow" strokeWidth={1} />
          </div>

          <div>
            <h1 className="font-serif text-4xl text-ink">{product.name}</h1>
            {product.shortDescription && <p className="mt-3 text-ink-2">{product.shortDescription}</p>}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-mono text-3xl text-ink">{formatPkr(product.pricePkr)}</span>
              {product.compareAtPricePkr && product.compareAtPricePkr > product.pricePkr && (
                <span className="font-mono text-lg text-ink-2 line-through">
                  {formatPkr(product.compareAtPricePkr)}
                </span>
              )}
            </div>

            <div className="mt-6">
              <DigitalProductActions product={product} />
            </div>

            <p className="mt-4 text-xs text-ink-2">
              Delivered instantly — download link emailed and always available in your account.
            </p>

            {product.longDescription && (
              <div className="mt-10 border-t border-line pt-6">
                <h2 className="font-serif text-lg text-ink">What&apos;s included</h2>
                <p className="mt-2 whitespace-pre-line text-sm text-ink-2">{product.longDescription}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
