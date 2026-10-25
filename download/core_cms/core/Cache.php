<?php
/**
 * JURAGAN CORE CMS — Page Cache (Lapisan Kecepatan, Masterplan BAB 4.3)
 * Setiap halaman publik disimpan sebagai HTML murni di storage/cache/{host}/.
 * Bila file ada & segar: pengunjung dilayani file statis tanpa eksekusi penuh.
 * Admin menyimpan konten → cache tenant dihapus → render ulang otomatis.
 */
declare(strict_types=1);

final class Cache
{
    private const BYPASS_PREFIX = ['/admin', '/media', '/assets', '/sitemap.xml', '/robots.txt', '/install'];

    public static function enabled(): bool
    {
        return (bool)Config::get('app.cache_on', true);
    }

    public static function dir(): string
    {
        return JRCMS_ROOT . '/storage/cache/' . preg_replace('/[^a-z0-9._-]/', '', Tenant::host());
    }

    private static function fileFor(string $path): string
    {
        if ($path === '/' || $path === '') return self::dir() . '/index.html';
        return self::dir() . '/p_' . md5($path) . '.html';
    }

    /** Apakah request ini kandidat cache? */
    private static function eligible(string $path): bool
    {
        if (!self::enabled()) return false;
        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') return false;
        if ($_SERVER['QUERY_STRING'] ?? '' !== '') return false;   // URL ber-query: jangan cache
        if (Auth::check()) return false;                          // admin melihat versi live
        foreach (self::BYPASS_PREFIX as $p) {
            if ($path === $p || str_starts_with($path, $p . '/')) return false;
        }
        return true;
    }

    /** Coba sajikan cache; exit bila hit. Dipanggil dari Bootstrap sebelum routing. */
    public static function serve(): void
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        if (!self::eligible($path)) return;

        $file = self::fileFor($path);
        if (!is_file($file)) return;

        $ttl = (int)Config::get('app.cache_ttl', 86400);
        if ($ttl > 0 && (time() - (int)filemtime($file)) > $ttl) return;

        header('Content-Type: text/html; charset=UTF-8');
        header('X-Core-Cache: HIT');
        header('Content-Length: ' . (string)filesize($file));
        readfile($file);
        exit;
    }

    /** Simpan hasil render halaman publik */
    public static function store(string $path, string $html): void
    {
        if (!self::eligible($path)) return;
        $file = self::fileFor($path);
        $dir = dirname($file);
        if (!is_dir($dir)) @mkdir($dir, 0775, true);
        @file_put_contents($file, $html, LOCK_EX);
    }

    /** Hapus seluruh cache tenant aktif (dipanggil setiap simpan konten) */
    public static function purgeTenant(): void
    {
        $dir = self::dir();
        if (!is_dir($dir)) return;
        foreach (glob($dir . '/*.html') ?: [] as $f) @unlink($f);
    }

    /** Ukuran cache tenant (byte) untuk dashboard */
    public static function size(): int
    {
        $dir = self::dir();
        if (!is_dir($dir)) return 0;
        $sum = 0;
        foreach (glob($dir . '/*.html') ?: [] as $f) $sum += (int)filesize($f);
        return $sum;
    }

    public static function count(): int
    {
        return is_dir(self::dir()) ? count(glob(self::dir() . '/*.html') ?: []) : 0;
    }
}
