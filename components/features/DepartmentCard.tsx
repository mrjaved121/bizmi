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
  className,
}: {
  href: string;
  color: DepartmentColor;
  title: string;
  subtitle: string;
  count?: number;
  image?: string;
  className?: string;
}) {
  const Icon = TITLE_ICON[title] ?? Bot;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-[32px] p-7 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
        COLOR_STYLES[color],
        className
      )}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
            aria-hidden
          />
        </>
      ) : (
        <Icon
          className={cn(
            "pointer-events-none absolute -right-4 -bottom-4 h-28 w-28 opacity-[0.14] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
            COLOR_TO_ICON_TEXT[color]
          )}
          strokeWidth={1.25}
          aria-hidden
        />
      )}

      <div className="relative flex items-start justify-between">
        {typeof count === "number" && (
          <span
            className={cn(
              "font-mono text-xs uppercase tracking-wide",
              image
                ? "rounded-full bg-white/90 px-3 py-1 text-ink shadow-sm backdrop-blur-sm"
                : "text-ink-2"
            )}
          >
            {count} products
          </span>
        )}
        <ArrowBubble className="ml-auto" />
      </div>
      <div className="relative">
        <h3 className={cn("font-serif text-2xl", image ? "text-white" : "text-ink")}>
          {title}
        </h3>
        <p className={cn("mt-1 text-sm", image ? "text-white/80" : "text-ink-2")}>
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
