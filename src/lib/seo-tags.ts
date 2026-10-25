/**
 * MESIN DATA SEO — BAGIAN 3: TAG (500 HALAMAN)
 * Halaman tag = halaman penghubung (hub) bertema: intent produk, kota,
 * provinsi, pulau, kegunaan, dan kombinasi intent × wilayah.
 * Semua slug unik & deterministik, total TEPAT 500.
 */
import { PRODUCTS, SITE } from "./juragan-data";
import {
  CITIES,
  ISLANDS,
  PROVINCES,
  hashStr,
  type IslandId,
  type SeoCity,
} from "./seo-cities";
import {
  LAYANAN,
  LAYANAN_BY_CITY,
  LAYANAN_BY_PRODUCT,
  PRODUCT_META,
  waLink,
  type Layanan,
} from "./seo-layanan";

/* ------------------------------ TIPE ------------------------------ */

export type TagType =
  | "produk-intent"
  | "kota"
  | "provinsi"
  | "pulau"
  | "kegunaan"
  | "produk-pulau"
  | "harga-kota"
  | "intent-provinsi";

export type SeoTag = {
  slug: string;
  type: TagType;
  group: string;
  idx: number;
  label: string;
  title: string;
  h1: string;
  description: string;
  intros: [string, string];
  filters: {
    productId?: string;
    intentId?: string;
    citySlug?: string;
    provinceSlug?: string;
    island?: IslandId;
    kegunaanId?: string;
  };
  image: { src: string; alt: string };
  wa: string;
};

export const TAG_GROUP_LABEL: Record<TagType, string> = {
  "produk-intent": "Kebutuhan Belanja (Intent)",
  kota: "Pasir per Kota",
  provinsi: "Pasir per Provinsi",
  pulau: "Pasir per Zona Pulau",
  kegunaan: "Pasir per Kegunaan",
  "produk-pulau": "Produk per Zona Pulau",
  "harga-kota": "Harga Pasir per Kota",
  "intent-provinsi": "Kebutuhan per Provinsi",
};

/* ---------------------------- INTENT ----------------------------- */

type Intent = {
  id: string;
  prefix: boolean;
  slug: string;
  prod: (p: string) => string;
  prov: (pr: string) => string;
};

const INTENTS: Intent[] = [
  { id: "harga", prefix: true, slug: "harga", prod: (p) => `Harga ${p} Terbaru Hari Ini`, prov: (pr) => `Harga Pasir ${pr} Terbaru` },
  { id: "jual", prefix: true, slug: "jual", prod: (p) => `Jual ${p} Langsung dari Gunung`, prov: (pr) => `Jual Pasir ${pr} — Semua Jenis Tersedia` },
  { id: "supplier", prefix: true, slug: "supplier", prod: (p) => `Supplier ${p} Terpercaya`, prov: (pr) => `Supplier Pasir ${pr}` },
  { id: "distributor", prefix: true, slug: "distributor", prod: (p) => `Distributor Resmi ${p}`, prov: (pr) => `Distributor Pasir ${pr}` },
  { id: "agen", prefix: true, slug: "agen", prod: (p) => `Agen & Reseller ${p}`, prov: (pr) => `Agen Pasir ${pr}` },
  { id: "grosir", prefix: true, slug: "grosir", prod: (p) => `Grosir ${p} — Harga Partai`, prov: (pr) => `Grosir Pasir ${pr}` },
  { id: "kirim", prefix: true, slug: "kirim", prod: (p) => `Kirim ${p} Sampai di Lokasi`, prov: (pr) => `Kirim Pasir ${pr}` },
  { id: "ekspedisi", prefix: true, slug: "ekspedisi", prod: (p) => `Ekspedisi ${p} Antar Pulau`, prov: (pr) => `Ekspedisi Pasir ${pr}` },
  { id: "murah", prefix: false, slug: "murah", prod: (p) => `${p} Murah, Mutu Tetap Terjaga`, prov: (pr) => `Pasir Murah ${pr}` },
  { id: "terdekat", prefix: false, slug: "terdekat", prod: (p) => `${p} Terdekat dari Lokasi Anda`, prov: (pr) => `Pasir Terdekat ${pr}` },
  { id: "1-truk", prefix: false, slug: "1-truk", prod: (p) => `Beli ${p} 1 Truk`, prov: (pr) => `Pasir 1 Truk ${pr}` },
  { id: "10-truk", prefix: false, slug: "10-truk", prod: (p) => `Beli ${p} 10 Truk atau Lebih`, prov: (pr) => `Pasir 10 Truk ${pr}` },
  { id: "untuk-kontraktor", prefix: false, slug: "untuk-kontraktor", prod: (p) => `${p} untuk Proyek Kontraktor`, prov: (pr) => `Pasir untuk Kontraktor ${pr}` },
  { id: "untuk-instansi", prefix: false, slug: "untuk-instansi", prod: (p) => `${p} untuk Instansi & Tender`, prov: (pr) => `Pasir untuk Instansi ${pr}` },
];
const INTENTS_BY_ID = new Map(INTENTS.map((i) => [i.id, i]));
const PREFIX_INTENTS = INTENTS.filter((i) => i.prefix);

/* --------------------------- KEGUNAAN ---------------------------- */

type Kegunaan = { id: string; label: string; products: string[]; blurb: string };

const KEGUNAAN: Kegunaan[] = [
  { id: "cor-pondasi", label: "Pasir untuk Cor Pondasi", products: ["pasir-galunggung-cor", "pasir-merah"], blurb: "Pondasi rumah, kolom, dan balok butuh pasir bersudut yang saling mengunci dalam beton — karakter alami pasir vulkanik Galunggung." },
  { id: "beton-struktural", label: "Pasir untuk Beton Struktural", products: ["pasir-galunggung-cor"], blurb: "Untuk mutu beton struktural K-225 ke atas, kadar lumpur rendah dan gradasi butir konsisten adalah wajib — standar kurasi kami." },
  { id: "plesteran", label: "Pasir untuk Plesteran", products: ["pasir-halus", "pasir-pasang"], blurb: "Plesteran yang rapi dimulai dari pasir bersih tanpa ranting dan kerikil kasar agar dinding tidak rongga dan tidak mudah retak." },
  { id: "acian", label: "Pasir untuk Acian", products: ["pasir-halus"], blurb: "Acian butuh butiran super halus agar lapisan finishing tipis tetap kuat dan permukaannya mulus siap cat." },
  { id: "pasangan-bata", label: "Pasir untuk Pasangan Bata", products: ["pasir-pasang", "pasir-halus"], blurb: "Adukan pasangan bata merah dan batako lebih kuat dengan pasir berkekasaran sedang yang mengikat mortar dengan baik." },
  { id: "urugan", label: "Pasir untuk Urugan & Tanah Timbun", products: ["pasir-urug", "pasir-merah"], blurb: "Menaikkan elevasi lahan, mengurug kolam, atau mengisi pondasi batu kali — butuh volume besar dengan harga ekonomis." },
  { id: "filter-air", label: "Pasir untuk Filter Air", products: ["pasir-silika"], blurb: "Media filter air bersih, IPAL, dan sumur resapan membutuhkan pasir silika bersih dengan gradasi mesh terstandar." },
  { id: "kolam", label: "Pasir untuk Kolam & Resapan", products: ["pasir-silika", "pasir-urug"], blurb: "Kolam renang, kolam koi, dan resapan air kami suplai lengkap: silika untuk media filter, urug untuk lapisan dasar." },
  { id: "taman", label: "Pasir untuk Taman & Outdoor", products: ["pasir-urug", "pasir-halus"], blurb: "Landscaping, jalur pedestrian, dan dekorasi taman memakai pasir halus maupun urug sesuai kebutuhan drainase Anda." },
  { id: "sandblasting", label: "Pasir untuk Sandblasting", products: ["pasir-silika"], blurb: "Sandblasting baja dan batu alam membutuhkan silika dengan kemiringan sudut butir tertentu — tersedia sesuai mesh yang diminta." },
  { id: "batako", label: "Pasir untuk Batako & Paving", products: ["pasir-pasang", "pasir-merah"], blurb: "Produksi batako, paving block, dan hebel hemat biaya bahan baku dengan pasir merah atau pasang berkualitas stabil." },
  { id: "screed", label: "Pasir untuk Screed Lantai", products: ["pasir-halus", "pasir-galunggung-cor"], blurb: "Screed lantai rata dan tidak bergerombol dimulai dari pasir terayak dengan gradasi seragam." },
];
const KEGUNAAN_BY_ID = new Map(KEGUNAAN.map((k) => [k.id, k]));

/* --------------------------- GALERI TAG -------------------------- */

const TAG_IMAGES = [
  "galunggung-2.jpg", "stokpasir-1.jpg", "truk-3.jpg", "eksavator-3.jpg",
  "cor-1.jpg", "silika-1.jpg", "pengolahan-1.jpg", "toko-1.jpg",
  "filter-1.jpg", "galunggung-3.jpg", "cor-3.jpg", "pasir-vulkanik-3.jpg",
];

/* --------------------------- BUILDER ----------------------------- */

const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

function tagImage(slug: string, label: string) {
  const h = hashStr(slug);
  const f = TAG_IMAGES[h % TAG_IMAGES.length];
  return { src: `/images/${f}`, alt: `${label} — pasokan pasir Galunggung asli Tasikmalaya` };
}

function waFor(label: string): string {
  return waLink(`Halo ${SITE.name}! Saya menemukan halaman "${label}" di website Anda. Saya ingin bertanya ketersediaan & harga pasir Galunggung. Terima kasih.`);
}

function buildTags(): SeoTag[] {
  const tags: Omit<SeoTag, "idx" | "image" | "wa">[] = [];

  /* 1) produk-intent — 84 */
  for (const intent of INTENTS) {
    for (const p of PRODUCTS) {
      const meta = PRODUCT_META[p.id];
      const slug = intent.prefix ? `${intent.slug}-${meta.shortSlug}` : `${meta.shortSlug}-${intent.slug}`;
      const label = intent.prod(p.name);
      tags.push({
        slug,
        type: "produk-intent",
        group: TAG_GROUP_LABEL["produk-intent"],
        label,
        title: `${label} | Juragan Pasir Galunggung`,
        h1: label,
        description: `${label} — pasokan langsung dari lereng Gunung Galunggung, Tasikmalaya. Kurasi mutu, garansi tertulis, kirim ke 34 provinsi. Penawaran resmi via WhatsApp.`,
        intros: [
          `${label} semuanya berangkat dari satu sumber terkontrol: lereng Gunung Galunggung, Tasikmalaya. Karena hanya menggarap satu deposit vulkanik, mutu antar-batch kami konsisten — hal yang paling dicari kontraktor dan pabrik ketika memesan pasir dalam volume berulang. Setiap order disertai spesifikasi tertulis dan surat jalan rapi.`,
          `Halaman ini menghimpun semua pilihan ${p.name} kami di berbagai kota. Pilih tujuan pengiriman Anda untuk melihat estimasi harga lokal dan waktu tempuh; atau langsung chat WhatsApp kami bila kebutuhannya spesifik. Tim penawaran merespons pada jam kerja dengan angka yang final — bukan angka mainan.`,
        ],
        filters: { productId: p.id, intentId: intent.id },
      });
    }
  }

  /* 2) kota — 99 */
  for (const c of CITIES) {
    tags.push({
      slug: `pasir-${c.slug}`,
      type: "kota",
      group: TAG_GROUP_LABEL.kota,
      label: `Pasir ${c.name}`,
      title: `Pasir ${c.name} — 6 Jenis Pasir Galunggung & Harga Lokal | Juragan Pasir`,
      h1: `Pasir untuk ${c.name}, ${c.province}`,
      description: `Semua jenis pasir Galunggung untuk ${c.name}: cor, urug, pasang, halus, silika & merah. Estimasi harga lokal, waktu kirim, dan penawaran resmi via WhatsApp — gratis.`,
      intros: [
        `Halaman ini adalah pintu masuk lengkap untuk kebutuhan pasir di ${c.name}, ${c.province}. Enam jenis pasir Galunggung kami layani untuk kota ini — dari pasir cor untuk struktur, pasir urug untuk penimbunan lahan, sampai pasir silika untuk kebutuhan filter dan industri. Setiap jenis punya halaman detailnya sendiri berisi estimasi harga, spesifikasi, dan estimasi waktu tiba.`,
        `Semua pengiriman ke ${c.name} berangkat dari titik muat di Tasikmalaya dengan kurasi mutu yang sama: disaring, diuji kadar lumpurnya, dan disertai surat jalan. Apakah Anda membangun rumah, menggarap proyek kontraktor, atau mengadaikan untuk instansi — mulailah dari jenis pasir di bawah ini, lalu minta penawaran resminya via WhatsApp.`,
      ],
      filters: { citySlug: c.slug },
    });
  }

  /* 3) provinsi — 34 */
  for (const pr of PROVINCES) {
    tags.push({
      slug: `pasir-${pr.slug}`,
      type: "provinsi",
      group: TAG_GROUP_LABEL.provinsi,
      label: `Pasir ${pr.name}`,
      title: `Pasir ${pr.name} — Supplier Pasir Galunggung Se-${pr.name} | Juragan Pasir`,
      h1: `Pasir Galunggung untuk ${pr.name}`,
      description: `Jangkauan pasir Galunggung di ${pr.name}: kota-kota yang kami layani, jenis pasir tersedia, estimasi harga dan waktu kirim. Penawaran tertulis via WhatsApp.`,
      intros: [
        `Kami melayani pengiriman pasir Galunggung ke seluruh ${pr.name}. Halaman provinsi ini merangkum kota-kota yang sudah punya halaman layanan detail — lengkap dengan estimasi harga lokal dan waktu tiba di masing-masing kota. Jadikan halaman ini peta Anda: pilih kota tujuan, lalu dalami jenis pasir yang proyek Anda butuhkan.`,
        `Logistik ke ${pr.name} kami rancang supaya mutu tidak menurun di ujung rantai: kurasi di titik muat Tasikmalaya, pengamanan muatan sesuai moda, dan dokumentasi serah terima yang tertib. Untuk pengadaan berulang — kontraktor, perusahaan, maupun instansi — kami sediakan skema kontrak pasokan dengan harga terkunci.`,
      ],
      filters: { provinceSlug: pr.slug },
    });
  }

  /* 4) pulau — 6 */
  for (const [id, meta] of Object.entries(ISLANDS)) {
    const island = id as IslandId;
    tags.push({
      slug: `pasir-${island}`,
      type: "pulau",
      group: TAG_GROUP_LABEL.pulau,
      label: `Pasir ${meta.label}`,
      title: `Pasir ${meta.label} — Kirim Pasir Galunggung ke ${meta.label} | Juragan Pasir`,
      h1: `Pasir Galunggung untuk ${meta.label}`,
      description: `Pengiriman pasir Galunggung ke ${meta.label}: kota terlayani, estimasi ${meta.eta}, harga antar pulau yang transparan. Pesan via WhatsApp dengan penawaran tertulis.`,
      intros: [
        `Mengirim pasir ke ${meta.label} menuntut perencanaan logistik yang serius — dan itu spesialisasi kami. Kombinasi armada darat, kereta angkut, dan kapal laut kami susun agar pasir Galunggung tiba di ${meta.label} dengan estimasi ${meta.eta}, tanpa kontaminasi dan tanpa kejutan biaya. Semua rute diawali kurasi di titik muat Tasikmalaya.`,
        `Di zona ini kami melayani segmen perseorangan sampai instansi: renovasi rumah, proyek infrastruktur, pengadaan perusahaan, hingga tender pemerintah. Gunakan halaman ini untuk melihat kota-kota terlayani di ${meta.label}, lalu masuk ke halaman kota atau jenis pasir yang paling sesuai kebutuhan Anda.`,
      ],
      filters: { island },
    });
  }

  /* 5) kegunaan — 12 */
  for (const k of KEGUNAAN) {
    tags.push({
      slug: `pasir-untuk-${k.id}`,
      type: "kegunaan",
      group: TAG_GROUP_LABEL.kegunaan,
      label: k.label,
      title: `${k.label} — Jenis & Harga Pasir Galunggung | Juragan Pasir`,
      h1: k.label,
      description: `${k.label}: jenis pasir Galunggung yang tepat, alasan teknisnya, dan pilihan kota pengiriman. ${k.blurb} Penawaran via WhatsApp.`,
      intros: [
        `${k.blurb} Halaman panduan ini membantu Anda memilih jenis pasir Galunggung yang tepat untuk kebutuhan tersebut — bukan sekadar jualan, tapi memastikan material yang Anda bayar memang yang paling sesuai secara teknis. Jika ragu, tim teknis kami siap menghitung kebutuhan Anda secara gratis.`,
        `Di bawah ini kami tampilkan jenis-jenis pasir yang direkomendasikan untuk kegunaan ini, beserta kota-kota yang sudah punya halaman harga lokal. Perhatikan bahwa harga berbeda antar kota karena faktor jarak dan moda angkut — bukan karena mutu pasirnya berbeda. Mutu Galunggung kami sama di semua titik kirim.`,
      ],
      filters: { kegunaanId: k.id },
    });
  }

  /* 6) produk-pulau — 36 */
  for (const [id, meta] of Object.entries(ISLANDS)) {
    const island = id as IslandId;
    for (const p of PRODUCTS) {
      const meta2 = PRODUCT_META[p.id];
      tags.push({
        slug: `${meta2.shortSlug}-${island}`,
        type: "produk-pulau",
        group: TAG_GROUP_LABEL["produk-pulau"],
        label: `${p.name} ${meta.label}`,
        title: `${p.name} untuk ${meta.label} — Harga & Pengiriman | Juragan Pasir Galunggung`,
        h1: `${p.name} untuk ${meta.label}`,
        description: `${p.name} dikirim ke kota-kota di ${meta.label}: estimasi ${meta.eta}, harga antar pulau transparan, garansi mutu tertulis. Minta penawaran via WhatsApp.`,
        intros: [
          `${p.name} kami kirim rutin ke berbagai kota di ${meta.label}. Untuk zona antar pulau seperti ini, kunci mutu ada di tiga hal: kurasi ketat sebelum muat, pengemasan/pengamanan muatan yang tepat, dan koordinasi moda darat–laut yang rapi. Ketiganya sudah menjadi prosedur baku setiap pengiriman kami.`,
          `Di bawah ini daftar kota di ${meta.label} yang memiliki halaman layanan ${p.name} lengkap dengan estimasi harga lokalnya. Pilih kota Anda untuk detail, atau langsung ajukan penawaran via WhatsApp bila lokasi Anda di luar daftar — jaringan logistik kami terus meluas.`,
        ],
        filters: { productId: p.id, island },
      });
    }
  }

  /* 7) harga-kota — 24 (kota tier 1) */
  const topCities = CITIES.filter((c) => c.tier === 1).slice(0, 24);
  for (const c of topCities) {
    tags.push({
      slug: `harga-pasir-${c.slug}`,
      type: "harga-kota",
      group: TAG_GROUP_LABEL["harga-kota"],
      label: `Harga Pasir ${c.name}`,
      title: `Harga Pasir ${c.name} Terbaru — Semua Jenis | Juragan Pasir Galunggung`,
      h1: `Harga Pasir di ${c.name}`,
      description: `Kumpulan estimasi harga pasir untuk ${c.name}: pasir cor, urug, pasang, halus, silika, dan merah — plus faktor yang membuat harga berubah. Penawaran final via WhatsApp.`,
      intros: [
        `Harga pasir di ${c.name} dipengaruhi tiga faktor utama: harga dasar di titik produksi Gunung Galunggung, jarak angkut ke ${c.name}, dan moda pengiriman yang dipakai. Halaman ini merangkum estimasi harga semua jenis pasir untuk kota ${c.name} agar Anda bisa membandingkan sebelum memutuskan.`,
        `Penting dipahami: angka di website ini adalah estimasi pasar yang sehat — bukan harga tawar-menawar yang ditiup. Penawaran final kami selalu tertulis, mencantumkan rincian pasir dan ongkos angkut secara terpisah, sehingga Anda tahu persis apa yang dibayar. Minta penawarannya via WhatsApp, gratis dan tanpa komitmen.`,
      ],
      filters: { citySlug: c.slug },
    });
  }

  /* 8) intent-provinsi — sisa hingga total 500 */
  const provByCount = [...PROVINCES].sort((a, b) => {
    const ca = CITIES.filter((c) => c.provinceSlug === a.slug).length;
    const cb = CITIES.filter((c) => c.provinceSlug === b.slug).length;
    return cb - ca || a.name.localeCompare(b.name);
  });
  const used = new Set(tags.map((t) => t.slug));
  const remaining = 500 - tags.length;
  let added = 0;
  outer: for (const intent of PREFIX_INTENTS) {
    for (const pr of provByCount) {
      if (added >= remaining) break outer;
      const slug = `${intent.slug}-pasir-${pr.slug}`;
      if (used.has(slug)) continue;
      used.add(slug);
      added++;
      tags.push({
        slug,
        type: "intent-provinsi",
        group: TAG_GROUP_LABEL["intent-provinsi"],
        label: intent.prov(pr.name),
        title: `${intent.prov(pr.name)} — Pasir Galunggung Asli | Juragan Pasir`,
        h1: intent.prov(pr.name),
        description: `${intent.prov(pr.name)}: pilihan kota, jenis pasir, dan estimasi harga dari supplier pasir Gunung Galunggung, Tasikmalaya. Garansi mutu & penawaran resmi via WhatsApp.`,
        intros: [
          `Mencari ${intent.prov(pr.name).toLowerCase()}? Halaman ini menghimpun semua pilihan pasir Galunggung untuk wilayah ${pr.name} sesuai kebutuhan Anda — dari kota besar sampai kota satelit. Setiap kota punya estimasi harga lokal dan waktu kirimnya sendiri, karena ongkos angkut dihitung jujur sesuai jarak, bukan diratakan.`,
          `Pasir yang kami suplai ke ${pr.name} melewati kurasi yang sama dengan yang kami kirim ke kota mana pun di Indonesia: disaring, diuji, dan didokumentasikan. Pilih kota di bawah untuk detail per kota, atau ajukan penawaran resmi langsung melalui WhatsApp kami.`,
        ],
        filters: { provinceSlug: pr.slug, intentId: intent.id },
      });
    }
  }

  /* slug harus unik */
  const seen = new Set<string>();
  for (const t of tags) {
    if (seen.has(t.slug)) throw new Error(`Slug tag duplikat: ${t.slug}`);
    seen.add(t.slug);
  }
  if (tags.length !== 500) throw new Error(`Jumlah tag bukan 500: ${tags.length}`);

  return tags.map((t, idx) => ({
    ...t,
    idx,
    image: tagImage(t.slug, t.label),
    wa: waFor(t.label),
  }));
}

export const TAGS: SeoTag[] = buildTags();
export const TAGS_BY_SLUG = new Map(TAGS.map((t) => [t.slug, t]));

/* --------------------------- MEMBERS ----------------------------- */

export function tagMembers(tag: SeoTag): Layanan[] {
  const f = tag.filters;
  let list = LAYANAN;
  if (f.productId) list = list.filter((l) => l.product.id === f.productId);
  if (f.citySlug) list = list.filter((l) => l.city.slug === f.citySlug);
  if (f.provinceSlug) list = list.filter((l) => l.city.provinceSlug === f.provinceSlug);
  if (f.island) list = list.filter((l) => l.city.island === f.island);
  if (f.kegunaanId) {
    const k = KEGUNAAN_BY_ID.get(f.kegunaanId);
    list = k ? list.filter((l) => k.products.includes(l.product.id)) : [];
  }
  if (f.intentId) {
    const it = INTENTS_BY_ID.get(f.intentId);
    if (it) {
      // urutkan anggota sesuai "semangat" intent: harga → termurah dulu; lainnya sesuai tier kota
      if (it.id === "harga" || it.id === "murah") {
        list = [...list].sort((a, b) => a.priceLow - b.priceLow);
      }
    }
  }
  return list;
}

export function tagMemberCount(tag: SeoTag): number {
  return tagMembers(tag).length;
}

/** Tag terkait untuk internal linking (10 per halaman) */
export function tagRelated(tag: SeoTag): SeoTag[] {
  const f = tag.filters;
  const out: SeoTag[] = [];
  const push = (s?: string) => {
    if (!s) return;
    const t = TAGS_BY_SLUG.get(s);
    if (t && !out.includes(t) && t.slug !== tag.slug) out.push(t);
  };
  if (f.productId) {
    const m = PRODUCT_META[f.productId];
    for (const iid of ["harga", "jual", "supplier", "grosir", "murah", "untuk-kontraktor"]) {
      const it = INTENTS_BY_ID.get(iid);
      if (it) push(it.prefix ? `${it.slug}-${m.shortSlug}` : `${m.shortSlug}-${it.slug}`);
    }
    for (const iid of Object.keys(ISLANDS)) push(`${m.shortSlug}-${iid}`);
  }
  if (f.citySlug) {
    const c = CITIES.find((x) => x.slug === f.citySlug);
    push(`pasir-${f.citySlug}`);
    if (c) push(`harga-pasir-${f.citySlug}`);
    if (c) push(`pasir-${c.provinceSlug}`);
    if (c) push(`pasir-${c.island}`);
  }
  if (f.provinceSlug) {
    push(`pasir-${f.provinceSlug}`);
    for (const iid of ["harga", "supplier", "jual", "grosir", "kirim", "ekspedisi", "agen", "distributor"]) push(`${iid}-pasir-${f.provinceSlug}`);
  }
  if (f.island) {
    push(`pasir-${f.island}`);
    for (const p of PRODUCTS) push(`${PRODUCT_META[p.id].shortSlug}-${f.island}`);
  }
  if (f.kegunaanId) {
    const k = KEGUNAAN_BY_ID.get(f.kegunaanId);
    if (k) for (const pid of k.products) {
      const m = PRODUCT_META[pid];
      push(`harga-${m.shortSlug}`);
      push(`jual-${m.shortSlug}`);
    }
  }
  // isi bila kurang dari 10
  if (out.length < 10) {
    for (const t of TAGS) {
      if (out.length >= 10) break;
      if (t.type === tag.type && t.slug !== tag.slug) out.push(t);
    }
  }
  return out.slice(0, 10);
}

/** Urutan grup untuk hub /tag */
export const TAG_HUB_ORDER: TagType[] = [
  "produk-intent", "kota", "harga-kota", "provinsi", "intent-provinsi", "pulau", "produk-pulau", "kegunaan",
];

export { LAYANAN_BY_CITY, LAYANAN_BY_PRODUCT };
export type { SeoCity, Layanan };
