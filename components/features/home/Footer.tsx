import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { FOOTER_LINKS } from "@/lib/mock/home";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <BrandMark size="md" />
            <p className="mt-4 max-w-[220px] text-sm text-white/60">
              Robotics, electronics, and STEM for Pakistani schools and
              curious kids at home.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-white/40">
                {heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/40">
              Contact
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/70">
              <li>Faisalabad, Punjab, Pakistan</li>
              <li>+92 313 897 9696</li>
              <li>bizmistore007@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-10">
        <p className="px-6 text-center text-[clamp(28px,8vw,96px)] font-serif leading-none tracking-[-0.02em] text-white">
          Learn. Build. Create. Innovate.
        </p>
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <p className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center font-mono text-xs uppercase tracking-wide text-white/40">
          <span>© {new Date().getFullYear()} Bizmi. All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
}
