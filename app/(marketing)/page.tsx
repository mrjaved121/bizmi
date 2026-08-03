import type { Metadata } from "next";
import { Hero } from "@/components/features/home/Hero";
import { CategoriesMarquee } from "@/components/features/home/CategoriesMarquee";
import { BentoCategories } from "@/components/features/home/BentoCategories";
import { FeaturedDevBoards } from "@/components/features/home/FeaturedDevBoards";
import { SensorsGrid } from "@/components/features/home/SensorsGrid";
import { DigitalProjectsBlock } from "@/components/features/home/DigitalProjectsBlock";
import { ForSchoolsSection } from "@/components/features/home/ForSchoolsSection";
import { Testimonial } from "@/components/features/home/Testimonial";
import { NewsletterCTA } from "@/components/features/home/NewsletterCTA";

export const metadata: Metadata = {
  title: "Bizmi — Robotics Kits, Arduino & Raspberry Pi for Pakistani Schools",
  description:
    "Shop robotics kits, Arduino, Raspberry Pi, STM32 dev boards, and sensors — plus curriculum and teacher training for Pakistani schools. Nationwide delivery, cash on delivery available.",
  openGraph: {
    title: "Bizmi — Learn. Build. Create. Innovate.",
    description:
      "Robotics kits, dev boards, sensors, and STEM curriculum for Pakistani schools and curious kids at home.",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesMarquee />
      <BentoCategories />
      <FeaturedDevBoards />
      <SensorsGrid />
      <DigitalProjectsBlock />
      <ForSchoolsSection />
      <Testimonial />
      <NewsletterCTA />
    </>
  );
}
