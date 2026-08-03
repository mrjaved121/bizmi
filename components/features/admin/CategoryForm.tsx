"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/lib/actions/admin-categories";
import type { CategoryOption } from "@/lib/data/admin-categories";
import { COLOR_TO_SOFT_BG } from "@/lib/product-visuals";
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

const NO_PARENT = "none";
const COLORS = Object.keys(COLOR_TO_SOFT_BG);

const schema = z.object({
  name: z.string().min(2, "Enter a category name"),
  nameUr: z.string().optional(),
  slug: z.string().min(2, "Enter a slug").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  color: z.string().optional(),
  orderIndex: z.number({ error: "Enter a position" }).min(0, "Enter a position"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function CategoryForm({
  categoryId,
  parentOptions,
  defaultValues,
}: {
  categoryId?: string;
  parentOptions: CategoryOption[];
  defaultValues: FormValues;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  const parentId = useWatch({ control, name: "parentId" });
  const color = useWatch({ control, name: "color" });
  const isActive = useWatch({ control, name: "isActive" });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const input = { ...values, parentId: values.parentId === NO_PARENT ? "" : (values.parentId ?? "") };
    const result = categoryId ? await updateCategory(categoryId, input) : await createCategory(input);

    if (result && !result.ok) {
      setFormError(result.error);
      return;
    }
    if (categoryId) {
      toast.success("Category updated.");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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

      <div>
        <Label htmlFor="nameUr">Name (Urdu)</Label>
        <Input id="nameUr" dir="rtl" className="mt-1.5" {...register("nameUr")} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} className="mt-1.5" {...register("description")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="parent">Parent category</Label>
          <Select
            value={parentId || NO_PARENT}
            onValueChange={(v) => {
              if (v) setValue("parentId", v, { shouldValidate: true });
            }}
          >
            <SelectTrigger id="parent" className="mt-1.5 w-full">
              <SelectValue placeholder="No parent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_PARENT}>No parent</SelectItem>
              {parentOptions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.depth > 0 ? `${"— ".repeat(c.depth)}${c.name}` : c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Select
            value={color}
            onValueChange={(v) => {
              if (v) setValue("color", v, { shouldValidate: true });
            }}
          >
            <SelectTrigger id="color" className="mt-1.5 w-full">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map((c) => (
                <SelectItem key={c} value={c}>
                  <span className={cn("h-3 w-3 rounded-full", COLOR_TO_SOFT_BG[c])} aria-hidden />
                  {c[0].toUpperCase() + c.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="orderIndex">Order</Label>
          <Input
            id="orderIndex"
            type="number"
            min={0}
            className="mt-1.5"
            {...register("orderIndex", { valueAsNumber: true })}
          />
          {errors.orderIndex && <p className="mt-1 text-xs text-red">{errors.orderIndex.message}</p>}
        </div>
        <div>
          <Label>Status</Label>
          <div className="mt-1.5">
            <button
              type="button"
              onClick={() => setValue("isActive", !isActive, { shouldValidate: true })}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                isActive ? "border-ink bg-ink text-white" : "border-line text-ink-2 hover:border-ink"
              )}
            >
              {isActive ? "Active" : "Inactive"}
            </button>
          </div>
        </div>
      </div>

      {formError && <p className="text-sm text-red">{formError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-orange px-6 py-3 text-white hover:bg-orange/90"
      >
        {isSubmitting ? "Saving…" : categoryId ? "Save changes" : "Create category"}
      </Button>
    </form>
  );
}
