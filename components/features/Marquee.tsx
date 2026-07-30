import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div className="flex w-max shrink-0 animate-[marquee_32s_linear_infinite] items-center gap-12 pr-12 group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-serif text-2xl text-ink-2 whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
