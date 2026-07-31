import type { Metadata } from "next";
import { FileText, Link2, Download, FileEdit, Video, Eye } from "lucide-react";
import {
  ServicePageLayout,
  IncludedListCard,
} from "@/components/features/schools/ServicePageLayout";
import { Eyebrow } from "@/components/features/Eyebrow";
import { Reveal } from "@/components/features/Reveal";

export const metadata: Metadata = {
  title: "Robotics Lesson Plans | Bizmi",
  description:
    "200+ ready-to-teach robotics lesson plans, aligned to the Bizmi curriculum, downloadable as PDF and editable DOCX, with teacher video walkthroughs.",
};

const FEATURES = [
  { icon: FileText, title: "200+ lessons", description: "A full term's worth, ready on day one." },
  { icon: Link2, title: "Curriculum-aligned", description: "Every lesson maps to a grade and topic." },
  { icon: Download, title: "PDF downloads", description: "Print-ready, no formatting required." },
  { icon: FileEdit, title: "Editable DOCX", description: "Adjust wording or pacing to fit your class." },
  { icon: Video, title: "Video walkthroughs", description: "A teacher demo for every build-based lesson." },
  { icon: Eye, title: "Free sample lesson", description: "Preview one before you commit." },
];

export default function LessonPlansPage() {
  return (
    <ServicePageLayout
      serviceName="Lesson plans"
      color="green"
      headline="Open the folder, teach the lesson."
      description="200+ ready-to-teach lesson plans that map directly to the Bizmi curriculum — PDF, editable DOCX, and a video walkthrough for every hands-on build."
      features={FEATURES}
      relatedServices={[
        { href: "/schools/curriculum", title: "Curriculum", description: "Grade-mapped, editable syllabus" },
        { href: "/schools/teacher-training", title: "Teacher training", description: "Certified training programs" },
        { href: "/schools/evaluation", title: "Student evaluation", description: "Progress tracking + certificates" },
      ]}
    >
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="aspect-[4/3] rounded-3xl bg-green-soft" />
            <div>
              <Eyebrow>Sample lesson</Eyebrow>
              <h2 className="mt-4 font-serif text-2xl text-ink">
                Grade 7, Week 4: &ldquo;Reading a light sensor&rdquo;
              </h2>
              <p className="mt-3 text-ink-2 leading-relaxed">
                A 45-minute lesson covering analog input, breadboard wiring,
                and a short Arduino sketch — includes a printable worksheet,
                a wiring diagram, and a 6-minute teacher walkthrough video.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <IncludedListCard
              title="What's in every lesson pack"
              items={[
                "Learning objective and time estimate",
                "Step-by-step teacher script",
                "Student worksheet (PDF + editable)",
                "Wiring diagram or code sample where relevant",
                "Video walkthrough for build-based lessons",
              ]}
            />
          </Reveal>
        </div>
      </section>
    </ServicePageLayout>
  );
}
