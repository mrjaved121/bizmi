import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/features/Reveal";
import { cn } from "@/lib/utils";

export function CtaBanner({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  color = "orange",
  roundedTop = true,
  className,
}: {
  eyebrow?: string;
  headline: React.ReactNode;
  subhead?: string;
  ctaLabel: string;
  ctaHref: string;
  color?: "orange" | "ink";
  roundedTop?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "py-16 text-center sm:py-24",
        color === "orange" ? "bg-orange text-white" : "bg-ink text-white",
        roundedTop && "rounded-t-[40px]",
        className
      )}
    >
      <Reveal className="mx-auto max-w-2xl px-6">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-widest text-white/70">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-3 text-[clamp(28px,4.5vw,48px)] font-serif leading-[1.05] tracking-[-0.02em]">
          {headline}
        </h2>
        {subhead && <p className="mt-4 text-white/80">{subhead}</p>}
        <Button
          size="lg"
          className="mt-8 rounded-full bg-white px-6 py-3.5 text-ink hover:bg-white/90"
          nativeButton={false}
          render={<Link href={ctaHref} />}
        >
          {ctaLabel}
        </Button>
      </Reveal>
    </section>
  );
}
