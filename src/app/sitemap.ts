import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL("/", site.url).href, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/contact", site.url).href, changeFrequency: "monthly", priority: .7 },
  ];
}
