export const ORDER_STATUSES = [
  "pending",
  "phone_confirmed",
  "payment_pending",
  "paid",
  "dispatched",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  phone_confirmed: "Phone confirmed",
  payment_pending: "Payment pending",
  paid: "Paid",
  dispatched: "Dispatched",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const ORDER_STATUS_STYLE: Record<string, string> = {
  pending: "bg-surface-2 text-ink-2",
  phone_confirmed: "bg-blue-soft text-blue",
  payment_pending: "bg-yellow-soft text-yellow",
  paid: "bg-green-soft text-green",
  dispatched: "bg-purple-soft text-purple",
  delivered: "bg-green-soft text-green",
  completed: "bg-green-soft text-green",
  cancelled: "bg-red-soft text-red",
  refunded: "bg-red-soft text-red",
};
