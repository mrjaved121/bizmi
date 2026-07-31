import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminCourses } from "@/lib/data/admin-courses";
import { formatPkr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Courses | Bizmi Admin",
  robots: { index: false },
};

export default async function AdminCoursesPage() {
  const courses = await getAdminCourses();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Courses</h1>
        <Button
          className="gap-2 rounded-full bg-orange px-5 text-white hover:bg-orange/90"
          nativeButton={false}
          render={<Link href="/admin/courses/new" />}
        >
          <Plus className="h-4 w-4" />
          New course
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-2">
              <th className="px-5 py-3 font-normal">Course</th>
              <th className="px-5 py-3 font-normal">Category</th>
              <th className="px-5 py-3 text-right font-normal">Lessons</th>
              <th className="px-5 py-3 text-right font-normal">Enrolled</th>
              <th className="px-5 py-3 text-right font-normal">Price</th>
              <th className="px-5 py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {courses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-2">
                  No courses yet.
                </td>
              </tr>
            )}
            {courses.map((course) => (
              <tr key={course.id} className="transition-colors hover:bg-surface-2">
                <td className="px-5 py-3">
                  <Link href={`/admin/courses/${course.id}`} className="text-ink hover:underline">
                    {course.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink-2">{course.category ?? "—"}</td>
                <td className="px-5 py-3 text-right font-mono text-ink">{course.lessonCount}</td>
                <td className="px-5 py-3 text-right font-mono text-ink">{course.enrollmentCount}</td>
                <td className="px-5 py-3 text-right font-mono text-ink">
                  {course.pricePkr === 0 ? "Free" : formatPkr(course.pricePkr)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide",
                      course.isPublished ? "bg-green-soft text-green" : "bg-surface-2 text-ink-2"
                    )}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
