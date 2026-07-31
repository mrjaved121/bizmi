"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { createClassroom } from "@/lib/actions/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Enter a classroom name"),
  gradeLevel: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateClassroomForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const result = await createClassroom(values);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    reset();
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 rounded-full bg-orange px-5 text-white hover:bg-orange/90"
      >
        <Plus className="h-4 w-4" />
        New classroom
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 sm:flex-row sm:items-end sm:gap-3"
    >
      <div className="flex-1">
        <Label htmlFor="name">Classroom name</Label>
        <Input id="name" placeholder="Grade 7 Robotics" className="mt-1.5" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red">{errors.name.message}</p>}
      </div>
      <div className="flex-1">
        <Label htmlFor="gradeLevel">Grade level (optional)</Label>
        <Input id="gradeLevel" placeholder="Grade 7" className="mt-1.5" {...register("gradeLevel")} />
      </div>
      {formError && <p className="text-sm text-red">{formError}</p>}
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-orange px-5 text-white hover:bg-orange/90"
        >
          {isSubmitting ? "Creating…" : "Create"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
