import type { MetadataRoute } from "next";
import { getCmsContent } from "@/lib/cms-content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { settings } = await getCmsContent();
  return {
    name: `${settings.siteName} — ${settings.tagline}`,
    short_name: settings.siteName.split(" ").slice(0, 2).join(" "),
    description: settings.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#021710",
    lang: "id",
    categories: ["business", "shopping", "construction"],
  };
}
