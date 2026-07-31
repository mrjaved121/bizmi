import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { formatPkr } from "@/lib/format";

export interface OrderConfirmationEmailProps {
  orderNumber: string;
  successUrl: string;
  customerName: string;
  items: { name: string; quantity: number; lineTotalPkr: number }[];
  subtotalPkr: number;
  deliveryFeePkr: number;
  totalPkr: number;
  paymentMethod: "cod" | "bank_transfer";
  shippingCity: string;
  shippingProvince: string;
  hasDigitalItems?: boolean;
}

const BRAND_ORANGE = "#FF6B35";
const INK = "#1A1A2E";
const INK_2 = "#5B5B70";
const SURFACE_2 = "#FAF6EC";
const LINE = "#E8E2D4";

export function OrderConfirmationEmail({
  orderNumber,
  successUrl,
  customerName,
  items,
  subtotalPkr,
  deliveryFeePkr,
  totalPkr,
  paymentMethod,
  shippingCity,
  shippingProvince,
  hasDigitalItems,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Order {orderNumber} confirmed — {formatPkr(totalPkr)}</Preview>
      <Body style={{ backgroundColor: SURFACE_2, fontFamily: "Helvetica, Arial, sans-serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ backgroundColor: "#FFFFFF", borderRadius: 24, padding: 32, maxWidth: 520 }}>
          <Text style={{ fontSize: 20, fontWeight: 700, color: INK, margin: 0 }}>Bizmi</Text>

          <Heading style={{ fontSize: 24, color: INK, marginTop: 24, marginBottom: 4 }}>
            Thanks, {customerName.split(" ")[0]} — order {orderNumber} is in.
          </Heading>
          <Text style={{ fontSize: 14, color: INK_2, marginTop: 0 }}>
            {hasDigitalItems
              ? "Your downloads are ready — click below to get them."
              : paymentMethod === "bank_transfer"
                ? "Share your payment receipt on WhatsApp and we'll confirm shortly."
                : "We'll call to confirm before dispatch."}
          </Text>

          <Section style={{ marginTop: 24 }}>
            {items.map((item) => (
              <Row key={item.name} style={{ paddingTop: 8, paddingBottom: 8, borderBottom: `1px solid ${LINE}` }}>
                <Column>
                  <Text style={{ fontSize: 14, color: INK_2, margin: 0 }}>
                    {item.name} × {item.quantity}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={{ fontSize: 14, color: INK, margin: 0, fontFamily: "monospace" }}>
                    {formatPkr(item.lineTotalPkr)}
                  </Text>
                </Column>
              </Row>
            ))}

            <Row style={{ paddingTop: 12 }}>
              <Column>
                <Text style={{ fontSize: 13, color: INK_2, margin: 0 }}>Subtotal</Text>
              </Column>
              <Column align="right">
                <Text style={{ fontSize: 13, color: INK, margin: 0, fontFamily: "monospace" }}>
                  {formatPkr(subtotalPkr)}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={{ fontSize: 13, color: INK_2, margin: 0 }}>Delivery</Text>
              </Column>
              <Column align="right">
                <Text style={{ fontSize: 13, color: INK, margin: 0, fontFamily: "monospace" }}>
                  {deliveryFeePkr === 0 ? "Free" : formatPkr(deliveryFeePkr)}
                </Text>
              </Column>
            </Row>
            <Hr style={{ borderColor: LINE, marginTop: 12, marginBottom: 12 }} />
            <Row>
              <Column>
                <Text style={{ fontSize: 16, fontWeight: 700, color: INK, margin: 0 }}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={{ fontSize: 18, fontWeight: 700, color: INK, margin: 0, fontFamily: "monospace" }}>
                  {formatPkr(totalPkr)}
                </Text>
              </Column>
            </Row>
          </Section>

          <Text style={{ fontSize: 13, color: INK_2, marginTop: 20 }}>
            Shipping to {customerName} — {shippingCity}, {shippingProvince}
          </Text>

          <Section style={{ textAlign: "center", marginTop: 28 }}>
            <Link
              href={successUrl}
              style={{
                backgroundColor: BRAND_ORANGE,
                color: "#FFFFFF",
                padding: "12px 28px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {hasDigitalItems ? "Get your downloads" : "View order details"}
            </Link>
          </Section>

          <Hr style={{ borderColor: LINE, marginTop: 32, marginBottom: 16 }} />
          <Text style={{ fontSize: 12, color: INK_2, textAlign: "center", margin: 0 }}>
            Bizmi — Pakistan&apos;s robotics &amp; STEM store
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmationEmail;
