import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { getClassroomRoster } from "@/lib/data/teacher";

export const metadata: Metadata = {
  title: "Classroom roster | Bizmi",
  robots: { index: false },
};

export default async function ClassroomRosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const classroom = await getClassroomRoster(id);

  if (!classroom) {
    notFound();
  }

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <Link href="/teacher" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to classrooms
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl text-ink">{classroom.name}</h1>
            {classroom.gradeLevel && <p className="mt-1 text-ink-2">{classroom.gradeLevel}</p>}
          </div>
          <span className="rounded-full bg-surface-2 px-4 py-2 font-mono text-sm uppercase tracking-wide text-ink">
            Join code: {classroom.joinCode}
          </span>
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line px-6 py-4">
            <Users className="h-4 w-4 text-ink-2" />
            <h2 className="font-serif text-lg text-ink">
              {classroom.students.length} student{classroom.students.length === 1 ? "" : "s"}
            </h2>
          </div>
          {classroom.students.length === 0 ? (
            <p className="p-6 text-sm text-ink-2">
              No students yet — share the join code above so they can join from their account.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {classroom.students.map((student) => (
                <li key={student.id} className="flex items-center justify-between px-6 py-3 text-sm">
                  <div>
                    <p className="text-ink">{student.fullName}</p>
                    {student.email && <p className="text-xs text-ink-2">{student.email}</p>}
                  </div>
                  <span className="text-xs text-ink-2">
                    Joined{" "}
                    {new Date(student.joinedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
