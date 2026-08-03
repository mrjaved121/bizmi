import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getMyCourses } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Your courses | Bizmi",
  robots: { index: false },
};

export default async function AccountCoursesPage() {
  const courses = await getMyCourses();

  if (courses.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white p-10 text-center">
        <GraduationCap className="mx-auto h-8 w-8 text-ink-2" />
        <p className="mt-4 text-ink-2">You haven&apos;t enrolled in any courses yet.</p>
        <Link href="/courses" className="mt-4 inline-block text-sm text-ink underline underline-offset-2">
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-line rounded-3xl border border-line bg-white">
      {courses.map((course) => (
        <li key={course.slug}>
          <Link href={`/courses/${course.slug}`} className="flex items-center justify-between gap-4 p-5 hover:bg-surface-2">
            <div>
              <p className="font-serif text-lg text-ink">{course.title}</p>
              <p className="mt-1 text-xs text-ink-2">
                Enrolled{" "}
                {new Date(course.enrolledAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full bg-orange" style={{ width: `${course.progressPercent}%` }} />
              </div>
              <span className="font-mono text-xs text-ink-2">{course.progressPercent}%</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
