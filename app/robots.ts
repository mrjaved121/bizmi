import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/checkout", "/cart", "/auth"],
    },
    sitemap: "https://bizmi.pk/sitemap.xml",
  };
}
