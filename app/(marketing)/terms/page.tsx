import type { Metadata } from "next";
import { LegalArticle, LegalSection } from "@/components/features/legal/LegalArticle";

export const metadata: Metadata = {
  title: "Terms of Service | Bizmi",
  description: "The terms that govern your use of Bizmi and any purchase you make.",
};

export default function TermsPage() {
  return (
    <LegalArticle title="Terms of service" updated="July 2026">
      <LegalSection title="Acceptance of terms">
        <p>
          By using bizmi.pk or placing an order, you agree to these terms. If
          you&apos;re ordering on behalf of a school, you&apos;re confirming
          you have the authority to do so.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          You&apos;re responsible for keeping your account credentials secure
          and for activity that happens under your account. Teacher and
          student accounts within a classroom are managed by the classroom&apos;s
          teacher.
        </p>
      </LegalSection>

      <LegalSection title="Orders & payment">
        <ul className="list-disc pl-5">
          <li>Orders are confirmed once payment is received (COD: on delivery) or, for schools, once an invoice is issued and accepted</li>
          <li>We may contact you by phone to confirm a Cash on Delivery order before dispatch</li>
          <li>All prices are listed in PKR and include applicable taxes unless stated otherwise</li>
          <li>We reserve the right to cancel an order if an item is out of stock after purchase, with a full refund</li>
        </ul>
      </LegalSection>

      <LegalSection title="Pricing & availability">
        <p>
          Prices and inventory shown on the site are updated regularly but
          aren&apos;t guaranteed in real time. If a price or availability
          error occurs, we&apos;ll contact you before processing the order.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          Digital project packs, curriculum materials, and lesson plans are
          licensed for use by the purchasing individual, classroom, or
          school — not for resale, public redistribution, or republishing
          elsewhere. Course video content is for enrolled-student viewing
          only.
        </p>
      </LegalSection>

      <LegalSection title="Prohibited uses">
        <p>
          Don&apos;t use the site to violate any law, infringe on
          intellectual property, upload harmful code, or attempt to
          circumvent digital delivery protections (including the watermarking
          on downloadable PDFs).
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          Bizmi provides kits, curriculum, and services as described on the
          site. We&apos;re not liable for indirect or incidental damages
          arising from product use — kits involve small electronic
          components and should be used with the age-appropriate supervision
          noted on each product page.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of Pakistan. Any disputes will
          be handled in the courts of Faisalabad, Punjab.
        </p>
      </LegalSection>

      <LegalSection title="Changes to these terms">
        <p>
          We may update these terms from time to time. Material changes will
          be noted on this page with an updated date.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>Questions: hello@bizmi.pk.</p>
      </LegalSection>
    </LegalArticle>
  );
}
