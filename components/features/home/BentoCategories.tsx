import { Eyebrow } from "@/components/features/Eyebrow";
import { DepartmentCard } from "@/components/features/DepartmentCard";
import { Reveal } from "@/components/features/Reveal";
import { DEPARTMENTS } from "@/lib/mock/home";
import { cn } from "@/lib/utils";

export function BentoCategories() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <Eyebrow>01 / Shop by department</Eyebrow>
          <h2 className="mt-4 text-[clamp(32px,5.5vw,56px)] font-serif leading-[1.02] tracking-[-0.02em] text-ink">
            Everything a young engineer needs
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((dept, i) => (
            <Reveal
              key={dept.href}
              delay={Math.min(i * 0.06, 0.3)}
              className={cn(
                dept.featured && "lg:col-span-2",
                dept.fullWidth && "sm:col-span-2 lg:col-span-3"
              )}
            >
              <DepartmentCard
                href={dept.href}
                color={dept.color}
                title={dept.title}
                subtitle={dept.subtitle}
                count={dept.count}
                image={dept.image}
                banner={dept.fullWidth}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
