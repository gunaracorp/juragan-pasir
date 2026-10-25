import type { MetadataRoute } from "next";
import { getCmsContent } from "@/lib/cms-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { settings } = await getCmsContent();
  return [
    {
      url: settings.domain,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "id-ID": settings.domain,
        },
      },
    },
  ];
}
