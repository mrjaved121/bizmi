export const FREE_SHIPPING_THRESHOLD_PKR = 5000;
export const FLAT_DELIVERY_FEE_PKR = 250;

export function calculateDeliveryFee(subtotalPkr: number): number {
  return subtotalPkr >= FREE_SHIPPING_THRESHOLD_PKR ? 0 : FLAT_DELIVERY_FEE_PKR;
}

export const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
] as const;
