export function Testimonial() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-[clamp(24px,4vw,40px)] font-serif leading-tight tracking-[-0.01em] text-ink">
          Our students went from{" "}
          <span className="text-orange">afraid of a soldering iron</span> to{" "}
          <span className="text-blue">building line-follower bots</span> in a
          single term — Kidibit made the{" "}
          <span className="text-purple">curriculum</span> and{" "}
          <span className="text-green">training</span> painless.
        </p>
        <p className="mt-6 font-mono text-sm uppercase tracking-wide text-ink-2">
          — Head of STEM, Beaconhouse Faisalabad
        </p>
      </div>
    </section>
  );
}
