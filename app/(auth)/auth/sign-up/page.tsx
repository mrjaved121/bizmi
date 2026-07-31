import type { Metadata } from "next";
import { Eyebrow } from "@/components/features/Eyebrow";
import { SignUpForm } from "@/components/features/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create an account | Bizmi",
};

export default function SignUpPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-6">
        <Eyebrow>Account</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl text-ink">Create an account.</h1>
        <p className="mt-2 text-ink-2">Track orders, save downloads, and check out faster.</p>

        <div className="mt-10">
          <SignUpForm />
        </div>
      </div>
    </section>
  );
}
