<?php
/**
 * JURAGAN CORE CMS — Router
 * Front controller polos yang bisa dibaca 10 tahun lagi:
 * satu if/elseif chain, tanpa magic, tanpa reflection.
 *
 * Protokol hasil controller:
 *   string                    → HTML (dicetak, halaman publik disimpan ke cache)
 *   ['redirect' => url]       → HTTP redirect
 *   ['file' => path, 'mime' => t, 'cache_days' => n] → aliran file (media/asset)
 *   ['status' => 404]         → halaman 404
 */
declare(strict_types=1);

final class Router
{
    public static function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $path   = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $path   = '/' . trim($path, '/');

        try {
            $out = self::route($method, $path);
        } catch (Throwable $e) {
            error_log('[CoreCMS] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
            if (Config::get('app.debug')) {
                http_response_code(500);
                echo '<h1>Error (debug)</h1><pre>' . e($e->getMessage())
                   . "\n" . e($e->getFile() . ':' . $e->getLine()) . '</pre>';
            } else {
                http_response_code(500);
                echo '<!doctype html><meta charset="utf-8"><title>Sedang Diperbaiki</title>'
                   . '<body style="font-family:system-ui;padding:3rem;text-align:center">'
                   . '<h1>Ups — sedang kami perbaiki.</h1><p>Silakan muat ulang beberapa saat lagi.</p>';
            }
            return;
        }

        if (is_array($out)) {
            if (isset($out['raw'])) {          // konten mentah (sitemap, robots)
                header('Content-Type: ' . $out['mime']);
                echo $out['raw'];
                return;
            }
            if (isset($out['redirect'])) {
                header('Location: ' . $out['redirect']);
                return;
            }
            if (isset($out['status'])) {
                http_response_code((int)$out['status']);
                echo View::layout('front/layout', View::render('front/404'), [
                    'seo' => Seo::meta('/', 'Halaman Tidak Ditemukan', 'Halaman yang Anda cari tidak tersedia.'),
                    'nav' => self::navPages(),
                ]);
                return;
            }
            if (isset($out['file'])) {
                $days = (int)($out['cache_days'] ?? 0);
                header('Content-Type: ' . ($out['mime'] ?? 'application/octet-stream'));
                if ($days > 0) header('Cache-Control: public, max-age=' . ($days * 86400));
                header('Content-Length: ' . (string)filesize($out['file']));
                readfile($out['file']);
                return;
            }
        }

        // HTML string
        $html = (string)$out;
        header('Content-Type: text/html; charset=UTF-8');
        if (Cache::enabled() && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
            header('X-Core-Cache: MISS');
        }
        header('Content-Length: ' . (string)strlen($html));
        echo $html;
        Cache::store($path, $html);
    }

    /** Halaman untuk navigasi header (published, bukan beranda) */
    public static function navPages(): array
    {
        return Database::all(
            'SELECT title, slug FROM ' . Database::t('pages')
            . ' WHERE is_published = 1 AND is_home = 0 ORDER BY sort_order, id LIMIT 8'
        );
    }

    private static function route(string $method, string $path)
    {
        /* ---------- Installer (sebelum lainnya, berpelindung lock) ---------- */
        if ($path === '/install') {
            return $method === 'POST' ? InstallerHttp::run() : InstallerHttp::form();
        }

        /* ---------- Panel admin ---------- */
        if ($path === '/admin' || str_starts_with($path, '/admin/')) {
            return ($method === 'POST')
                ? Admin::post(substr($path, 6))
                : Admin::get(substr($path, 6));
        }

        if ($method !== 'GET') {
            flash_set('err', 'Aksi tidak dikenal.');
            return ['redirect' => '/'];
        }

        /* ---------- Sinyal teknis SEO ---------- */
        if ($path === '/sitemap.xml') return Front::sitemap();
        if ($path === '/robots.txt')  return Front::robots();

        /* ---------- Aset & media ---------- */
        if (str_starts_with($path, '/media/'))  return Front::media(substr($path, 7));
        if (str_starts_with($path, '/assets/')) return Front::asset(substr($path, 8));

        /* ---------- Halaman publik ---------- */
        if ($path === '/')           return Front::home();
        if ($path === '/artikel')    return Front::articles();
        if (str_starts_with($path, '/artikel/')) return Front::article(urldecode(substr($path, 9)));

        return Front::page(urldecode(ltrim($path, '/')));
    }
}

/**
 * Pembungkus rute installer agar Router tetap ramping.
 * Setelah install.lock ada, hanya mode "tambah tenant" yang tersedia.
 */
final class InstallerHttp
{
    public static function form(?array $result = null): string
    {
        $locked = Installer::locked();
        $data = [
            'locked' => $locked,
            'result' => $result,
            'csrf'   => Auth::csrfField(),
            'tenant' => Tenant::resolve(),
        ];
        return View::render('admin/install', $data);
    }

    public static function run()
    {
        if (!Auth::csrfVerify()) {
            return self::form(['ok' => false, 'errors' => ['Token keamanan tidak sah. Muat ulang halaman.'], 'messages' => []]);
        }
        $f = [
            'driver' => query_str('driver') ?: post('driver'),
            'db_host' => post('db_host', 'localhost'),
            'db_name' => post('db_name'),
            'db_user' => post('db_user'),
            'db_pass' => post('db_pass'),
            'prefix' => post('prefix', 't1_'),
            'site_title' => post('site_title'),
            'tenant_name' => post('tenant_name'),
            'admin_user' => post('admin_user'),
            'admin_pass' => post('admin_pass'),
        ];
        $result = Installer::locked() ? Installer::addTenant($f) : Installer::install($f);
        return self::form($result);
    }
}
