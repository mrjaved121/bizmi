"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { enrollFree, requestPaidEnrollment } from "@/lib/actions/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

type FormValues = z.infer<typeof schema>;

export function CourseEnrollActions({
  courseId,
  courseTitle,
  pricePkr,
  isEnrolled,
}: {
  courseId: string;
  courseTitle: string;
  pricePkr: number;
  isEnrolled: boolean;
}) {
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [requested, setRequested] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (isEnrolled) {
    return (
      <p className="flex items-center gap-2 rounded-full bg-green-soft px-4 py-2.5 text-sm text-green">
        <CheckCircle2 className="h-4 w-4" />
        You&apos;re enrolled
      </p>
    );
  }

  if (pricePkr === 0) {
    async function handleFreeEnroll() {
      setEnrolling(true);
      const result = await enrollFree(courseId);
      setEnrolling(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("You're enrolled!");
      router.refresh();
    }

    return (
      <Button
        size="lg"
        onClick={handleFreeEnroll}
        disabled={enrolling}
        className="rounded-full bg-orange px-8 py-3.5 text-white hover:bg-orange/90"
      >
        {enrolling ? "Enrolling…" : "Enroll for free"}
      </Button>
    );
  }

  if (requested) {
    return (
      <p className="flex items-center gap-2 rounded-full bg-green-soft px-4 py-2.5 text-sm text-green">
        <CheckCircle2 className="h-4 w-4" />
        Request sent — we&apos;ll be in touch shortly.
      </p>
    );
  }

  async function onSubmit(values: FormValues) {
    const result = await requestPaidEnrollment({ courseId, courseTitle, ...values });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setRequested(true);
  }

  if (!showForm) {
    return (
      <Button
        size="lg"
        onClick={() => setShowForm(true)}
        className="rounded-full bg-orange px-8 py-3.5 text-white hover:bg-orange/90"
      >
        Request enrollment
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-sm flex-col gap-4">
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" className="mt-1.5" {...register("fullName")} />
        {errors.fullName && <p className="mt-1 text-xs text-red">{errors.fullName.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" className="mt-1.5" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" className="mt-1.5" {...register("phone")} />
        {errors.phone && <p className="mt-1 text-xs text-red">{errors.phone.message}</p>}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-orange px-6 py-3 text-white hover:bg-orange/90"
      >
        {isSubmitting ? "Sending…" : "Send request"}
      </Button>
    </form>
  );
}
