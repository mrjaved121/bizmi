import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DepartmentColor } from "@/components/features/DepartmentCard";

export interface CartItem {
  slug: string;
  name: string;
  categoryHref: string;
  color: DepartmentColor;
  brand?: string;
  pricePkr: number;
  compareAtPricePkr?: number;
  quantity: number;
  maxQuantity?: number;
  productType?: "physical" | "digital";
}

export function cartItemHref(item: Pick<CartItem, "slug" | "categoryHref" | "productType">): string {
  return item.productType === "digital" ? `/digital/${item.slug}` : `/shop/${item.categoryHref}/${item.slug}`;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug);
          if (existing) {
            const cap = existing.maxQuantity ?? Infinity;
            return {
              items: state.items.map((i) =>
                i.slug === item.slug
                  ? { ...i, quantity: Math.min(i.quantity + quantity, cap) }
                  : i
              ),
            };
          }
          const cap = item.maxQuantity ?? Infinity;
          return {
            items: [...state.items, { ...item, quantity: Math.min(quantity, cap) }],
          };
        }),

      removeItem: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),

      setQuantity: (slug, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.slug !== slug)
              : state.items.map((i) =>
                  i.slug === slug
                    ? { ...i, quantity: Math.min(quantity, i.maxQuantity ?? Infinity) }
                    : i
                ),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: "bizmi-cart" }
  )
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartSubtotalPkr(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.pricePkr * i.quantity, 0);
}
