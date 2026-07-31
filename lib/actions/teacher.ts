"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireTeacher, ForbiddenError } from "@/lib/auth/require-staff";

export type ActionResult = { ok: true } | { ok: false; error: string };

const JOIN_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 — easy to read aloud

function generateJoinCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += JOIN_CODE_CHARS[Math.floor(Math.random() * JOIN_CODE_CHARS.length)];
  }
  return code;
}

const createClassroomSchema = z.object({
  name: z.string().min(2, "Enter a classroom name"),
  gradeLevel: z.string().optional(),
});

export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;

export async function createClassroom(input: CreateClassroomInput): Promise<ActionResult> {
  let teacher;
  try {
    teacher = await requireTeacher();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const parsed = createClassroomSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();

  // join_code is globally unique — a handful of retries on collision is
  // simpler than a reservation scheme at this volume
  for (let attempt = 0; attempt < 5; attempt++) {
    const { error } = await supabase.from("classrooms").insert({
      teacher_id: teacher.userId,
      name: parsed.data.name,
      grade_level: parsed.data.gradeLevel || null,
      join_code: generateJoinCode(),
    });
    if (!error) {
      revalidatePath("/teacher");
      return { ok: true };
    }
    if (!error.message.includes("duplicate key")) {
      return { ok: false, error: "Something went wrong creating the classroom." };
    }
  }

  return { ok: false, error: "Something went wrong creating the classroom. Please try again." };
}
