<?php
/**
 * JURAGAN CORE CMS — Settings
 * Pengaturan per-tenant (tabel settings berprefiks) dengan nilai bawaan aman.
 */
declare(strict_types=1);

final class Settings
{
    private static ?array $cache = null;

    public static function defaults(): array
    {
        return [
            'site_title'     => Tenant::name(),
            'tagline'        => '',
            'meta_title'     => '',
            'meta_description' => '',
            'og_image'       => '',
            'whatsapp'       => '',
            'wa_message'     => 'Halo! Saya ingin bertanya.',
            'phone'          => '',
            'email'          => '',
            'hours'          => '',
            'street'         => '',
            'city'           => '',
            'region'         => '',
            'postal'         => '',
            'lat'            => '',
            'lng'            => '',
            'footer_about'   => '',
            'footer_text'    => '',
            'ga_head'        => '',
            'ld_localbusiness' => '1',
            'ld_faq'         => '1',
            'wa_float'       => '1',
        ];
    }

    /** Muat seluruh pengaturan tenant (sekali per request) */
    public static function all(): array
    {
        if (self::$cache !== null) return self::$cache;
        $rows = Database::all('SELECT skey, svalue FROM ' . Database::t('settings'));
        $map = [];
        foreach ($rows as $r) $map[(string)$r['skey']] = (string)$r['svalue'];
        self::$cache = array_merge(self::defaults(), $map);
        return self::$cache;
    }

    public static function get(string $key, string $default = ''): string
    {
        $all = self::all();
        return isset($all[$key]) && $all[$key] !== '' ? (string)$all[$key] : $default;
    }

    /** Simpan banyak kunci sekaligus + hapus cache tenant */
    public static function putMany(array $kv): void
    {
        $st = Database::pdo();
        $table = Database::t('settings');
        $driver = Config::get('db.driver');
        $sql = $driver === 'sqlite'
            ? "INSERT INTO {$table} (skey, svalue) VALUES (?, ?) ON CONFLICT(skey) DO UPDATE SET svalue = excluded.svalue"
            : "INSERT INTO {$table} (skey, svalue) VALUES (?, ?) ON DUPLICATE KEY UPDATE svalue = VALUES(svalue)";
        $stmt = $st->prepare($sql);
        foreach ($kv as $k => $v) {
            $stmt->execute([(string)$k, (string)$v]);
        }
        self::$cache = null;
        Cache::purgeTenant();
    }

    /** Judul meta final: meta_title → title halaman + situs (tanpa duplikasi nama situs) */
    public static function metaTitle(?string $pageTitle = null, ?string $pageMeta = null): string
    {
        $site = self::get('site_title');
        if ($pageMeta !== null && $pageMeta !== '') {
            return str_starts_with($pageMeta, $site) ? $pageMeta : $pageMeta . ' — ' . $site;
        }
        if ($pageTitle !== null && $pageTitle !== '') {
            return $pageTitle === $site ? $site : $pageTitle . ' — ' . $site;
        }
        return self::get('meta_title') !== '' ? self::get('meta_title') : $site;
    }

    /** Deskripsi meta final: meta halaman → deskripsi situs → potongan konten */
    public static function metaDesc(?string $pageMeta = null, ?string $content = null): string
    {
        if ($pageMeta !== null && $pageMeta !== '') return $pageMeta;
        $site = self::get('meta_description');
        if ($site !== '') return $site;
        if ($content !== null && $content !== '') return excerpt_of($content);
        return self::get('tagline');
    }
}
