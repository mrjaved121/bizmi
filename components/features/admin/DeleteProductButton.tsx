"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct } from "@/lib/actions/admin-products";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${productName}"? This can't be undone.`)) return;

    setDeleting(true);
    const result = await deleteProduct(productId);
    setDeleting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Product deleted.");
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={deleting}
      onClick={handleDelete}
      aria-label={`Delete ${productName}`}
      className="text-ink-2 hover:text-red disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
