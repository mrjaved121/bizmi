import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminCategories } from "@/lib/data/admin-categories";
import { Button } from "@/components/ui/button";
import { DeleteCategoryButton } from "@/components/features/admin/DeleteCategoryButton";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Categories | Bizmi Admin",
  robots: { index: false },
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Categories</h1>
        <Button
          className="gap-2 rounded-full bg-orange px-5 text-white hover:bg-orange/90"
          nativeButton={false}
          render={<Link href="/admin/categories/new" />}
        >
          <Plus className="h-4 w-4" />
          New category
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-2">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Slug</th>
              <th className="px-5 py-3 font-normal">Parent</th>
              <th className="px-5 py-3 text-right font-normal">Products</th>
              <th className="px-5 py-3 text-right font-normal">Order</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {categories.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-ink-2">
                  No categories yet.
                </td>
              </tr>
            )}
            {categories.map((category) => (
              <tr key={category.id} className="transition-colors hover:bg-surface-2">
                <td className="px-5 py-3">
                  <Link href={`/admin/categories/${category.id}`} className="text-ink hover:underline">
                    {category.name}
                  </Link>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-ink-2">{category.slug}</td>
                <td className="px-5 py-3 text-ink-2">{category.parentName ?? "—"}</td>
                <td className="px-5 py-3 text-right font-mono text-ink">{category.productCount}</td>
                <td className="px-5 py-3 text-right font-mono text-ink-2">{category.orderIndex}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide",
                      category.isActive ? "bg-green-soft text-green" : "bg-surface-2 text-ink-2"
                    )}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
