import type { Metadata } from "next";
import {
  ClipboardList,
  Package,
  Wrench,
  ShieldCheck,
  GraduationCap,
  Calendar,
} from "lucide-react";
import {
  ServicePageLayout,
  IncludedListCard,
} from "@/components/features/schools/ServicePageLayout";
import { Eyebrow } from "@/components/features/Eyebrow";
import { Reveal } from "@/components/features/Reveal";

export const metadata: Metadata = {
  title: "Robotics Lab Setup for Schools | Bizmi",
  description:
    "Turnkey robotics lab setup — site survey, equipment, installation, and safety compliance. From order to opening in 6-8 weeks.",
};

const FEATURES = [
  { icon: ClipboardList, title: "Site survey", description: "We assess your space before recommending a layout." },
  { icon: Package, title: "Equipment list", description: "Every board, sensor, and tool your lab needs." },
  { icon: Wrench, title: "Procurement & installation", description: "We source, deliver, and set everything up." },
  { icon: ShieldCheck, title: "Safety compliance", description: "Wiring, storage, and workstations done to code." },
  { icon: GraduationCap, title: "Teacher orientation", description: "A walkthrough session before students arrive." },
  { icon: Calendar, title: "Ongoing support", description: "Maintenance visits and a direct support line." },
];

const INVENTORY_EXAMPLE = [
  { item: "Student workstations (6-seat)", qty: "5" },
  { item: "Arduino UNO R3 kits", qty: "30" },
  { item: "Raspberry Pi 4 kits", qty: "10" },
  { item: "Sensor & prototyping bundle", qty: "30" },
  { item: "Storage & charging cabinet", qty: "2" },
];

export default function LabSetupPage() {
  return (
    <ServicePageLayout
      serviceName="Lab setup"
      color="blue"
      headline="A full robotics lab, installed and ready to teach in."
      description="From an empty classroom to a working lab — we handle the survey, the equipment list, procurement, installation, and safety compliance."
      features={FEATURES}
      relatedServices={[
        { href: "/schools/curriculum", title: "Curriculum", description: "Grade-mapped, editable syllabus" },
        { href: "/schools/teacher-training", title: "Teacher training", description: "Certified training programs" },
        { href: "/schools/evaluation", title: "Student evaluation", description: "Progress tracking + certificates" },
      ]}
    >
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <Eyebrow>Sample inventory</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl text-ink">
              What a 30-student lab looks like
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-8 overflow-hidden rounded-3xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 font-mono text-xs uppercase tracking-wide text-ink-2">
                <tr>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {INVENTORY_EXAMPLE.map((row) => (
                  <tr key={row.item}>
                    <td className="px-6 py-4 font-medium text-ink">{row.item}</td>
                    <td className="px-6 py-4 text-ink-2">{row.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Reveal>
              <IncludedListCard
                title="Timeline"
                items={[
                  "Week 1-2: site survey and equipment plan",
                  "Week 3-6: procurement and delivery",
                  "Week 7-8: installation, safety check, and teacher orientation",
                ]}
              />
            </Reveal>
            <Reveal delay={0.06}>
              <IncludedListCard
                title="Warranty & support"
                items={[
                  "1-year hardware warranty on all installed equipment",
                  "Two maintenance visits included per year",
                  "Direct WhatsApp line to our support team",
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
