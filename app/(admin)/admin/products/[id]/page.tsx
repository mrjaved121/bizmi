import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminProductDetail, getAdminCategoryOptions } from "@/lib/data/admin-products";
import { ProductForm } from "@/components/features/admin/ProductForm";

export const metadata: Metadata = {
  title: "Edit product | Bizmi Admin",
  robots: { index: false },
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProductDetail(id), getAdminCategoryOptions()]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to products
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">{product.name}</h1>

      <div className="mt-6 max-w-2xl rounded-3xl border border-line bg-white p-6 sm:p-8">
        <ProductForm
          productId={product.id}
          categories={categories}
          defaultValues={{
            name: product.name,
            slug: product.slug,
            sku: product.sku ?? "",
            categoryId: product.categoryId ?? "",
            brand: product.brand ?? "",
            shortDescription: product.shortDescription ?? "",
            pricePkr: product.pricePkr,
            compareAtPricePkr: product.compareAtPricePkr ?? undefined,
            inventoryCount: product.inventoryCount,
            difficulty: product.difficulty ?? "",
            featured: product.featured,
            isBestseller: product.isBestseller,
            isNew: product.isNew,
            isActive: product.isActive,
          }}
        />
      </div>
    </div>
  );
}
