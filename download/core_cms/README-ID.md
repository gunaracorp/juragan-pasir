# CORE CMS v1 — "Satu Kode, Banyak Kerajaan"

CMS multi-tenant **pure PHP + MySQL** buatan sendiri, sesuai Masterplan Arsitektur 100 Tahun:
**tanpa framework, tanpa Composer, tanpa proses build, tanpa biaya baru.**

- 🏰 Multi-tenant: satu core melayani puluhan domain per akun hosting (prefiks tabel per tenant)
- ⚡ Lapisan kecepatan: halaman di-cache sebagai HTML statis (`X-Core-Cache: HIT`)
- 🔍 SEO-first bawaan: sitemap.xml, robots.txt, canonical, Open Graph, JSON-LD (WebSite, LocalBusiness, Article, FAQPage, BreadcrumbList), pratinjau SERP, panel Kesehatan SEO
- 🎨 Tema "juragan" dengan animasi vanilla (reveal scroll, counter, accordion) — hormat `prefers-reduced-motion`
- 🛡️ Keamanan: CSRF, password_hash, rate-limit login, filter unggahan, session aman, .htaccess pelindung
- 📦 Backup: dump SQL + copy folder = situs utuh kembali

---

## Persyaratan

| Butuh | Keterangan |
|---|---|
| PHP 8.1+ | dengan PDO MySQL (bawaan cPanel), `mbstring`, `fileinfo` |
| MySQL | satu database per akun hosting cukup |
| Apache | mod_rewrite aktif (bawaan cPanel) |
| Tanpa | Composer, Node, build tool, SSH — **tidak dibutuhkan** |

---

## Deploy ke Shared Hosting (cPanel) — 15 Menit

### Langkah 1 — Upload core (di LUAR public_html)
1. cPanel → **File Manager** → masuk ke folder home akun (`/home/USERNAME/`).
2. Unggah `core_cms.zip` lalu **Extract** → hasilnya `/home/USERNAME/core_cms/`.

### Langkah 2 — Buat database
1. cPanel → **MySQL® Databases** → buat database (mis. `user_cms`) + user, beri **ALL PRIVILEGES**.
2. Catat: nama DB, user, sandi.

### Langkah 3 — Siapkan folder domain (addon domain)
1. cPanel → **Domains/Addon Domains** → arahkan dokumen root ke `public_html/domainku.com`.
2. Salin dua file dari `docs/kit-domain/` ke folder domain itu:
   - `index.php` → ganti `/home/USERNAME/core_cms` sesuai path akun Anda.
   - `htaccess-template.txt` → **rename jadi `.htaccess`** → ganti semua `__CORE_PATH__` dengan `/home/USERNAME/core_cms`.

### Langkah 4 — Instalasi lewat browser
1. Buka `https://domainku.com/install`.
2. Isi: driver **MySQL**, kredensial DB, nama situs, prefiks tabel (mis. `t1_`), username & sandi admin (min. 8 karakter).
3. Klik **Pasang Sekarang** → konten starter Juragan Pasir otomatis tertanam.
4. Installer otomatis: menulis `config/config.php`, mendaftarkan tenant di `config/tenants.php`, membuat 5 tabel berprefiks, membuat `.htaccess` pelindung core, dan **mengunci diri** (`storage/install.lock`).

### Langkah 5 — Masuk panel & bekerja
1. Buka `https://domainku.com/admin` → login.
2. Dashboard → **Kesehatan SEO** → lengkapi meta yang ditandai.
3. Selesai. Setiap simpanan admin langsung tampil di frontend (cache dibersihkan otomatis).

---

## Menambah Tenant ke-2, ke-3, ... (domain lain di akun yang sama)

1. Buat folder addon domain + kit domain seperti Langkah 3 (prefiks **berbeda** hanya di database — kit tetap sama).
2. Buka `https://domain-baru.com/install` → mode **Tambah Tenant** sudah aktif (sistem terkunci).
3. Isi nama tenant + prefiks baru (mis. `t2_`) + kredensial admin yang ada.
4. Daftarkan pemetaan domain di `config/tenants.php` bila perlu (installer biasanya sudah menuliskannya):

```php
return [
    'domainku.com'    => ['prefix' => 't1_', 'name' => 'Juragan Pasir Galunggung', 'theme' => 'juragan'],
    'tokokedua.com'   => ['prefix' => 't2_', 'name' => 'Toko Kedua', 'theme' => 'juragan'],
    'default'         => ['prefix' => 'main_', 'name' => 'Juragan Core', 'theme' => 'juragan'],
];
```

> Varian `www.` dicocokkan otomatis. Satu core ditambal = semua tenant di akun itu terpatch serentak.

---

## Struktur Folder

```
~/core_cms/                  ← INTI (di luar public_html, deny-all)
├── index.php                ← front controller inti
├── install.php?             ← (tidak ada) installer via rute /install
├── config/                  ← config.php + tenants.php (ditulis installer)
├── core/                    ← mesin: Bootstrap, Database, Tenant, Router,
│                               Cache, Auth, View, Seo, Media, Settings, Installer
├── controllers/             ← Front (publik) + Admin (panel)
├── views/                   ← view inti (front/ + admin/)
├── themes/juragan/          ← tema frontend: views + assets (css/js animasi)
├── assets/                  ← admin.css, admin.js
├── storage/                 ← cache HTML, uploads per-tenant, logs, install.lock
└── docs/kit-domain/         ← template index.php + .htaccess per domain

~/public_html/domainku.com/  ← SATU-SATUNYA folder terekspos per domain
├── index.php                ← 3 baris pemicu
└── .htaccess                ← cache-turbo + front controller + header keamanan
```

## Cara Kerja Kecepatan (Lapisan Cache)

1. Pengunjung meminta `/` → `.htaccess` mengecek file cache (rule "Turbo") → **Apache menyajikan HTML murni tanpa PHP** bila ada.
2. Bila belum ada (atau rule Turbo dihapus), `index.php` mengecek cache tingkat PHP → `readfile()` dalam beberapa milidetik (`X-Core-Cache: HIT`).
3. Bila cache kosong → render penuh sekali → simpan → `X-Core-Cache: MISS`.
4. Admin menyimpan konten apa pun → cache tenant dihapus → render ulang otomatis.

## Ritme Backup (Masterplan BAB 4.5)

- **Mingguan** (cron cPanel): `mysqldump` seluruh DB + zip folder `core_cms` ke `~/backups/`.
- **Bulanan**: unduh Full Backup cPanel ke disk lokal + cloud pribadi (3-2-1).
- **Kode**: simpan core_cms di Git pribadi. Pemulihan = upload kode + import SQL + arahkan DNS.
- **Uji kuarteran**: restore satu situs kecil, pastikan hidup.

## Keamanan yang Sudah Terpasang

- Token CSRF pada semua formulir; verifikasi ketat di setiap POST.
- `password_hash()` PHP + rate-limit login (jeda membalon setelah 5 gagal).
- Session cookie `HttpOnly` + `SameSite=Lax` + `Secure` (HTTPS) + regenerate saat login.
- Unggahan: whitelist ekstensi + verifikasi MIME finfo + nama file acak + maks 8 MB.
- Panel admin `noindex,nofollow`; folder core `Require all denied`.
- Header: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` (di .htaccess domain).
- Opsional: lindungi `/admin` dengan Basic Auth dari cPanel (lapisan ganda, Masterplan BAB 4.5).

## Checklist SEO Setelah Domain Pindah (Masterplan BAB 5.4 & 6)

1. Turunkan TTL DNS ke 300 detik (24 jam sebelum cutover).
2. Pastikan konten identik di hosting baru (uji via preview URL).
3. Ubah A record / nameserver → aktifkan AutoSSL/Let's Encrypt → paksa HTTPS.
4. Verifikasi domain di **Google Search Console** (berkas HTML atau DNS).
5. Submit `https://domain/sitemap.xml` (tersedia otomatis).
6. Pantau Cakupan mingguan; gunakan URL Inspection untuk halaman prioritas.
7. **Baru** matikan deployment lama di Vercel.

## Uji Lokal (tanpa hosting)

```bash
cd core_cms
php -S 127.0.0.1:8099 dev-server.php
# buka http://127.0.0.1:8099/install → pilih driver SQLite
```

## Catatan v1 (jujur & terbatas)

- Editor konten = textarea HTML (dokumentasi class section ada di form halaman). Editor WYSIWYG → roadmap v2.
- Kalkulator pasir, revisi konten/rollback, multi-user per tenant → roadmap v2.
- WA di konten hero tersimpan dalam HTML halaman (ubah via edit konten); tombol WA otomatis (float, CTA, kartu produk) mengikuti Pengaturan.
