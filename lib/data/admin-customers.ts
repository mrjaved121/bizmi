import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaff, ForbiddenError } from "@/lib/auth/require-staff";

export interface AdminCustomer {
  id: string;
  fullName: string;
  email: string | null;
  role: string;
  phone: string | null;
  city: string | null;
  createdAt: string;
  orderCount: number;
  totalSpentPkr: number;
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  try {
    await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return [];
    throw err;
  }

  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, phone, city, created_at")
    .order("created_at", { ascending: false });

  const { data: orders } = await supabase.from("orders").select("user_id, total_pkr").not("user_id", "is", null);

  const statsById = new Map<string, { count: number; total: number }>();
  for (const order of orders ?? []) {
    if (!order.user_id) continue;
    const stats = statsById.get(order.user_id) ?? { count: 0, total: 0 };
    stats.count += 1;
    stats.total += order.total_pkr ?? 0;
    statsById.set(order.user_id, stats);
  }

  // profiles don't store email — only the service-role auth admin API can list it
  const adminClient = createAdminClient();
  const emailById = new Map<string, string>();
  const { data: usersResp } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
  for (const user of usersResp?.users ?? []) {
    if (user.email) emailById.set(user.id, user.email);
  }

  return (profiles ?? []).map((p) => {
    const stats = statsById.get(p.id);
    return {
      id: p.id,
      fullName: p.full_name || "—",
      email: emailById.get(p.id) ?? null,
      role: p.role ?? "customer",
      phone: p.phone,
      city: p.city,
      createdAt: p.created_at ?? "",
      orderCount: stats?.count ?? 0,
      totalSpentPkr: stats?.total ?? 0,
    };
  });
}
