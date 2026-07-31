"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { submitContactForm } from "@/lib/actions/inquiries";
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

const SUBJECTS = [
  { value: "general", label: "General" },
  { value: "sales", label: "Sales" },
  { value: "schools", label: "Schools" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership" },
] as const;

const contactSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  subject: z.enum(["general", "sales", "schools", "support", "partnership"]),
  message: z.string().min(10, "Tell us a little more (10+ characters)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: "general" },
  });

  async function onSubmit(values: ContactFormValues) {
    const result = await submitContactForm(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Message sent — we'll reply within 24 hours");
    reset({ subject: "general", name: "", email: "", phone: "", message: "" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" className="mt-1.5" {...register("name")} />
        {errors.name && (
          <p className="mt-1 text-xs text-red">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-1.5" {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-xs text-red">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" placeholder="+92 3XX XXXXXXX" className="mt-1.5" {...register("phone")} />
          {errors.phone && (
            <p className="mt-1 text-xs text-red">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Controller
          control={control}
          name="subject"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="subject" className="mt-1.5 w-full">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} className="mt-1.5" {...register("message")} />
        {errors.message && (
          <p className="mt-1 text-xs text-red">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-2 self-start rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
