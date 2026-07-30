import Link from "next/link";
import { ArrowBubble } from "@/components/features/ArrowBubble";
import { cn } from "@/lib/utils";

const COLOR_STYLES = {
  orange: "bg-orange-soft",
  blue: "bg-blue-soft",
  red: "bg-red-soft",
  purple: "bg-purple-soft",
  green: "bg-green-soft",
  yellow: "bg-yellow-soft",
  pink: "bg-pink-soft",
} as const;

export type DepartmentColor = keyof typeof COLOR_STYLES;

export function DepartmentCard({
  href,
  color,
  title,
  subtitle,
  count,
  className,
}: {
  href: string;
  color: DepartmentColor;
  title: string;
  subtitle: string;
  count?: number;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-[32px] p-7 transition-transform duration-300 hover:-translate-y-1",
        COLOR_STYLES[color],
        className
      )}
    >
      <div className="flex items-start justify-between">
        {typeof count === "number" && (
          <span className="font-mono text-xs uppercase tracking-wide text-ink-2">
            {count} products
          </span>
        )}
        <ArrowBubble className="ml-auto" />
      </div>
      <div>
        <h3 className="font-serif text-2xl text-ink">{title}</h3>
        <p className="mt-1 text-sm text-ink-2">{subtitle}</p>
      </div>
    </Link>
  );
}
