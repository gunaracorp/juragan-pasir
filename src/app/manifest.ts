import type { MetadataRoute } from "next";
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
    lang: "id",
    categories: ["business", "shopping", "construction"],
  };
}
