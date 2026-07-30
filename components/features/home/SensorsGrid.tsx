import Link from "next/link";
import {
  MonitorSmartphone,
  Joystick,
  Gauge,
  ScanLine,
  Thermometer,
  Eye,
  Bluetooth,
  Fingerprint,
  MapPin,
  Zap,
  Cable,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow } from "@/components/features/Eyebrow";
import { Reveal } from "@/components/features/Reveal";
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

const LABEL_ICON: Record<string, LucideIcon> = {
  Displays: MonitorSmartphone,
  Input: Joystick,
  Motion: Gauge,
  Distance: ScanLine,
  Environment: Thermometer,
  "Motion / presence": Eye,
  Communication: Bluetooth,
  Identification: Fingerprint,
  Location: MapPin,
  "Power / switching": Zap,
  Prototyping: Cable,
  "Shields & storage": Layers,
};

export function SensorsGrid() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <Eyebrow>03 / Sensors & shields</Eyebrow>
          <h2 className="mt-4 text-[clamp(32px,5.5vw,56px)] font-serif leading-[1.02] tracking-[-0.02em] text-ink">
            64+ parts to prototype anything
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SENSOR_TILES.map((tile, i) => {
            const Icon = LABEL_ICON[tile.label] ?? Gauge;
            return (
              <Reveal key={tile.label} delay={Math.min(i * 0.04, 0.3)}>
                <Link
                  href="/shop/sensors"
                  className={cn(
                    "group flex aspect-[4/3] flex-col justify-between rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
                    COLOR_TO_SOFT_BG_AND_TEXT[tile.color]
                  )}
                >
                  <Icon
                    className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.75}
                  />
                  <span className="font-serif text-lg text-ink">
                    {tile.label}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
