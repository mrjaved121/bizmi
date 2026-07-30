import { Hero } from "@/components/features/home/Hero";
import { SchoolsMarquee } from "@/components/features/home/SchoolsMarquee";
import { BentoCategories } from "@/components/features/home/BentoCategories";
import { FeaturedDevBoards } from "@/components/features/home/FeaturedDevBoards";
import { SensorsGrid } from "@/components/features/home/SensorsGrid";
import { DigitalProjectsBlock } from "@/components/features/home/DigitalProjectsBlock";
import { ForSchoolsSection } from "@/components/features/home/ForSchoolsSection";
import { Testimonial } from "@/components/features/home/Testimonial";
import { NewsletterCTA } from "@/components/features/home/NewsletterCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SchoolsMarquee />
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
