import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminProductDetail, getAdminCategoryOptions } from "@/lib/data/admin-products";
import { getDigitalFilesForProduct } from "@/lib/data/admin-digital";
import { getAdminProductImages } from "@/lib/data/admin-product-images";
import { ProductForm } from "@/components/features/admin/ProductForm";
import { DigitalFilesManager } from "@/components/features/admin/DigitalFilesManager";
import { ProductImagesManager } from "@/components/features/admin/ProductImagesManager";

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

  const isDigital = product.productType === "digital";
  const [digitalFiles, images] = await Promise.all([
    isDigital ? getDigitalFilesForProduct(id) : Promise.resolve([]),
    getAdminProductImages(id),
  ]);

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to products
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">{product.name}</h1>

      <div className="mt-6 flex max-w-2xl flex-col gap-6">
        <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
          <ProductForm
            productId={product.id}
            categories={categories}
            defaultValues={{
              productType: product.productType === "digital" ? "digital" : "physical",
              name: product.name,
              nameUr: product.nameUr ?? "",
              slug: product.slug,
              sku: product.sku ?? "",
              categoryId: product.categoryId ?? "",
              brand: product.brand ?? "",
              shortDescription: product.shortDescription ?? "",
              shortDescriptionUr: product.shortDescriptionUr ?? "",
              longDescription: product.longDescription ?? "",
              longDescriptionUr: product.longDescriptionUr ?? "",
              pricePkr: product.pricePkr,
              compareAtPricePkr: product.compareAtPricePkr ?? undefined,
              costPkr: product.costPkr ?? undefined,
              weightGrams: product.weightGrams ?? undefined,
              inventoryCount: product.inventoryCount,
              lowStockThreshold: product.lowStockThreshold ?? undefined,
              ageMin: product.ageMin ?? undefined,
              ageMax: product.ageMax ?? undefined,
              gradeTags: product.gradeTags,
              difficulty: product.difficulty ?? "",
              featured: product.featured,
              isBestseller: product.isBestseller,
              isNew: product.isNew,
              isActive: product.isActive,
              metaTitle: product.metaTitle ?? "",
              metaDescription: product.metaDescription ?? "",
              ogImage: product.ogImage ?? "",
            }}
          />
        </div>

        <ProductImagesManager productId={product.id} images={images} />

        {isDigital && <DigitalFilesManager productId={product.id} files={digitalFiles} />}
      </div>
    </div>
  );
}
