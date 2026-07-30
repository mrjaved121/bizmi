import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/features/Eyebrow";
import { formatPkr } from "@/lib/format";
import { DIGITAL_PACKS } from "@/lib/mock/home";

const COLOR_TO_BORDER: Record<string, string> = {
  blue: "border-blue/40 hover:border-blue",
  red: "border-red/40 hover:border-red",
  purple: "border-purple/40 hover:border-purple",
};

export function DigitalProjectsBlock() {
  return (
    <section className="rounded-t-[40px] bg-ink py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Eyebrow className="text-white/60">04 / Digital projects</Eyebrow>
        <h2 className="mt-4 max-w-xl text-[clamp(32px,5.5vw,56px)] font-serif leading-[1.02] tracking-[-0.02em]">
          Downloadable project packs, ready to build tonight
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {DIGITAL_PACKS.map((pack) => (
            <Link
              key={pack.slug}
              href={`/digital/${pack.slug}`}
              className={`group flex flex-col justify-between rounded-3xl border bg-white/5 p-6 transition-colors ${COLOR_TO_BORDER[pack.color]}`}
            >
              <div>
                <h3 className="font-serif text-2xl">{pack.name}</h3>
                <p className="mt-2 text-sm text-white/60">
                  {pack.description}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="font-mono text-lg">
                  {formatPkr(pack.pricePkr)}
                </span>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110" />
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/digital/kidibit-mega-bundle"
          className="mt-5 flex flex-col items-start justify-between gap-4 rounded-3xl bg-yellow p-6 text-ink transition-transform duration-300 hover:-translate-y-1 sm:flex-row sm:items-center"
        >
          <div>
            <h3 className="font-serif text-2xl">Kidibit Mega Bundle</h3>
            <p className="mt-1 text-sm text-ink-2">
              All three packs together — 30% off individual total
            </p>
          </div>
          <span className="rounded-full bg-ink px-5 py-2.5 font-mono text-sm text-white">
            {formatPkr(6599)}
          </span>
        </Link>
      </div>
    </section>
  );
}
