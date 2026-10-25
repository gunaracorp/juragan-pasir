import type { MetadataRoute } from "next";
<<<<<<< HEAD
import { getCmsContent } from "@/lib/cms-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { settings } = await getCmsContent();
  return [
    {
      url: settings.domain,
=======
import { SITE } from "@/lib/juragan-data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.domain,
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
<<<<<<< HEAD
          "id-ID": settings.domain,
=======
          "id-ID": SITE.domain,
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
        },
      },
    },
  ];
}
