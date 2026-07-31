import type { Metadata } from "next";
import {
  Users,
  Award,
  Clock,
  Headphones,
  UserCheck,
  Presentation,
} from "lucide-react";
import {
  ServicePageLayout,
  IncludedListCard,
} from "@/components/features/schools/ServicePageLayout";
import { Eyebrow } from "@/components/features/Eyebrow";
import { Reveal } from "@/components/features/Reveal";

export const metadata: Metadata = {
  title: "Teacher Training for Robotics | Bizmi",
  description:
    "Certified robotics teacher training — beginner to specialization tracks, 2-day intensives or 8-week programs, with ongoing support.",
};

const FEATURES = [
  { icon: Users, title: "4 training tracks", description: "Beginner, Intermediate, Advanced, Specialization." },
  { icon: Clock, title: "Flexible duration", description: "2-day intensive or an 8-week evening program." },
  { icon: Award, title: "Certification", description: "A recognized certificate on completion." },
  { icon: Headphones, title: "Ongoing support", description: "A direct line to our trainers after the course ends." },
  { icon: UserCheck, title: "Credentialed trainers", description: "Engineers who've taught 500+ teachers." },
  { icon: Presentation, title: "Hands-on format", description: "Every session ends with a build, not just slides." },
];

const SCHEDULE = [
  { time: "9:00 - 10:30", activity: "Electronics fundamentals refresher" },
  { time: "10:45 - 12:30", activity: "Hands-on: build and program a line-follower" },
  { time: "1:30 - 3:00", activity: "Classroom management for a robotics lab" },
  { time: "3:15 - 4:30", activity: "Practice teaching a sample lesson, with feedback" },
];

export default function TeacherTrainingPage() {
  return (
    <ServicePageLayout
      serviceName="Teacher training"
      color="purple"
      headline="Confident teachers make a robotics program stick."
      description="A certified training program that takes a teacher from 'never touched a breadboard' to running a classroom build session — with ongoing support after the course ends."
      features={FEATURES}
      relatedServices={[
        { href: "/schools/curriculum", title: "Curriculum", description: "Grade-mapped, editable syllabus" },
        { href: "/schools/lesson-plans", title: "Lesson plans", description: "Ready-to-teach modules" },
        { href: "/schools/lab-setup", title: "Lab setup", description: "Turnkey robotics lab solutions" },
      ]}
    >
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <Eyebrow>Sample training day</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl text-ink">
              A day inside the Beginner track
            </h2>
          </Reveal>
          <div className="mt-8 flex flex-col gap-4">
            {SCHEDULE.map((row, i) => (
              <Reveal
                key={row.time}
                delay={Math.min(i * 0.06, 0.24)}
                className="flex gap-6 rounded-2xl border border-line bg-white p-5"
              >
                <span className="w-32 shrink-0 font-mono text-sm text-purple">
                  {row.time}
                </span>
                <span className="text-ink-2">{row.activity}</span>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Reveal>
              <IncludedListCard
                title="Duration options"
                items={[
                  "2-day intensive — full immersion, weekend format",
                  "8-week evening program — one 90-minute session per week",
                  "Both tracks end in the same certification",
                ]}
              />
            </Reveal>
            <Reveal delay={0.06}>
              <IncludedListCard
                title="Ongoing support"
                items={[
                  "WhatsApp group with our trainers, all term",
                  "One free refresher session per year",
                  "Priority booking for the next specialization track",
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
