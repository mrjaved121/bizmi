import "server-only";
import { createClient } from "@/lib/supabase/server";

export class ForbiddenError extends Error {}

// Middleware only gates page navigation — Server Actions are callable
// directly regardless of which page rendered them, so every admin action
// that touches the service-role client must re-check the role itself.
export async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new ForbiddenError("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "staff") {
    throw new ForbiddenError("Not authorized");
  }

  return { userId: user.id, role: profile.role as "admin" | "staff" };
}
