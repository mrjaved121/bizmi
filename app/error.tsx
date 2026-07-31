"use client";

import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { RobotMascot } from "@/components/brand/RobotMascot";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="px-6 py-6">
        <Link href="/" aria-label="Bizmi home">
          <BrandMark size="md" />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex max-w-lg flex-col items-center text-center">
          <div className="w-40">
            <RobotMascot pose="broken" />
          </div>
          <h1 className="mt-6 font-serif text-3xl text-ink">
            Something broke on our end.
          </h1>
          <p className="mt-3 text-ink-2">
            It&apos;s been logged — try again in a moment.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={reset}
              className="rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
            >
              Try again
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-[1.5px] border-ink px-6 py-3.5 text-ink hover:bg-ink hover:text-white"
              nativeButton={false}
              render={<Link href="/" />}
            >
              Back to home
            </Button>
          </div>
          <p className="mt-6 text-sm text-ink-2">
            Still stuck?{" "}
            <a
              href="https://wa.me/923138979696?text=Hi%20Bizmi%2C%20I%20hit%20an%20error%20on%20the%20site"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-orange hover:underline"
            >
              Message us on WhatsApp
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
