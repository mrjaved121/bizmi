import type { Metadata } from "next";
import { Breadcrumb } from "@/components/features/Breadcrumb";
import { Eyebrow } from "@/components/features/Eyebrow";
import { CheckoutForm } from "@/components/features/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Bizmi",
};

export default function CheckoutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />

      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>Checkout</Eyebrow>
          <h1 className="mt-4 font-serif text-4xl text-ink">Almost there.</h1>

          <div className="mt-10">
            <CheckoutForm />
          </div>
        </div>
      </section>
    </>
  );
}
