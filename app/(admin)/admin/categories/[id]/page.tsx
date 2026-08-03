import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminCategoryDetail, getAdminParentCategoryOptions } from "@/lib/data/admin-categories";
import { CategoryForm } from "@/components/features/admin/CategoryForm";

export const metadata: Metadata = {
  title: "Edit category | Bizmi Admin",
  robots: { index: false },
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, parentOptions] = await Promise.all([
    getAdminCategoryDetail(id),
    getAdminParentCategoryOptions(id),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/categories" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to categories
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">{category.name}</h1>

      <div className="mt-6 max-w-2xl rounded-3xl border border-line bg-white p-6 sm:p-8">
        <CategoryForm
          categoryId={category.id}
          parentOptions={parentOptions}
          defaultValues={{
            name: category.name,
            nameUr: category.nameUr ?? "",
            slug: category.slug,
            description: category.description ?? "",
            parentId: category.parentId ?? "",
            color: category.color ?? "orange",
            orderIndex: category.orderIndex,
            isActive: category.isActive,
          }}
        />
      </div>
    </div>
  );
}
