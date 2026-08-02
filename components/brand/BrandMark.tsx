import Image from "next/image";
import { cn } from "@/lib/utils";

const LETTERS: { char: string; color: string }[] = [
  { char: "B", color: "var(--orange)" },
  { char: "i", color: "var(--blue)" },
  { char: "z", color: "var(--purple)" },
  { char: "m", color: "var(--yellow)" },
  { char: "i", color: "var(--green)" },
];

// logo-icon.png is 660x470 — height drives the box, width follows that ratio
const ICON_ASPECT = 660 / 470;

const SIZES = {
  sm: { text: "text-xl", iconHeight: 34 },
  md: { text: "text-2xl", iconHeight: 42 },
  lg: { text: "text-4xl", iconHeight: 64 },
} as const;

export function BrandMark({
  size = "md",
  className,
  priority,
}: {
  size?: keyof typeof SIZES;
  className?: string;
  priority?: boolean;
}) {
  const { text, iconHeight } = SIZES[size];
  const iconWidth = Math.round(iconHeight * ICON_ASPECT);

  return (
    <span
      className={cn("inline-flex items-center gap-2 select-none", className)}
      aria-label="Bizmi"
    >
      <Image
        src="/images/logo-icon.png"
        alt=""
        width={iconWidth}
        height={iconHeight}
        priority={priority}
        className="shrink-0"
      />
      <span className={cn("font-serif font-semibold tracking-tight", text)}>
        {LETTERS.map((letter, i) => (
          <span key={i} style={{ color: letter.color }}>
            {letter.char}
          </span>
        ))}
      </span>
    </span>
  );
}
