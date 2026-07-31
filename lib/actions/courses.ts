"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function enrollFree(courseId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sign in to enroll in this course." };
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id, price_pkr, is_published, slug")
    .eq("id", courseId)
    .eq("is_published", true)
    .maybeSingle();

  if (!course) {
    return { ok: false, error: "This course isn't available." };
  }
  if ((course.price_pkr ?? 0) > 0) {
    return { ok: false, error: "This course requires enrollment approval — use the request form instead." };
  }

  const { error } = await supabase.from("course_enrollments").insert({
    user_id: user.id,
    course_id: course.id,
  });

  if (error && !error.message.includes("duplicate key")) {
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/courses/${course.slug}`);
  return { ok: true };
}

const requestSchema = z.object({
  courseId: z.string().uuid(),
  courseTitle: z.string(),
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

export async function requestPaidEnrollment(input: z.infer<typeof requestSchema>): Promise<ActionResult> {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }
  const data = parsed.data;

  const supabase = createAdminClient();
  const { error } = await supabase.from("service_inquiries").insert({
    service_type: "course_enrollment",
    contact_name: data.fullName,
    contact_email: data.email,
    contact_phone: data.phone,
    message: `Requesting enrollment in: ${data.courseTitle}`,
    status: "new",
  });

  if (error) {
    console.error("requestPaidEnrollment insert failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
