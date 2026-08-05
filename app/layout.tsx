import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { FloatingWhatsApp } from "@/components/features/FloatingWhatsApp";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bizmi.pk"),
  title: "Bizmi — Learn. Build. Create. Innovate.",
  description:
    "Robotics kits, dev boards, sensors, and digital project packs for Pakistani schools and curious kids at home.",
  openGraph: {
    siteName: "Bizmi",
    type: "website",
    locale: "en_PK",
    images: [
      {
        url: "/images/hero-robot.png",
        width: 922,
        height: 784,
        alt: "Bizmi robotics mascot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bizmi",
  url: "https://bizmi.pk",
  logo: "https://bizmi.pk/images/logo-icon.png",
  description:
    "Robotics kits, dev boards, sensors, and STEM curriculum for Pakistani schools and curious kids at home.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Faisalabad",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-313-897-9696",
    contactType: "customer service",
    areaServed: "PK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        {children}
        <FloatingWhatsApp />
        <Toaster />
      </body>
    </html>
  );
}
