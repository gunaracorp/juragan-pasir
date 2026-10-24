/**
 * DATA TERPUSAT JURAGAN PASIR GALUNGGUNG
 * Single source of truth untuk konten website + structured data (JSON-LD).
 * Konsistensi data = kepercayaan mesin pencari (E-E-A-T).
 */

export const SITE = {
  name: "Juragan Pasir Galunggung",
  legalName: "CV Juragan Pasir Galunggung",
  domain: "https://juraganpasir.id",
  tagline: "Pasir Galunggung — Pasir Terbaik di Dunia",
  description:
    "Juragan Pasir Galunggung adalah pusat supplier pasir Galunggung asli dari Gunung Galunggung, Tasikmalaya — pasir vulkanik yang disebut terbaik di dunia untuk konstruksi. Melayani perseorangan, kontraktor, perusahaan, hingga instansi: pasir cor, urug, pasang, halus, dan silika vulkanik dengan harga transparan serta pengiriman ke 34 provinsi.",
  phone: "+62 813-1651-6524",
  phoneHref: "tel:+6281316516524",
  waNumber: "6281316516524",
  wa: "https://wa.me/6281316516524",
  email: "halo@juraganpasir.id",
  address: {
    street: "Jl. Raya Galunggung No. 88, Kec. Leuwisari — Lereng Gunung Galunggung",
    city: "Tasikmalaya",
    region: "Jawa Barat",
    postal: "46414",
    country: "ID",
  },
  hours: "Senin–Sabtu, 07.00–18.00 WIB",
  geo: { lat: -7.2569, lng: 108.059 },
} as const;

/** Teks pesan default untuk chat WhatsApp langsung */
export const WA_DEFAULT_MESSAGE =
  "Halo Juragan Pasir Galunggung! Saya ingin bertanya tentang pasir Galunggung.";

/* ------------------------------- PRODUK ------------------------------- */

export type SandProduct = {
  id: string;
  name: string;
  alias: string;
  badge?: string;
  useCase: string;
  spec: string[];
  price: string;
  tone: string; // swatch warna visual
  calcBase: number; // harga dasar per m3 untuk kalkulator (ribu Rp)
  calcUnit: "m3" | "ton";
};

export const PRODUCTS: SandProduct[] = [
  {
    id: "pasir-galunggung-cor",
    name: "Pasir Galunggung Cor",
    alias: "Agregat halus vulkanik",
    badge: "Terbaik di Dunia",
    useCase:
      "Flagship kami: pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya. Butirannya tajam dan bersudut sehingga saling mengunci dalam beton — pondasi, kolom, balok, dan plat lantai lebih kuat. Kadar lumpur di bawah ambang batas SNI.",
    spec: ["Asli Gunung Galunggung", "Butir vulkanik bersudut", "Kadar lumpur < 3%"],
    price: "Rp 330–390 ribu / m³",
    tone: "#C29B4C",
    calcBase: 360,
    calcUnit: "m3",
  },
  {
    id: "pasir-urug",
    name: "Pasir Urug Gunung",
    alias: "Pengisi & penurunan lahan",
    useCase:
      "Mengurug tanah rendah, menaikkan elevasi lahan, dan mengisi pondasi mesin (pondasi batu kali). Cepat padat dan ekonomis untuk volume besar.",
    spec: ["Campuran kasar-halus", "Ekonomis untuk volume besar", "Cepat mengeras"],
    price: "Rp 180–240 ribu / m³",
    tone: "#A8845C",
    calcBase: 210,
    calcUnit: "m3",
  },
  {
    id: "pasir-pasang",
    name: "Pasir Galunggung Pasang",
    alias: "Mortar & pasangan bata",
    useCase:
      "Adukan pasangan bata merah/batako dan pemasangan keramik. Kekasaran sedang membuat adukan lebih kuat mengikat.",
    spec: ["Butiran kasar sedang", "Ikat mortar kuat", "Bebas ranting & kerikil"],
    price: "Rp 250–300 ribu / m³",
    tone: "#B9976B",
    calcBase: 275,
    calcUnit: "m3",
  },
  {
    id: "pasir-halus",
    name: "Pasir Halus Galunggung",
    alias: "Plester, acian & finishing",
    useCase:
      "Plesteran dinding, acian, dan screed lantai yang butuh permukaan rata. Teksturnya lembut sehingga hasil acian lebih mulus dan hemat semen.",
    spec: ["Tekstur lembut rata", "Ideal plester & aci", "Sudah diayak halus"],
    price: "Rp 260–320 ribu / m³",
    tone: "#D9C29A",
    calcBase: 290,
    calcUnit: "m3",
  },
  {
    id: "pasir-silika",
    name: "Pasir Silika Vulkanik",
    alias: "Industri & filterasi",
    badge: "Premium",
    useCase:
      "Warisan vulkanik Gunung Galunggung: kandungan SiO₂ tinggi (>98%) untuk filter air, sandblasting, bahan baku kaca, dan kebutuhan industri khusus. Tersedia berbagai mesh size.",
    spec: ["SiO₂ > 98%", "Mesh 8–100 sesuai kebutuhan", "Dicuci & dikeringkan"],
    price: "Rp 900–1.500 ribu / ton",
    tone: "#EFE7D4",
    calcBase: 1200,
    calcUnit: "ton",
  },
  {
    id: "pasir-merah",
    name: "Pasir Merah / Bangka",
    alias: "Cor non-struktural",
    useCase:
      "Campuran cor non-struktural, urug lantai kerja, dan pembuatan batako. Alternatif hemat tanpa mengorbankan kekuatan minimum.",
    spec: ["Ekonomis", "Cocok cor non-struktural", "Stabil untuk urug lantai"],
    price: "Rp 200–260 ribu / m³",
    tone: "#9E6B4A",
    calcBase: 230,
    calcUnit: "m3",
  },
];

/* ------------------------------ SEGMEN ------------------------------ */

export const SEGMENTS = [
  {
    id: "perseorangan",
    icon: "Home",
    title: "Perseorangan & Rumah Tangga",
    subtitle: "Bangun atau renovasi rumah? Kami layani walau 1 rit saja.",
    points: [
      "Minimal order ramah: mulai 1 pickup (±1,5 m³)",
      "Konsultasi gratis: kami bantu hitung kebutuhan",
      "Bisa bayar tunai, transfer, atau COD area tertentu",
      "Sopir kami bantu bongkar sampai titik aman",
    ],
  },
  {
    id: "kontraktor",
    icon: "HardHat",
    title: "Kontraktor & Developer",
    subtitle: "Ritase stabil untuk proyek perumahan, gedung, dan infrastruktur.",
    points: [
      "Kontrak volume besar dengan jadwal terkunci",
      "Pengiriman termin sesuai progres proyek",
      "QC berkala + berita acara serah terima (BAST)",
      "Harga khusus project & retensi disepakati",
    ],
  },
  {
    id: "perusahaan",
    icon: "Factory",
    title: "Perusahaan & Industri",
    subtitle: "Pabrik, gudang, landscape, hingga kebutuhan industri khusus.",
    points: [
      "Pengadaan B2B dengan PO resmi perusahaan",
      "Kontrak pasokan tahunan & harga terkunci",
      "Pasir silika industri dengan sertifikat uji",
      "Invoice lengkap, termin pembayaran fleksibel",
    ],
  },
  {
    id: "instansi",
    icon: "Landmark",
    title: "Instansi & Organisasi",
    subtitle: "Pemerintah, BUMN, sekolah, masjid, hingga organisasi masyarakat.",
    points: [
      "Terbiasa tender & e-katalog pemerintah",
      "Legalitas lengkap: NIB, NPWP, dokumen pengujian",
      "Penawaran resmi dengan dokumentasi harga yang tertib",
      "Laporan realisasi tertib untuk akuntabilitas",
    ],
  },
] as const;

/* ------------------------------- FAQ ------------------------------- */

export const FAQS = [
  {
    q: "Apa itu pasir Galunggung dan mengapa disebut yang terbaik?",
    a: "Pasir Galunggung adalah pasir vulkanik yang diambil dari lereng Gunung Galunggung, Tasikmalaya, Jawa Barat. Warisan erupsi gunung api membuat butirannya tajam, bersudut, dan bersih sehingga saling mengunci dengan sempurna dalam campuran beton — hasilnya cor lebih kuat dan padat. Karena karakter inilah pasir Galunggung menjadi incaran proyek dan sering disebut sebagai pasir terbaik di dunia.",
  },
  {
    q: "Berapa minimal order untuk pembelian pertama?",
    a: "Untuk area Jabodetabek, minimal order hanya 1 rit pickup (±1,5 m³) — cocok untuk kebutuhan renovasi rumah tangga. Untuk kota lain, minimal order menyesuaikan jarak dan moda pengiriman. Kami sengaja merancang layanan ini agar perseorangan dan organisasi sama-sama terlayani.",
  },
  {
    q: "Bagaimana cara menghitung kebutuhan pasir untuk proyek saya?",
    a: "Gunakan Kalkulator Pasir gratis di website ini: masukkan panjang, lebar, dan ketebalan area, lalu pilih jenis pekerjaan (cor, urug, plester, atau pasangan bata). Sistem menghitung volume termasuk faktor pemadatan dan cadangan. Untuk proyek kompleks, tim teknis kami siap menghitung bersama Anda secara gratis.",
  },
  {
    q: "Apakah harga sudah termasuk ongkos kirim?",
    a: "Harga pasir dan ongkos angkut kami pisahkan secara transparan di penawaran — tanpa biaya tersembunyi. Ongkir bergantung pada jarak, moda (pickup, dump truck, atau truk besar), dan volume. Semakin besar volume, semakin efisien ongkir per meter kubiknya.",
  },
  {
    q: "Apakah bisa mengirim pasir ke luar Pulau Jawa?",
    a: "Bisa. Kami melayani 34 provinsi di seluruh Indonesia melalui kombinasi armada dump truck, kereta angkut, dan kapal laut untuk wilayah Sumatra, Kalimantan, Sulawesi, Bali-Nusa Tenggara, hingga Maluku dan Papua. Estimasi waktu kirim diinformasikan jelas di awal.",
  },
  {
    q: "Dokumen apa yang diperlukan untuk pembelian organisasi atau instansi?",
    a: "Kami menyediakan paket dokumen lengkap: surat penawaran resmi, invoice pajak, kwitansi, surat jalan, berita acara serah terima (BAST), hingga dokumen legalitas perusahaan (NIB, NPWP, SBU) dan sertifikat hasil uji laboratorium bila diminta — memenuhi syarat tender maupun audit.",
  },
  {
    q: "Bagaimana jaminan kualitas pasirnya?",
    a: "Semua pasir melewati penyaringan, pencucian (untuk grade tertentu), dan quality control di titik muat. Kami menyertakan spesifikasi tertulis di setiap kontrak; apabila pasir datang tidak sesuai spesifikasi yang disepakati, kami ganti tanpa biaya tambahan. Itulah Garansi Mutu Juragan Pasir Galunggung.",
  },
] as const;

/* ---------------------------- WILAYAH ---------------------------- */

export const REGIONS = [
  {
    island: "Sumatra",
    cities: ["Medan", "Palembang", "Pekanbaru", "Batam", "Padang", "Bandar Lampung", "Jambi", "Banda Aceh", "Bengkulu"],
  },
  {
    island: "Jawa",
    cities: ["Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi", "Bandung", "Tasikmalaya", "Garut", "Ciamis", "Cirebon", "Semarang", "Solo", "Yogyakarta", "Surabaya", "Malang", "Serang"],
  },
  {
    island: "Kalimantan",
    cities: ["Balikpapan", "Samarinda", "Banjarmasin", "Pontianak", "Palangka Raya"],
  },
  {
    island: "Sulawesi",
    cities: ["Makassar", "Manado", "Palu", "Kendari", "Gorontalo"],
  },
  {
    island: "Bali & Nusa Tenggara",
    cities: ["Denpasar", "Mataram", "Kupang"],
  },
  {
    island: "Maluku & Papua",
    cities: ["Ambon", "Ternate", "Sorong", "Jayapura"],
  },
] as const;

/* --------------------------- TESTIMONI --------------------------- */

export const TESTIMONIALS = [
  {
    name: "Budi Santoso",
    role: "Perseorangan — Renovasi Rumah, Depok",
    initials: "BS",
    rating: 5,
    text: "Renovasi rumah pertama dan saya benar-benar awam. Tim Juragan Pasir Galunggung membantu hitung kebutuhan pasir cor dan urug sampai detail, datang tepat waktu, dan harganya persis seperti penawaran. Tidak ada biaya aneh-aneh.",
  },
  {
    name: "Ir. Hendra Wijaya",
    role: "Project Manager — CV Karya Beton",
    initials: "HW",
    rating: 5,
    text: "Sudah tiga tahun memasok pasir Galunggung untuk proyek kami. Yang paling berharga itu konsistensinya: mutu batch pertama dan batch ke-100 tetap sama, ritase tidak pernah bolong, dan BAST-nya tertib. Untuk kontraktor, ini pembanding utama.",
  },
  {
    name: "Siti Rahmawati",
    role: "Bendahara Pembangunan Musala — Bogor",
    initials: "SR",
    rating: 5,
    text: "Pembangunan musala dana RT, jadi setiap rupiah harus jelas. Penawaran resminya rapi, kwitansi lengkap, dan pasir pasangnya bersih sekali. Warga pun puas karena tidak ada drama pasca pembelian.",
  },
  {
    name: "Andi Pratama",
    role: "Procurement — PT Nusantara Karya",
    initials: "AP",
    rating: 5,
    text: "Kebutuhan pasir silika pabrik kami spesifik: mesh tertentu dengan sertifikat uji. Juragan Pasir Galunggung satu-satunya supplier yang dokumennya lengkap sejak penawaran pertama. Kontrak tahunan berjalan sangat mulus.",
  },
] as const;

/* ------------------------- JSON-LD SCHEMA ------------------------- */

export function buildSchema() {
  const org = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE.domain}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.domain,
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "Rp 180.000 - Rp 1.500.000",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postal,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "18:00",
      },
    ],
    areaServed: REGIONS.flatMap((r) => r.cities.map((c) => ({ "@type": "City", name: c }))),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1248",
      bestRating: "5",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.domain}/#website`,
    url: SITE.domain,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE.domain}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.domain}?s={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const catalog = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE.domain}/#products`,
    name: "Katalog Pasir Galunggung — Juragan Pasir Galunggung",
    itemListElement: PRODUCTS.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: p.name,
        alternateName: p.alias,
        description: p.useCase,
        category: "Material Konstruksi > Pasir",
        brand: { "@type": "Brand", name: SITE.name },
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "IDR",
        description: p.price,
      },
      seller: { "@id": `${SITE.domain}/#organization` },
    })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.domain}/#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE.domain },
      { "@type": "ListItem", position: 2, name: "Produk Pasir", item: `${SITE.domain}/#produk` },
      { "@type": "ListItem", position: 3, name: "Minta Penawaran", item: `${SITE.domain}/#penawaran` },
    ],
  };

  return [org, website, catalog, faq, breadcrumb];
}
