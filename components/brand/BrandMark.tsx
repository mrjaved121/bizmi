import { cn } from "@/lib/utils";

const LETTERS: { char: string; color: string }[] = [
  { char: "B", color: "var(--orange)" },
  { char: "i", color: "var(--blue)" },
  { char: "z", color: "var(--purple)" },
  { char: "m", color: "var(--yellow)" },
  { char: "i", color: "var(--green)" },
];

const SIZES = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
} as const;

export function BrandMark({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-serif font-semibold tracking-tight select-none",
        SIZES[size],
        className
      )}
      aria-label="Bizmi"
    >
      {LETTERS.map((letter, i) => (
        <span key={i} style={{ color: letter.color }}>
          {letter.char}
        </span>
      ))}
    </span>
  );
}
