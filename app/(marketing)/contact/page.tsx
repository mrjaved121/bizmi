import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/features/PageHero";
import { FaqAccordion } from "@/components/features/FaqAccordion";
import { Reveal } from "@/components/features/Reveal";
import { ContactForm } from "@/components/features/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Bizmi",
  description:
    "Get in touch with Bizmi — sales, schools, support, or partnerships. We reply within 24 hours.",
};

const INFO_CARDS = [
  {
    icon: MapPin,
    title: "Address",
    lines: ["Faisalabad, Punjab, Pakistan"],
    color: "text-orange",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    lines: ["+92 313 897 9696"],
    color: "text-green",
    href: "https://wa.me/923138979696?text=Hi%20Bizmi",
    linkLabel: "Chat on WhatsApp",
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+92 313 897 9696"],
    color: "text-blue",
    href: "tel:+923138979696",
    linkLabel: "Tap to call",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["bizmistore007@gmail.com"],
    color: "text-purple",
    href: "mailto:bizmistore007@gmail.com",
    linkLabel: "Send an email",
  },
];

const FAQS = [
  {
    question: "How fast do you ship?",
    answer:
      "Most orders dispatch within 24-48 hours and arrive in 2-4 days depending on your city, via TCS, Leopards, or M&P.",
  },
  {
    question: "What's your return policy?",
    answer:
      "Unopened kits can be returned within 7 days of delivery. See our Returns page for the full policy.",
  },
  {
    question: "Do you offer bulk pricing for schools?",
    answer:
      "Yes — orders of 10+ units qualify for institutional pricing and invoice-based payment. Book a demo and we'll send a custom quote.",
  },
  {
    question: "How do digital project packs get delivered?",
    answer:
      "Instantly by email after checkout, and always available to re-download from your account — no waiting on a courier.",
  },
  {
    question: "Do you run programs for schools outside Faisalabad?",
    answer:
      "Yes, we work with schools across all four provinces. Our lab setup and training teams travel nationwide.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <PageHero
        eyebrow="Contact"
        headline="Get in touch."
        subhead="Questions about an order, a bulk quote for your school, or just want to say hi — we reply within 24 hours."
      />

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[3fr_2fr]">
          <Reveal className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <ContactForm />
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {INFO_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={Math.min(i * 0.06, 0.24)}>
                <div className="rounded-3xl border border-line bg-white p-5">
                  <card.icon className={`h-6 w-6 ${card.color}`} strokeWidth={1.5} />
                  <p className="mt-3 font-serif text-lg text-ink">
                    {card.title}
                  </p>
                  {card.lines.map((line) => (
                    <p key={line} className="text-sm text-ink-2">
                      {line}
                    </p>
                  ))}
                  {card.href && (
                    <a
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel={card.href.startsWith("http") ? "noreferrer" : undefined}
                      className="mt-2 inline-block text-sm font-medium text-orange hover:underline"
                    >
                      {card.linkLabel} →
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
            <div className="rounded-3xl bg-surface-2 p-5 text-sm text-ink-2 sm:col-span-2 lg:col-span-1">
              We reply within 24 hours, Monday to Saturday.
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="overflow-hidden rounded-3xl border border-line">
            <iframe
              title="Bizmi location — Faisalabad, Pakistan"
              src="https://www.google.com/maps?q=Faisalabad,Pakistan&output=embed"
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-white pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-serif text-3xl text-ink">
            Frequently asked questions
          </h2>
          <div className="mt-8">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
