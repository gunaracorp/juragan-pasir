# CATATAN PENYESUAIAN — Usulan Awal vs Masterplan 100 Tahun

Dokumen ini merekam rekonsiliasi antara usulan migrasi "Juragan Core" (fase chat) dengan
**Masterplan Arsitektur 100 Tahun — Portofolio 46 Situs** yang menjadi acuan final.

## 1. Apa yang Berubah (vonis Masterplan menang)

| Dimensi | Usulan Awal | Final (Masterplan) | Alasan |
|---|---|---|---|
| Framework | Micro-framework + Composer (FastRoute, autoload PSR-4) | **Pure PHP, autoloader buatan, nol dependensi** | Debug permukaan datar di cPanel; tanpa vendor dir; umur panjang |
| Database | SQLite | **MySQL** (SQLite hanya opsi dev lokal) | Native cPanel, mysqldump mudah, prefiks tabel per tenant |
| Skala | CMS single-site (juragan-pasir saja) | **Multi-tenant sejak baris pertama** | "Satu Kode, Banyak Kerajaan": 1 core → puluhan domain/akun |
| Build CSS | Tailwind CLI build step | **CSS jadi, tanpa build** | Nol tooling; konsisten "tanpa proses build" |
| Admin UI | htmx via CDN | **Vanilla JS + CSS murni** | Offline-safe, tanpa dependensi eksternal apa pun |
| (Baru) | — | **Lapisan cache HTML + .htaccess Turbo** | Kecepatan gratis; Apache menyajikan beranda tanpa PHP |
| (Baru) | — | **Installer web 2-mode** (instal awal + tambah tenant) | Realitas cPanel tanpa CLI/SSH |
| (Baru) | — | **Panel Kesehatan SEO + pratinjau SERP** | Masterplan BAB 6.2: fondasi teknis otomatis, bukan mengandalkan ingatan |

## 2. Apa yang Bertahan dari Usulan Awal

- Arsitektur **section registry** (Next.js CMS) → disederhanakan menjadi **kategori artikel**
  (`produk`, `testimoni`, `faq`) yang otomatis menjadi grid beranda — filosofi "berkembang bebas" tetap.
- **Funnel WhatsApp-first**: tombol WA float, CTA, pesan ter-prefill per produk.
- **Animasi penuh tanpa framework**: reveal scroll (IntersectionObserver), counter easing, accordion.
- **Respect `prefers-reduced-motion`** dan progressive enhancement (situs hidup tanpa JS).
- Seed konten asli Juragan Pasir Galunggung (6 produk, 4 testimoni, 7 FAQ, 4 langkah, 6 keunggulan, 4 statistik, WA 6281316516524).

## 3. Posisi juragan-pasir dalam Masterplan

- Status: **Tier A → PILOT #1** migrasi (situs komersial bernilai tertinggi, update konten rutin).
- Jalur: CMS multi-tenant di akun hosting A, bukan static export (karena konten dinamis via admin).
- CMS Next.js sebelumnya tetap jadi **aset**: sumber konten & desain; Next.js hanya "pensiun dari operasional".

## 4. Kepatuhan terhadap Syarat Wajib Masterplan (BAB 2.4)

| Syarat | Status |
|---|---|
| Nol rupiah biaya baru | ✅ murni PHP/MySQL di shared hosting yang sudah terbayar |
| Timeline mendesak (pilot 2 minggu) | ✅ CMS v1 selesai & lulus 37/37 uji E2E; tinggal deploy + cutover |
| Melayani situs campuran | ✅ tenant dinamis (CMS) + jalur static export untuk brosur Tier C |
| Cocok kemampuan PHP menengah | ✅ if/else router yang bisa dibaca, error log cPanel, tanpa CLI |
| SEO-first sejak lahir | ✅ sitemap, robots, canonical, OG, JSON-LD, cache, SERP preview, health panel |

## 5. Verifikasi yang Sudah Dijalankan (E2E, 37/37)

Instalasi → seed konten → beranda (hero, grid produk/testimoni/FAQ, animasi, WA) → cache MISS/HIT →
halaman tentang → detail produk (JSON-LD Article) → 404 → sitemap.xml → robots.txt → proteksi admin →
login → dashboard → edit konten via admin → **cache purge & frontend berubah** → upload media →
media tersaji → tambah tenant kedua → logout → proteksi kembali.

Diverifikasi visual via browser: tema frontend (hero, stats beranimasi, produk, testimoni, CTA) dan
panel admin (dashboard + Kesehatan SEO).
