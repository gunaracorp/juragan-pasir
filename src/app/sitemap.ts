import type { MetadataRoute } from "next";
import { SITE } from "@/lib/juragan-data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.domain,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "id-ID": SITE.domain,
        },
      },
    },
  ];
}
