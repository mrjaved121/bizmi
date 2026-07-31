import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/features/Reveal";
import { cn } from "@/lib/utils";

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export function PricingTiers({ tiers }: { tiers: PricingTier[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {tiers.map((tier, i) => (
        <Reveal key={tier.name} delay={i * 0.08}>
          <div
            className={cn(
              "flex h-full flex-col rounded-3xl border p-6 sm:p-8",
              tier.highlighted
                ? "border-ink bg-ink text-white"
                : "border-line bg-white"
            )}
          >
            <h3 className="font-serif text-2xl">{tier.name}</h3>
            <p
              className={cn(
                "mt-1 text-sm",
                tier.highlighted ? "text-white/70" : "text-ink-2"
              )}
            >
              {tier.description}
            </p>
            <p className="mt-6 font-mono text-2xl">{tier.price}</p>

            <ul className="mt-6 flex flex-1 flex-col gap-2.5">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      tier.highlighted ? "text-green" : "text-green"
                    )}
                  />
                  <span className={tier.highlighted ? "text-white/90" : "text-ink-2"}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className={cn(
                "mt-8 rounded-full py-3.5",
                tier.highlighted
                  ? "bg-white text-ink hover:bg-white/90"
                  : "bg-orange text-white hover:bg-orange/90"
              )}
              nativeButton={false}
              render={<Link href="/schools/book-demo" />}
            >
              Book a demo
            </Button>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
