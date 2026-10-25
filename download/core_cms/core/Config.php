<?php
/**
 * JURAGAN CORE CMS — Config
 * Memuat konfigurasi akun hosting (DB, cache, debug) dari config/config.php.
 */
declare(strict_types=1);

final class Config
{
    private static array $data = [];
    private static bool $loaded = false;

    public static function load(bool $force = false): void
    {
        if (self::$loaded && !$force) return;
        self::$loaded = true;
        $file = JRCMS_ROOT . '/config/config.php';
        $user = is_file($file) ? (require $file) : [];
        self::$data = array_merge(self::defaults(), is_array($user) ? $user : []);
    }

    /** Timpa segmen konfigurasi saat runtime (tanpa menulis file) */
    public static function override(string $key, array $values): void
    {
        self::load();
        $cur = self::get($key, []);
        self::$data[$key] = array_merge(is_array($cur) ? $cur : [], $values);
    }

    private static function defaults(): array
    {
        return [
            'db' => [
                'driver' => 'mysql',        // mysql (produksi) | sqlite (lokal/dev)
                'host'   => 'localhost',
                'port'   => '3306',
                'name'   => 'cms',
                'user'   => 'cms',
                'pass'   => '',
                'charset'=> 'utf8mb4',
            ],
            'app' => [
                'debug'     => false,
                'timezone'  => 'Asia/Jakarta',
                'cache_on'  => true,
                'cache_ttl' => 86400,       // detik; 0 = cache tak pernah kedaluwarsa
            ],
        ];
    }

    /** Ambil nilai konfigurasi dengan notasi titik: Config::get('db.driver') */
    public static function get(string $key, $default = null)
    {
        $seg = explode('.', $key);
        $val = self::$data;
        foreach ($seg as $s) {
            if (!is_array($val) || !array_key_exists($s, $val)) return $default;
            $val = $val[$s];
        }
        return $val;
    }
}
