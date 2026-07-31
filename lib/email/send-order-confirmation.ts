import { getResendClient } from "@/lib/email/resend";
import { OrderConfirmationEmail } from "@/lib/email/templates/OrderConfirmationEmail";

export interface OrderConfirmationEmailInput {
  to: string;
  orderNumber: string;
  guestAccessToken: string;
  customerName: string;
  items: { name: string; quantity: number; lineTotalPkr: number }[];
  subtotalPkr: number;
  deliveryFeePkr: number;
  totalPkr: number;
  paymentMethod: "cod" | "bank_transfer";
  shippingCity: string;
  shippingProvince: string;
}

export async function sendOrderConfirmationEmail(input: OrderConfirmationEmailInput) {
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      `sendOrderConfirmationEmail: RESEND_API_KEY not configured, skipping email for order ${input.orderNumber}`
    );
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bizmi.pk";
  const successUrl = `${siteUrl}/checkout/success?order=${input.orderNumber}&token=${input.guestAccessToken}`;

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "orders@bizmi.pk",
      to: input.to,
      subject: `Order confirmed — ${input.orderNumber}`,
      react: OrderConfirmationEmail({
        orderNumber: input.orderNumber,
        successUrl,
        customerName: input.customerName,
        items: input.items,
        subtotalPkr: input.subtotalPkr,
        deliveryFeePkr: input.deliveryFeePkr,
        totalPkr: input.totalPkr,
        paymentMethod: input.paymentMethod,
        shippingCity: input.shippingCity,
        shippingProvince: input.shippingProvince,
      }),
    });
    if (error) {
      console.error(`sendOrderConfirmationEmail: Resend rejected order ${input.orderNumber}:`, error);
    }
  } catch (err) {
    console.error(`sendOrderConfirmationEmail: failed to send for order ${input.orderNumber}:`, err);
  }
}
