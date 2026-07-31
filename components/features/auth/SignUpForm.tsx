"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { signUp } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const result = await signUp(values);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setSubmitted(values.email);
    router.push(`/auth/verify?email=${encodeURIComponent(values.email)}`);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-line bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-soft">
          <Mail className="h-7 w-7 text-orange" />
        </div>
        <h2 className="mt-5 font-serif text-2xl text-ink">Check your email</h2>
        <p className="mt-2 text-sm text-ink-2">
          We sent a confirmation link to {submitted}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
          <Input id="phone" type="tel" placeholder="+92 3XX XXXXXXX" className="mt-1.5" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-red">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" className="mt-1.5" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-red">{errors.password.message}</p>}
        </div>

        {formError && <p className="text-sm text-red">{formError}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="mt-2 w-full rounded-full bg-orange py-3.5 text-white hover:bg-orange/90"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-sm text-ink-2">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-ink underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
