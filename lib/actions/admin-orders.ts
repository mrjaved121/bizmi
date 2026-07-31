"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaff, ForbiddenError } from "@/lib/auth/require-staff";
import { ORDER_STATUSES } from "@/lib/order-status";
import type { Database } from "@/types/database.types";

type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

const schema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(ORDER_STATUSES),
  note: z.string().optional(),
  trackingNumber: z.string().optional(),
  courier: z.string().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof schema>;
export type ActionResult = { ok: true } | { ok: false; error: string };

const TIMESTAMP_COLUMN: Partial<Record<(typeof ORDER_STATUSES)[number], string>> = {
  phone_confirmed: "confirmed_at",
  dispatched: "dispatched_at",
  delivered: "delivered_at",
  cancelled: "cancelled_at",
};

export async function updateOrderStatus(input: UpdateOrderStatusInput): Promise<ActionResult> {
  let staff;
  try {
    staff = await requireStaff();
  } catch (err) {
    if (err instanceof ForbiddenError) return { ok: false, error: "You don't have permission to do that." };
    throw err;
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid status update." };
  }
  const data = parsed.data;

  const supabase = createAdminClient();

  const { data: current } = await supabase.from("orders").select("status").eq("id", data.orderId).single();
  if (!current) {
    return { ok: false, error: "Order not found." };
  }

  const updates: OrderUpdate = { status: data.status };
  if (data.trackingNumber !== undefined) updates.tracking_number = data.trackingNumber || null;
  if (data.courier !== undefined) updates.courier = data.courier || null;
  const timestampColumn = TIMESTAMP_COLUMN[data.status];
  if (timestampColumn) (updates as Record<string, string>)[timestampColumn] = new Date().toISOString();

  const { error: updateError } = await supabase.from("orders").update(updates).eq("id", data.orderId);
  if (updateError) {
    return { ok: false, error: "Something went wrong updating the order." };
  }

  await supabase.from("order_status_log").insert({
    order_id: data.orderId,
    from_status: current.status,
    to_status: data.status,
    actor_id: staff.userId,
    note: data.note || null,
  });

  revalidatePath(`/admin/orders/${data.orderId}`);
  revalidatePath("/admin/orders");

  return { ok: true };
}
