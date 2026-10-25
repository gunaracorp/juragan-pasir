<?php
/**
 * JURAGAN CORE CMS — Installer
 * Dipasang lewat browser di /install (tanpa CLI — sesuai kenyataan cPanel):
 *  1) Instalasi awal   : tulis config, buat tabel tenant, akun admin, seed konten.
 *  2) Tambah tenant    : buat tabel + seed untuk prefiks baru (butuh kredensial admin).
 * Membuat file .htaccess pelindung dan storage/install.lock setelah selesai.
 */
declare(strict_types=1);

final class Installer
{
    public static function locked(): bool
    {
        return is_file(JRCMS_ROOT . '/storage/install.lock');
    }

    /* ================= DDL per driver ================= */

    public static function ddl(string $driver): array
    {
        if ($driver === 'sqlite') return self::ddlSqlite();
        return self::ddlMysql();
    }

    private static function ddlMysql(): array
    {
        $p = Tenant::prefix();
        $t = function (string $suffix) use ($p): string { return '`' . $p . $suffix . '`'; };
        return [
            "CREATE TABLE IF NOT EXISTS {$t('users')} (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(64) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(120) NOT NULL DEFAULT '',
                role VARCHAR(20) NOT NULL DEFAULT 'admin',
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS {$t('settings')} (
                skey VARCHAR(64) NOT NULL PRIMARY KEY,
                svalue LONGTEXT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS {$t('pages')} (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(190) NOT NULL,
                slug VARCHAR(190) NOT NULL UNIQUE,
                content LONGTEXT,
                meta_title VARCHAR(190) NOT NULL DEFAULT '',
                meta_description VARCHAR(320) NOT NULL DEFAULT '',
                og_image VARCHAR(255) NOT NULL DEFAULT '',
                is_home TINYINT(1) NOT NULL DEFAULT 0,
                is_published TINYINT(1) NOT NULL DEFAULT 1,
                sort_order INT NOT NULL DEFAULT 0,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS {$t('articles')} (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(190) NOT NULL,
                slug VARCHAR(190) NOT NULL UNIQUE,
                category VARCHAR(64) NOT NULL DEFAULT 'artikel',
                excerpt VARCHAR(500) NOT NULL DEFAULT '',
                content LONGTEXT,
                image VARCHAR(255) NOT NULL DEFAULT '',
                meta_title VARCHAR(190) NOT NULL DEFAULT '',
                meta_description VARCHAR(320) NOT NULL DEFAULT '',
                is_published TINYINT(1) NOT NULL DEFAULT 1,
                published_at DATETIME NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS {$t('media')} (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                original_name VARCHAR(255) NOT NULL DEFAULT '',
                mime VARCHAR(100) NOT NULL DEFAULT '',
                size INT NOT NULL DEFAULT 0,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
        ];
    }

    private static function ddlSqlite(): array
    {
        $p = Tenant::prefix();
        $t = function (string $suffix) use ($p): string { return '"' . $p . $suffix . '"'; };
        return [
            "CREATE TABLE IF NOT EXISTS {$t('users')} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL DEFAULT '',
                role TEXT NOT NULL DEFAULT 'admin',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
            "CREATE TABLE IF NOT EXISTS {$t('settings')} (
                skey TEXT PRIMARY KEY,
                svalue TEXT)",
            "CREATE TABLE IF NOT EXISTS {$t('pages')} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                content TEXT,
                meta_title TEXT NOT NULL DEFAULT '',
                meta_description TEXT NOT NULL DEFAULT '',
                og_image TEXT NOT NULL DEFAULT '',
                is_home INTEGER NOT NULL DEFAULT 0,
                is_published INTEGER NOT NULL DEFAULT 1,
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
            "CREATE TABLE IF NOT EXISTS {$t('articles')} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                category TEXT NOT NULL DEFAULT 'artikel',
                excerpt TEXT NOT NULL DEFAULT '',
                content TEXT,
                image TEXT NOT NULL DEFAULT '',
                meta_title TEXT NOT NULL DEFAULT '',
                meta_description TEXT NOT NULL DEFAULT '',
                is_published INTEGER NOT NULL DEFAULT 1,
                published_at TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
            "CREATE TABLE IF NOT EXISTS {$t('media')} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                original_name TEXT NOT NULL DEFAULT '',
                mime TEXT NOT NULL DEFAULT '',
                size INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
        ];
    }

    /** Buat seluruh tabel tenant aktif */
    public static function createTables(): void
    {
        foreach (self::ddl(Config::get('db.driver')) as $sql) {
            Database::run($sql);
        }
    }

    /* ================= Instalasi awal ================= */

    /** @return array{ok:bool, errors:string[], messages:string[]} */
    public static function install(array $f): array
    {
        $errors = [];
        $messages = [];

        $driver = $f['driver'] === 'sqlite' ? 'sqlite' : 'mysql';
        $host   = trim($f['db_host']) ?: 'localhost';
        $name   = trim($f['db_name']);
        $user   = trim($f['db_user']);
        $pass   = (string)$f['db_pass'];
        $siteTitle = trim($f['site_title']) ?: 'Situs Saya';
        $prefix = strtolower(trim($f['prefix']) ?: 't1_');
        if (!preg_match('/^[a-z][a-z0-9_]*_$/', $prefix)) {
            $errors[] = 'Prefiks tabel harus diakhiri garis bawah, hanya huruf kecil/angka (mis. t1_).';
        }
        $adminUser = trim($f['admin_user']);
        $adminPass = (string)$f['admin_pass'];
        if ($adminUser === '' || strlen($adminPass) < 8) {
            $errors[] = 'Username admin wajib diisi dan sandi minimal 8 karakter.';
        }

        if (!$errors && $driver === 'mysql' && ($name === '' || $user === '')) {
            $errors[] = 'Nama database dan user MySQL wajib diisi.';
        }

        if ($errors) return ['ok' => false, 'errors' => $errors, 'messages' => $messages];

        // 1) Uji koneksi
        try {
            if ($driver === 'sqlite') {
                Config::override('db', ['driver' => 'sqlite', 'sqlite_path' => JRCMS_ROOT . '/storage/cms.sqlite']);
            } else {
                Config::override('db', ['driver' => 'mysql', 'host' => $host, 'port' => '3306',
                    'name' => $name, 'user' => $user, 'pass' => $pass, 'charset' => 'utf8mb4']);
            }
            Database::pdo()->query('SELECT 1');
            $messages[] = 'Koneksi database berhasil.';
        } catch (Throwable $e) {
            $errors[] = 'Koneksi database gagal: ' . $e->getMessage();
            return ['ok' => false, 'errors' => $errors, 'messages' => $messages];
        }

        // 2) Tulis config/config.php + config/tenants.php
        $thisHost = strtolower(preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? 'default') ?: 'default');
        $cfgFile = JRCMS_ROOT . '/config/config.php';
        if (!is_file($cfgFile)) {
            $cfgPhp = "<?php\n// Dibuat otomatis oleh installer " . date('Y-m-d H:i') . "\nreturn [\n"
                . "    'db' => [\n"
                . "        'driver' => " . var_export($driver, true) . ",\n"
                . ($driver === 'sqlite'
                    ? "        'sqlite_path' => JRCMS_ROOT . '/storage/cms.sqlite',\n"
                    : "        'host' => " . var_export($host, true) . ",\n"
                    . "        'port' => '3306',\n"
                    . "        'name' => " . var_export($name, true) . ",\n"
                    . "        'user' => " . var_export($user, true) . ",\n"
                    . "        'pass' => " . var_export($pass, true) . ",\n"
                    . "        'charset' => 'utf8mb4',\n")
                . "    ],\n"
                . "    'app' => [\n"
                . "        'debug' => false,\n"
                . "        'timezone' => 'Asia/Jakarta',\n"
                . "        'cache_on' => true,\n"
                . "        'cache_ttl' => 86400,\n"
                . "    ],\n"
                . "];\n";
            @file_put_contents($cfgFile, $cfgPhp);
            @chmod($cfgFile, 0640);
            $messages[] = 'config/config.php ditulis.';
        }
        Config::load(true);

        $tenFile = JRCMS_ROOT . '/config/tenants.php';
        $tenants = is_file($tenFile) ? (require $tenFile) : [];
        if (!is_array($tenants)) $tenants = [];
        if (!isset($tenants[$thisHost])) {
            $tenants[$thisHost] = ['prefix' => $prefix, 'name' => $siteTitle, 'theme' => 'juragan'];
            $tenPhp = "<?php\n// Peta tenant: domain => konfigurasi (Masterplan BAB 4.3)\nreturn " . var_export($tenants, true) . ";\n";
            @file_put_contents($tenFile, $tenPhp);
            $messages[] = "Tenant '{$thisHost}' terdaftar (prefiks {$prefix}).";
        }
        Tenant::reload();

        // 3) Buat tabel + admin + seed
        try {
            self::createTables();
            $messages[] = 'Tabel tenant "' . $prefix . '" siap (users, settings, pages, articles, media).';

            $hasAdmin = Database::scalar('SELECT COUNT(*) FROM ' . Database::t('users')) > 0;
            if (!$hasAdmin) {
                Database::insert(Database::t('users'), [
                    'username' => $adminUser,
                    'password_hash' => password_hash($adminPass, PASSWORD_DEFAULT),
                    'name' => 'Admin ' . $siteTitle,
                    'role' => 'admin',
                ]);
                $messages[] = 'Akun admin dibuat: ' . $adminUser;
            }

            $seeded = self::seedContent();
            $messages[] = $seeded;
        } catch (Throwable $e) {
            $errors[] = 'Gagal menyiapkan struktur: ' . $e->getMessage();
            return ['ok' => false, 'errors' => $errors, 'messages' => $messages];
        }

        // 4) .htaccess pelindung core + kunci installer
        @file_put_contents(JRCMS_ROOT . '/.htaccess',
            "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n"
            . "<IfModule !mod_authz_core.c>\nOrder deny,allow\nDeny from all\n</IfModule>\n");
        @file_put_contents(JRCMS_ROOT . '/storage/install.lock', date('c'));
        $messages[] = 'File pelindung .htaccess core dibuat. Installer terkunci.';

        return ['ok' => true, 'errors' => [], 'messages' => $messages];
    }

    /* ================= Tambah tenant (mode 2) ================= */

    /** @return array{ok:bool, errors:string[], messages:string[]} */
    public static function addTenant(array $f): array
    {
        $errors = [];
        $prefix = strtolower(trim($f['prefix']) ?: '');
        $name   = trim($f['tenant_name']) ?: 'Tenant Baru';
        if (!preg_match('/^[a-z][a-z0-9_]*_$/', $prefix)) {
            $errors[] = 'Prefiks tidak sah (contoh benar: t2_).';
        }
        // Verifikasi kredensial admin tenant mana pun yang ada di DB ini
        $verified = false;
        foreach (self::knownPrefixes() as $kp) {
            try {
                $row = Database::one(
                    "SELECT password_hash FROM \"{$kp}users\" WHERE username = ? LIMIT 1",
                    [trim($f['admin_user'])]
                );
                if ($row && password_verify((string)$f['admin_pass'], (string)$row['password_hash'])) {
                    $verified = true; break;
                }
            } catch (Throwable $e) { /* tabel belum ada, lanjut */ }
        }
        if (!$verified) $errors[] = 'Kredensial admin tidak sah — tenant tidak dibuat.';
        if ($errors) return ['ok' => false, 'errors' => $errors, 'messages' => []];

        $old = Tenant::prefix();
        Tenant::setPrefixManually($prefix);
        try {
            self::createTables();
            Database::insert(Database::t('users'), [
                'username' => trim($f['admin_user']),
                'password_hash' => password_hash((string)$f['admin_pass'], PASSWORD_DEFAULT),
                'name' => 'Admin ' . $name,
                'role' => 'admin',
            ]);
            $msg = self::seedContent();
        } catch (Throwable $e) {
            Tenant::setPrefixManually($old);
            return ['ok' => false, 'errors' => ['Gagal membuat tenant: ' . $e->getMessage()], 'messages' => []];
        }
        Tenant::setPrefixManually($old);

        // Daftarkan di tenants.php (domain diisi nanti saat addon domain siap)
        $tenFile = JRCMS_ROOT . '/config/tenants.php';
        $tenants = is_file($tenFile) ? (require $tenFile) : [];
        $tenants['tenant-' . rtrim($prefix, '_')] = ['prefix' => $prefix, 'name' => $name, 'theme' => 'juragan'];
        @file_put_contents($tenFile, "<?php\nreturn " . var_export($tenants, true) . ";\n");

        return ['ok' => true, 'errors' => [],
            'messages' => ["Tenant '{$name}' ({$prefix}) dibuat. {$msg}"]];
    }

    private static function knownPrefixes(): array
    {
        $out = [];
        foreach (Tenant::map() as $cfg) {
            if (is_array($cfg) && !empty($cfg['prefix'])) $out[] = $cfg['prefix'];
        }
        return array_unique($out);
    }

    /* ================= Seed konten ================= */

    private static function seedContent(): string
    {
        $pages = Database::scalar('SELECT COUNT(*) FROM ' . Database::t('pages'));
        if ($pages > 0) return 'Konten sudah ada — seed dilewati.';

        self::seedSettings();
        self::seedPages();
        self::seedArticles();
        return 'Seed konten Juragan Pasir terpasang (beranda, tentang, 6 produk, 4 testimoni, 7 FAQ).';
    }

    private static function put(string $k, string $v): void
    {
        $table = Database::t('settings');
        $driver = Config::get('db.driver');
        $sql = $driver === 'sqlite'
            ? "INSERT INTO {$table} (skey, svalue) VALUES (?, ?) ON CONFLICT(skey) DO UPDATE SET svalue = excluded.svalue"
            : "INSERT INTO {$table} (skey, svalue) VALUES (?, ?) ON DUPLICATE KEY UPDATE svalue = VALUES(svalue)";
        Database::run($sql, [$k, $v]);
    }

    private static function seedSettings(): void
    {
        self::put('site_title', 'Juragan Pasir Galunggung');
        self::put('tagline', 'Pasir Galunggung — Pasir Terbaik di Dunia');
        self::put('meta_title', 'Juragan Pasir Galunggung — Pasir Terbaik di Dunia dari Gunung Galunggung, Tasikmalaya');
        self::put('meta_description', 'Pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya. Dari perseorangan hingga instansi: pasir cor, urug, pasang, halus & silika, harga transparan, kirim ke 34 provinsi. Minta penawaran via WhatsApp hari ini.');
        self::put('whatsapp', '6281316516524');
        self::put('wa_message', 'Halo Juragan Pasir Galunggung! Saya ingin bertanya tentang pasir Galunggung.');
        self::put('phone', '+62 813-1651-6524');
        self::put('email', 'halo@juraganpasir.id');
        self::put('hours', 'Senin–Sabtu, 07.00–18.00 WIB');
        self::put('street', 'Jl. Raya Galunggung No. 88, Kec. Leuwisari — Lereng Gunung Galunggung');
        self::put('city', 'Tasikmalaya');
        self::put('region', 'Jawa Barat');
        self::put('postal', '46414');
        self::put('lat', '-7.2569');
        self::put('lng', '108.059');
        self::put('footer_about', 'Pusat supplier pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya — dipercaya perseorangan, kontraktor, perusahaan, hingga instansi. Disaring, teruji, dan dikirim tepat waktu ke 34 provinsi Indonesia.');
        self::put('footer_text', '© ' . date('Y') . ' CV Juragan Pasir Galunggung. Seluruh hak cipta dilindungi.');
    }

    private static function insPage(array $d): int
    {
        $now = date('Y-m-d H:i:s');
        return Database::insert(Database::t('pages'), array_merge([
            'meta_title' => '', 'meta_description' => '', 'og_image' => '',
            'is_home' => 0, 'is_published' => 1, 'sort_order' => 0,
            'created_at' => $now, 'updated_at' => $now,
        ], $d));
    }

    private static function insArticle(array $d): int
    {
        $now = date('Y-m-d H:i:s');
        return Database::insert(Database::t('articles'), array_merge([
            'image' => '', 'meta_title' => '', 'meta_description' => '',
            'is_published' => 1, 'published_at' => $now,
            'created_at' => $now, 'updated_at' => $now,
        ], $d));
    }

    private static function seedPages(): void
    {
        $wa = wa_link('6281316516524', 'Halo Juragan Pasir Galunggung! Saya ingin minta penawaran pasir.');

        $home = <<<HTML
<section class="sec-hero" id="beranda">
  <div class="container hero-grid">
    <div class="hero-copy reveal">
      <span class="badge-line">Asli Lereng Gunung Galunggung — Tasikmalaya</span>
      <h1>Pasir Galunggung,<br><span class="hl">Terbaik di Dunia</span></h1>
      <p class="lead">Juragan Pasir Galunggung adalah pusat supplier pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya — dipercaya perseorangan, kontraktor, perusahaan, hingga instansi. Disaring, teruji, dan dikirim tepat waktu ke 34 provinsi.</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="{$wa}">Minta Penawaran Gratis</a>
        <a class="btn btn-ghost" href="#produk">Lihat 6 Jenis Pasir</a>
      </div>
      <ul class="hero-chips">
        <li>Standar SNI &amp; teruji lab</li><li>Garansi mutu tertulis</li><li>Kirim ke 34 provinsi</li>
      </ul>
    </div>
    <div class="hero-card reveal">
      <div class="hc-badge">Disaring • Teruji • Tersertifikasi</div>
      <h3>Garansi Mutu<br>Juragan Pasir</h3>
      <p>Tidak sesuai spesifikasi yang disepakati? Kami ganti — tanpa biaya tambahan, tanpa drama.</p>
      <div class="hc-stat"><strong>12.480+</strong><span>Klien Terlayani</span></div>
    </div>
  </div>
</section>

<section class="sec-stats">
  <div class="container stats-grid">
    <div class="stat reveal"><strong data-count="2.5" data-decimals="1" data-suffix=" jt+">0</strong><span>Ton pasir terkirim</span></div>
    <div class="stat reveal"><strong data-count="12480" data-suffix="+">0</strong><span>Klien terlayani</span></div>
    <div class="stat reveal"><strong data-count="34" data-suffix="">0</strong><span>Provinsi terjangkau</span></div>
    <div class="stat reveal"><strong data-count="98.6" data-decimals="1" data-suffix="%">0</strong><span>Kirim tepat waktu</span></div>
  </div>
</section>

<section class="sec shell" id="segmen">
  <div class="container">
    <p class="eyebrow reveal">Siapa yang Kami Layani</p>
    <h2 class="reveal">Semua Kalangan, <span class="hl">Tanpa Kecuali</span></h2>
    <p class="section-desc reveal">Tidak ada order yang terlalu kecil dan tidak ada kontrak yang terlalu besar. Empat segmen, satu standar pelayanan juragan.</p>
    <div class="grid grid-4">
      <article class="card seg reveal"><div class="seg-ico">🏠</div><h3>Perseorangan &amp; Rumah Tangga</h3><p>Bangun atau renovasi rumah? Kami layani walau 1 rit saja. Minimal order mulai 1 pickup (±1,5 m³).</p></article>
      <article class="card seg reveal"><div class="seg-ico">⛑️</div><h3>Kontraktor &amp; Developer</h3><p>Ritase stabil untuk proyek perumahan, gedung, dan infrastruktur. Kontrak volume, jadwal terkunci, BAST tertib.</p></article>
      <article class="card seg reveal"><div class="seg-ico">🏭</div><h3>Perusahaan &amp; Industri</h3><p>Pabrik, gudang, landscape, hingga kebutuhan industri khusus dengan PO resmi dan kontrak tahunan.</p></article>
      <article class="card seg reveal"><div class="seg-ico">🏛️</div><h3>Instansi &amp; Organisasi</h3><p>Pemerintah, BUMN, sekolah, masjid — legalitas lengkap, penawaran resmi, administrasi tertib.</p></article>
    </div>
  </div>
</section>

<section class="sec shell-alt" id="keunggulan">
  <div class="container">
    <p class="eyebrow reveal">Kenapa Juragan Pasir</p>
    <h2 class="reveal">Alasan Klien Balik Lagi <span class="hl">dan Lagi</span></h2>
    <p class="section-desc reveal">Kami tidak sekadar menjual pasir — kami mengelola rantai pasok material agar proyek Anda tidak pernah berhenti karena kekurangan agregat.</p>
    <div class="grid grid-3">
      <article class="card why reveal"><h3>🧪 Mutu Tersaring &amp; Teruji</h3><p>Setiap pasir disaring dan (untuk grade tertentu) dicuci sebelum dimuat. Kadar lumpur dan modulus kehalusan dicek berkala — spesifikasi tertulis melekat di setiap kontrak.</p></article>
      <article class="card why reveal"><h3>🏷️ Harga Transparan</h3><p>Rincian harga pasir, ongkos angkut, dan pajak dipisah jelas di penawaran. Yang Anda lihat adalah yang Anda bayar — tidak ada biaya kejutan di akhir.</p></article>
      <article class="card why reveal"><h3>🚛 Armada Sendiri</h3><p>40+ unit dump truck dari pickup hingga truk besar berarti jadwal tidak bergantung pihak ketiga. Kirim darurat pun bisa kami akali, termasuk akhir pekan.</p></article>
      <article class="card why reveal"><h3>🏬 Stok Anti Kehabisan</h3><p>Tambak dan gudang di beberapa titik strategis menjaga pasokan tetap mengalir walau musim hujan atau saat permintaan proyek memuncak.</p></article>
      <article class="card why reveal"><h3>🎧 Konsultasi Teknis Gratis</h3><p>Bingung pilih pasir cor atau pasir pasang? Tim berpengalaman membantu menghitung dan memilih spesifikasi yang tepat — gratis, tanpa syarat pembelian.</p></article>
      <article class="card why reveal"><h3>📄 Dokumen Lengkap &amp; Resmi</h3><p>NIB, NPWP, invoice pajak, kwitansi, hingga berita acara serah terima. Semua transaksi tertib administrasi — aman untuk audit perusahaan maupun instansi.</p></article>
    </div>
  </div>
</section>

<section class="sec shell" id="proses">
  <div class="container">
    <p class="eyebrow reveal">Cara Kerja</p>
    <h2 class="reveal">Dari Chat Sampai <span class="hl">Pasir Tiba</span></h2>
    <p class="section-desc reveal">Empat langkah transparan — tanpa drama, tanpa biaya kejutan. Semua terdokumentasi rapi dari awal sampai serah terima.</p>
    <ol class="steps">
      <li class="step reveal"><span class="step-n">1</span><div><h3>Konsultasi &amp; Kebutuhan</h3><p>Ceritakan proyek Anda via WhatsApp, telepon, atau form. Individu cukup sebutkan perkiraan kebutuhan; organisasi bisa lampirkan permintaan resmi.</p></div></li>
      <li class="step reveal"><span class="step-n">2</span><div><h3>Penawaran Tertulis</h3><p>Penawaran resmi berisi spesifikasi, harga rinci, dan jadwal dikirim maksimal 1×24 jam. Sampel material bisa diatur untuk kontrak besar.</p></div></li>
      <li class="step reveal"><span class="step-n">3</span><div><h3>Kesepakatan &amp; Jadwal</h3><p>Individu cukup sepakat via chat; kontraktor dan instansi kami siapkan PO/kontrak. Jadwal kirim dikunci sesuai ritme pekerjaan Anda.</p></div></li>
      <li class="step reveal"><span class="step-n">4</span><div><h3>Kirim &amp; Terima Terukur</h3><p>Volume diukur (kubikasi/timbangan), surat jalan menyertai setiap armada, dan BAST ditandatangani saat penerimaan. Selesai dengan rapi.</p></div></li>
    </ol>
  </div>
</section>
HTML;
        self::insPage([
            'title' => 'Beranda', 'slug' => 'beranda', 'is_home' => 1, 'sort_order' => 0,
            'meta_title' => 'Juragan Pasir Galunggung — Pasir Terbaik di Dunia dari Gunung Galunggung, Tasikmalaya',
            'meta_description' => 'Pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya. Dari perseorangan hingga instansi: pasir cor, urug, pasang, halus & silika, harga transparan, kirim ke 34 provinsi. Minta penawaran via WhatsApp hari ini.',
            'content' => $home,
        ]);

        $about = <<<HTML
<section class="sec shell">
  <div class="container narrow">
    <p class="eyebrow">Tentang Kami</p>
    <h1>Tambang di Tangan, <span class="hl">Standar di Hati</span></h1>
    <p><strong>CV Juragan Pasir Galunggung</strong> adalah pusat supplier pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya. Warisan erupsi gunung api menjadikan butir pasir kami tajam, bersudut, dan bersih — karakter yang membuatnya sering disebut pasir terbaik di dunia untuk konstruksi.</p>
    <p>Kami melayani empat segmen: perseorangan &amp; rumah tangga, kontraktor &amp; developer, perusahaan &amp; industri, hingga instansi &amp; organisasi. Enam jenis pasir dikurasi di titik muat: disaring, dibersihkan, dan disertai spesifikasi tertulis. Pengiriman menjangkau 34 provinsi lewat kombinasi armada darat, kereta angkut, dan kapal laut.</p>
    <p>Prinsip kami sederhana: harga transparan, mutu bergaransi tertulis, dan administrasi yang tertib — dari pickup pertama sampai BAST terakhir.</p>
  </div>
</section>
HTML;
        self::insPage([
            'title' => 'Tentang Kami', 'slug' => 'tentang-kami', 'sort_order' => 1,
            'meta_title' => 'Tentang Kami — CV Juragan Pasir Galunggung',
            'content' => $about,
        ]);

        $contact = <<<HTML
<section class="sec shell">
  <div class="container narrow">
    <p class="eyebrow">Kontak</p>
    <h1>Bicara Langsung dengan <span class="hl">Juragannya</span></h1>
    <ul class="contact-list">
      <li>💬 WhatsApp: <a href="{$wa}">+62 813-1651-6524</a></li>
      <li>📞 Telepon: <a href="tel:+6281316516524">+62 813-1651-6524</a></li>
      <li>✉️ Email: <a href="mailto:halo@juraganpasir.id">halo@juraganpasir.id</a></li>
      <li>📍 Alamat: Jl. Raya Galunggung No. 88, Kec. Leuwisari, Tasikmalaya, Jawa Barat 46414</li>
      <li>🕒 Jam operasional: Senin–Sabtu, 07.00–18.00 WIB</li>
    </ul>
  </div>
</section>
HTML;
        self::insPage([
            'title' => 'Kontak', 'slug' => 'kontak', 'sort_order' => 2,
            'meta_title' => 'Kontak — Juragan Pasir Galunggung',
            'content' => $contact,
        ]);
    }

    private static function seedArticles(): void
    {
        $waBase = '6281316516524';

        $products = [
            ['Pasir Galunggung Cor', 'pasir-galunggung-cor', 'Agregat halus vulkanik — flagship', 'Rp 330–390 ribu / m³',
             'Flagship kami: pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya. Butirannya tajam dan bersudut sehingga saling mengunci dalam beton — pondasi, kolom, balok, dan plat lantai lebih kuat. Kadar lumpur di bawah ambang batas SNI.',
             '<ul><li>Asli Gunung Galunggung</li><li>Butir vulkanik bersudut</li><li>Kadar lumpur &lt; 3%</li><li>Harga: Rp 330–390 ribu / m³</li></ul>', 'Terbaik di Dunia'],
            ['Pasir Urug Gunung', 'pasir-urug-gunung', 'Pengisi & penurunan lahan', 'Rp 180–240 ribu / m³',
             'Mengurug tanah rendah, menaikkan elevasi lahan, dan mengisi pondasi mesin (pondasi batu kali). Cepat padat dan ekonomis untuk volume besar.',
             '<ul><li>Campuran kasar-halus</li><li>Ekonomis untuk volume besar</li><li>Cepat mengeras</li><li>Harga: Rp 180–240 ribu / m³</li></ul>', null],
            ['Pasir Galunggung Pasang', 'pasir-galunggung-pasang', 'Mortar & pasangan bata', 'Rp 250–300 ribu / m³',
             'Adukan pasangan bata merah/batako dan pemasangan keramik. Kekasaran sedang membuat adukan lebih kuat mengikat.',
             '<ul><li>Butiran kasar sedang</li><li>Ikat mortar kuat</li><li>Bebas ranting &amp; kerikil</li><li>Harga: Rp 250–300 ribu / m³</li></ul>', null],
            ['Pasir Halus Galunggung', 'pasir-halus-galunggung', 'Plester, acian & finishing', 'Rp 260–320 ribu / m³',
             'Plesteran dinding, acian, dan screed lantai yang butuh permukaan rata. Teksturnya lembut sehingga hasil acian lebih mulus dan hemat semen.',
             '<ul><li>Tekstur lembut rata</li><li>Ideal plester &amp; aci</li><li>Sudah diayak halus</li><li>Harga: Rp 260–320 ribu / m³</li></ul>', null],
            ['Pasir Silika Vulkanik', 'pasir-silika-vulkanik', 'Industri & filterasi', 'Rp 900–1.500 ribu / ton',
             'Warisan vulkanik Gunung Galunggung: kandungan SiO2 tinggi (>98%) untuk filter air, sandblasting, bahan baku kaca, dan kebutuhan industri khusus. Tersedia berbagai mesh size.',
             '<ul><li>SiO2 &gt; 98%</li><li>Mesh 8–100 sesuai kebutuhan</li><li>Dicuci &amp; dikeringkan</li><li>Harga: Rp 900–1.500 ribu / ton</li></ul>', 'Premium'],
            ['Pasir Merah / Bangka', 'pasir-merah-bangka', 'Cor non-struktural', 'Rp 200–260 ribu / m³',
             'Campuran cor non-struktural, urug lantai kerja, dan pembuatan batako. Alternatif hemat tanpa mengorbankan kekuatan minimum.',
             '<ul><li>Ekonomis</li><li>Cocok cor non-struktural</li><li>Stabil untuk urug lantai</li><li>Harga: Rp 200–260 ribu / m³</li></ul>', null],
        ];
        foreach ($products as $i => [$name, $slug, $alias, $price, $useCase, $spec, $badge]) {
            $waMsg = wa_link($waBase, "Halo Juragan Pasir! Saya ingin penawaran untuk {$name}.");
            $content = '<p><strong>' . $price . '</strong></p><p>' . $useCase . '</p>' . $spec
                     . '<p><a class="btn btn-primary" href="' . $waMsg . '">Minta Penawaran via WhatsApp</a></p>';
            self::insArticle([
                'title' => $name, 'slug' => $slug, 'category' => 'produk',
                'excerpt' => ($badge ? "[{$badge}] " : '') . $alias . ' — ' . $price,
                'content' => $content,
                'meta_title' => $name . ' — Harga & Spesifikasi | Juragan Pasir Galunggung',
                'meta_description' => excerpt_of($useCase, 300),
            ]);
        }

        $testis = [
            ['Budi Santoso', 'Perseorangan — Renovasi Rumah, Depok',
             'Renovasi rumah pertama dan saya benar-benar awam. Tim Juragan Pasir Galunggung membantu hitung kebutuhan pasir cor dan urug sampai detail, datang tepat waktu, dan harganya persis seperti penawaran. Tidak ada biaya aneh-aneh.'],
            ['Ir. Hendra Wijaya', 'Project Manager — CV Karya Beton',
             'Sudah tiga tahun memasok pasir Galunggung untuk proyek kami. Yang paling berharga itu konsistensinya: mutu batch pertama dan batch ke-100 tetap sama, ritase tidak pernah bolong, dan BAST-nya tertib. Untuk kontraktor, ini pembanding utama.'],
            ['Siti Rahmawati', 'Bendahara Pembangunan Musala — Bogor',
             'Pembangunan musala dana RT, jadi setiap rupiah harus jelas. Penawaran resminya rapi, kwitansi lengkap, dan pasir pasangnya bersih sekali. Warga pun puas karena tidak ada drama pasca pembelian.'],
            ['Andi Pratama', 'Procurement — PT Nusantara Karya',
             'Kebutuhan pasir silika pabrik kami spesifik: mesh tertentu dengan sertifikat uji. Juragan Pasir Galunggung satu-satunya supplier yang dokumennya lengkap sejak penawaran pertama. Kontrak tahunan berjalan sangat mulus.'],
        ];
        foreach ($testis as $t) {
            self::insArticle([
                'title' => $t[0], 'slug' => slugify('testimoni-' . $t[0]), 'category' => 'testimoni',
                'excerpt' => $t[1], 'content' => '<p>' . $t[2] . '</p>',
            ]);
        }

        $faqs = [
            ['Apa itu pasir Galunggung dan mengapa disebut yang terbaik?',
             'Pasir Galunggung adalah pasir vulkanik yang diambil dari lereng Gunung Galunggung, Tasikmalaya, Jawa Barat. Warisan erupsi gunung api membuat butirannya tajam, bersudut, dan bersih sehingga saling mengunci dengan sempurna dalam campuran beton — hasilnya cor lebih kuat dan padat. Karena karakter inilah pasir Galunggung menjadi incaran proyek dan sering disebut sebagai pasir terbaik di dunia.'],
            ['Berapa minimal order untuk pembelian pertama?',
             'Untuk area Jabodetabek, minimal order hanya 1 rit pickup (±1,5 m³) — cocok untuk kebutuhan renovasi rumah tangga. Untuk kota lain, minimal order menyesuaikan jarak dan moda pengiriman. Kami sengaja merancang layanan ini agar perseorangan dan organisasi sama-sama terlayani.'],
            ['Bagaimana cara menghitung kebutuhan pasir untuk proyek saya?',
             'Ceritakan panjang, lebar, dan ketebalan area serta jenis pekerjaan (cor, urug, plester, atau pasangan bata) ke tim kami via WhatsApp — kami hitungkan gratis termasuk faktor pemadatan dan cadangan. Untuk proyek kompleks, tim teknis kami siap menghitung bersama Anda.'],
            ['Apakah harga sudah termasuk ongkos kirim?',
             'Harga pasir dan ongkos angkut kami pisahkan secara transparan di penawaran — tanpa biaya tersembunyi. Ongkir bergantung pada jarak, moda (pickup, dump truck, atau truk besar), dan volume. Semakin besar volume, semakin efisien ongkir per meter kubiknya.'],
            ['Apakah bisa mengirim pasir ke luar Pulau Jawa?',
             'Bisa. Kami melayani 34 provinsi di seluruh Indonesia melalui kombinasi armada dump truck, kereta angkut, dan kapal laut untuk wilayah Sumatra, Kalimantan, Sulawesi, Bali-Nusa Tenggara, hingga Maluku dan Papua. Estimasi waktu kirim diinformasikan jelas di awal.'],
            ['Dokumen apa yang diperlukan untuk pembelian organisasi atau instansi?',
             'Kami menyediakan paket dokumen lengkap: surat penawaran resmi, invoice pajak, kwitansi, surat jalan, berita acara serah terima (BAST), hingga dokumen legalitas perusahaan (NIB, NPWP, SBU) dan sertifikat hasil uji laboratorium bila diminta — memenuhi syarat tender maupun audit.'],
            ['Bagaimana jaminan kualitas pasirnya?',
             'Semua pasir melewati penyaringan, pencucian (untuk grade tertentu), dan quality control di titik muat. Kami menyertakan spesifikasi tertulis di setiap kontrak; apabila pasir datang tidak sesuai spesifikasi yang disepakati, kami ganti tanpa biaya tambahan. Itulah Garansi Mutu Juragan Pasir Galunggung.'],
        ];
        foreach ($faqs as $f) {
            self::insArticle([
                'title' => $f[0], 'slug' => slugify('faq-' . $f[0]), 'category' => 'faq',
                'excerpt' => excerpt_of($f[1], 120), 'content' => '<p>' . $f[1] . '</p>',
            ]);
        }
    }
}
