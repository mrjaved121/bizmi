"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/lib/actions/admin-products";
import type { CategoryOption } from "@/lib/data/admin-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const schema = z.object({
  productType: z.enum(["physical", "digital"]),
  name: z.string().min(2, "Enter a product name"),
  nameUr: z.string().optional(),
  slug: z.string().min(2, "Enter a slug").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  shortDescription: z.string().optional(),
  shortDescriptionUr: z.string().optional(),
  longDescription: z.string().optional(),
  longDescriptionUr: z.string().optional(),
  pricePkr: z.number({ error: "Enter a price" }).min(0, "Enter a price"),
  compareAtPricePkr: z.number().optional(),
  costPkr: z.number().optional(),
  weightGrams: z.number().optional(),
  inventoryCount: z.number({ error: "Enter a stock count" }).min(0, "Enter a stock count"),
  lowStockThreshold: z.number().optional(),
  ageMin: z.number().optional(),
  ageMax: z.number().optional(),
  gradeTags: z.array(z.string()).optional(),
  difficulty: z.string().optional(),
  featured: z.boolean(),
  isBestseller: z.boolean(),
  isNew: z.boolean(),
  isActive: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const OPTIONAL_NUMBER = { setValueAs: (v: string) => (v === "" ? undefined : Number(v)) };

export function ProductForm({
  productId,
  categories,
  defaultValues,
}: {
  productId?: string;
  categories: CategoryOption[];
  defaultValues: FormValues;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [gradeTagsText, setGradeTagsText] = useState(() => (defaultValues.gradeTags ?? []).join(", "));
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  const productType = useWatch({ control, name: "productType" });
  const categoryId = useWatch({ control, name: "categoryId" });
  const difficulty = useWatch({ control, name: "difficulty" });
  const featured = useWatch({ control, name: "featured" });
  const isBestseller = useWatch({ control, name: "isBestseller" });
  const isNew = useWatch({ control, name: "isNew" });
  const isActive = useWatch({ control, name: "isActive" });
  const isDigital = productType === "digital";

  function commitGradeTags() {
    setValue(
      "gradeTags",
      gradeTagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );
  }

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const result = productId ? await updateProduct(productId, values) : await createProduct(values);

    if (result && !result.ok) {
      setFormError(result.error);
      return;
    }
    if (productId) {
      toast.success("Product updated.");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {!productId && (
        <div>
          <Label>Type</Label>
          <div className="mt-1.5 flex gap-2">
            {(["physical", "digital"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue("productType", type, { shouldValidate: true })}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm capitalize transition-colors",
                  productType === type ? "border-ink bg-ink text-white" : "border-line text-ink-2 hover:border-ink"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" className="mt-1.5" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" className="mt-1.5" {...register("slug")} />
          {errors.slug && <p className="mt-1 text-xs text-red">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" className="mt-1.5" {...register("sku")} />
        </div>
        {!isDigital && (
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" className="mt-1.5" {...register("brand")} />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={categoryId}
          onValueChange={(v) => {
            if (v) setValue("categoryId", v, { shouldValidate: true });
          }}
        >
          <SelectTrigger id="category" className="mt-1.5 w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.depth > 0 ? `${"— ".repeat(c.depth)}${c.name}` : c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="shortDescription">Short description</Label>
        <Textarea id="shortDescription" rows={3} className="mt-1.5" {...register("shortDescription")} />
      </div>

      <div>
        <Label htmlFor="longDescription">Full description</Label>
        <Textarea id="longDescription" rows={8} className="mt-1.5" {...register("longDescription")} />
      </div>

      <div className={cn("grid gap-5", isDigital ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
        <div>
          <Label htmlFor="pricePkr">Price (PKR)</Label>
          <Input id="pricePkr" type="number" min={0} className="mt-1.5" {...register("pricePkr", { valueAsNumber: true })} />
          {errors.pricePkr && <p className="mt-1 text-xs text-red">{errors.pricePkr.message}</p>}
        </div>
        <div>
          <Label htmlFor="compareAtPricePkr">Compare-at price</Label>
          <Input
            id="compareAtPricePkr"
            type="number"
            min={0}
            className="mt-1.5"
            {...register("compareAtPricePkr", OPTIONAL_NUMBER)}
          />
        </div>
        {!isDigital && (
          <div>
            <Label htmlFor="inventoryCount">Stock</Label>
            <Input
              id="inventoryCount"
              type="number"
              min={0}
              className="mt-1.5"
              {...register("inventoryCount", { valueAsNumber: true })}
            />
            {errors.inventoryCount && <p className="mt-1 text-xs text-red">{errors.inventoryCount.message}</p>}
          </div>
        )}
      </div>

      <div className={cn("grid gap-5", isDigital ? "sm:grid-cols-1" : "sm:grid-cols-3")}>
        <div>
          <Label htmlFor="costPkr">Cost (PKR)</Label>
          <Input id="costPkr" type="number" min={0} className="mt-1.5" {...register("costPkr", OPTIONAL_NUMBER)} />
        </div>
        {!isDigital && (
          <>
            <div>
              <Label htmlFor="weightGrams">Weight (g)</Label>
              <Input
                id="weightGrams"
                type="number"
                min={0}
                className="mt-1.5"
                {...register("weightGrams", OPTIONAL_NUMBER)}
              />
            </div>
            <div>
              <Label htmlFor="lowStockThreshold">Low stock threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min={0}
                className="mt-1.5"
                {...register("lowStockThreshold", OPTIONAL_NUMBER)}
              />
            </div>
          </>
        )}
      </div>

      {!isDigital && (
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={difficulty}
            onValueChange={(v) => {
              if (v) setValue("difficulty", v, { shouldValidate: true });
            }}
          >
            <SelectTrigger id="difficulty" className="mt-1.5 w-full">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d[0].toUpperCase() + d.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="ageMin">Age from</Label>
          <Input id="ageMin" type="number" min={0} className="mt-1.5" {...register("ageMin", OPTIONAL_NUMBER)} />
        </div>
        <div>
          <Label htmlFor="ageMax">Age to</Label>
          <Input id="ageMax" type="number" min={0} className="mt-1.5" {...register("ageMax", OPTIONAL_NUMBER)} />
        </div>
      </div>

      <div>
        <Label htmlFor="gradeTags">Grade tags</Label>
        <Input
          id="gradeTags"
          placeholder="e.g. grade-3, grade-4, grade-5"
          className="mt-1.5"
          value={gradeTagsText}
          onChange={(e) => setGradeTagsText(e.target.value)}
          onBlur={commitGradeTags}
        />
        <p className="mt-1 text-xs text-ink-2">Comma-separated.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        {[
          { key: "featured" as const, label: "Featured", value: featured },
          { key: "isBestseller" as const, label: "Bestseller", value: isBestseller },
          { key: "isNew" as const, label: "New", value: isNew },
          { key: "isActive" as const, label: "Active", value: isActive },
        ].map((flag) => (
          <button
            key={flag.key}
            type="button"
            onClick={() => setValue(flag.key, !flag.value, { shouldValidate: true })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              flag.value ? "border-ink bg-ink text-white" : "border-line text-ink-2 hover:border-ink"
            )}
          >
            {flag.label}
          </button>
        ))}
      </div>

      <Accordion className="rounded-2xl border border-line px-4">
        <AccordionItem value="urdu">
          <AccordionTrigger className="text-sm font-medium text-ink hover:no-underline">
            Urdu translations
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="nameUr">Name (Urdu)</Label>
              <Input id="nameUr" dir="rtl" className="mt-1.5" {...register("nameUr")} />
            </div>
            <div>
              <Label htmlFor="shortDescriptionUr">Short description (Urdu)</Label>
              <Textarea id="shortDescriptionUr" dir="rtl" rows={3} className="mt-1.5" {...register("shortDescriptionUr")} />
            </div>
            <div>
              <Label htmlFor="longDescriptionUr">Full description (Urdu)</Label>
              <Textarea id="longDescriptionUr" dir="rtl" rows={6} className="mt-1.5" {...register("longDescriptionUr")} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="seo">
          <AccordionTrigger className="text-sm font-medium text-ink hover:no-underline">SEO</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="metaTitle">Meta title</Label>
              <Input id="metaTitle" className="mt-1.5" {...register("metaTitle")} />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta description</Label>
              <Textarea id="metaDescription" rows={3} className="mt-1.5" {...register("metaDescription")} />
            </div>
            <div>
              <Label htmlFor="ogImage">Social share image URL</Label>
              <Input id="ogImage" className="mt-1.5" {...register("ogImage")} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {formError && <p className="text-sm text-red">{formError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-orange px-6 py-3 text-white hover:bg-orange/90"
      >
        {isSubmitting ? "Saving…" : productId ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
