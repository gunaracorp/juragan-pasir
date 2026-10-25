import type { MetadataRoute } from "next";
import { getCmsContent } from "@/lib/cms-content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getCmsContent();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: `${settings.domain}/sitemap.xml`,
    host: settings.domain,
  };
}
