"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, ForbiddenError } from "@/lib/auth/require-staff";

export type ActionResult = { ok: true } | { ok: false; error: string };

const courseSchema = z.object({
  title: z.string().min(2, "Enter a course title"),
  slug: z
    .string()
    .min(2, "Enter a slug")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  durationWeeks: z.number().min(0).optional(),
  pricePkr: z.number().min(0, "Enter a price"),
  instructorName: z.string().optional(),
  instructorBio: z.string().optional(),
  isPublished: z.boolean(),
});

export type CourseInput = z.infer<typeof courseSchema>;

function toRow(data: CourseInput) {
  return {
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    category: data.category || null,
    difficulty: data.difficulty || null,
    duration_weeks: data.durationWeeks ?? null,
    price_pkr: data.pricePkr,
    instructor_name: data.instructorName || null,
    instructor_bio: data.instructorBio || null,
    is_published: data.isPublished,
  };
}

export async function createCourse(input: CourseInput): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data: row, error } = await supabase.from("courses").insert(toRow(parsed.data)).select("id").single();

  if (error) {
    if (error.message.includes("duplicate key")) {
      return { ok: false, error: "A course with this slug already exists." };
    }
    return { ok: false, error: "Something went wrong creating the course." };
  }

  revalidatePath("/admin/courses");
  redirect(`/admin/courses/${row.id}`);
}

export async function updateCourse(id: string, input: CourseInput): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("courses").update(toRow(parsed.data)).eq("id", id);

  if (error) {
    if (error.message.includes("duplicate key")) {
      return { ok: false, error: "A course with this slug already exists." };
    }
    return { ok: false, error: "Something went wrong updating the course." };
  }

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);
  return { ok: true };
}

const lessonSchema = z.object({
  title: z.string().min(2, "Enter a lesson title"),
  durationMinutes: z.number().min(0).optional(),
  isFreePreview: z.boolean(),
  contentMd: z.string().optional(),
  videoUrl: z.string().optional(),
});

export type LessonInput = z.infer<typeof lessonSchema>;

export async function createLesson(courseId: string, input: LessonInput): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const parsed = lessonSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { count } = await supabase
    .from("course_lessons")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);

  const { error } = await supabase.from("course_lessons").insert({
    course_id: courseId,
    order_index: count ?? 0,
    title: parsed.data.title,
    duration_minutes: parsed.data.durationMinutes ?? null,
    is_free_preview: parsed.data.isFreePreview,
    content_md: parsed.data.contentMd || null,
    video_url: parsed.data.videoUrl || null,
  });

  if (error) {
    return { ok: false, error: "Something went wrong adding the lesson." };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { ok: true };
}

export async function deleteLesson(lessonId: string, courseId: string): Promise<ActionResult> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("course_lessons").delete().eq("id", lessonId);

  if (error) {
    return { ok: false, error: "Something went wrong removing the lesson." };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { ok: true };
}
