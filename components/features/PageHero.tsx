import { Eyebrow } from "@/components/features/Eyebrow";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  headline,
  subhead,
  align = "left",
  className,
  children,
}: {
  eyebrow: string;
  headline: React.ReactNode;
  subhead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("py-16 sm:py-24", className)}>
      <div
        className={cn(
          "mx-auto max-w-3xl px-6",
          align === "center" && "text-center"
        )}
      >
        <div className={cn(align === "center" && "flex justify-center")}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-5 text-[clamp(36px,6.5vw,64px)] font-serif leading-[1.02] tracking-[-0.02em] text-ink">
          {headline}
        </h1>
        {subhead && (
          <p className="mt-5 text-base leading-relaxed text-ink-2">
            {subhead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
