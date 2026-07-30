import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ArrowBubble({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110",
        className
      )}
      aria-hidden
    >
      <ArrowUpRight className="h-5 w-5" />
    </span>
  );
}
