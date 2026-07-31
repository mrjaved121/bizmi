"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { joinClassroom } from "@/lib/actions/classroom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  joinCode: z.string().min(4, "Enter the join code your teacher shared"),
});

type FormValues = z.infer<typeof schema>;

export function JoinClassroomForm() {
  const [joined, setJoined] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const result = await joinClassroom(values);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setJoined(result.classroomName);
  }

  if (joined) {
    return (
      <div className="rounded-3xl border border-line bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-soft">
          <CheckCircle2 className="h-7 w-7 text-green" />
        </div>
        <h2 className="mt-5 font-serif text-2xl text-ink">You&apos;re in!</h2>
        <p className="mt-2 text-sm text-ink-2">You&apos;ve joined {joined}.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 sm:p-8"
    >
      <div>
        <Label htmlFor="joinCode">Join code</Label>
        <Input
          id="joinCode"
          placeholder="ABC123"
          className="mt-1.5 uppercase"
          {...register("joinCode")}
        />
        {errors.joinCode && <p className="mt-1 text-xs text-red">{errors.joinCode.message}</p>}
      </div>
      {formError && <p className="text-sm text-red">{formError}</p>}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-orange px-6 py-3 text-white hover:bg-orange/90"
      >
        {isSubmitting ? "Joining…" : "Join classroom"}
      </Button>
    </form>
  );
}
