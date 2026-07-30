import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RobotMascot } from "@/components/brand/RobotMascot";
import { Eyebrow } from "@/components/features/Eyebrow";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <Eyebrow>Robotics · electronics · STEM</Eyebrow>
          <h1 className="mt-5 text-[clamp(40px,8.5vw,80px)] font-serif leading-[0.96] tracking-[-0.03em] text-ink">
            Build your first{" "}
            <span className="wavy-underline font-serif italic text-orange">
              robot
            </span>{" "}
            this weekend
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-2">
            Kits, dev boards, sensors, and downloadable project packs for
            Pakistani schools, teachers, and curious kids at home.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
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
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <RobotMascot pose="waving" className="drop-shadow-xl" />

          <div className="absolute -left-4 top-6 rounded-2xl border border-line bg-white px-4 py-3 shadow-lg sm:-left-8">
            <p className="font-mono text-2xl text-ink">80+</p>
            <p className="text-xs text-ink-2">products in stock</p>
          </div>

          <div className="absolute -right-2 bottom-10 rounded-2xl border border-line bg-white px-4 py-3 shadow-lg sm:-right-8">
            <p className="font-mono text-2xl text-orange">500+</p>
            <p className="text-xs text-ink-2">students taught</p>
          </div>
        </div>
      </div>
    </section>
  );
}
