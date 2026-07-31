import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminCategoryOptions } from "@/lib/data/admin-products";
import { ProductForm } from "@/components/features/admin/ProductForm";

export const metadata: Metadata = {
  title: "New product | Bizmi Admin",
  robots: { index: false },
};

export default async function NewProductPage() {
  const categories = await getAdminCategoryOptions();

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to products
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">New product</h1>

      <div className="mt-6 max-w-2xl rounded-3xl border border-line bg-white p-6 sm:p-8">
        <ProductForm
          categories={categories}
          defaultValues={{
            name: "",
            slug: "",
            sku: "",
            categoryId: "",
            brand: "",
            shortDescription: "",
            pricePkr: 0,
            compareAtPricePkr: undefined,
            inventoryCount: 0,
            difficulty: "",
            featured: false,
            isBestseller: false,
            isNew: true,
            isActive: true,
          }}
        />
      </div>
    </div>
  );
}
