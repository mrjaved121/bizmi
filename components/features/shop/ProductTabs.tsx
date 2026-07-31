"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  description?: string;
  specs: Record<string, string>;
  components: { name: string; qty: number; note?: string }[];
}

export function ProductTabs({ description, specs, components }: ProductTabsProps) {
  const specEntries = Object.entries(specs ?? {});
  const hasSpecs = specEntries.length > 0;
  const hasComponents = components.length > 0;

  const tabs = [
    { key: "description", label: "Description", available: !!description },
    { key: "specs", label: "Specs", available: hasSpecs },
    { key: "box", label: "What's in the box", available: hasComponents },
    { key: "reviews", label: "Reviews", available: true },
  ].filter((t) => t.available || t.key === "description");

  const [active, setActive] = useState(tabs[0]?.key ?? "description");

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-wide transition-colors",
              active === tab.key
                ? "border-orange text-ink"
                : "border-transparent text-ink-2 hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-8">
        {active === "description" && (
          <p className="max-w-2xl leading-relaxed text-ink-2">
            {description ?? "A full description for this product is coming soon."}
          </p>
        )}

        {active === "specs" && hasSpecs && (
          <div className="max-w-2xl overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-line">
                {specEntries.map(([key, value]) => (
                  <tr key={key}>
                    <td className="bg-surface-2 px-5 py-3 font-mono text-xs uppercase tracking-wide text-ink-2">
                      {key}
                    </td>
                    <td className="px-5 py-3 text-ink">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {active === "box" && hasComponents && (
          <ul className="max-w-2xl divide-y divide-line rounded-2xl border border-line">
            {components.map((item) => (
              <li key={item.name} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-ink">{item.name}</span>
                <span className="font-mono text-ink-2">× {item.qty}</span>
              </li>
            ))}
          </ul>
        )}

        {active === "reviews" && (
          <p className="max-w-2xl text-ink-2">
            No reviews yet — be the first to build with this one.
          </p>
        )}
      </div>
    </div>
  );
}
