import { LAYANAN, LAYANAN_BY_CITY, layananFaq, layananIntros } from "../src/lib/seo-layanan";
import { TAGS, tagMembers, tagRelated, TAG_HUB_ORDER } from "../src/lib/seo-tags";
import { CITIES, PROVINCES } from "../src/lib/seo-cities";

console.log("Kota:", CITIES.length, "| Provinsi:", PROVINCES.length);
console.log("LAYANAN:", LAYANAN.length, "| TAGS:", TAGS.length);
console.log("Slug layanan unik:", new Set(LAYANAN.map((l) => l.slug)).size);

// minimum anggota per kota
let minCity = 99, minCityName = "";
for (const c of CITIES) {
  const n = (LAYANAN_BY_CITY.get(c.slug) ?? []).length;
  if (n < minCity) { minCity = n; minCityName = c.name; }
}
console.log("Min layanan per kota:", minCity, "(", minCityName, ")");

// min/max anggota tag
const counts = TAGS.map((t) => tagMembers(t).length);
console.log("Tag members — min:", Math.min(...counts), "max:", Math.max(...counts));
const zero = TAGS.filter((t) => tagMembers(t).length === 0);
console.log("Tag tanpa anggota:", zero.length, zero.slice(0, 5).map((t) => t.slug));

// grup tag
const byType: Record<string, number> = {};
for (const t of TAGS) byType[t.type] = (byType[t.type] ?? 0) + 1;
console.log("Per tipe:", byType);

// contoh konten
const l = LAYANAN[0];
console.log("\nContoh layanan:", l.slug, "\n  title:", l.title, "\n  desc:", l.description.slice(0, 80) + "...");
console.log("  faq1:", layananFaq(l)[0].q);
const t = TAGS[100];
console.log("\nContoh tag:", t.slug, "| members:", tagMembers(t).length, "| related:", tagRelated(t).length);
console.log("  title:", t.title);
