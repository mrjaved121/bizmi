import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminProducts } from "@/lib/data/admin-products";
import { formatPkr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products | Bizmi Admin",
  robots: { index: false },
};

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Products</h1>
        <Button
          className="gap-2 rounded-full bg-orange px-5 text-white hover:bg-orange/90"
          nativeButton={false}
          render={<Link href="/admin/products/new" />}
        >
          <Plus className="h-4 w-4" />
          New product
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-2">
              <th className="px-5 py-3 font-normal">Product</th>
              <th className="px-5 py-3 font-normal">Category</th>
              <th className="px-5 py-3 font-normal">SKU</th>
              <th className="px-5 py-3 text-right font-normal">Price</th>
              <th className="px-5 py-3 text-right font-normal">Stock</th>
              <th className="px-5 py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-2">
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-surface-2">
                <td className="px-5 py-3">
                  <Link href={`/admin/products/${product.id}`} className="text-ink hover:underline">
                    {product.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink-2">{product.categoryName ?? "—"}</td>
                <td className="px-5 py-3 font-mono text-xs text-ink-2">{product.sku ?? "—"}</td>
                <td className="px-5 py-3 text-right font-mono text-ink">{formatPkr(product.pricePkr)}</td>
                <td
                  className={cn(
                    "px-5 py-3 text-right font-mono",
                    product.inventoryCount <= 5 ? "text-red" : "text-ink"
                  )}
                >
                  {product.inventoryCount}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide",
                      product.isActive ? "bg-green-soft text-green" : "bg-surface-2 text-ink-2"
                    )}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
