import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourseForm } from "@/components/features/admin/CourseForm";

export const metadata: Metadata = {
  title: "New course | Bizmi Admin",
  robots: { index: false },
};

export default function NewCoursePage() {
  return (
    <div>
      <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to courses
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">New course</h1>

      <div className="mt-6 max-w-2xl rounded-3xl border border-line bg-white p-6 sm:p-8">
        <CourseForm
          defaultValues={{
            title: "",
            slug: "",
            description: "",
            category: "",
            difficulty: "",
            durationWeeks: undefined,
            pricePkr: 0,
            instructorName: "",
            instructorBio: "",
            isPublished: false,
          }}
        />
      </div>
    </div>
  );
}
