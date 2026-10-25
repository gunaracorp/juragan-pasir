/**
 * SEED CMS — Mengisi database dengan konten asli Juragan Pasir Galunggung
 * Menjadi "starter content" seperti WordPress. Bisa diubah semua dari admin.
 * Jalankan: bun scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "crypto";

const db = new PrismaClient();

/** Hash password scrypt (tanpa dependensi eksternal) */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256").update(salt + password).digest("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("🌱 Seeding Juragan Pasir CMS...");

  // ---------- SITE SETTINGS ----------
  await db.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      siteName: "Juragan Pasir Galunggung",
      legalName: "CV Juragan Pasir Galunggung",
      domain: "https://juraganpasir.id",
      tagline: "Pasir Galunggung — Pasir Terbaik di Dunia",
      description:
        "Juragan Pasir Galunggung adalah pusat supplier pasir Galunggung asli dari Gunung Galunggung, Tasikmalaya — pasir vulkanik yang disebut terbaik di dunia untuk konstruksi. Melayani perseorangan, kontraktor, perusahaan, hingga instansi: pasir cor, urug, pasang, halus, dan silika vulkanik dengan harga transparan serta pengiriman ke 34 provinsi.",
      phone: "+62 813-1651-6524",
      phoneHref: "tel:+6281316516524",
      waNumber: "6281316516524",
      email: "halo@juraganpasir.id",
      hours: "Senin–Sabtu, 07.00–18.00 WIB",
      waMessage:
        "Halo Juragan Pasir Galunggung! Saya ingin bertanya tentang pasir Galunggung.",
      street:
        "Jl. Raya Galunggung No. 88, Kec. Leuwisari — Lereng Gunung Galunggung",
      city: "Tasikmalaya",
      region: "Jawa Barat",
      postal: "46414",
      country: "ID",
      lat: -7.2569,
      lng: 108.059,
      heroBadge: "Asli Lereng Gunung Galunggung — Tasikmalaya",
      heroTitle1: "Pasir Galunggung,",
      heroTitle2: "Terbaik di Dunia",
      heroDesc:
        "Juragan Pasir Galunggung adalah pusat supplier pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya — dipercaya perseorangan, kontraktor, perusahaan, hingga instansi. Disaring, teruji, dan dikirim tepat waktu ke 34 provinsi.",
      heroCta1: "Minta Penawaran Gratis",
      heroCta2: "Lihat 6 Jenis Pasir",
      heroCardTitle: "Garansi Mutu\nJuragan Pasir",
      heroCardBadge: "Disaring • Teruji • Tersertifikasi",
      heroCardText:
        "Tidak sesuai spesifikasi yang disepakati? Kami ganti — tanpa biaya tambahan, tanpa drama.",
      heroStatNum: "12.480+",
      heroStatLabel: "Klien Terlayani",
      heroChipsJson: JSON.stringify([
        "Standar SNI & teruji lab",
        "Garansi mutu tertulis",
        "Kirim ke 34 provinsi",
      ]),
      seoTitle:
        "Juragan Pasir Galunggung — Pasir Terbaik di Dunia dari Gunung Galunggung, Tasikmalaya",
      seoDescription:
        "Pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya. Dari perseorangan hingga instansi: pasir cor, urug, pasang, halus & silika, harga transparan, kirim ke 34 provinsi. Minta penawaran via WhatsApp hari ini.",
      seoKeywords:
        "pasir galunggung,pasir gunung galunggung,jual pasir galunggung,harga pasir galunggung,pasir galunggung terbaik di dunia,pasir tasikmalaya,supplier pasir tasikmalaya,pasir vulkanik,pasir terbaik di dunia,jual pasir,supplier pasir,pusat pasir indonesia,harga pasir cor,pasir murah,toko pasir terpercaya,pasir urug,pasir pasang,pasir halus,pasir silika,distributor pasir,agen pasir galunggung,pasir jabodetabek,pengiriman pasir seluruh indonesia,supplier pasir kontraktor,pasir untuk renovasi rumah,pasir proyek konstruksi,supplier material konstruksi",
      footerAbout:
        "Pusat supplier pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya — dipercaya perseorangan, kontraktor, perusahaan, hingga instansi. Disaring, teruji, dan dikirim tepat waktu ke 34 provinsi Indonesia.",
      footerCopyright:
        "© 2026 CV Juragan Pasir Galunggung. Seluruh hak cipta dilindungi.",
    },
  });

  // ---------- ADMIN USER ----------
  const adminExists = await db.adminUser.count();
  if (adminExists === 0) {
    await db.adminUser.create({
      data: {
        email: "admin@juraganpasir.id",
        name: "Admin Juragan",
        passwordHash: hashPassword("juragan2026"),
        role: "admin",
      },
    });
    console.log("  👤 Admin: admin@juraganpasir.id / juragan2026");
  }

  // ---------- SECTIONS (registry) ----------
  const sections = [
    { key: "hero", title: "Hero — Sambutan Utama", order: 1, eyebrow: "", heading: "", highlight: "", description: "" },
    {
      key: "stats", title: "Statistik Prestasi", order: 2,
      eyebrow: "", heading: "", highlight: "", description: "",
    },
    {
      key: "products", title: "Katalog Produk Pasir", order: 3,
      eyebrow: "Produk Pasir",
      heading: "Enam Jenis Pasir,",
      highlight: "Satu Standar Mutu",
      description:
        "Setiap jenis pasir punya karakter dan kegunaan teknisnya masing-masing. Semua dikurasi di titik muat: disaring, dibersihkan, dan disertai spesifikasi tertulis.",
    },
    {
      key: "calculator", title: "Kalkulator Pasir", order: 4,
      eyebrow: "Alat Gratis",
      heading: "Kalkulator Pasir:",
      highlight: "Hitung Sebelum Beli",
      description:
        "Tiga dimensi, dua klik — tahu persis volume pasir, armada yang pas, dan estimasi biayanya. Tidak perlu ahli untuk mulai bijak berhitung.",
    },
    {
      key: "segments", title: "Segmen Klien", order: 5,
      eyebrow: "Siapa yang Kami Layani",
      heading: "Semua Kalangan,",
      highlight: "Tanpa Kecuali",
      description:
        "Tidak ada order yang terlalu kecil dan tidak ada kontrak yang terlalu besar. Empat segmen, satu standar pelayanan juragan.",
    },
    {
      key: "whyus", title: "Keunggulan Kami", order: 6,
      eyebrow: "Kenapa Juragan Pasir",
      heading: "Alasan Klien Balik Lagi",
      highlight: "dan Lagi",
      description:
        "Kami tidak sekadar menjual pasir — kami mengelola rantai pasok material agar proyek Anda tidak pernah berhenti karena kekurangan agregat.",
    },
    {
      key: "process", title: "Alur Pemesanan", order: 7,
      eyebrow: "Cara Kerja",
      heading: "Dari Chat Sampai",
      highlight: "Pasir Tiba",
      description:
        "Empat langkah transparan — tanpa drama, tanpa biaya kejutan. Semua terdokumentasi rapi dari awal sampai serah terima.",
    },
    {
      key: "coverage", title: "Jangkauan Wilayah", order: 8,
      eyebrow: "Jangkauan Pengiriman",
      heading: "34 Provinsi,",
      highlight: "Satu Rantai Pasok",
      description:
        "Dari Jabodetabek sampai Papua: armada darat, kereta angkut, dan kapal laut kami kombinasikan agar pasir sampai ke mana pun proyek Anda berdiri.",
    },
    {
      key: "testimonials", title: "Testimoni Klien", order: 9,
      eyebrow: "Kata Mereka",
      heading: "Kepercayaan yang Terbangun",
      highlight: "Ritase demi Ritase",
      description:
        "Rating 4,9/5 dari 1.248 ulasan terverifikasi. Berikut suara asli dari tiap segmen klien kami.",
    },
    {
      key: "faq", title: "FAQ — Tanya Jawab", order: 10,
      eyebrow: "Tanya Jawab",
      heading: "Pertanyaan yang",
      highlight: "Sering Diajukan",
      description:
        "Belum menemukan jawabannya? Tim kami membalas WhatsApp kerja hari yang sama.",
    },
    { key: "quote", title: "Form Minta Penawaran", order: 11, eyebrow: "", heading: "", highlight: "", description: "" },
  ];
  for (const s of sections) {
    await db.section.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log(`  🧩 ${sections.length} sections terdaftar`);

  // ---------- PRODUK ----------
  if ((await db.product.count()) === 0) {
    const products = [
      {
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
        order: 1,
      },
      {
        name: "Pasir Urug Gunung",
        alias: "Pengisi & penurunan lahan",
        badge: null,
        useCase:
          "Mengurug tanah rendah, menaikkan elevasi lahan, dan mengisi pondasi mesin (pondasi batu kali). Cepat padat dan ekonomis untuk volume besar.",
        spec: ["Campuran kasar-halus", "Ekonomis untuk volume besar", "Cepat mengeras"],
        price: "Rp 180–240 ribu / m³",
        tone: "#A8845C",
        calcBase: 210,
        calcUnit: "m3",
        order: 2,
      },
      {
        name: "Pasir Galunggung Pasang",
        alias: "Mortar & pasangan bata",
        badge: null,
        useCase:
          "Adukan pasangan bata merah/batako dan pemasangan keramik. Kekasaran sedang membuat adukan lebih kuat mengikat.",
        spec: ["Butiran kasar sedang", "Ikat mortar kuat", "Bebas ranting & kerikil"],
        price: "Rp 250–300 ribu / m³",
        tone: "#B9976B",
        calcBase: 275,
        calcUnit: "m3",
        order: 3,
      },
      {
        name: "Pasir Halus Galunggung",
        alias: "Plester, acian & finishing",
        badge: null,
        useCase:
          "Plesteran dinding, acian, dan screed lantai yang butuh permukaan rata. Teksturnya lembut sehingga hasil acian lebih mulus dan hemat semen.",
        spec: ["Tekstur lembut rata", "Ideal plester & aci", "Sudah diayak halus"],
        price: "Rp 260–320 ribu / m³",
        tone: "#D9C29A",
        calcBase: 290,
        calcUnit: "m3",
        order: 4,
      },
      {
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
        order: 5,
      },
      {
        name: "Pasir Merah / Bangka",
        alias: "Cor non-struktural",
        badge: null,
        useCase:
          "Campuran cor non-struktural, urug lantai kerja, dan pembuatan batako. Alternatif hemat tanpa mengorbankan kekuatan minimum.",
        spec: ["Ekonomis", "Cocok cor non-struktural", "Stabil untuk urug lantai"],
        price: "Rp 200–260 ribu / m³",
        tone: "#9E6B4A",
        calcBase: 230,
        calcUnit: "m3",
        order: 6,
      },
    ];
    for (const { spec, ...p } of products) {
      await db.product.create({
        data: { ...p, specJson: JSON.stringify(spec), badge: p.badge ?? undefined },
      });
    }
    console.log(`  📦 ${products.length} produk`);
  }

  // ---------- SEGMEN ----------
  if ((await db.segment.count()) === 0) {
    const segments = [
      {
        icon: "Home",
        title: "Perseorangan & Rumah Tangga",
        subtitle: "Bangun atau renovasi rumah? Kami layani walau 1 rit saja.",
        points: [
          "Minimal order ramah: mulai 1 pickup (±1,5 m³)",
          "Konsultasi gratis: kami bantu hitung kebutuhan",
          "Bisa bayar tunai, transfer, atau COD area tertentu",
          "Sopir kami bantu bongkar sampai titik aman",
        ],
        order: 1,
      },
      {
        icon: "HardHat",
        title: "Kontraktor & Developer",
        subtitle: "Ritase stabil untuk proyek perumahan, gedung, dan infrastruktur.",
        points: [
          "Kontrak volume besar dengan jadwal terkunci",
          "Pengiriman termin sesuai progres proyek",
          "QC berkala + berita acara serah terima (BAST)",
          "Harga khusus project & retensi disepakati",
        ],
        order: 2,
      },
      {
        icon: "Factory",
        title: "Perusahaan & Industri",
        subtitle: "Pabrik, gudang, landscape, hingga kebutuhan industri khusus.",
        points: [
          "Pengadaan B2B dengan PO resmi perusahaan",
          "Kontrak pasokan tahunan & harga terkunci",
          "Pasir silika industri dengan sertifikat uji",
          "Invoice lengkap, termin pembayaran fleksibel",
        ],
        order: 3,
      },
      {
        icon: "Landmark",
        title: "Instansi & Organisasi",
        subtitle: "Pemerintah, BUMN, sekolah, masjid, hingga organisasi masyarakat.",
        points: [
          "Terbiasa tender & e-katalog pemerintah",
          "Legalitas lengkap: NIB, NPWP, dokumen pengujian",
          "Penawaran resmi dengan dokumentasi harga yang tertib",
          "Laporan realisasi tertib untuk akuntabilitas",
        ],
        order: 4,
      },
    ];
    for (const { points, ...s } of segments) {
      await db.segment.create({ data: { ...s, pointsJson: JSON.stringify(points) } });
    }
    console.log(`  🧑‍🤝‍🧑 ${segments.length} segmen`);
  }

  // ---------- FAQ ----------
  if ((await db.faq.count()) === 0) {
    const faqs = [
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
    ];
    for (let i = 0; i < faqs.length; i++) {
      await db.faq.create({ data: { question: faqs[i].q, answer: faqs[i].a, order: i + 1 } });
    }
    console.log(`  ❓ ${faqs.length} FAQ`);
  }

  // ---------- WILAYAH ----------
  if ((await db.region.count()) === 0) {
    const regions = [
      { island: "Sumatra", cities: ["Medan", "Palembang", "Pekanbaru", "Batam", "Padang", "Bandar Lampung", "Jambi", "Banda Aceh", "Bengkulu"] },
      { island: "Jawa", cities: ["Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi", "Bandung", "Tasikmalaya", "Garut", "Ciamis", "Cirebon", "Semarang", "Solo", "Yogyakarta", "Surabaya", "Malang", "Serang"] },
      { island: "Kalimantan", cities: ["Balikpapan", "Samarinda", "Banjarmasin", "Pontianak", "Palangka Raya"] },
      { island: "Sulawesi", cities: ["Makassar", "Manado", "Palu", "Kendari", "Gorontalo"] },
      { island: "Bali & Nusa Tenggara", cities: ["Denpasar", "Mataram", "Kupang"] },
      { island: "Maluku & Papua", cities: ["Ambon", "Ternate", "Sorong", "Jayapura"] },
    ];
    for (let i = 0; i < regions.length; i++) {
      await db.region.create({
        data: { island: regions[i].island, citiesJson: JSON.stringify(regions[i].cities), order: i + 1 },
      });
    }
    console.log(`  🗺️ ${regions.length} wilayah`);
  }

  // ---------- TESTIMONI ----------
  if ((await db.testimonial.count()) === 0) {
    const items = [
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
    ];
    for (let i = 0; i < items.length; i++) {
      await db.testimonial.create({ data: { ...items[i], order: i + 1 } });
    }
    console.log(`  💬 ${items.length} testimoni`);
  }

  // ---------- STATISTIK ----------
  if ((await db.stat.count()) === 0) {
    const stats = [
      { icon: "Gem", target: 2.5, decimals: 1, suffix: " jt+", label: "Ton pasir terkirim", order: 1 },
      { icon: "Users", target: 12480, decimals: 0, suffix: "+", label: "Klien terlayani", order: 2 },
      { icon: "Landmark", target: 34, decimals: 0, suffix: "", label: "Provinsi terjangkau", order: 3 },
      { icon: "Truck", target: 98.6, decimals: 1, suffix: "%", label: "Kirim tepat waktu", order: 4 },
    ];
    for (const s of stats) await db.stat.create({ data: s });
    console.log(`  📊 ${stats.length} statistik`);
  }

  // ---------- ALUR PEMESANAN ----------
  if ((await db.processStep.count()) === 0) {
    const steps = [
      {
        icon: "MessagesSquare",
        title: "Konsultasi & Kebutuhan",
        body: "Ceritakan proyek Anda via WhatsApp, telepon, atau form. Individu cukup sebutkan perkiraan kebutuhan; organisasi bisa lampirkan permintaan resmi.",
        order: 1,
      },
      {
        icon: "ClipboardCheck",
        title: "Penawaran Tertulis",
        body: "Penawaran resmi berisi spesifikasi, harga rinci, dan jadwal dikirim maksimal 1×24 jam. Sampel material bisa diatur untuk kontrak besar.",
        order: 2,
      },
      {
        icon: "Handshake",
        title: "Kesepakatan & Jadwal",
        body: "Individu cukup sepakat via chat; kontraktor dan instansi kami siapkan PO/kontrak. Jadwal kirim dikunci sesuai ritme pekerjaan Anda.",
        order: 3,
      },
      {
        icon: "Scale",
        title: "Kirim & Terima Terukur",
        body: "Volume diukur (kubikasi/timbangan), surat jalan menyertai setiap armada, dan BAST ditandatangani saat penerimaan. Selesai dengan rapi.",
        order: 4,
      },
    ];
    for (const s of steps) await db.processStep.create({ data: s });
    console.log(`  🔄 ${steps.length} langkah proses`);
  }

  // ---------- KEUNGGULAN ----------
  if ((await db.whyUsItem.count()) === 0) {
    const values = [
      {
        icon: "FlaskConical",
        title: "Mutu Tersaring & Teruji",
        body: "Setiap pasir disaring dan (untuk grade tertentu) dicuci sebelum dimuat. Kadar lumpur dan modulus kehalusan dicek secara berkala — spesifikasi tertulis melekat di setiap kontrak.",
        order: 1,
      },
      {
        icon: "BadgePercent",
        title: "Harga Transparan",
        body: "Rincian harga pasir, ongkos angkut, dan pajak dipisah jelas di penawaran. Yang Anda lihat adalah yang Anda bayar — tidak ada biaya kejutan di akhir.",
        order: 2,
      },
      {
        icon: "Truck",
        title: "Armada Sendiri",
        body: "40+ unit dump truck dari pickup hingga truk besar berarti jadwal tidak bergantung pihak ketiga. Kirim darurat pun bisa kami akali, termasuk akhir pekan.",
        order: 3,
      },
      {
        icon: "Warehouse",
        title: "Stok Anti Kehabisan",
        body: "Tambak dan gudang di beberapa titik strategis menjaga pasokan tetap mengalir walau musim hujan atau saat permintaan proyek memuncak.",
        order: 4,
      },
      {
        icon: "Headset",
        title: "Konsultasi Teknis Gratis",
        body: "Bingung pilih pasir cor atau pasir pasang? Tim berpengalaman membantu menghitung dan memilih spesifikasi yang tepat — gratis, tanpa syarat pembelian.",
        order: 5,
      },
      {
        icon: "FileCheck2",
        title: "Dokumen Lengkap & Resmi",
        body: "NIB, NPWP, invoice pajak, kwitansi, hingga berita acara serah terima. Semua transaksi tertib administrasi — aman untuk audit perusahaan maupun instansi.",
        order: 6,
      },
    ];
    for (const v of values) await db.whyUsItem.create({ data: v });
    console.log(`  ⭐ ${values.length} keunggulan`);
  }

  console.log("✅ Seed selesai!");
  console.log("   Frontend  → membaca dari database");
  console.log("   Backend   → /admin (login: admin@juraganpasir.id / juragan2026)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
