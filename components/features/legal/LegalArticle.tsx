import { Eyebrow } from "@/components/features/Eyebrow";

export function LegalArticle({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-5 font-serif text-4xl text-ink">{title}</h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-wide text-ink-2">
          Last updated {updated}
        </p>
        <div className="mt-10 flex flex-col gap-8">{children}</div>
      </div>
    </section>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-serif text-xl text-ink">{title}</h2>
      <div className="mt-2 flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
        {children}
      </div>
    </div>
  );
}
