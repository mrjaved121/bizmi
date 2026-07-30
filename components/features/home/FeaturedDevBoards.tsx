"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eyebrow } from "@/components/features/Eyebrow";
import { ProductCard } from "@/components/features/ProductCard";
import { Reveal } from "@/components/features/Reveal";
import { cn } from "@/lib/utils";
import { FEATURED_DEV_BOARDS } from "@/lib/mock/home";

const TABS = [
  { key: "all", label: "All" },
  { key: "arduino", label: "Arduino" },
  { key: "raspberry-pi", label: "Raspberry Pi" },
  { key: "stm32", label: "STM32" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function FeaturedDevBoards() {
  const [active, setActive] = useState<TabKey>("all");

  const boards =
    active === "all"
      ? FEATURED_DEV_BOARDS
      : FEATURED_DEV_BOARDS.filter((b) => b.brandGroup === active);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>02 / Dev boards</Eyebrow>
            <h2 className="mt-4 text-[clamp(32px,5.5vw,56px)] font-serif leading-[1.02] tracking-[-0.02em] text-ink">
              Development boards
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
                  active === tab.key
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink-2 hover:border-ink"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {boards.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
