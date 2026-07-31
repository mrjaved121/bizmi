"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult = { ok: true } | { ok: false; error: string };

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  subject: z.enum(["general", "sales", "schools", "support", "partnership"]),
  message: z.string().min(10),
});

export async function submitContactForm(
  input: z.infer<typeof contactSchema>
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("service_inquiries").insert({
    service_type: parsed.data.subject,
    contact_name: parsed.data.name,
    contact_email: parsed.data.email,
    contact_phone: parsed.data.phone,
    message: parsed.data.message,
    status: "new",
  });

  if (error) {
    console.error("submitContactForm insert failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  // TODO(Resend): email sales at hello@bizmi.pk once RESEND_API_KEY is set.
  return { ok: true };
}

const demoSchema = z.object({
  schoolName: z.string().min(2),
  city: z.string().min(2),
  studentCount: z.number().min(1),
  gradeLevels: z.array(z.string()).min(1),
  contactName: z.string().min(2),
  contactRole: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  interests: z.array(z.string()).min(1),
  preferredDate: z.string().min(1),
  notes: z.string().optional(),
});

export async function submitServiceInquiry(
  input: z.infer<typeof demoSchema>
): Promise<ActionResult> {
  const parsed = demoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const d = parsed.data;
  const message = [d.whatsapp ? `WhatsApp: ${d.whatsapp}` : null, d.notes]
    .filter(Boolean)
    .join("\n\n");

  const supabase = createAdminClient();
  const { error } = await supabase.from("service_inquiries").insert({
    service_type: "demo",
    school_name: d.schoolName,
    city: d.city,
    student_count: d.studentCount,
    grade_levels: d.gradeLevels,
    contact_name: d.contactName,
    contact_role: d.contactRole,
    contact_phone: d.phone,
    contact_email: d.email,
    interests: d.interests,
    preferred_demo_at: d.preferredDate,
    message: message || null,
    status: "new",
  });

  if (error) {
    console.error("submitServiceInquiry insert failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  // TODO(Resend): email sales + Slack alert, and a confirmation email to the
  // school, once RESEND_API_KEY is set.
  return { ok: true };
}
