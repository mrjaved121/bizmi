import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MapPinned, FileSignature, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/features/Eyebrow";
import { Reveal } from "@/components/features/Reveal";
import { StatRow } from "@/components/features/StatRow";
import { DepartmentCard } from "@/components/features/DepartmentCard";
import { FaqAccordion } from "@/components/features/FaqAccordion";
import { CtaBanner } from "@/components/features/CtaBanner";
import { TestimonialCarousel } from "@/components/features/schools/TestimonialCarousel";
import { PricingTiers } from "@/components/features/schools/PricingTiers";

export const metadata: Metadata = {
  title: "For Schools | Bizmi",
  description:
    "A robotics program for your school, delivered end-to-end — curriculum, lab setup, teacher training, lesson plans, and student evaluation.",
};

const STATS = [
  { value: "40+", label: "schools" },
  { value: "12k+", label: "students taught" },
  { value: "98%", label: "satisfaction" },
  { value: "4", label: "provinces" },
];

const SERVICES = [
  { href: "/schools/curriculum", color: "orange" as const, title: "Curriculum", subtitle: "Grade-mapped, editable syllabus", featured: true },
  { href: "/schools/lab-setup", color: "blue" as const, title: "Lab setup", subtitle: "Turnkey robotics lab solutions" },
  { href: "/schools/teacher-training", color: "purple" as const, title: "Teacher training", subtitle: "Certified training programs" },
  { href: "/schools/lesson-plans", color: "green" as const, title: "Lesson plans", subtitle: "Ready-to-teach modules" },
  { href: "/schools/evaluation", color: "yellow" as const, title: "Student evaluation", subtitle: "Progress tracking + certificates" },
];

const HOW_IT_WORKS = [
  { icon: Phone, title: "Contact us", description: "Tell us about your school and student count." },
  { icon: MapPinned, title: "Site visit", description: "We assess your space, in person or over video." },
  { icon: FileSignature, title: "Custom plan", description: "A proposal scoped to your budget and goals." },
  { icon: Rocket, title: "Rollout", description: "Lab installed, teachers trained, program live." },
];

const TESTIMONIALS = [
  { quote: "Our students went from afraid of a soldering iron to building line-follower bots in a single term.", attribution: "Head of STEM, Beaconhouse Faisalabad" },
  { quote: "The curriculum meant our teachers didn't need an engineering degree to run the lab confidently.", attribution: "Principal, Roots Millennium Lahore" },
  { quote: "Bizmi handled procurement, installation, and training — we just opened the door on day one.", attribution: "Admin Director, The City School" },
];

const PILOT_SCHOOLS = [
  "Beaconhouse", "LGS", "The City School", "Roots Millennium", "Bloomfield Hall", "Froebel's",
];

const PRICING: import("@/components/features/schools/PricingTiers").PricingTier[] = [
  {
    name: "Starter Lab",
    price: "From Rs 350,000",
    description: "For a single classroom pilot",
    features: ["10-student kit set", "Curriculum access (standalone)", "1-day teacher orientation", "6-month support"],
  },
  {
    name: "Full Program",
    price: "Custom quote",
    description: "The complete end-to-end rollout",
    features: ["Full lab installation", "Grade-mapped curriculum", "Certified teacher training", "Student evaluation dashboard", "1-year support & maintenance"],
    highlighted: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    description: "Multi-campus or district-wide",
    features: ["Multi-campus rollout", "Dedicated account manager", "Volume pricing", "Custom curriculum requests"],
  },
];

const FAQS = [
  { question: "How much does a full program cost?", answer: "It depends on student count and whether you need lab setup from scratch. Book a demo and we'll send a scoped quote within 48 hours." },
  { question: "How is our order delivered?", answer: "Kits ship via TCS/Leopards nationwide; lab installations are handled in person by our team." },
  { question: "Is the curriculum aligned with the SNC?", answer: "Yes — it maps directly to the Single National Curriculum science strands, and is also compatible with O-level pacing." },
  { question: "What languages is material available in?", answer: "English and Urdu, for both student worksheets and teacher notes." },
  { question: "How long does teacher training take?", answer: "A 2-day intensive or an 8-week evening program — both end in the same certification." },
  { question: "Do you offer ongoing support after setup?", answer: "Yes, every Full Program includes a year of support, maintenance visits, and a direct WhatsApp line." },
  { question: "Can we discontinue or downgrade later?", answer: "Yes, our services are billed per term or per year with no long-term lock-in." },
  { question: "Can we upgrade from Starter Lab to Full Program?", answer: "Absolutely — we credit what you've already paid toward the upgrade." },
  { question: "Do teachers get certified?", answer: "Yes, every training track ends in a Bizmi certification your staff can list on their CV." },
  { question: "Do you work with schools outside Faisalabad?", answer: "Yes, we work with schools across all four provinces — our lab setup and training teams travel nationwide." },
];

export default function SchoolsPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>For schools</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-5 text-[clamp(36px,7vw,72px)] font-serif leading-[1] tracking-[-0.03em] text-ink">
              A robotics program, delivered end-to-end.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-2">
              Curriculum, lab setup, teacher training, lesson plans, and
              student evaluation — one partner, instead of five vendors.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
              nativeButton={false}
              render={<Link href="/schools/book-demo" />}
            >
              Book a demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-[1.5px] border-ink px-6 py-3.5 text-ink hover:bg-ink hover:text-white"
              nativeButton={false}
              render={<a href="mailto:hello@bizmi.pk?subject=Brochure%20request" />}
            >
              Download brochure
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <StatRow stats={STATS} />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>What we offer</Eyebrow>
          <h2 className="mt-4 text-[clamp(28px,4.5vw,44px)] font-serif tracking-[-0.02em] text-ink">
            Five services, one partner.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal
                key={service.href}
                delay={Math.min(i * 0.06, 0.24)}
                className={service.featured ? "lg:col-span-2" : undefined}
              >
                <DepartmentCard
                  href={service.href}
                  color={service.color}
                  title={service.title}
                  subtitle={service.subtitle}
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 text-[clamp(28px,4.5vw,44px)] font-serif tracking-[-0.02em] text-ink">
            From first call to open lab.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.title} delay={Math.min(i * 0.08, 0.32)}>
                <div className="rounded-3xl border border-line bg-white p-6">
                  <span className="font-mono text-xs text-orange">
                    0{i + 1}
                  </span>
                  <step.icon className="mt-3 h-6 w-6 text-ink" strokeWidth={1.5} />
                  <h3 className="mt-3 font-serif text-lg text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-2">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Reveal>
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </Reveal>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>Pilot schools</Eyebrow>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {PILOT_SCHOOLS.map((name) => (
              <div
                key={name}
                className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-line bg-white px-3 text-center font-serif text-lg text-ink-2"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-4 text-[clamp(28px,4.5vw,44px)] font-serif tracking-[-0.02em] text-ink">
            Three ways to bring Bizmi in.
          </h2>
          <div className="mt-10">
            <PricingTiers tiers={PRICING} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-serif text-3xl text-ink">
            Frequently asked questions
          </h2>
          <div className="mt-8">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Ready when you are"
        headline="Book a 30-minute demo"
        subhead="See sample kits, get custom pricing, no commitment."
        ctaLabel="Book a demo"
        ctaHref="/schools/book-demo"
      />
    </>
  );
}
