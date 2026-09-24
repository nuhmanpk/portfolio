import type { MetadataRoute } from "next";
import { SITE_URL, url } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: url("llms.txt"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: url("llms-full.txt"), lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}
