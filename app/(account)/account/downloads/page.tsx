import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { getMyDownloads } from "@/lib/data/account";

export const metadata: Metadata = {
  title: "Your downloads | Bizmi",
  robots: { index: false },
};

export default async function AccountDownloadsPage() {
  const downloads = await getMyDownloads();

  if (downloads.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white p-10 text-center">
        <FileText className="mx-auto h-8 w-8 text-ink-2" />
        <p className="mt-4 text-ink-2">You haven&apos;t bought any digital packs yet.</p>
        <Link href="/digital" className="mt-4 inline-block text-sm text-ink underline underline-offset-2">
          Browse digital projects
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-line rounded-3xl border border-line bg-white">
      {downloads.map((item) => (
        <li key={item.productId} className="p-5">
          <p className="font-serif text-lg text-ink">{item.productName}</p>
          <p className="mt-1 text-xs text-ink-2">
            Purchased{" "}
            {new Date(item.grantedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.files.length === 0 ? (
              <span className="text-xs text-ink-2">Files being prepared — check back soon.</span>
            ) : (
              item.files.map((file) => (
                <a
                  key={file.url}
                  href={file.url}
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange-soft px-3 py-1.5 text-xs text-orange hover:bg-orange hover:text-white"
                >
                  <Download className="h-3 w-3" />
                  {file.fileName}
                </a>
              ))
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
