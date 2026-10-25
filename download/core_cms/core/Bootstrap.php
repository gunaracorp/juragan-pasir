<?php
/**
 * JURAGAN CORE CMS — Bootstrap
 * Titik masuk inti: autoloader buatan (tanpa Composer), session aman,
 * penanganan error, coba-layani-cache, lalu dispatch router.
 */
declare(strict_types=1);

final class Bootstrap
{
    public static function autoload(string $class): void
    {
        foreach (['core', 'controllers'] as $dir) {
            $f = JRCMS_ROOT . '/' . $dir . '/' . $class . '.php';
            if (is_file($f)) { require $f; return; }
        }
    }

    public static function run(): void
    {
        // Autoloader murni PHP — tidak butuh Composer (Masterplan BAB 3.2)
        spl_autoload_register([self::class, 'autoload']);

        // Fungsi global (e, slugify, flash, dst.) dimuat eksplisit
        require_once JRCMS_ROOT . '/core/Helpers.php';

        // Waktu & zona
        Config::load();
        date_default_timezone_set((string)(Config::get('app.timezone') ?: 'Asia/Jakarta'));
        mb_internal_encoding('UTF-8');

        // Session aman
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_name('JRCMSSESS');
            session_set_cookie_params([
                'lifetime' => 0,
                'path'     => '/',
                'httponly' => true,
                'samesite' => 'Lax',
                'secure'   => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
            ]);
            session_start();
        }

        // Error: dicatat ke storage/logs, pengunjung melihat halaman rapi
        $logDir = JRCMS_ROOT . '/storage/logs';
        if (!is_dir($logDir)) @mkdir($logDir, 0775, true);
        ini_set('log_errors', '1');
        ini_set('error_log', $logDir . '/error.log');
        ini_set('display_errors', Config::get('app.debug') ? '1' : '0');
        error_reporting(E_ALL);

        // Tenant dulu, kecepatan kemudian, routing terakhir
        Tenant::resolve();
        Cache::serve();
        Router::dispatch();
    }
}
