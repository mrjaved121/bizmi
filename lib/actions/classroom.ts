"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type JoinClassroomResult = { ok: true; classroomName: string } | { ok: false; error: string };

const schema = z.object({
  joinCode: z.string().min(4, "Enter the join code your teacher shared"),
});

export async function joinClassroom(input: z.infer<typeof schema>): Promise<JoinClassroomResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Enter a valid join code." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in to join a classroom." };
  }

  // students can't SELECT a classroom by join_code under RLS until they're
  // already a member — the admin client resolves that chicken-and-egg step,
  // the actual membership insert below still goes through the RLS-bound
  // client (classroom_students_self_join requires student_id = auth.uid())
  const admin = createAdminClient();
  const { data: classroom } = await admin
    .from("classrooms")
    .select("id, name")
    .eq("join_code", parsed.data.joinCode.toUpperCase())
    .maybeSingle();

  if (!classroom) {
    return { ok: false, error: "That join code doesn't match a classroom. Double-check with your teacher." };
  }

  const { error } = await supabase.from("classroom_students").insert({
    classroom_id: classroom.id,
    student_id: user.id,
  });

  if (error) {
    if (error.message.includes("duplicate key")) {
      return { ok: false, error: "You've already joined this classroom." };
    }
    return { ok: false, error: "Something went wrong joining the classroom. Please try again." };
  }

  revalidatePath("/account");
  return { ok: true, classroomName: classroom.name ?? "your classroom" };
}
