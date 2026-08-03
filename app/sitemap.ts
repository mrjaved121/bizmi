import type { MetadataRoute } from "next";
import {
  getCategorySlugsForStaticParams,
  getProductSlugsForStaticParams,
} from "@/lib/data/products";
import { getCourseSlugsForStaticParams } from "@/lib/data/courses";
import { getDigitalProductSlugsForStaticParams } from "@/lib/data/digital";

const SITE_URL = "https://bizmi.pk";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/shop", priority: 0.9, changeFrequency: "daily" },
  { path: "/digital", priority: 0.7, changeFrequency: "weekly" },
  { path: "/courses", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/schools", priority: 0.8, changeFrequency: "monthly" },
  { path: "/schools/curriculum", priority: 0.6, changeFrequency: "monthly" },
  { path: "/schools/lab-setup", priority: 0.6, changeFrequency: "monthly" },
  { path: "/schools/teacher-training", priority: 0.6, changeFrequency: "monthly" },
  { path: "/schools/lesson-plans", priority: 0.6, changeFrequency: "monthly" },
  { path: "/schools/evaluation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/schools/book-demo", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/returns", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, courses, digitalProducts] = await Promise.all([
    getCategorySlugsForStaticParams(),
    getProductSlugsForStaticParams(),
    getCourseSlugsForStaticParams(),
    getDigitalProductSlugsForStaticParams(),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/shop/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/shop/${p.category}/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const courseEntries: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_URL}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const digitalEntries: MetadataRoute.Sitemap = digitalProducts.map((d) => ({
    url: `${SITE_URL}/digital/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries, ...courseEntries, ...digitalEntries];
}
