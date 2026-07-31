"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  city: z.string().optional(),
  province: z.string().optional(),
  address: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof schema>;
export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }
  const data = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.fullName,
      phone: data.phone,
      city: data.city || null,
      province: data.province || null,
      address: data.address || null,
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath("/account/settings");
  return { ok: true };
}
