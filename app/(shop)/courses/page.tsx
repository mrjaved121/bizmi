import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Clock } from "lucide-react";
import { getCourses } from "@/lib/data/courses";
import { formatPkr } from "@/lib/format";
import { Eyebrow } from "@/components/features/Eyebrow";

export const metadata: Metadata = {
  title: "Courses | Bizmi",
  description: "Live and self-paced courses in robotics, electronics, and coding for Pakistani students.",
};

export default async function CoursesCatalogPage() {
  const courses = await getCourses();

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Eyebrow>Courses</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl text-ink">Learn with a real instructor.</h1>
        <p className="mt-2 max-w-xl text-ink-2">
          Structured courses in robotics, electronics, and coding — built for Pakistani classrooms and curious kids.
        </p>

        {courses.length === 0 ? (
          <p className="mt-10 text-ink-2">No courses published yet — check back soon.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="flex flex-col rounded-3xl border border-line bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-soft">
                  <GraduationCap className="h-6 w-6 text-purple" />
                </div>
                <h2 className="mt-4 font-serif text-xl text-ink">{course.title}</h2>
                {course.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-ink-2">{course.description}</p>
                )}
                <div className="mt-4 flex flex-1 items-end justify-between">
                  <span className="font-mono text-lg text-ink">
                    {course.pricePkr === 0 ? "Free" : formatPkr(course.pricePkr)}
                  </span>
                  {course.durationWeeks && (
                    <span className="flex items-center gap-1.5 text-sm text-ink-2">
                      <Clock className="h-4 w-4" />
                      {course.durationWeeks}w
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
