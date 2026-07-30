import { cn } from "@/lib/utils";

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-2",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-orange" aria-hidden />
      {children}
    </div>
  );
}
