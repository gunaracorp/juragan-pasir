/**
 * MESIN DATA SEO — BAGIAN 1: KOTA, PULAU, HELPER
 * Sumber data tunggal untuk 500 halaman layanan + 500 halaman tag.
 * Semua deterministik (tanpa Math.random) agar hasil build stabil & bebas hydration mismatch.
 */

export type IslandId =
  | "jawa"
  | "sumatra"
  | "kalimantan"
  | "sulawesi"
  | "bali-nusa-tenggara"
  | "maluku-papua";

export type SeoCity = {
  name: string;
  slug: string;
  province: string;
  provinceSlug: string;
  island: IslandId;
  km: number | null; // jarak darat kasar dari titik muat Tasikmalaya (null = via laut)
  tier: 1 | 2; // 1 = kota utama/provinsi
};

export const ISLANDS: Record<
  IslandId,
  { label: string; eta: string; mult: number }
> = {
  jawa: { label: "Pulau Jawa", eta: "1–2 hari", mult: 1.0 },
  sumatra: { label: "Pulau Sumatra", eta: "4–7 hari", mult: 1.12 },
  kalimantan: { label: "Pulau Kalimantan", eta: "5–8 hari", mult: 1.15 },
  sulawesi: { label: "Pulau Sulawesi", eta: "5–9 hari", mult: 1.15 },
  "bali-nusa-tenggara": { label: "Bali & Nusa Tenggara", eta: "3–6 hari", mult: 1.22 },
  "maluku-papua": { label: "Maluku & Papua", eta: "7–14 hari", mult: 1.32 },
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Hash djb2 deterministik untuk rotasi konten */
export function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

function city(
  name: string,
  province: string,
  island: IslandId,
  km: number | null,
  tier: 1 | 2 = 2
): SeoCity {
  return {
    name,
    slug: slugify(name),
    province,
    provinceSlug: slugify(province),
    island,
    km,
    tier,
  };
}

/** 99 kota/kabupaten strategis di 6 zona pengiriman */
export const CITIES: SeoCity[] = [
  // ── Jawa Barat ──────────────────────────────────────────────
  city("Tasikmalaya", "Jawa Barat", "jawa", 0, 1),
  city("Garut", "Jawa Barat", "jawa", 35),
  city("Ciamis", "Jawa Barat", "jawa", 40),
  city("Banjar", "Jawa Barat", "jawa", 55),
  city("Sumedang", "Jawa Barat", "jawa", 95),
  city("Majalengka", "Jawa Barat", "jawa", 90),
  city("Cirebon", "Jawa Barat", "jawa", 100, 1),
  city("Kuningan", "Jawa Barat", "jawa", 120),
  city("Bandung", "Jawa Barat", "jawa", 112, 1),
  city("Cimahi", "Jawa Barat", "jawa", 118),
  city("Cianjur", "Jawa Barat", "jawa", 160),
  city("Indramayu", "Jawa Barat", "jawa", 160),
  city("Subang", "Jawa Barat", "jawa", 150),
  city("Purwakarta", "Jawa Barat", "jawa", 160),
  city("Karawang", "Jawa Barat", "jawa", 190),
  city("Sukabumi", "Jawa Barat", "jawa", 190),
  city("Bogor", "Jawa Barat", "jawa", 230, 1),
  city("Depok", "Jawa Barat", "jawa", 260, 1),
  city("Bekasi", "Jawa Barat", "jawa", 270, 1),
  // ── DKI Jakarta & Banten ────────────────────────────────────
  city("Jakarta", "DKI Jakarta", "jawa", 265, 1),
  city("Tangerang", "Banten", "jawa", 290, 1),
  city("Tangerang Selatan", "Banten", "jawa", 285),
  city("Serang", "Banten", "jawa", 320, 1),
  city("Cilegon", "Banten", "jawa", 330),
  city("Pandeglang", "Banten", "jawa", 340),
  // ── Jawa Tengah ─────────────────────────────────────────────
  city("Tegal", "Jawa Tengah", "jawa", 140),
  city("Cilacap", "Jawa Tengah", "jawa", 200),
  city("Purwokerto", "Jawa Tengah", "jawa", 175),
  city("Pekalongan", "Jawa Tengah", "jawa", 190),
  city("Semarang", "Jawa Tengah", "jawa", 270, 1),
  city("Kudus", "Jawa Tengah", "jawa", 330),
  city("Jepara", "Jawa Tengah", "jawa", 360),
  city("Salatiga", "Jawa Tengah", "jawa", 290),
  city("Magelang", "Jawa Tengah", "jawa", 310),
  city("Boyolali", "Jawa Tengah", "jawa", 330),
  city("Solo", "Jawa Tengah", "jawa", 340, 1),
  city("Klaten", "Jawa Tengah", "jawa", 355),
  // ── DIY ─────────────────────────────────────────────────────
  city("Yogyakarta", "DI Yogyakarta", "jawa", 330, 1),
  // ── Jawa Timur ──────────────────────────────────────────────
  city("Magetan", "Jawa Timur", "jawa", 410),
  city("Madiun", "Jawa Timur", "jawa", 420),
  city("Ponorogo", "Jawa Timur", "jawa", 420),
  city("Ngawi", "Jawa Timur", "jawa", 430),
  city("Bojonegoro", "Jawa Timur", "jawa", 510),
  city("Kediri", "Jawa Timur", "jawa", 490, 1),
  city("Blitar", "Jawa Timur", "jawa", 520),
  city("Mojokerto", "Jawa Timur", "jawa", 540),
  city("Jombang", "Jawa Timur", "jawa", 520),
  city("Surabaya", "Jawa Timur", "jawa", 570, 1),
  city("Gresik", "Jawa Timur", "jawa", 585),
  city("Sidoarjo", "Jawa Timur", "jawa", 585, 1),
  city("Batu", "Jawa Timur", "jawa", 590),
  city("Malang", "Jawa Timur", "jawa", 620, 1),
  city("Pasuruan", "Jawa Timur", "jawa", 620),
  city("Probolinggo", "Jawa Timur", "jawa", 680),
  city("Jember", "Jawa Timur", "jawa", 760),
  city("Banyuwangi", "Jawa Timur", "jawa", 880),
  // ── Sumatra ─────────────────────────────────────────────────
  city("Banda Aceh", "Aceh", "sumatra", null, 1),
  city("Lhokseumawe", "Aceh", "sumatra", null),
  city("Medan", "Sumatera Utara", "sumatra", null, 1),
  city("Pematangsiantar", "Sumatera Utara", "sumatra", null),
  city("Padang", "Sumatera Barat", "sumatra", null, 1),
  city("Bukittinggi", "Sumatera Barat", "sumatra", null),
  city("Pekanbaru", "Riau", "sumatra", null, 1),
  city("Dumai", "Riau", "sumatra", null),
  city("Batam", "Kepulauan Riau", "sumatra", null, 1),
  city("Tanjungpinang", "Kepulauan Riau", "sumatra", null),
  city("Kota Jambi", "Jambi", "sumatra", null, 1),
  city("Palembang", "Sumatera Selatan", "sumatra", null, 1),
  city("Metro", "Sumatera Selatan", "sumatra", null),
  city("Kota Bengkulu", "Bengkulu", "sumatra", null, 1),
  city("Bandar Lampung", "Lampung", "sumatra", null, 1),
  city("Pangkalpinang", "Kep. Bangka Belitung", "sumatra", null, 1),
  // ── Kalimantan ──────────────────────────────────────────────
  city("Pontianak", "Kalimantan Barat", "kalimantan", null, 1),
  city("Singkawang", "Kalimantan Barat", "kalimantan", null),
  city("Palangka Raya", "Kalimantan Tengah", "kalimantan", null, 1),
  city("Banjarmasin", "Kalimantan Selatan", "kalimantan", null, 1),
  city("Banjarbaru", "Kalimantan Selatan", "kalimantan", null),
  city("Balikpapan", "Kalimantan Timur", "kalimantan", null, 1),
  city("Samarinda", "Kalimantan Timur", "kalimantan", null),
  city("Tarakan", "Kalimantan Utara", "kalimantan", null, 1),
  // ── Sulawesi ────────────────────────────────────────────────
  city("Makassar", "Sulawesi Selatan", "sulawesi", null, 1),
  city("Parepare", "Sulawesi Selatan", "sulawesi", null),
  city("Palu", "Sulawesi Tengah", "sulawesi", null, 1),
  city("Manado", "Sulawesi Utara", "sulawesi", null, 1),
  city("Bitung", "Sulawesi Utara", "sulawesi", null),
  city("Gorontalo", "Gorontalo", "sulawesi", null, 1),
  city("Kendari", "Sulawesi Tenggara", "sulawesi", null, 1),
  city("Bau-Bau", "Sulawesi Tenggara", "sulawesi", null),
  // ── Bali & Nusa Tenggara ────────────────────────────────────
  city("Denpasar", "Bali", "bali-nusa-tenggara", null, 1),
  city("Singaraja", "Bali", "bali-nusa-tenggara", null),
  city("Mataram", "Nusa Tenggara Barat", "bali-nusa-tenggara", null, 1),
  city("Bima", "Nusa Tenggara Barat", "bali-nusa-tenggara", null),
  city("Kupang", "Nusa Tenggara Timur", "bali-nusa-tenggara", null, 1),
  // ── Maluku & Papua ──────────────────────────────────────────
  city("Ambon", "Maluku", "maluku-papua", null, 1),
  city("Ternate", "Maluku Utara", "maluku-papua", null, 1),
  city("Sorong", "Papua Barat", "maluku-papua", null, 1),
  city("Manokwari", "Papua Barat", "maluku-papua", null),
  city("Jayapura", "Papua", "maluku-papua", null, 1),
  city("Timika", "Papua Tengah", "maluku-papua", null),
];

export const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

/** Daftar provinsi unik (urut sesuai CITIES) */
export const PROVINCES: { name: string; slug: string; island: IslandId }[] = [
  ...new Map(CITIES.map((c) => [c.provinceSlug, { name: c.province, slug: c.provinceSlug, island: c.island }])).values(),
];

/** ETA & estimasi ongkir per kota */
export function etaFor(city: SeoCity): string {
  if (city.island !== "jawa") return ISLANDS[city.island].eta;
  if (city.km !== null && city.km <= 60) return "Hari yang sama";
  if (city.km !== null && city.km <= 300) return "1–2 hari";
  return "2–3 hari";
}

/** Format angka ribuan rupiah: 360 → "Rp 360 ribu", 1380 → "Rp 1,38 juta" */
export function fmtHarga(ribu: number): string {
  if (ribu >= 1000) {
    const juta = (ribu / 1000).toFixed(2).replace(".", ",").replace(/,?0+$/, "");
    return `Rp ${juta} juta`;
  }
  return `Rp ${ribu} ribu`;
}

/** Estimasi harga per kota: basis produk × multiplier pulau (rentang ±8%) */
export function hargaFor(calcBase: number, city: SeoCity): { low: number; high: number } {
  const base = calcBase * ISLANDS[city.island].mult;
  const low = Math.round((base * 0.92) / 5) * 5;
  const high = Math.round((base * 1.08) / 5) * 5;
  return { low, high };
}

/** Teks jarak pengiriman yang manusiawi */
export function jarakText(city: SeoCity): string {
  if (city.island !== "jawa")
    return `pengiriman antar pulau via armada darat + kapal laut`;
  if (city.km === 0) return `lokasi muat utama kami — pasir diambil langsung dari titik produksi`;
  return `±${city.km} km dari titik muat Tasikmalaya`;
}
