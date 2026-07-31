import { Reveal } from "@/components/features/Reveal";
import { cn } from "@/lib/utils";

export function StatRow({
  stats,
  className,
}: {
  stats: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-5 sm:grid-cols-4",
        className
      )}
    >
      {stats.map((stat, i) => (
        <Reveal key={stat.label} delay={Math.min(i * 0.06, 0.24)}>
          <div className="rounded-3xl border border-line bg-white p-6 text-center">
            <p className="font-mono text-3xl text-orange">{stat.value}</p>
            <p className="mt-1 text-sm text-ink-2">{stat.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
