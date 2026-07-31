import type { Metadata } from "next";
import {
  BarChart3,
  ClipboardCheck,
  Award,
  FolderOpen,
  TrendingUp,
  FileCheck,
} from "lucide-react";
import {
  ServicePageLayout,
  IncludedListCard,
} from "@/components/features/schools/ServicePageLayout";
import { Eyebrow } from "@/components/features/Eyebrow";
import { Reveal } from "@/components/features/Reveal";

export const metadata: Metadata = {
  title: "Student Evaluation & Progress Tracking | Bizmi",
  description:
    "Auto-graded rubrics, per-student and per-class progress dashboards, printable certificates, and portfolio building for robotics programs.",
};

const FEATURES = [
  { icon: ClipboardCheck, title: "Auto-graded rubrics", description: "Consistent scoring, no manual tallying." },
  { icon: BarChart3, title: "Progress dashboards", description: "Per student, per class, per school." },
  { icon: Award, title: "Printable certificates", description: "A milestone kids actually want to frame." },
  { icon: FolderOpen, title: "Portfolio building", description: "Every build a student completes, saved." },
  { icon: TrendingUp, title: "Trend tracking", description: "See growth across a full term or year." },
  { icon: FileCheck, title: "Exportable reports", description: "Share progress with parents or admin easily." },
];

export default function EvaluationPage() {
  return (
    <ServicePageLayout
      serviceName="Student evaluation"
      color="yellow"
      headline="See exactly how much your students are learning."
      description="Auto-graded rubrics, progress dashboards, and printable certificates — so 'they're learning something' turns into a report you can show a parent or a principal."
      features={FEATURES}
      relatedServices={[
        { href: "/schools/lesson-plans", title: "Lesson plans", description: "Ready-to-teach modules" },
        { href: "/schools/curriculum", title: "Curriculum", description: "Grade-mapped, editable syllabus" },
        { href: "/schools/teacher-training", title: "Teacher training", description: "Certified training programs" },
      ]}
    >
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <Eyebrow>Sample report card</Eyebrow>
          </Reveal>
          <Reveal delay={0.08} className="mt-6 rounded-3xl border border-line bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <p className="font-serif text-xl text-ink">Ahmed Raza — Grade 7B</p>
                <p className="text-sm text-ink-2">Term 2 · Robotics & Electronics</p>
              </div>
              <span className="rounded-full bg-yellow-soft px-4 py-1.5 font-mono text-sm text-yellow">
                87% average
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {[
                { skill: "Circuit reading", score: 92 },
                { skill: "Arduino programming", score: 84 },
                { skill: "Sensor integration", score: 78 },
                { skill: "Project completion", score: 95 },
              ].map((row) => (
                <div key={row.skill} className="flex items-center gap-4">
                  <span className="w-40 shrink-0 text-sm text-ink-2">
                    {row.skill}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-yellow"
                      style={{ width: `${row.score}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-sm text-ink">
                    {row.score}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.16} className="mt-10">
            <IncludedListCard
              title="What schools get access to"
              items={[
                "A dashboard per classroom, updated automatically as work is graded",
                "Individual student portfolios of every completed build",
                "Printable certificates for term-end milestones",
                "Exportable PDF reports for parent-teacher meetings",
              ]}
            />
          </Reveal>
        </div>
      </section>
    </ServicePageLayout>
  );
}
