<?php
/**
 * JURAGAN CORE CMS — Tenant Resolver
 * Jantung "Satu Kode, Banyak Kerajaan" (Masterplan BAB 4.3):
 * membaca HTTP_HOST, mencocokkan peta tenant di config/tenants.php,
 * dan menentukan prefiks tabel + tema + nama situs untuk domain tersebut.
 */
declare(strict_types=1);

final class Tenant
{
    private static ?array $current = null;
    private static ?array $mapCache = null;
    private static string $host = '';

    /** Peta tenant contoh — installer menulis config/tenants.php sungguhan */
    public static function map(): array
    {
        if (self::$mapCache === null) {
            $file = JRCMS_ROOT . '/config/tenants.php';
            $m = is_file($file) ? (require $file) : [];
            self::$mapCache = is_array($m) ? $m : [];
        }
        return self::$mapCache;
    }

    /** Resolusi tenant dari HTTP_HOST; aman dipanggil berulang */
    public static function resolve(): array
    {
        if (self::$current !== null) return self::$current;

        $host = strtolower($_SERVER['HTTP_HOST'] ?? 'default');
        $host = preg_replace('/:\d+$/', '', $host) ?: 'default';
        self::$host = $host;

        $map = self::map();
        $def = $map['default'] ?? ['prefix' => 'main_', 'name' => 'Juragan Core', 'theme' => 'juragan'];

        $pick = null;
        if (isset($map[$host]) && is_array($map[$host])) {
            $pick = $map[$host];
        } else {
            // Coba varian www / non-www agar satu entri mencakup keduanya
            $alt = str_starts_with($host, 'www.') ? substr($host, 4) : 'www.' . $host;
            if (isset($map[$alt]) && is_array($map[$alt])) $pick = $map[$alt];
        }
        if ($pick === null) $pick = $def;

        self::$current = [
            'host'   => $host,
            'prefix' => preg_replace('/[^a-z0-9_]/', '', strtolower($pick['prefix'] ?? 'main_')),
            'name'   => $pick['name'] ?? $def['name'],
            'theme'  => preg_replace('/[^a-z0-9_-]/', '', strtolower($pick['theme'] ?? 'juragan')),
        ];
        return self::$current;
    }

    /** Paksa resolusi ulang tenant (dipakai installer setelah menulis tenants.php) */
    public static function reload(): void
    {
        self::$mapCache = null;
        self::$current = null;
        self::resolve();
    }

    /** Alih prefiks tenant secara manual (mode tambah-tenant installer) */
    public static function setPrefixManually(string $prefix): void
    {
        self::resolve();
        self::$current['prefix'] = preg_replace('/[^a-z0-9_]/', '', $prefix);
    }

    public static function prefix(): string  { return self::resolve()['prefix']; }
    public static function name(): string    { return self::resolve()['name']; }
    public static function theme(): string   { return self::resolve()['theme']; }
    public static function host(): string    { return self::resolve()['host']; }
}
