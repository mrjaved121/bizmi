"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus, Lock, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { createLesson, deleteLesson } from "@/lib/actions/admin-courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminCourseLesson } from "@/lib/data/admin-courses";

const schema = z.object({
  title: z.string().min(2, "Enter a lesson title"),
  durationMinutes: z.number().optional(),
  isFreePreview: z.boolean(),
  contentMd: z.string().optional(),
  videoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function LessonManager({
  courseId,
  lessons,
}: {
  courseId: string;
  lessons: AdminCourseLesson[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { isFreePreview: false } });

  async function onSubmit(values: FormValues) {
    const result = await createLesson(courseId, values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    reset({ title: "", isFreePreview: false });
    setOpen(false);
    router.refresh();
  }

  async function handleDelete(lessonId: string) {
    setDeletingId(lessonId);
    const result = await deleteLesson(lessonId, courseId);
    setDeletingId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg text-ink">Lessons</h2>
        {!open && (
          <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5 rounded-full bg-ink px-4 text-white hover:bg-ink/90">
            <Plus className="h-3.5 w-3.5" />
            Add lesson
          </Button>
        )}
      </div>

      <ul className="mt-4 flex flex-col divide-y divide-line">
        {lessons.length === 0 && <p className="py-4 text-sm text-ink-2">No lessons yet.</p>}
        {lessons.map((lesson, i) => (
          <li key={lesson.id} className="flex items-center justify-between py-3">
            <span className="flex items-center gap-2.5 text-sm text-ink">
              {lesson.isFreePreview ? (
                <PlayCircle className="h-4 w-4 text-orange" />
              ) : (
                <Lock className="h-4 w-4 text-ink-2" />
              )}
              {i + 1}. {lesson.title}
              {lesson.durationMinutes && <span className="text-xs text-ink-2">({lesson.durationMinutes} min)</span>}
            </span>
            <button
              type="button"
              disabled={deletingId === lesson.id}
              onClick={() => handleDelete(lesson.id)}
              aria-label={`Remove ${lesson.title}`}
              className="text-ink-2 hover:text-red disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
          <div>
            <Label htmlFor="lessonTitle">Title</Label>
            <Input id="lessonTitle" className="mt-1.5" {...register("title")} />
            {errors.title && <p className="mt-1 text-xs text-red">{errors.title.message}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="durationMinutes">Duration (min)</Label>
              <Input
                id="durationMinutes"
                type="number"
                min={0}
                className="mt-1.5"
                {...register("durationMinutes", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input id="videoUrl" className="mt-1.5" {...register("videoUrl")} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-2">
            <input type="checkbox" className="h-4 w-4 rounded border-line" {...register("isFreePreview")} />
            Free preview (visible without enrolling)
          </label>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="rounded-full bg-orange px-5 text-white hover:bg-orange/90"
            >
              {isSubmitting ? "Adding…" : "Add lesson"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
