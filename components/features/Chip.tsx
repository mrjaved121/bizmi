import { cn } from "@/lib/utils";

const VARIANTS = {
  default: "bg-white border border-line text-ink-2",
  blue: "bg-blue-soft text-blue border-transparent",
  red: "bg-red-soft text-red border-transparent",
  purple: "bg-purple-soft text-purple border-transparent",
  green: "bg-green-soft text-green border-transparent",
  yellow: "bg-yellow-soft text-yellow border-transparent",
  orange: "bg-orange-soft text-orange border-transparent",
  pink: "bg-pink-soft text-pink border-transparent",
  dark: "bg-ink text-white border-transparent",
} as const;

export type ChipVariant = keyof typeof VARIANTS;

export function Chip({
  variant = "default",
  className,
  children,
}: {
  variant?: ChipVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
