import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Eyebrow } from "@/components/features/Eyebrow";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Check your email | Bizmi",
  robots: { index: false },
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-6 text-center">
        <Eyebrow className="justify-center">Account</Eyebrow>
        <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-soft">
          <Mail className="h-8 w-8 text-orange" />
        </div>
        <h1 className="mt-6 font-serif text-3xl text-ink">Check your email</h1>
        <p className="mt-2 text-ink-2">
          {email ? (
            <>
              We sent a confirmation link to <span className="font-medium text-ink">{email}</span>.
            </>
          ) : (
            "We sent you a confirmation link."
          )}{" "}
          Click it to activate your account.
        </p>
        <Button
          variant="outline"
          className="mt-8 rounded-full border-[1.5px] border-ink px-6 py-3.5 text-ink hover:bg-ink hover:text-white"
          nativeButton={false}
          render={<Link href="/auth/sign-in" />}
        >
          Back to sign in
        </Button>
      </div>
    </section>
  );
}
