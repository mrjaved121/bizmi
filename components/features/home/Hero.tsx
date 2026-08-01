"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/features/Eyebrow";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-32 h-64 w-64 rounded-full bg-blue/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-purple/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <Eyebrow>Robotics · electronics · STEM</Eyebrow>
          </motion.div>
          <motion.h1
            variants={item}
            className="mt-5 text-[clamp(40px,8.5vw,80px)] font-serif leading-[0.96] tracking-[-0.03em] text-ink"
          >
            Build your first{" "}
            <span className="wavy-underline font-serif italic text-orange">
              robot
            </span>{" "}
            this weekend
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-md text-base leading-relaxed text-ink-2"
          >
            Kits, dev boards, sensors, and downloadable project packs for
            Pakistani schools, teachers, and curious kids at home.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button
              size="lg"
              className="rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
              nativeButton={false}
              render={<Link href="/shop" />}
            >
              Shop kits
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-[1.5px] border-ink px-6 py-3.5 text-ink hover:bg-ink hover:text-white"
              nativeButton={false}
              render={<Link href="/schools/book-demo" />}
            >
              Book a school demo
            </Button>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              <Image
                src="/images/hero-robot.png"
                alt="Bizmi robot mascot waving, surrounded by robotics kit parts"
                fill
                priority
                sizes="(min-width: 1024px) 28rem, 80vw"
                className="object-contain drop-shadow-xl"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.5 },
              y: { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            }}
            className="absolute -left-4 top-6 rounded-2xl border border-line bg-white px-4 py-3 shadow-lg sm:-left-8"
          >
            <p className="font-mono text-2xl text-ink">80+</p>
            <p className="text-xs text-ink-2">products in stock</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.65 },
              y: {
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9,
              },
            }}
            className="absolute -right-2 bottom-10 rounded-2xl border border-line bg-white px-4 py-3 shadow-lg sm:-right-8"
          >
            <p className="font-mono text-2xl text-orange">500+</p>
            <p className="text-xs text-ink-2">students taught</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
