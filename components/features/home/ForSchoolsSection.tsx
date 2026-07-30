import Link from "next/link";
import { Eyebrow } from "@/components/features/Eyebrow";
import { ArrowBubble } from "@/components/features/ArrowBubble";
import { Reveal } from "@/components/features/Reveal";
import { Button } from "@/components/ui/button";
import { SCHOOL_SERVICES } from "@/lib/mock/home";
import { cn } from "@/lib/utils";

const COLOR_TO_SOFT_BG: Record<string, string> = {
  orange: "bg-orange-soft",
  blue: "bg-blue-soft",
  red: "bg-red-soft",
  purple: "bg-purple-soft",
  green: "bg-green-soft",
  yellow: "bg-yellow-soft",
  pink: "bg-pink-soft",
};

export function ForSchoolsSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>05 / For schools</Eyebrow>
            <h2 className="mt-4 text-[clamp(32px,5.5vw,56px)] font-serif leading-[1.02] tracking-[-0.02em] text-ink">
              A full robotics lab, without the guesswork
            </h2>
          </div>
          <Button
            size="lg"
            className="rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
            nativeButton={false}
            render={<Link href="/schools/book-demo" />}
          >
            Book a demo
          </Button>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SCHOOL_SERVICES.map((service, i) => (
            <Reveal key={service.href} delay={Math.min(i * 0.06, 0.3)}>
              <Link
                href={service.href}
                className={cn(
                  "group flex items-center justify-between gap-4 rounded-3xl border border-line p-6 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
                  COLOR_TO_SOFT_BG[service.color]
                )}
              >
                <div>
                  <h3 className="font-serif text-xl text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-2">
                    {service.description}
                  </p>
                </div>
                <ArrowBubble />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
