import Image from "next/image";
import { COLOR_TO_SOFT_BG, COLOR_TO_ICON_TEXT, BrandIcon } from "@/lib/product-visuals";
import type { DepartmentColor } from "@/components/features/DepartmentCard";
import { cn } from "@/lib/utils";

// Shared thumbnail treatment for real product photos vs. the flat brand-icon
// fallback. Real photos are stock/Commons shots with their own white
// background and inconsistent framing — object-cover cropped them
// unpredictably and dropped them straight onto the department's tinted
// color, which showed as a harsh seam. object-contain + a white backing
// + proportional padding keeps the whole product in frame and reads as a
// deliberate "product on white" shot instead.
export function ProductThumb({
  coverImage,
  brand,
  name,
  color,
  iconClassName,
  imageClassName,
  sizes,
  priority,
  className,
  children,
}: {
  coverImage?: string | null;
  brand?: string;
  name: string;
  color: DepartmentColor;
  iconClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        coverImage ? "bg-white ring-1 ring-inset ring-line" : (COLOR_TO_SOFT_BG[color] ?? "bg-surface-2"),
        className
      )}
    >
      {!coverImage && (
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/30 blur-2xl" aria-hidden />
      )}
      {coverImage ? (
        <Image
          src={coverImage}
          alt={name}
          fill
          sizes={sizes ?? "200px"}
          priority={priority}
          className={cn("object-contain p-[10%]", imageClassName)}
        />
      ) : (
        <BrandIcon
          brand={brand}
          className={cn(COLOR_TO_ICON_TEXT[color] ?? "text-ink-2", iconClassName)}
          strokeWidth={1.5}
        />
      )}
      {children}
    </div>
  );
}
