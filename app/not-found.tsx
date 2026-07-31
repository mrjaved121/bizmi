import Link from "next/link";
import { TopBar } from "@/components/features/home/TopBar";
import { Nav } from "@/components/features/home/Nav";
import { Footer } from "@/components/features/home/Footer";
import { RobotMascot } from "@/components/brand/RobotMascot";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <TopBar />
      <Nav />
      <main className="flex-1">
        <section className="py-16 sm:py-24">
          <div className="mx-auto flex max-w-lg flex-col items-center px-6 text-center">
            <div className="w-40">
              <RobotMascot pose="confused" />
            </div>
            <h1 className="mt-6 font-serif text-3xl text-ink">
              This page took a wrong turn.
            </h1>
            <p className="mt-3 text-ink-2">
              The link might be broken, or the page moved.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
                nativeButton={false}
                render={<Link href="/" />}
              >
                Back to home
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-[1.5px] border-ink px-6 py-3.5 text-ink hover:bg-ink hover:text-white"
                nativeButton={false}
                render={<Link href="/shop" />}
              >
                Shop kits
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-ink-2">
              <Link href="/digital" className="hover:text-ink hover:underline">
                Digital projects
              </Link>
              <span className="text-line">·</span>
              <Link href="/schools" className="hover:text-ink hover:underline">
                For schools
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
