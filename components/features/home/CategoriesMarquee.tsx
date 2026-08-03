import Link from "next/link";
import { Bot } from "lucide-react";
import {
  COLOR_STYLES,
  COLOR_TO_ICON_TEXT,
  TITLE_ICON,
} from "@/components/features/DepartmentCard";
import { DEPARTMENTS } from "@/lib/mock/home";
import { cn } from "@/lib/utils";

export function CategoriesMarquee() {
  const items = [...DEPARTMENTS, ...DEPARTMENTS];

  return (
    <section className="border-y border-line bg-surface-2 py-8">
      <p className="mx-auto mb-4 max-w-7xl px-6 text-center font-mono text-xs uppercase tracking-widest text-ink-2">
        Explore every department
      </p>
      <div className="group relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-4 pr-4 group-hover:[animation-play-state:paused]">
          {items.map((dept, i) => {
            const Icon = TITLE_ICON[dept.title] ?? Bot;
            return (
              <Link
                key={`${dept.title}-${i}`}
                href={dept.href}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-line px-5 py-2.5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-sm",
                  COLOR_STYLES[dept.color]
                )}
              >
                <Icon
                  className={cn("h-5 w-5", COLOR_TO_ICON_TEXT[dept.color])}
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="font-serif text-lg text-ink">{dept.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
