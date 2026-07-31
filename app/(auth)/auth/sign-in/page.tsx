import type { Metadata } from "next";
import { Suspense } from "react";
import { Eyebrow } from "@/components/features/Eyebrow";
import { SignInForm } from "@/components/features/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign in | Bizmi",
};

export default function SignInPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-6">
        <Eyebrow>Account</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl text-ink">Welcome back.</h1>
        <p className="mt-2 text-ink-2">Sign in to see your orders and downloads.</p>

        <div className="mt-10">
          <Suspense fallback={null}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
