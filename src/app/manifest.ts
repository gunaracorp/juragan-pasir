import type { MetadataRoute } from "next";
import { SITE } from "@/lib/juragan-data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Juragan Pasir — Pusat Pasir Terbaik Se-Indonesia",
    short_name: "Juragan Pasir",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fdfaf5",
    theme_color: "#1c1917",
    lang: "id",
    categories: ["business", "shopping", "construction"],
  };
}
