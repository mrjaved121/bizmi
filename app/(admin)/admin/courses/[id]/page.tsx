import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminCourseDetail, getAdminCourseLessons } from "@/lib/data/admin-courses";
import { CourseForm } from "@/components/features/admin/CourseForm";
import { LessonManager } from "@/components/features/admin/LessonManager";

export const metadata: Metadata = {
  title: "Edit course | Bizmi Admin",
  robots: { index: false },
};

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [course, lessons] = await Promise.all([getAdminCourseDetail(id), getAdminCourseLessons(id)]);

  if (!course) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to courses
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">{course.title}</h1>

      <div className="mt-6 flex max-w-2xl flex-col gap-6">
        <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
          <CourseForm
            courseId={course.id}
            defaultValues={{
              title: course.title,
              slug: course.slug,
              description: course.description ?? "",
              category: course.category ?? "",
              difficulty: course.difficulty ?? "",
              durationWeeks: course.durationWeeks ?? undefined,
              pricePkr: course.pricePkr,
              instructorName: course.instructorName ?? "",
              instructorBio: course.instructorBio ?? "",
              isPublished: course.isPublished,
            }}
          />
        </div>

        <LessonManager courseId={course.id} lessons={lessons} />
      </div>
    </div>
  );
}
