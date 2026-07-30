import { Marquee } from "@/components/features/Marquee";
import { SCHOOL_NAMES } from "@/lib/mock/home";

export function SchoolsMarquee() {
  return (
    <section className="border-y border-line bg-surface-2 py-8">
      <p className="mx-auto mb-4 max-w-7xl px-6 text-center font-mono text-xs uppercase tracking-widest text-ink-2">
        Trusted by schools across Pakistan
      </p>
      <Marquee items={SCHOOL_NAMES} />
    </section>
  );
}
