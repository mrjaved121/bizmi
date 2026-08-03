"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  uploadProductImage,
  removeProductImage,
  setCoverImage,
  reorderProductGallery,
} from "@/lib/actions/admin-product-images";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdminProductImages } from "@/lib/data/admin-product-images";

export function ProductImagesManager({
  productId,
  images,
}: {
  productId: string;
  images: AdminProductImages;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [busyUrl, setBusyUrl] = useState<string | null>(null);

  async function handleUpload(formData: FormData) {
    setUploading(true);
    const result = await uploadProductImage(productId, formData);
    setUploading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Image uploaded.");
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  async function handleRemove(url: string) {
    setBusyUrl(url);
    const result = await removeProductImage(productId, url);
    setBusyUrl(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Image removed.");
    router.refresh();
  }

  async function handleSetCover(url: string) {
    setBusyUrl(url);
    const result = await setCoverImage(productId, url);
    setBusyUrl(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Cover image updated.");
    router.refresh();
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.gallery.length) return;

    const reordered = [...images.gallery];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    setBusyUrl(images.gallery[index]);
    const result = await reorderProductGallery(productId, reordered);
    setBusyUrl(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <h2 className="font-serif text-lg text-ink">Photos</h2>
      <p className="mt-1 text-xs text-ink-2">
        The starred photo is the cover image shown on the shop and product cards.
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.gallery.length === 0 && <p className="col-span-full py-4 text-sm text-ink-2">No photos yet.</p>}
        {images.gallery.map((url, i) => {
          const isCover = images.coverImage === url;
          const busy = busyUrl === url;
          return (
            <li
              key={url}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-2xl border",
                isCover ? "border-orange" : "border-line"
              )}
            >
              <Image src={url} alt="" fill sizes="200px" className="object-cover" />

              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-1.5">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleSetCover(url)}
                  aria-label={isCover ? "Cover image" : "Set as cover image"}
                  className={cn(
                    "rounded-full p-1.5 shadow-sm backdrop-blur-sm transition-colors disabled:opacity-50",
                    isCover ? "bg-orange text-white" : "bg-white/90 text-ink-2 hover:text-orange"
                  )}
                >
                  <Star className="h-3.5 w-3.5" fill={isCover ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleRemove(url)}
                  aria-label="Remove photo"
                  className="rounded-full bg-white/90 p-1.5 text-ink-2 shadow-sm backdrop-blur-sm transition-colors hover:text-red disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  disabled={busy || i === 0}
                  onClick={() => handleMove(i, -1)}
                  aria-label="Move left"
                  className="rounded-full bg-white/90 p-1.5 text-ink-2 shadow-sm backdrop-blur-sm disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={busy || i === images.gallery.length - 1}
                  onClick={() => handleMove(i, 1)}
                  aria-label="Move right"
                  className="rounded-full bg-white/90 p-1.5 text-ink-2 shadow-sm backdrop-blur-sm disabled:opacity-30"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <form action={handleUpload} className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="image/*"
          required
          className="text-sm text-ink-2 file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-xs file:text-ink"
        />
        <Button
          type="submit"
          disabled={uploading}
          size="sm"
          className="gap-1.5 rounded-full bg-ink px-4 text-white hover:bg-ink/90"
        >
          <Upload className="h-3.5 w-3.5" />
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </form>
    </div>
  );
}
