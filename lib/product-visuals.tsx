import { createElement } from "react";
import { Cpu, CircuitBoard, Microchip, type LucideIcon } from "lucide-react";

export const COLOR_TO_SOFT_BG: Record<string, string> = {
  orange: "bg-orange-soft",
  blue: "bg-blue-soft",
  red: "bg-red-soft",
  purple: "bg-purple-soft",
  green: "bg-green-soft",
  yellow: "bg-yellow-soft",
  pink: "bg-pink-soft",
};

export const COLOR_TO_ICON_TEXT: Record<string, string> = {
  orange: "text-orange",
  blue: "text-blue",
  red: "text-red",
  purple: "text-purple",
  green: "text-green",
  yellow: "text-yellow",
  pink: "text-pink",
};

const BRAND_ICON: Record<string, LucideIcon> = {
  Arduino: Cpu,
  "Raspberry Pi": CircuitBoard,
  STM32: Microchip,
};

export function iconForBrand(brand?: string): LucideIcon {
  return (brand && BRAND_ICON[brand]) || Cpu;
}

export function BrandIcon({
  brand,
  className,
  strokeWidth,
}: {
  brand?: string;
  className?: string;
  strokeWidth?: number;
}) {
  return createElement(iconForBrand(brand), { className, strokeWidth });
}
