import Link from "next/link";
import Image from "next/image";
import {
  Bot,
  Cpu,
  CircuitBoard,
  Microchip,
  Gauge,
  Download,
  BookOpen,
  Wrench,
  Users,
  FileText,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { ArrowBubble } from "@/components/features/ArrowBubble";
import { cn } from "@/lib/utils";

export const COLOR_STYLES = {
  orange: "bg-orange-soft",
  blue: "bg-blue-soft",
  red: "bg-red-soft",
  purple: "bg-purple-soft",
  green: "bg-green-soft",
  yellow: "bg-yellow-soft",
  pink: "bg-pink-soft",
} as const;

export const COLOR_TO_ICON_TEXT = {
  orange: "text-orange",
  blue: "text-blue",
  red: "text-red",
  purple: "text-purple",
  green: "text-green",
  yellow: "text-yellow",
  pink: "text-pink",
} as const;

export type DepartmentColor = keyof typeof COLOR_STYLES;

export const TITLE_ICON: Record<string, LucideIcon> = {
  "Robotics kits": Bot,
  Arduino: Cpu,
  "Raspberry Pi": CircuitBoard,
  STM32: Microchip,
  "Sensors & shields": Gauge,
  "Digital projects": Download,
  Curriculum: BookOpen,
  "Lab setup": Wrench,
  "Teacher training": Users,
  "Lesson plans": FileText,
  "Student evaluation": BarChart3,
};

export function DepartmentCard({
  href,
  color,
  title,
  subtitle,
  count,
  image,
  banner,
  className,
}: {
  href: string;
  color: DepartmentColor;
  title: string;
  subtitle: string;
  count?: number;
  image?: string;
  banner?: boolean;
  className?: string;
}) {
  const Icon = TITLE_ICON[title] ?? Bot;

  if (banner && !image) {
    return (
      <Link
        href={href}
        className={cn(
          "group relative flex h-full min-h-32 flex-wrap items-center justify-between gap-4 overflow-hidden rounded-[32px] border border-black/[0.06] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
          COLOR_STYLES[color],
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/60",
              COLOR_TO_ICON_TEXT[color]
            )}
          >
            <Icon className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-ink">{title}</h3>
            <p className="mt-1 text-sm text-ink-2">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {typeof count === "number" && (
            <span className="font-mono text-xs uppercase tracking-wide text-ink-2">
              {count} products
            </span>
          )}
          <ArrowBubble />
        </div>
      </Link>
    );
  }

  if (image) {
    return (
      <Link
        href={href}
        className={cn(
          "group relative flex h-full min-h-56 flex-col gap-4 overflow-hidden rounded-[32px] border border-black/[0.06] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
          COLOR_STYLES[color],
          className
        )}
      >
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl sm:h-44">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between">
            {typeof count === "number" && (
              <span className="rounded-full bg-white/90 px-3 py-1 font-mono text-xs uppercase tracking-wide text-ink shadow-sm backdrop-blur-sm">
                {count} products
              </span>
            )}
            <ArrowBubble className="ml-auto" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end px-2 pb-1">
          <h3 className="font-serif text-2xl text-ink">{title}</h3>
          <p className="mt-1 text-sm text-ink-2">{subtitle}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-[32px] border border-black/[0.06] p-7 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
        COLOR_STYLES[color],
        className
      )}
    >
      <Icon
        className={cn(
          "pointer-events-none absolute -right-4 -bottom-4 h-28 w-28 opacity-[0.14] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
          COLOR_TO_ICON_TEXT[color]
        )}
        strokeWidth={1.25}
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        {typeof count === "number" && (
          <span className="font-mono text-xs uppercase tracking-wide text-ink-2">
            {count} products
          </span>
        )}
        <ArrowBubble className="ml-auto" />
      </div>
      <div className="relative">
        <h3 className="font-serif text-2xl text-ink">{title}</h3>
        <p className="mt-1 text-sm text-ink-2">{subtitle}</p>
      </div>
    </Link>
  );
}
