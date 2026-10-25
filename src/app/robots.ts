import type { MetadataRoute } from "next";
<<<<<<< HEAD
import { getCmsContent } from "@/lib/cms-content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getCmsContent();
=======
import { SITE } from "@/lib/juragan-data";

export default function robots(): MetadataRoute.Robots {
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
<<<<<<< HEAD
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: `${settings.domain}/sitemap.xml`,
    host: settings.domain,
=======
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE.domain}/sitemap.xml`,
    host: SITE.domain,
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  };
}
