import Link from "next/link";
import { Eyebrow } from "@/components/features/Eyebrow";
import { SENSOR_TILES } from "@/lib/mock/home";
import { cn } from "@/lib/utils";

const COLOR_TO_SOFT_BG_AND_TEXT: Record<string, string> = {
  orange: "bg-orange-soft text-orange",
  blue: "bg-blue-soft text-blue",
  red: "bg-red-soft text-red",
  purple: "bg-purple-soft text-purple",
  green: "bg-green-soft text-green",
  yellow: "bg-yellow-soft text-yellow",
  pink: "bg-pink-soft text-pink",
};

export function SensorsGrid() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Eyebrow>03 / Sensors & shields</Eyebrow>
        <h2 className="mt-4 text-[clamp(32px,5.5vw,56px)] font-serif leading-[1.02] tracking-[-0.02em] text-ink">
          64+ parts to prototype anything
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SENSOR_TILES.map((tile) => (
            <Link
              key={tile.label}
              href="/shop/sensors"
              className={cn(
                "group flex aspect-[4/3] flex-col justify-between rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1",
                COLOR_TO_SOFT_BG_AND_TEXT[tile.color]
              )}
            >
              <span className="font-mono text-xs uppercase tracking-wide opacity-70">
                Sensors
              </span>
              <span className="font-serif text-lg text-ink">
                {tile.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
