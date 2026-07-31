"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Landmark, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCart, cartSubtotalPkr } from "@/lib/cart";
import { calculateDeliveryFee, PAKISTAN_PROVINCES } from "@/lib/shipping";
import { formatPkr } from "@/lib/format";
import { createOrder } from "@/lib/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  province: z.string().min(2, "Select a province"),
  city: z.string().min(2, "Enter your city"),
  address: z.string().min(5, "Enter your full address"),
  landmark: z.string().optional(),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer"]),
});

type FormValues = z.infer<typeof schema>;

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["fullName", "phone", "email"],
  2: ["province", "city", "address"],
  3: ["paymentMethod"],
};

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);
  const [step, setStep] = useState(1);

  const subtotal = cartSubtotalPkr(items);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "cod", province: "" },
  });

  const paymentMethod = useWatch({ control, name: "paymentMethod" });
  const province = useWatch({ control, name: "province" });

  async function next() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function onSubmit(values: FormValues) {
    if (step !== 3) return;
    const result = await createOrder({
      ...values,
      items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
    });

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    clearCart();
    router.push(`/checkout/success?order=${result.orderNumber}&token=${result.guestAccessToken}`);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white p-8 text-center">
        <p className="text-ink-2">Your cart is empty.</p>
        <Button
          className="mt-4 rounded-full bg-orange px-6 text-white hover:bg-orange/90"
          nativeButton={false}
          render={<Link href="/shop" />}
        >
          Explore kits
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs",
                  s <= step ? "bg-orange text-white" : "bg-surface-2 text-ink-2"
                )}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={cn("h-0.5 flex-1 rounded-full", s < step ? "bg-orange" : "bg-surface-2")} />
              )}
            </div>
          ))}
        </div>
        <p className="mb-6 font-mono text-xs uppercase tracking-wide text-ink-2">
          Step {step} of 3 — {["Contact", "Shipping", "Payment"][step - 1]}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {step === 1 && (
            <>
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" className="mt-1.5" {...register("fullName")} />
                {errors.fullName && <p className="mt-1 text-xs text-red">{errors.fullName.message}</p>}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+92 3XX XXXXXXX" className="mt-1.5" {...register("phone")} />
                  {errors.phone && <p className="mt-1 text-xs text-red">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" className="mt-1.5" {...register("email")} />
                  {errors.email ? (
                    <p className="mt-1 text-xs text-red">{errors.email.message}</p>
                  ) : (
                    <p className="mt-1 text-xs text-ink-2">We&apos;ll send your order confirmation here.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label htmlFor="province">Province</Label>
                <Select
                  value={province}
                  onValueChange={(v) => {
                    if (v) setValue("province", v, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger id="province" className="mt-1.5 w-full">
                    <SelectValue placeholder="Select a province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAKISTAN_PROVINCES.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province && <p className="mt-1 text-xs text-red">{errors.province.message}</p>}
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" className="mt-1.5" {...register("city")} />
                {errors.city && <p className="mt-1 text-xs text-red">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="address">Full address</Label>
                <Textarea id="address" rows={3} className="mt-1.5" {...register("address")} />
                {errors.address && <p className="mt-1 text-xs text-red">{errors.address.message}</p>}
              </div>
              <div>
                <Label htmlFor="landmark">Nearest landmark (optional)</Label>
                <Input id="landmark" className="mt-1.5" {...register("landmark")} />
              </div>
              <div>
                <Label htmlFor="deliveryNotes">Delivery notes (optional)</Label>
                <Textarea id="deliveryNotes" rows={2} className="mt-1.5" {...register("deliveryNotes")} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setValue("paymentMethod", "cod")}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                    paymentMethod === "cod" ? "border-orange bg-orange-soft" : "border-line hover:border-ink"
                  )}
                >
                  <Truck className="h-5 w-5 text-orange" />
                  <div>
                    <p className="font-serif text-ink">Cash on delivery</p>
                    <p className="text-sm text-ink-2">Pay when you receive your order.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setValue("paymentMethod", "bank_transfer")}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                    paymentMethod === "bank_transfer" ? "border-orange bg-orange-soft" : "border-line hover:border-ink"
                  )}
                >
                  <Landmark className="h-5 w-5 text-orange" />
                  <div>
                    <p className="font-serif text-ink">Bank transfer</p>
                    <p className="text-sm text-ink-2">We&apos;ll email account details to confirm.</p>
                  </div>
                </button>
              </div>

              {paymentMethod === "bank_transfer" && (
                <div className="rounded-2xl bg-surface-2 p-4 text-sm text-ink-2">
                  <p className="font-mono text-xs uppercase tracking-wide text-ink">Bank details</p>
                  <p className="mt-1">Bizmi (Pvt) Ltd · Meezan Bank · Faisalabad Branch</p>
                  <p>Account: 0123 4567 8901 · IBAN: PK00 MEZN 0000 0123 4567 8901</p>
                  <p className="mt-2">
                    We&apos;ll confirm your order once the receipt is verified — share it via WhatsApp
                    after placing your order.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="mt-2 flex items-center justify-between">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={back}>
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <Button
                key="next"
                type="button"
                onClick={next}
                className="rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
              >
                Next
              </Button>
            ) : (
              <Button
                key="submit"
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-orange px-6 py-3.5 text-white hover:bg-orange/90"
              >
                {isSubmitting ? "Placing order…" : "Place order"}
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl text-ink">Order summary</h2>
          <ul className="mt-4 flex flex-col gap-3 border-b border-line pb-4">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center justify-between text-sm">
                <span className="text-ink-2">
                  {item.name} <span className="font-mono">× {item.quantity}</span>
                </span>
                <span className="font-mono text-ink">{formatPkr(item.pricePkr * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between text-sm text-ink-2">
            <span>Subtotal</span>
            <span className="font-mono text-ink">{formatPkr(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-ink-2">
            <span>Delivery</span>
            <span className="font-mono text-ink">
              {deliveryFee === 0 ? "Free" : formatPkr(deliveryFee)}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="font-serif text-lg text-ink">Total</span>
            <span className="font-mono text-xl text-ink">{formatPkr(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
