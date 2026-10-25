/**
 * JURAGAN CORE CMS — IDENTITAS VERSI
 * Sumber tunggal kebenaran untuk nomor versi, changelog, dan data keunggulan.
 * Dipakai oleh: landing /cms, halaman login, dashboard, dan sidebar admin.
 * Upgrade versi berikutnya cukup ubah file ini — semua titik lain mengikuti.
 */

export const CMS_NAME = "JURAGAN CORE";
export const CMS_VERSION = "2.0";
export const CMS_CODENAME = "God Tier Edition";
export const CMS_RELEASE_LABEL = `v.${CMS_VERSION} · ${CMS_CODENAME}`;
export const CMS_BUILD_YEAR = 2026;

/** Changelog resmi — tampil di dashboard & landing /cms */
export const CMS_CHANGELOG: { version: string; date: string; items: string[] }[] = [
  {
    version: "2.0",
    date: "Oktober 2026",
    items: [
      "CMS Home baru — landing platform dengan 9 keunggulan lengkap",
      "Halaman login didesain ulang total (split-screen premium + animasi)",
      "Dashboard v.2: sambutan dinamis, pintasan cepat, changelog bawaan",
      "Branding versi di seluruh panel admin",
      "Pondasi v.1 tetap utuh: 14 model data, 13 halaman admin, 11 API",
    ],
  },
  {
    version: "1.0",
    date: "Oktober 2026",
    items: [
      "CMS 3-lapis: Frontend DB-driven · Backend Admin · Integrasi API",
      "Section Manager (urutkan / sembunyikan / ubah judul)",
      "Leads Inbox + pipeline 5 status + tautan WhatsApp",
      "Riwayat revisi dengan rollback satu klik + audit log",
      "Export HTML mandiri (1 file offline siap kirim)",
    ],
  },
];

export type Keunggulan = {
  icon: string;
  title: string;
  desc: string;
  points: string[];
};

/** 9 keunggulan CMS — dirender di landing /cms (grid utama) */
export const CMS_KEUNGGULAN: Keunggulan[] = [
  {
    icon: "zap",
    title: "Edit Langsung Tampil",
    desc: "Simpan di backend, frontend berubah dalam hitungan detik. Tanpa deploy, tanpa build, tanpa hapus cache.",
    points: ["Real-time database-driven", "Zero-deploy workflow"],
  },
  {
    icon: "list",
    title: "Section Manager",
    desc: "Atur urutan, sembunyikan, atau ganti judul setiap section homepage — menu navigasi menyesuaikan otomatis.",
    points: ["Drag & drop urutan", "Toggle visibilitas"],
  },
  {
    icon: "database",
    title: "9 Editor Resource",
    desc: "Produk, segmen, testimoni, FAQ, wilayah, statistik, alur proses, keunggulan, hingga pengaturan situs — semua terkelola.",
    points: ["Form tervalidasi Zod", "Icon picker & list editor"],
  },
  {
    icon: "inbox",
    title: "Leads Inbox + WhatsApp",
    desc: "Setiap form penawaran masuk dengan nomor referensi. Pipeline 5 status, satu klik langsung buka chat WhatsApp terstruktur.",
    points: ["Pipeline 5 tahap", "Pesan WA otomatis"],
  },
  {
    icon: "history",
    title: "Riwayat & Rollback",
    desc: "Setiap penyimpanan konten terekam sebagai revisi. Salah ubah? Kembali ke versi sebelumnya dengan satu klik.",
    points: ["Time-machine konten", "Audit log aktivitas"],
  },
  {
    icon: "export",
    title: "Export HTML Mandiri",
    desc: "Unduh seluruh website sebagai satu file HTML offline — CSS & gambar ter-inline. Buka di mana saja tanpa server.",
    points: ["Portofolio & backup", "±1 file, siap kirim"],
  },
  {
    icon: "search",
    title: "SEO Otomatis",
    desc: "Metadata, JSON-LD (LocalBusiness, FAQ, Product), sitemap.xml, dan robots.txt digenerate langsung dari database.",
    points: ["Structured data penuh", "Siap Google Rich Results"],
  },
  {
    icon: "shield",
    title: "Keamanan Berlapis",
    desc: "Session JWT httpOnly, password di-hash scrypt, dan middleware guard melindungi seluruh halaman & API admin.",
    points: ["Token httpOnly", "Guard semua route admin"],
  },
  {
    icon: "puzzle",
    title: "Arsitektur Berkembang Bebas",
    desc: "Section baru cukup satu renderer + satu baris registry. Platform tumbuh mengikuti bisnis Anda, tanpa rombak kode.",
    points: ["Plugin architecture", "Unlimited ekspansi"],
  },
];

/** Peta nama ikon → komponen lucide (diimport dinamis di landing) */
export const CMS_STATS = [
  { value: "14", label: "Model Data" },
  { value: "13", label: "Halaman Admin" },
  { value: "11", label: "API Endpoint" },
  { value: "100%", label: "SSR + SEO" },
];

export const CMS_TECH = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS 4",
  "Prisma ORM",
  "SQLite",
  "JWT Auth",
  "Recharts",
  "Zod Validation",
  "Lucide Icons",
  "shadcn/ui",
];
