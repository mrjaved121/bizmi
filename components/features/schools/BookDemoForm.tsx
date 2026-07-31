"use client";

import { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const GRADE_LEVELS = ["Primary (1-5)", "Middle (6-8)", "Secondary (9-10)", "Higher secondary (11-12)"];
const INTERESTS = ["Kits", "Curriculum", "Lab setup", "Teacher training", "Lesson plans", "Student evaluation"];

const schema = z.object({
  schoolName: z.string().min(2, "Enter your school's name"),
  city: z.string().min(2, "Enter your city"),
  studentCount: z
    .number({ error: "Enter an approximate student count" })
    .min(1, "Enter an approximate student count"),
  gradeLevels: z.array(z.string()).min(1, "Select at least one grade level"),
  contactName: z.string().min(2, "Enter your name"),
  contactRole: z.string().min(2, "Enter your role"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  whatsapp: z.string().optional(),
  interests: z.array(z.string()).min(1, "Select at least one"),
  preferredDate: z.string().min(1, "Pick a preferred date"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["schoolName", "city", "studentCount", "gradeLevels"],
  2: ["contactName", "contactRole", "phone", "email"],
  3: ["interests", "preferredDate"],
};

export function BookDemoForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { gradeLevels: [], interests: [] },
  });

  const gradeLevels = useWatch({ control, name: "gradeLevels" });
  const interests = useWatch({ control, name: "interests" });

  function toggle(field: "gradeLevels" | "interests", value: string) {
    const current = field === "gradeLevels" ? gradeLevels : interests;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next, { shouldValidate: true });
  }

  async function next() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function onSubmit(values: FormValues) {
    // TODO: wire to the `submitServiceInquiry` server action (Part 8 of
    // BIZMI_MASTER_PROMPT.md) once Supabase is connected — inserts into
    // `service_inquiries` (service_type='demo'), emails sales + Slack, and
    // sends a confirmation email to the school.
    await new Promise((resolve) => setTimeout(resolve, 700));
    console.log("Demo booking submitted", values);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-line bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-soft">
          <Check className="h-7 w-7 text-green" />
        </div>
        <h2 className="mt-5 font-serif text-2xl text-ink">
          Thanks — we&apos;ll be in touch within 24 hours.
        </h2>
        <p className="mt-2 text-sm text-ink-2">
          Meanwhile, here&apos;s a brochure to share with colleagues.
        </p>
        <Button
          size="lg"
          variant="outline"
          className="mt-6 gap-2 rounded-full border-[1.5px] border-ink px-6 py-3.5 text-ink hover:bg-ink hover:text-white"
        >
          <Download className="h-4 w-4" />
          Download brochure
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs",
                s <= step ? "bg-orange text-white" : "bg-surface-2 text-ink-2"
              )}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded-full",
                  s < step ? "bg-orange" : "bg-surface-2"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mb-6 font-mono text-xs uppercase tracking-wide text-ink-2">
        Step {step} of 3
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {step === 1 && (
          <>
            <div>
              <Label htmlFor="schoolName">School name</Label>
              <Input id="schoolName" className="mt-1.5" {...register("schoolName")} />
              {errors.schoolName && <p className="mt-1 text-xs text-red">{errors.schoolName.message}</p>}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" className="mt-1.5" {...register("city")} />
                {errors.city && <p className="mt-1 text-xs text-red">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="studentCount">Approx. student count</Label>
                <Input id="studentCount" type="number" min={1} className="mt-1.5" {...register("studentCount", { valueAsNumber: true })} />
                {errors.studentCount && <p className="mt-1 text-xs text-red">{errors.studentCount.message}</p>}
              </div>
            </div>
            <div>
              <Label>Grade levels</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {GRADE_LEVELS.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => toggle("gradeLevels", grade)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                      gradeLevels?.includes(grade)
                        ? "border-ink bg-ink text-white"
                        : "border-line text-ink-2 hover:border-ink"
                    )}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              {errors.gradeLevels && <p className="mt-1 text-xs text-red">{errors.gradeLevels.message}</p>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="contactName">Your name</Label>
                <Input id="contactName" className="mt-1.5" {...register("contactName")} />
                {errors.contactName && <p className="mt-1 text-xs text-red">{errors.contactName.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactRole">Your role</Label>
                <Input id="contactRole" placeholder="Principal, STEM coordinator…" className="mt-1.5" {...register("contactRole")} />
                {errors.contactRole && <p className="mt-1 text-xs text-red">{errors.contactRole.message}</p>}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+92 3XX XXXXXXX" className="mt-1.5" {...register("phone")} />
                {errors.phone && <p className="mt-1 text-xs text-red">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="mt-1.5" {...register("email")} />
                {errors.email && <p className="mt-1 text-xs text-red">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp (if different)</Label>
              <Input id="whatsapp" type="tel" className="mt-1.5" {...register("whatsapp")} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <Label>What are you interested in?</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggle("interests", interest)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                      interests?.includes(interest)
                        ? "border-ink bg-ink text-white"
                        : "border-line text-ink-2 hover:border-ink"
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              {errors.interests && <p className="mt-1 text-xs text-red">{errors.interests.message}</p>}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="preferredDate">Preferred demo date</Label>
                <Input id="preferredDate" type="date" className="mt-1.5" {...register("preferredDate")} />
                {errors.preferredDate && <p className="mt-1 text-xs text-red">{errors.preferredDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" value="Pakistan Standard Time (PKT)" disabled className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Anything else we should know?</Label>
              <Controller
                control={control}
                name="notes"
                render={({ field }) => (
                  <Textarea id="notes" rows={3} className="mt-1.5" {...field} />
                )}
              />
            </div>
          </>
        )}

        <div className="mt-2 flex items-center justify-between">
          {step > 1 ? (
            <Button type="button" variant="ghost" onClick={back}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <Button
              type="button"
              onClick={next}
              className="rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
            >
              {isSubmitting ? "Sending…" : "Submit request"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
