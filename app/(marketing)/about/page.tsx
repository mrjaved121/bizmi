import type { Metadata } from "next";
import { Sparkles, HandMetal, Unlock } from "lucide-react";
import { PageHero } from "@/components/features/PageHero";
import { StatRow } from "@/components/features/StatRow";
import { CtaBanner } from "@/components/features/CtaBanner";
import { Reveal } from "@/components/features/Reveal";
import { Eyebrow } from "@/components/features/Eyebrow";

export const metadata: Metadata = {
  title: "About | Bizmi",
  description:
    "Bizmi is a Pakistani robotics and STEM company on a mission to put hands-on engineering in reach of every curious kid.",
};

const STATS = [
  { value: "40+", label: "schools" },
  { value: "12k+", label: "students taught" },
  { value: "180+", label: "products" },
  { value: "98%", label: "teacher satisfaction" },
];

const TEAM = [
  { initials: "JA", name: "Jay", role: "Founder", color: "bg-orange-soft text-orange" },
  { initials: "MR", name: "M. Raza", role: "Co-founder", color: "bg-blue-soft text-blue" },
  { initials: "SK", name: "Sana K.", role: "Curriculum Advisor", color: "bg-purple-soft text-purple" },
  { initials: "TA", name: "Tariq A.", role: "Community Lead", color: "bg-green-soft text-green" },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "Curiosity",
    description: "We build for the kid who takes things apart to see how they work.",
    color: "text-orange",
  },
  {
    icon: HandMetal,
    title: "Hands-on",
    description: "No engineering skill was ever built by watching a slideshow.",
    color: "text-blue",
  },
  {
    icon: Unlock,
    title: "Access",
    description: "Great STEM education shouldn't depend on your postal code.",
    color: "text-purple",
  },
];

const TIMELINE = [
  { year: "2022", event: "Started selling Arduino kits out of a Faisalabad garage." },
  { year: "2023", event: "First school partnership — a 30-student pilot lab." },
  { year: "2024", event: "Catalog grows to cover Arduino, Raspberry Pi, and STM32." },
  { year: "2025", event: "Launched digital project packs and the teacher training program." },
  { year: "2026", event: "40+ partner schools across 4 provinces." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Bizmi"
        headline="Curiosity is a Pakistani superpower."
        subhead="We're a Faisalabad-based robotics and STEM company building the kits, curriculum, and training that turn curious kids into engineers — one build at a time."
      />

      <section className="py-8 sm:py-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <Reveal className="aspect-[4/3] rounded-3xl bg-orange-soft" />
          <Reveal delay={0.1}>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl text-ink">
              It started with a soldering iron and a stubborn Arduino.
            </h2>
            <p className="mt-4 text-ink-2 leading-relaxed">
              Bizmi began in a Faisalabad garage in 2022, when our founder
              couldn&apos;t find a single local supplier who could get a
              school a working robotics kit — with a manual in a language
              the teacher actually spoke — inside of two weeks.
            </p>
            <p className="mt-4 text-ink-2 leading-relaxed">
              So we built one. Then a curriculum to go with it. Then a
              training program so teachers didn&apos;t have to learn
              electronics from a manual at all. Today Bizmi is the kit,
              the lesson plan, and the download link — everything a
              school or a curious kid needs, in one place.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <StatRow stats={STATS} />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>The team</Eyebrow>
          <h2 className="mt-4 text-[clamp(28px,4.5vw,44px)] font-serif tracking-[-0.02em] text-ink">
            Small team, hands-on everywhere.
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={Math.min(i * 0.06, 0.24)}>
                <div className="rounded-3xl border border-line p-6 text-center">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full font-serif text-lg ${member.color}`}
                  >
                    {member.initials}
                  </div>
                  <p className="mt-4 font-serif text-lg text-ink">
                    {member.name}
                  </p>
                  <p className="text-sm text-ink-2">{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.08}>
                <value.icon className={`h-8 w-8 ${value.color}`} strokeWidth={1.5} />
                <h3 className="mt-4 font-serif text-2xl text-ink">
                  {value.title}
                </h3>
                <p className="mt-2 text-ink-2 leading-relaxed">
                  {value.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Eyebrow>Our journey</Eyebrow>
          <h2 className="mt-4 text-[clamp(28px,4.5vw,44px)] font-serif tracking-[-0.02em] text-ink">
            2022 → 2026
          </h2>
          <div className="mt-10 flex flex-col gap-6">
            {TIMELINE.map((item, i) => (
              <Reveal
                key={item.year}
                delay={Math.min(i * 0.05, 0.2)}
                className="flex gap-6 border-l-2 border-line pl-6"
              >
                <span className="font-mono text-sm text-orange">
                  {item.year}
                </span>
                <p className="text-ink-2">{item.event}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        headline="Ready to bring Bizmi to your school?"
        ctaLabel="Book a demo"
        ctaHref="/schools/book-demo"
      />
    </>
  );
}
