/**
 * MESIN DATA SEO — BAGIAN 2: LAYANAN (500 HALAMAN)
 * Setiap halaman = kombinasi Produk × Kota dengan konten deterministik
 * (judul, deskripsi, harga lokal, ETA, gambar, FAQ, link internal).
 */
import { PRODUCTS, SITE, type SandProduct } from "./juragan-data";
import {
  CITIES,
  ISLANDS,
  etaFor,
  fmtHarga,
  hashStr,
  hargaFor,
  jarakText,
  slugify,
  type SeoCity,
} from "./seo-cities";

/* ------------------------- META PRODUK SEO ------------------------- */

export const PRODUCT_META: Record<
  string,
  { shortSlug: string; images: string[]; alts: string[] }
> = {
  "pasir-galunggung-cor": {
    shortSlug: "pasir-cor",
    images: ["cor-1.jpg", "cor-3.jpg", "eksavator-2.jpg", "truk-3.jpg", "stokpasir-1.jpg"],
    alts: [
      "Pekerja menuang adukan beton di pondasi proyek menggunakan pasir cor Galunggung",
      "Tim proyek meratakan cor di bekisting — pasir vulkanik Gunung Galunggung",
      "Armada dump truck siap angkut pasir cor Galunggung ke lokasi proyek",
      "Truk pengangkut pasir cor Galunggung di jalan logistik tambang",
      "Tumpukan pasir cor Galunggung hasil kurasi di titik muat Tasikmalaya",
    ],
  },
  "pasir-urug": {
    shortSlug: "pasir-urug",
    images: ["stokpasir-1.jpg", "eksavator-3.jpg", "truk-2.jpg", "toko-1.jpg"],
    alts: [
      "Stok pasir urug Gunung Galunggung dalam volume ritase di gudang Tasikmalaya",
      "Ekskavator memuat pasir urug ke dump truck di area produksi",
      "Dump truck membongkar pasir urug Galunggung di titik pengiriman",
      "Halaman toko pasir dengan pasokan pasir urug siap kirim se-Indonesia",
    ],
  },
  "pasir-pasang": {
    shortSlug: "pasir-pasang",
    images: ["cor-3.jpg", "stokpasir-1.jpg", "pengolahan-2.jpg", "toko-1.jpg"],
    alts: [
      "Progres pasangan dinding proyek yang memakai adukan pasir pasang Galunggung",
      "Pasir pasang Galunggung tersaji bersih di gudang kurasi Tasikmalaya",
      "Pengangkutan pasir pasang dalam kemasan rit untuk pembangunan rumah",
      "Stok pasir pasang halus-sedang siap dikirim ke lokasi pembangun",
    ],
  },
  "pasir-halus": {
    shortSlug: "pasir-halus",
    images: ["pasir-vulkanik-3.jpg", "silika-3.jpg", "stokpasir-1.jpg", "toko-1.jpg"],
    alts: [
      "Tekstur butir halus pasir Galunggung hasil pengayakan untuk plester dan aci",
      "Pasir halus bersih kualitas premium untuk finishing dinding dan screed",
      "Gunung pasir halus Galunggung di stok gudang Tasikmalaya",
      "Pasokan pasir halus di toko material — siap antar ke alamat Anda",
    ],
  },
  "pasir-silika": {
    shortSlug: "pasir-silika",
    images: ["silika-1.jpg", "silika-3.jpg", "filter-1.jpg", "filter-2.jpg", "filter-3.jpg", "pengolahan-1.jpg"],
    alts: [
      "Tumpukan pasir silika vulkanik putih dengan kandungan SiO2 tinggi",
      "Pasir silika Galunggung berkemasan siap kirim untuk kebutuhan industri",
      "Instalasi filter air bersih dengan media pasir silika Galunggung",
      "Unit filterasi industri yang memakai media pasir silika vulkanik",
      "Tangki filter air bertekanan berisi media pasir silika Galunggung",
      "Pengolahan dan penyaringan pasir silika dengan konveyor industri",
    ],
  },
  "pasir-merah": {
    shortSlug: "pasir-merah",
    images: ["pasir-vulkanik-1.jpg", "toko-3.jpg", "pengolahan-3.jpg", "stokpasir-1.jpg"],
    alts: [
      "Bibit batuan vulkanik Gunung Galunggung — asal mula pasir berkualitas",
      "Kerikil dan pasir merah pilihan untuk cor non-struktural dan batako",
      "Pengolahan pasir dan kerikil dengan unit ayakan bergerak",
      "Stok campuran pasir merah Bangka di gudang material Tasikmalaya",
    ],
  },
};

/* ------------------------------ TIPE ------------------------------ */

export type Layanan = {
  slug: string;
  idx: number;
  product: SandProduct;
  city: SeoCity;
  shortSlug: string;
  title: string;
  h1: string;
  description: string;
  priceLow: number;
  priceHigh: number;
  eta: string;
  images: { src: string; alt: string }[];
  wa: string;
  waShort: string;
};

/* --------------------------- GENERATOR --------------------------- */

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

const TITLES: (p: string, c: string, prov: string, eta: string) => string[] = (p, c, prov, eta) => [
  `${p} ${c} — Harga & Kirim ${eta} | Juragan Pasir Galunggung`,
  `Jual ${p} di ${c} — Supplier Pasir Galunggung ${prov}`,
  `Harga ${p} ${c} Terbaru — Asli Gunung Galunggung, Tiba ${eta}`,
];

const H1S: (p: string, c: string) => string[] = (p, c) => [
  `Jual ${p} di ${c} — Asli Gunung Galunggung`,
  `${p} ${c} — Pasir Vulkanik Asli Tasikmalaya`,
  `Supplier ${p} ${c} — Garansi Mutu Tertulis`,
];

const DESCS: (p: string, c: string, prov: string, price: string, eta: string) => string[] = (
  p, c, prov, price, eta
) => [
  `${p} asli lereng Gunung Galunggung untuk ${c}, ${prov}. Estimasi ${price}, tiba ${eta}, garansi mutu tertulis. Minta penawaran resmi via WhatsApp — gratis.`,
  `Belanja ${p} di ${c}? Kami kirim langsung dari Gunung Galunggung, Tasikmalaya. ${price}, ETA ${eta}, dokumen lengkap untuk individu sampai instansi. Chat WhatsApp sekarang.`,
  `Supplier ${p} untuk area ${c} & sekitarnya: disaring, teruji, dikirim ${eta}. ${price}. Penawaran tertulis tanpa biaya tersembunyi — hubungi WhatsApp kami.`,
];

function buildLayanan(): Layanan[] {
  const combos: { product: SandProduct; city: SeoCity; score: number }[] = [];
  const PRODUCT_SCORE: Record<string, number> = {
    "pasir-galunggung-cor": 6,
    "pasir-urug": 5,
    "pasir-silika": 5,
    "pasir-pasang": 4,
    "pasir-halus": 4,
    "pasir-merah": 1,
  };
  for (const city of CITIES) {
    for (const product of PRODUCTS) {
      combos.push({
        product,
        city,
        score: PRODUCT_SCORE[product.id] + (city.tier === 1 ? 10 : 6) + (city.island === "jawa" ? 1 : 0),
      });
    }
  }
  // urut stabil desc by score → potong tepat 500
  combos.sort((a, b) => b.score - a.score || a.city.slug.localeCompare(b.city.slug) || a.product.id.localeCompare(b.product.id));
  const chosen = combos.slice(0, 500);

  return chosen.map(({ product, city }, idx) => {
    const shortSlug = PRODUCT_META[product.id].shortSlug;
    const slug = `${shortSlug}-${city.slug}`;
    const h = hashStr(slug);
    const unit = product.calcUnit === "ton" ? "ton" : "m³";
    const { low, high } = hargaFor(product.calcBase, city);
    const price = `${fmtHarga(low)} – ${fmtHarga(high)} /${unit}`;
    const eta = etaFor(city);
    const pName = product.name;

    const title = pick(TITLES(pName, city.name, city.province, eta), h);
    const h1 = pick(H1S(pName, city.name), h >> 2);
    const description = pick(DESCS(pName, city.name, city.province, price, eta), h >> 4);

    const imgs = PRODUCT_META[product.id];
    const images = [0, 1].map((k) => {
      const i = (h + idx + k) % imgs.images.length;
      const src = `/images/${imgs.images[i]}`;
      const alt = `${imgs.alts[i]} — ${pName} untuk ${city.name}`;
      return { src, alt };
    });

    const waMsg = `Halo ${SITE.name}! Saya mau minta penawaran ${pName} kirim ke ${city.name}, ${city.province}. Perkiraan kebutuhan: ___ ${unit}. Mohon info harga & ongkirnya. Terima kasih.`;
    const waShort = `Halo ${SITE.name}! Saya tertarik ${pName} untuk area ${city.name}. Boleh minta penawarannya?`;

    return {
      slug, idx, product, city, shortSlug, title, h1, description,
      priceLow: low, priceHigh: high, eta, images,
      wa: `${SITE.wa}?text=${encodeURIComponent(waMsg)}`,
      waShort: `${SITE.wa}?text=${encodeURIComponent(waShort)}`,
    };
  });
}

export const LAYANAN: Layanan[] = buildLayanan();
export const LAYANAN_BY_SLUG = new Map(LAYANAN.map((l) => [l.slug, l]));
export const LAYANAN_BY_CITY = new Map<string, Layanan[]>();
for (const l of LAYANAN) {
  const arr = LAYANAN_BY_CITY.get(l.city.slug) ?? [];
  arr.push(l);
  LAYANAN_BY_CITY.set(l.city.slug, arr);
}
export const LAYANAN_BY_PRODUCT = new Map<string, Layanan[]>();
for (const l of LAYANAN) {
  const arr = LAYANAN_BY_PRODUCT.get(l.product.id) ?? [];
  arr.push(l);
  LAYANAN_BY_PRODUCT.set(l.product.id, arr);
}

/* ------------------------ KONTEN LAYANAN ------------------------ */

const INTROS1: (p: string, c: string, prov: string, use: string) => string[] = (p, c, prov, use) => [
  `${p} yang kami kirim ke ${c}, ${prov}, disaring langsung dari titik produksi di lereng Gunung Galunggung, Tasikmalaya. Karakter butir vulkaniknya yang tajam dan bersudut membuat material ini saling mengunci dengan sempurna — ${use}. Setiap rit yang berangkat melewati kurasi visual dan uji kadar lumpur agar yang sampai di lokasi Anda persis seperti spesifikasi yang disepakati.`,
  `Butuh ${p} untuk proyek di ${c}? Kami memotong rantai pasok: pasir diambil dari lereng Gunung Galunggung, dikurasi di gudang Tasikmalaya, lalu dikirim langsung ke alamat Anda tanpa perantara. ${use.charAt(0).toUpperCase() + use.slice(1)} menjadi alasan utama kontraktor meminta pasir Galunggung secara spesifik — dan kami menjaga standar itu di setiap pengiriman, sekecil apa pun volumenya.`,
  `Kami menyuplai ${p} untuk area ${c} dan sekitarnya dengan satu janji: mutu tidak menegosiasi. Pasir Galunggung kami berasal dari deposit vulkanik Gunung Galunggung yang dikenal karena butirannya bersih dan kuat, ${use}. Dari pesanan satu rit pickup sampai kontrak ritase bulanan, dokumen dan garansi mutu kami perlakukan sama.`,
];

const INTROS2: (c: string, eta: string, jarak: string) => string[] = (c, eta, jarak) => [
  `Pengiriman ke ${c} ditempuh dengan estimasi tiba ${eta} (${jarak}). Ongkos angkut dihitung transparan sesuai moda — pickup, dump truck, atau truk besar — dan Anda menerima penawaran tertulis sebelum transaksi. Setelah pasir tiba, sopir kami membantu membongkar di titik yang aman sesuai instruksi Anda.`,
  `Untuk area ${c}, armada kami berangkat dari titik muat Tasikmalaya dengan jadwal yang bisa disesuaikan progres proyek Anda — estimasi tiba ${eta}. ${jarak.charAt(0).toUpperCase() + jarak.slice(1)}. Butuh pengiriman termin? Kami pecah jadwal kirim sesuai kalender pekerjaan Anda tanpa biaya penalti.`,
  `Rute pengiriman ke ${c} kami layani rutin sehingga estimasi waktunya akurat: pasir tiba ${eta}. Kami gabungkan efisiensi ritase dengan kontrol muat yang rapi — tidak ada volume yang "mengembang" di atas truk, tidak ada kejutan di tagihan. Semua tercatat di surat jalan yang Anda terima saat pengiriman.`,
];

const FAQS_LOCAL: (l: { productName: string; cityName: string; provinceName: string; price: string; eta: string; unit: string }) => { q: string; a: string }[] = (l) => [
  {
    q: `Berapa harga ${l.productName} untuk area ${l.cityName}?`,
    a: `Estimasi harga ${l.productName} untuk pengiriman ke ${l.cityName} berkisar ${l.price}, sudah memperhitungkan mutu pasir Galunggung dan faktor logistik ke ${l.provinceName}. Harga final tergantung volume dan moda angkut — kami kirimkan penawaran tertulis lengkap sebelum Anda memutuskan, tanpa biaya tersembunyi.`,
  },
  {
    q: `Apakah bisa kirim ${l.productName} ke ${l.cityName}? Estimasinya berapa lama?`,
    a: `Bisa. Kami rutin mengirim ke ${l.cityName} dan sekitarnya dengan estimasi tiba ${l.eta}. Armada dikombinasikan sesuai jarak dan volume — mulai pickup untuk kebutuhan rumah tangga sampai dump truck bertingkat untuk ritase proyek. Jadwal bisa disesuaikan dengan progres pekerjaan Anda.`,
  },
  {
    q: `Berapa minimal order ${l.productName} di ${l.cityName}?`,
    a: `Untuk area Jabodetabek dan kota besar di Jawa, minimal order kami ramah: 1 rit pickup (±1,5 ${l.unit === "ton" ? "ton" : "m³"}). Untuk kota lain minimal order menyesuaikan moda dan jarak — semakin besar volume, semakin efisien biaya angkut per unitnya. Konsultasi kebutuhan selalu gratis.`,
  },
  {
    q: `Bagaimana jaminan mutu ${l.productName}-nya?`,
    a: `Semua ${l.productName} melewati penyaringan dan kontrol kadar lumpur di titik muat. Spesifikasi tertulis disertakan dalam penawaran; jika pasir yang tiba tidak sesuai spesifikasi yang disepakati, kami ganti tanpa biaya tambahan. Untuk kebutuhan instansi dan perusahaan, kami juga menyediakan dokumen legalitas lengkap serta hasil uji laboratorium bila diminta.`,
  },
];

export function layananFaq(l: Layanan) {
  return FAQS_LOCAL({
    productName: l.product.name,
    cityName: l.city.name,
    provinceName: l.city.province,
    price: `${fmtHarga(l.priceLow)} – ${fmtHarga(l.priceHigh)} /${l.product.calcUnit === "ton" ? "ton" : "m³"}`,
    eta: l.eta,
    unit: l.product.calcUnit,
  });
}

export function layananIntros(l: Layanan): [string, string] {
  const h = hashStr(l.slug);
  const unit = l.product.calcUnit === "ton" ? "ton" : "m³";
  const use = l.product.useCase.split(".")[0].toLowerCase();
  const p1 = pick(INTROS1(l.product.name, l.city.name, l.city.province, use), h);
  const p2 = pick(INTROS2(l.city.name, l.eta, jarakText(l.city)), h >> 3);
  void unit;
  return [p1, p2];
}

/** Link terkait untuk setiap halaman layanan (internal linking) */
export function layananRelated(l: Layanan): {
  sameProduct: Layanan[];
  sameCity: Layanan[];
} {
  const sameProduct = (LAYANAN_BY_PRODUCT.get(l.product.id) ?? [])
    .filter((x) => x.city.slug !== l.city.slug)
    .slice(0, 8);
  const sameCity = (LAYANAN_BY_CITY.get(l.city.slug) ?? [])
    .filter((x) => x.product.id !== l.product.id)
    .slice(0, 8);
  return { sameProduct, sameCity };
}

export function waLink(msg: string): string {
  return `${SITE.wa}?text=${encodeURIComponent(msg)}`;
}

export { ISLANDS, etaFor, fmtHarga, slugify, hashStr };
export type { SeoCity };
export const WA_SITE = SITE.wa;
