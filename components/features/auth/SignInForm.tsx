"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const result = await signIn(values);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-1.5" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red">{errors.email.message}</p>}
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
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center text-sm text-ink-2">
          New to Bizmi?{" "}
          <Link href="/auth/sign-up" className="text-ink underline underline-offset-2">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
