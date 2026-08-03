import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminParentCategoryOptions } from "@/lib/data/admin-categories";
import { CategoryForm } from "@/components/features/admin/CategoryForm";

export const metadata: Metadata = {
  title: "New category | Bizmi Admin",
  robots: { index: false },
};

export default async function NewCategoryPage() {
  const parentOptions = await getAdminParentCategoryOptions();

  return (
    <div>
      <Link href="/admin/categories" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to categories
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">New category</h1>

      <div className="mt-6 max-w-2xl rounded-3xl border border-line bg-white p-6 sm:p-8">
        <CategoryForm
          parentOptions={parentOptions}
          defaultValues={{
            name: "",
            nameUr: "",
            slug: "",
            description: "",
            parentId: "",
            color: "orange",
            orderIndex: 0,
            isActive: true,
          }}
        />
      </div>
    </div>
  );
}
