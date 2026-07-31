import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface MyClassroom {
  id: string;
  name: string;
  gradeLevel: string | null;
  joinCode: string;
  studentCount: number;
  createdAt: string;
}

export async function getMyClassrooms(): Promise<MyClassroom[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("classrooms")
    .select("id, name, grade_level, join_code, created_at, classroom_students(count)")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error("getMyClassrooms query failed:", error.message);

  return (data ?? []).map((c) => ({
    id: c.id,
    name: c.name ?? "Untitled classroom",
    gradeLevel: c.grade_level,
    joinCode: c.join_code ?? "",
    studentCount: c.classroom_students?.[0]?.count ?? 0,
    createdAt: c.created_at ?? "",
  }));
}

export interface ClassroomRosterStudent {
  id: string;
  fullName: string;
  email: string | null;
  joinedAt: string;
}

export interface ClassroomRoster {
  id: string;
  name: string;
  gradeLevel: string | null;
  joinCode: string;
  students: ClassroomRosterStudent[];
}

// Teachers can't read other users' `profiles` rows under RLS (that policy
// only allows self or staff), so getting student names for a roster needs
// the service-role client — gated here by an explicit ownership check
// instead of relying on RLS.
export async function getClassroomRoster(classroomId: string): Promise<ClassroomRoster | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: classroom } = await supabase
    .from("classrooms")
    .select("id, name, grade_level, join_code, teacher_id")
    .eq("id", classroomId)
    .single();

  if (!classroom || classroom.teacher_id !== user.id) return null;

  const admin = createAdminClient();
  const { data: members } = await admin
    .from("classroom_students")
    .select("student_id, joined_at, profiles(full_name)")
    .eq("classroom_id", classroomId)
    .order("joined_at", { ascending: false });

  const studentIds = (members ?? []).map((m) => m.student_id).filter((id): id is string => Boolean(id));
  const emailById = new Map<string, string>();
  if (studentIds.length > 0) {
    const { data: usersResp } = await admin.auth.admin.listUsers({ perPage: 1000 });
    for (const u of usersResp?.users ?? []) {
      if (u.email && studentIds.includes(u.id)) emailById.set(u.id, u.email);
    }
  }

  return {
    id: classroom.id,
    name: classroom.name ?? "Untitled classroom",
    gradeLevel: classroom.grade_level,
    joinCode: classroom.join_code ?? "",
    students: (members ?? [])
      .filter((m): m is typeof m & { student_id: string } => Boolean(m.student_id))
      .map((m) => ({
        id: m.student_id,
        fullName: m.profiles?.full_name || "—",
        email: emailById.get(m.student_id) ?? null,
        joinedAt: m.joined_at ?? "",
      })),
  };
}
