"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/actions/admin-orders";
import { ORDER_STATUSES, ORDER_STATUS_LABEL } from "@/lib/order-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  status: z.enum(ORDER_STATUSES),
  note: z.string().optional(),
  trackingNumber: z.string().optional(),
  courier: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function OrderStatusForm({
  orderId,
  currentStatus,
  trackingNumber,
  courier,
}: {
  orderId: string;
  currentStatus: string;
  trackingNumber: string | null;
  courier: string | null;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: currentStatus as FormValues["status"],
      trackingNumber: trackingNumber ?? "",
      courier: courier ?? "",
    },
  });

  const status = useWatch({ control, name: "status" });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const result = await updateOrderStatus({ orderId, ...values });
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    toast.success("Order updated.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(v) => {
            if (v) setValue("status", v as FormValues["status"], { shouldValidate: true });
          }}
        >
          <SelectTrigger id="status" className="mt-1.5 w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="courier">Courier</Label>
          <Input id="courier" className="mt-1.5" {...register("courier")} />
        </div>
        <div>
          <Label htmlFor="trackingNumber">Tracking number</Label>
          <Input id="trackingNumber" className="mt-1.5" {...register("trackingNumber")} />
        </div>
      </div>

      <div>
        <Label htmlFor="note">Internal note (optional)</Label>
        <Textarea id="note" rows={2} className="mt-1.5" {...register("note")} />
      </div>

      {formError && <p className="text-sm text-red">{formError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-orange px-6 py-3 text-white hover:bg-orange/90"
      >
        {isSubmitting ? "Updating…" : "Update order"}
      </Button>
    </form>
  );
}
