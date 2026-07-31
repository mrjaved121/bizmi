import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { getMyClassrooms } from "@/lib/data/teacher";
import { CreateClassroomForm } from "@/components/features/teacher/CreateClassroomForm";

export const metadata: Metadata = {
  title: "Your classrooms | Bizmi",
  robots: { index: false },
};

export default async function TeacherDashboardPage() {
  const classrooms = await getMyClassrooms();

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-3xl text-ink">Your classrooms</h1>
          <CreateClassroomForm />
        </div>

        {classrooms.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-line bg-white p-10 text-center">
            <Users className="mx-auto h-8 w-8 text-ink-2" />
            <p className="mt-4 text-ink-2">Create a classroom to get a join code your students can use.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {classrooms.map((classroom) => (
              <Link
                key={classroom.id}
                href={`/teacher/classrooms/${classroom.id}`}
                className="rounded-3xl border border-line bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <h2 className="font-serif text-xl text-ink">{classroom.name}</h2>
                {classroom.gradeLevel && <p className="mt-1 text-sm text-ink-2">{classroom.gradeLevel}</p>}
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-ink-2">
                    <Users className="h-4 w-4" />
                    {classroom.studentCount} student{classroom.studentCount === 1 ? "" : "s"}
                  </span>
                  <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs uppercase tracking-wide text-ink">
                    {classroom.joinCode}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
