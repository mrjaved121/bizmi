import type { Metadata } from "next";
import { LegalArticle, LegalSection } from "@/components/features/legal/LegalArticle";

export const metadata: Metadata = {
  title: "Privacy Policy | Bizmi",
  description: "How Bizmi collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalArticle title="Privacy policy" updated="July 2026">
      <LegalSection title="Information we collect">
        <p>
          When you create an account, place an order, or contact us, we
          collect information you provide directly — name, phone number,
          email, shipping address, and, for school orders, your
          institution&apos;s details. When you browse the site, we
          automatically collect basic usage data (pages viewed, device type,
          approximate location) via PostHog analytics.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <ul className="list-disc pl-5">
          <li>To process and deliver your orders, including COD confirmation calls</li>
          <li>To send order updates, digital download links, and support responses</li>
          <li>To respond to school inquiries and demo requests</li>
          <li>To improve the site based on aggregate usage patterns</li>
          <li>To send product and program updates, if you&apos;ve opted in to marketing emails</li>
        </ul>
      </LegalSection>

      <LegalSection title="Data sharing">
        <p>
          We share your information only where necessary to run the business:
          courier partners (TCS, Leopards, M&amp;P) for delivery, payment
          processors for future online payment options, and service
          providers we use to operate the site (Supabase for data storage,
          Resend for email, PostHog for analytics). We do not sell your
          personal information to third parties.
        </p>
      </LegalSection>

      <LegalSection title="Cookies & analytics">
        <p>
          We use cookies to keep you signed in, remember your cart, and
          measure site usage. You can disable cookies in your browser, though
          some features (like staying signed in) won&apos;t work correctly
          without them.
        </p>
      </LegalSection>

      <LegalSection title="Data retention">
        <p>
          We keep order and account records for as long as your account is
          active, and as required by Pakistani tax and commercial record-
          keeping law after that. You can request deletion of your account at
          any time via Settings or by contacting us.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          You can access, correct, or request deletion of your personal data
          at any time from your account settings, or by emailing
          hello@bizmi.pk. School accounts should contact their assigned
          Bizmi representative for institutional data requests.
        </p>
      </LegalSection>

      <LegalSection title="Children's privacy">
        <p>
          Bizmi&apos;s products are used by students, but accounts on this
          site are created and managed by parents, teachers, or school
          administrators — not by children directly. Student progress data
          within a classroom is managed by the teacher and school, consistent
          with the school&apos;s own data policies.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy: hello@bizmi.pk, or Bizmi, Faisalabad,
          Punjab, Pakistan.
        </p>
      </LegalSection>
    </LegalArticle>
  );
}
