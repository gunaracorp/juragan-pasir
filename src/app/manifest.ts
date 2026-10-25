import type { MetadataRoute } from "next";
<<<<<<< HEAD
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
=======
import { SITE } from "@/lib/juragan-data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Juragan Pasir Galunggung — Pasir Terbaik di Dunia",
    short_name: "Pasir Galunggung",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2e1065",
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
    lang: "id",
    categories: ["business", "shopping", "construction"],
  };
}
