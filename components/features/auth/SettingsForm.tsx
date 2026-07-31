"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/account";
import { PAKISTAN_PROVINCES } from "@/lib/shipping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  city: z.string().optional(),
  province: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function SettingsForm({
  email,
  defaultValues,
}: {
  email: string | null;
  defaultValues: {
    fullName: string;
    phone: string;
    city: string;
    province: string;
    address: string;
  };
}) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  const province = useWatch({ control, name: "province" });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const result = await updateProfile(values);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    toast.success("Profile updated.");
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <Label>Email</Label>
          <Input value={email ?? ""} disabled className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" className="mt-1.5" {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-xs text-red">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" className="mt-1.5" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-red">{errors.phone.message}</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="province">Province</Label>
            <Select
              value={province}
              onValueChange={(v) => {
                if (v) setValue("province", v, { shouldValidate: true });
              }}
            >
              <SelectTrigger id="province" className="mt-1.5 w-full">
                <SelectValue placeholder="Select a province" />
              </SelectTrigger>
              <SelectContent>
                {PAKISTAN_PROVINCES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" className="mt-1.5" {...register("city")} />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" className="mt-1.5" {...register("address")} />
        </div>

        {formError && <p className="text-sm text-red">{formError}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-orange py-3.5 text-white hover:bg-orange/90 sm:w-fit sm:px-8"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
