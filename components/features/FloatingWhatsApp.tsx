"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "923138979696"; // +92 313 897 9696

export function FloatingWhatsApp({ className }: { className?: string }) {
  const pathname = usePathname();

  // customer-facing contact channel — not useful (and just clutter) on the
  // internal staff admin dashboard
  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Bizmi on WhatsApp"
      className={cn(
        "group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:bottom-6 sm:right-6",
        className
      )}
    >
      <Image
        src="/images/logo-icon.png"
        alt=""
        width={45}
        height={32}
        className="h-auto w-9 transition-transform duration-300 group-hover:scale-110"
      />
      <span
        className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-green ring-2 ring-white"
        aria-hidden
      />
    </a>
  );
}
