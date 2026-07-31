import type { Metadata } from "next";
import {
  BookOpen,
  CalendarCheck,
  ClipboardCheck,
  Library,
  StickyNote,
  PenSquare,
} from "lucide-react";
import {
  ServicePageLayout,
  IncludedListCard,
} from "@/components/features/schools/ServicePageLayout";
import { Eyebrow } from "@/components/features/Eyebrow";
import { Reveal } from "@/components/features/Reveal";

export const metadata: Metadata = {
  title: "Robotics Curriculum for Schools | Bizmi",
  description:
    "Grade-mapped robotics curriculum for grades 5-12, aligned to the SNC, with weekly lesson plans, rubrics, and a digital resource library.",
};

const FEATURES = [
  { icon: BookOpen, title: "Grade-mapped syllabus", description: "A clear progression from Grade 5 through 12." },
  { icon: CalendarCheck, title: "Weekly lesson plans", description: "Ready to teach, no extra prep required." },
  { icon: ClipboardCheck, title: "Assessment rubrics", description: "Consistent grading across every classroom." },
  { icon: Library, title: "Digital resources library", description: "Slides, videos, and worksheets included." },
  { icon: StickyNote, title: "Teacher notes", description: "Context and talking points for every lesson." },
  { icon: PenSquare, title: "Editable & customizable", description: "Adapt the pacing to your school's calendar." },
];

const GRADE_MAP = [
  { grade: "Grade 5", topic: "Circuits & electricity basics" },
  { grade: "Grade 6", topic: "Sensors & simple automation" },
  { grade: "Grade 7", topic: "Arduino programming fundamentals" },
  { grade: "Grade 8", topic: "Robotics builds & motor control" },
  { grade: "Grades 9-10", topic: "Raspberry Pi & applied electronics" },
  { grade: "Grades 11-12", topic: "STM32, embedded systems, capstone project" },
];

export default function CurriculumPage() {
  return (
    <ServicePageLayout
      serviceName="Curriculum"
      color="orange"
      headline="A robotics curriculum your teachers can pick up and teach."
      description="Grade-mapped, editable, and aligned to Pakistan's national curriculum — so your school gets a real STEM program, not a pile of loose worksheets."
      features={FEATURES}
      relatedServices={[
        { href: "/schools/lab-setup", title: "Lab setup", description: "Turnkey robotics lab solutions" },
        { href: "/schools/teacher-training", title: "Teacher training", description: "Certified training programs" },
        { href: "/schools/lesson-plans", title: "Lesson plans", description: "Ready-to-teach modules" },
      ]}
    >
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <Eyebrow>Curriculum preview</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl text-ink">
              Grade → topic mapping
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-8 overflow-hidden rounded-3xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 font-mono text-xs uppercase tracking-wide text-ink-2">
                <tr>
                  <th className="px-6 py-3">Grade</th>
                  <th className="px-6 py-3">Focus topic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {GRADE_MAP.map((row) => (
                  <tr key={row.grade}>
                    <td className="px-6 py-4 font-medium text-ink">{row.grade}</td>
                    <td className="px-6 py-4 text-ink-2">{row.topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Reveal>
              <IncludedListCard
                title="Aligned to Pakistan's SNC + O-levels"
                items={[
                  "Maps directly to Single National Curriculum science strands",
                  "Compatible with O-level Computer Science / Physics pacing",
                  "Vocabulary and units taught in both English and Urdu",
                ]}
              />
            </Reveal>
            <Reveal delay={0.06}>
              <IncludedListCard
                title="Pricing"
                items={[
                  "Included with the Full Program tier",
                  "Also available standalone for schools with their own kits",
                  "Custom pricing for 500+ student rollouts",
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
