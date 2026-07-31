import type { Metadata } from "next";
import { Video, Package2, Tag, ShieldOff } from "lucide-react";
import { Breadcrumb } from "@/components/features/Breadcrumb";
import { Eyebrow } from "@/components/features/Eyebrow";
import { Reveal } from "@/components/features/Reveal";
import { BookDemoForm } from "@/components/features/schools/BookDemoForm";

export const metadata: Metadata = {
  title: "Book a Demo | Bizmi",
  description:
    "See Bizmi in your school — a 30-minute video call, sample kits, and custom pricing. No commitment.",
};

const BENEFITS = [
  { icon: Video, label: "30-min video call" },
  { icon: Package2, label: "See sample kits" },
  { icon: Tag, label: "Custom pricing" },
  { icon: ShieldOff, label: "No commitment" },
];

export default function BookDemoPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "For schools", href: "/schools" }, { label: "Book a demo" }]} />

      <section className="py-10 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[2fr_3fr] lg:items-start">
          <Reveal>
            <Eyebrow>Book a demo</Eyebrow>
            <h1 className="mt-5 text-[clamp(32px,5.5vw,52px)] font-serif leading-[1.02] tracking-[-0.02em] text-ink">
              See Bizmi in your school.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-2">
              Tell us a bit about your school and we&apos;ll set up a short
              call — no sales pressure, just a look at what a Bizmi robotics
              program actually looks like.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit.label} className="flex items-center gap-3">
                  <benefit.icon className="h-5 w-5 text-orange" strokeWidth={1.75} />
                  <span className="text-ink-2">{benefit.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <BookDemoForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
