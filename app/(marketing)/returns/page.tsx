import type { Metadata } from "next";
import { LegalArticle, LegalSection } from "@/components/features/legal/LegalArticle";

export const metadata: Metadata = {
  title: "Returns & Refunds | Bizmi",
  description: "Our return policy for physical kits and digital project packs.",
};

export default function ReturnsPage() {
  return (
    <LegalArticle title="Returns & refunds" updated="July 2026">
      <LegalSection title="Physical products">
        <p>
          Unopened kits and dev boards can be returned within 7 days of
          delivery for a full refund or exchange. The item must be in its
          original packaging with all components included. Once a kit&apos;s
          seal is broken, it can only be returned if the item is faulty.
        </p>
      </LegalSection>

      <LegalSection title="Digital products">
        <p>
          Because project packs are delivered instantly and can be downloaded
          immediately, digital products are non-refundable once the download
          link has been accessed. If a file is corrupted or missing, contact
          us and we&apos;ll fix it — that&apos;s a delivery problem, not a
          refund situation.
        </p>
      </LegalSection>

      <LegalSection title="Damaged or defective items">
        <p>
          If something arrives damaged or doesn&apos;t work as described,
          send us a photo within 48 hours of delivery and we&apos;ll send a
          replacement or issue a refund — no need to return the item first in
          most cases.
        </p>
      </LegalSection>

      <LegalSection title="How to request a return">
        <ol className="list-decimal pl-5">
          <li>Email bizmistore007@gmail.com or WhatsApp +92 313 897 9696 with your order number</li>
          <li>We&apos;ll confirm eligibility and arrange a courier pickup</li>
          <li>Once received and inspected, your refund is processed within 5-7 business days</li>
        </ol>
      </LegalSection>

      <LegalSection title="Refund method">
        <p>
          Refunds for Cash on Delivery orders are sent via bank transfer or
          JazzCash/EasyPaisa. Refunds for bank-transfer orders go back to the
          original account.
        </p>
      </LegalSection>

      <LegalSection title="School & bulk orders">
        <p>
          Institutional orders placed via invoice follow the terms agreed in
          the purchase order — typically a longer inspection window given
          procurement timelines. Contact your Bizmi representative directly.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>bizmistore007@gmail.com · +92 313 897 9696</p>
      </LegalSection>
    </LegalArticle>
  );
}
