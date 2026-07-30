"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.success("You're on the list — we'll be in touch");
    setEmail("");
  }

  return (
    <section className="rounded-t-[40px] bg-orange py-16 text-white sm:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-[clamp(32px,5.5vw,56px)] font-serif leading-[1.02] tracking-[-0.02em]">
          New kits, project packs, and workshop dates in your inbox
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-full border-transparent bg-white px-5 text-ink placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 rounded-full bg-ink px-6 text-white hover:bg-ink/90"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
