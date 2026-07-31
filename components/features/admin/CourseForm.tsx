"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createCourse, updateCourse } from "@/lib/actions/admin-courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(2, "Enter a course title"),
  slug: z.string().min(2, "Enter a slug").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  durationWeeks: z.number().optional(),
  pricePkr: z.number({ error: "Enter a price" }).min(0, "Enter a price"),
  instructorName: z.string().optional(),
  instructorBio: z.string().optional(),
  isPublished: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function CourseForm({
  courseId,
  defaultValues,
}: {
  courseId?: string;
  defaultValues: FormValues;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  const isPublished = useWatch({ control, name: "isPublished" });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const result = courseId ? await updateCourse(courseId, values) : await createCourse(values);

    if (result && !result.ok) {
      setFormError(result.error);
      return;
    }
    if (courseId) {
      toast.success("Course updated.");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" className="mt-1.5" {...register("title")} />
          {errors.title && <p className="mt-1 text-xs text-red">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" className="mt-1.5" {...register("slug")} />
          {errors.slug && <p className="mt-1 text-xs text-red">{errors.slug.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} className="mt-1.5" {...register("description")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="Basic Robotics" className="mt-1.5" {...register("category")} />
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Input id="difficulty" placeholder="beginner" className="mt-1.5" {...register("difficulty")} />
        </div>
        <div>
          <Label htmlFor="durationWeeks">Duration (weeks)</Label>
          <Input
            id="durationWeeks"
            type="number"
            min={0}
            className="mt-1.5"
            {...register("durationWeeks", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="pricePkr">Price (PKR — 0 for free)</Label>
        <Input id="pricePkr" type="number" min={0} className="mt-1.5" {...register("pricePkr", { valueAsNumber: true })} />
        {errors.pricePkr && <p className="mt-1 text-xs text-red">{errors.pricePkr.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="instructorName">Instructor name</Label>
          <Input id="instructorName" className="mt-1.5" {...register("instructorName")} />
        </div>
        <div>
          <Label htmlFor="instructorBio">Instructor bio</Label>
          <Input id="instructorBio" className="mt-1.5" {...register("instructorBio")} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setValue("isPublished", !isPublished, { shouldValidate: true })}
        className={cn(
          "w-fit rounded-full border px-4 py-1.5 text-sm transition-colors",
          isPublished ? "border-ink bg-ink text-white" : "border-line text-ink-2 hover:border-ink"
        )}
      >
        {isPublished ? "Published" : "Draft"}
      </button>

      {formError && <p className="text-sm text-red">{formError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-orange px-6 py-3 text-white hover:bg-orange/90"
      >
        {isSubmitting ? "Saving…" : courseId ? "Save changes" : "Create course"}
      </Button>
    </form>
  );
}
