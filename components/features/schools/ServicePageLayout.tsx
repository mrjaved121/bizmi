import Link from "next/link";
import { Check, type LucideIcon } from "lucide-react";
import { Breadcrumb } from "@/components/features/Breadcrumb";
import { Eyebrow } from "@/components/features/Eyebrow";
import { Reveal } from "@/components/features/Reveal";
import { CtaBanner } from "@/components/features/CtaBanner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DepartmentColor } from "@/components/features/DepartmentCard";

const COLOR_TO_SOFT_BG_TEXT: Record<string, string> = {
  orange: "bg-orange-soft text-orange",
  blue: "bg-blue-soft text-blue",
  red: "bg-red-soft text-red",
  purple: "bg-purple-soft text-purple",
  green: "bg-green-soft text-green",
  yellow: "bg-yellow-soft text-yellow",
  pink: "bg-pink-soft text-pink",
};

export function ServicePageLayout({
  serviceName,
  color,
  headline,
  description,
  features,
  children,
  relatedServices,
}: {
  serviceName: string;
  color: DepartmentColor;
  headline: string;
  description: string;
  features: { icon: LucideIcon; title: string; description: string }[];
  children?: React.ReactNode;
  relatedServices: { href: string; title: string; description: string }[];
}) {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "For schools", href: "/schools" },
          { label: serviceName },
        ]}
      />

      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <Eyebrow>For schools / {serviceName}</Eyebrow>
          <h1 className="mt-5 text-[clamp(32px,5.5vw,56px)] font-serif leading-[1.02] tracking-[-0.02em] text-ink">
            {headline}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-2">
            {description}
          </p>
          <Button
            size="lg"
            className="mt-6 rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
            nativeButton={false}
            render={<Link href="/schools/book-demo" />}
          >
            Book a demo
          </Button>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>What&apos;s included</Eyebrow>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={Math.min(i * 0.06, 0.24)}>
                <div className="h-full rounded-3xl border border-line p-6">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full",
                      COLOR_TO_SOFT_BG_TEXT[color]
                    )}
                  >
                    <feature.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 font-serif text-lg text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-2">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {children}

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>Related services</Eyebrow>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {relatedServices.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-3xl border border-line p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                <h3 className="font-serif text-lg text-ink">
                  {service.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-2">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        headline="Ready to bring this to your school?"
        ctaLabel="Book a demo"
        ctaHref="/schools/book-demo"
      />
    </>
  );
}

export function IncludedListCard({
  title,
  items,
  className,
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-line bg-white p-6", className)}>
      <h3 className="font-serif text-lg text-ink">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
