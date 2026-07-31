import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Lock, PlayCircle, Clock, GraduationCap } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses";
import { formatPkr } from "@/lib/format";
import { Breadcrumb } from "@/components/features/Breadcrumb";
import { CourseEnrollActions } from "@/components/features/courses/CourseEnrollActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: `${course.title} | Bizmi Courses`,
    description: course.description ?? undefined,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Courses", href: "/courses" }, { label: course.title }]} />

      <section className="py-10 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[3fr_2fr]">
          <div>
            <h1 className="font-serif text-4xl text-ink">{course.title}</h1>
            {course.description && <p className="mt-3 text-ink-2">{course.description}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-2">
              {course.instructorName && (
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  {course.instructorName}
                </span>
              )}
              {course.durationWeeks && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {course.durationWeeks} weeks
                </span>
              )}
              {course.difficulty && <span className="capitalize">{course.difficulty}</span>}
            </div>

            <div className="mt-10 rounded-3xl border border-line bg-white">
              <h2 className="border-b border-line px-6 py-4 font-serif text-lg text-ink">Syllabus</h2>
              {course.lessons.length === 0 ? (
                <p className="p-6 text-sm text-ink-2">Lessons coming soon.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {course.lessons.map((lesson, i) => (
                    <li key={lesson.id} className="flex items-center justify-between px-6 py-3.5 text-sm">
                      <span className="flex items-center gap-3 text-ink">
                        {lesson.locked ? (
                          <Lock className="h-4 w-4 shrink-0 text-ink-2" />
                        ) : (
                          <PlayCircle className="h-4 w-4 shrink-0 text-orange" />
                        )}
                        {i + 1}. {lesson.title}
                      </span>
                      {lesson.durationMinutes && (
                        <span className="shrink-0 text-xs text-ink-2">{lesson.durationMinutes} min</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {course.instructorBio && (
              <div className="mt-10 border-t border-line pt-6">
                <h2 className="font-serif text-lg text-ink">About the instructor</h2>
                <p className="mt-2 text-sm text-ink-2">{course.instructorBio}</p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-line bg-white p-6">
              <span className="font-mono text-3xl text-ink">
                {course.pricePkr === 0 ? "Free" : formatPkr(course.pricePkr)}
              </span>
              <div className="mt-6">
                <CourseEnrollActions
                  courseId={course.id}
                  courseTitle={course.title}
                  pricePkr={course.pricePkr}
                  isEnrolled={course.isEnrolled}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
