"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadDigitalFile, deleteDigitalFile } from "@/lib/actions/admin-digital";
import { Button } from "@/components/ui/button";
import type { AdminDigitalFile } from "@/lib/data/admin-digital";

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DigitalFilesManager({
  productId,
  files,
}: {
  productId: string;
  files: AdminDigitalFile[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleUpload(formData: FormData) {
    setUploading(true);
    const result = await uploadDigitalFile(productId, formData);
    setUploading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("File uploaded.");
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  async function handleDelete(fileId: string) {
    setDeletingId(fileId);
    const result = await deleteDigitalFile(fileId, productId);
    setDeletingId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("File removed.");
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <h2 className="font-serif text-lg text-ink">Digital files</h2>
      <p className="mt-1 text-xs text-ink-2">
        Uploaded here go to a private bucket — buyers only ever get time-limited signed links.
      </p>

      <ul className="mt-4 flex flex-col divide-y divide-line">
        {files.length === 0 && <p className="py-4 text-sm text-ink-2">No files uploaded yet.</p>}
        {files.map((file) => (
          <li key={file.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-ink-2" />
              <div>
                <p className="text-sm text-ink">{file.fileName}</p>
                <p className="text-xs text-ink-2">{formatBytes(file.fileSizeBytes)}</p>
              </div>
            </div>
            <button
              type="button"
              disabled={deletingId === file.id}
              onClick={() => handleDelete(file.id)}
              aria-label={`Remove ${file.fileName}`}
              className="text-ink-2 hover:text-red disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <form action={handleUpload} className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <input
          ref={inputRef}
          type="file"
          name="file"
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
