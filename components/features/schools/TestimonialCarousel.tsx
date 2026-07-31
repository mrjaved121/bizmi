"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SchoolTestimonial {
  quote: string;
  attribution: string;
}

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: SchoolTestimonial[];
}) {
  const [index, setIndex] = useState(0);
  const active = testimonials[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 text-center">
      <p className="text-[clamp(22px,3.5vw,32px)] font-serif leading-snug tracking-[-0.01em] text-ink">
        &ldquo;{active.quote}&rdquo;
      </p>
      <p className="mt-5 font-mono text-sm uppercase tracking-wide text-ink-2">
        — {active.attribution}
      </p>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.attribution}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === index ? "bg-orange" : "bg-line"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
