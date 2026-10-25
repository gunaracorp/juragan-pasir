<?php
/**
 * JURAGAN CORE CMS — Auth + CSRF
 * Login per-tenant (tabel users berprefiks), password_hash bawaan PHP,
 * pembatasan percobaan login, dan token CSRF untuk semua formulir.
 */
declare(strict_types=1);

final class Auth
{
    /** Apakah pengunjung saat ini sudah login sebagai admin tenant aktif? */
    public static function check(): bool
    {
        if (session_status() !== PHP_SESSION_ACTIVE) return false;
        if (empty($_SESSION['admin_user']) || empty($_SESSION['admin_tenant'])) return false;
        return $_SESSION['admin_tenant'] === Tenant::prefix();
    }

    public static function username(): string
    {
        return self::check() ? (string)$_SESSION['admin_user'] : '';
    }

    /** Coba login; TRUE bila sukses. Rate-limit sederhana via session. */
    public static function attempt(string $username, string $password): bool
    {
        $fails = (int)($_SESSION['login_fails'] ?? 0);
        if ($fails >= 5) {
            $wait = min(30, 2 ** ($fails - 5));
            sleep($wait); // jeda membalon: 2s, 4s, 8s ... maks 30s
        }

        $row = Database::one(
            'SELECT * FROM ' . Database::t('users') . ' WHERE username = ? LIMIT 1',
            [$username]
        );
        if ($row === null || !password_verify($password, (string)$row['password_hash'])) {
            $_SESSION['login_fails'] = $fails + 1;
            return false;
        }

        session_regenerate_id(true);
        $_SESSION['admin_user'] = (string)$row['username'];
        $_SESSION['admin_name'] = (string)($row['name'] ?: $row['username']);
        $_SESSION['admin_tenant'] = Tenant::prefix();
        unset($_SESSION['login_fails']);
        return true;
    }

    public static function logout(): void
    {
        unset($_SESSION['admin_user'], $_SESSION['admin_name'], $_SESSION['admin_tenant']);
        session_regenerate_id(true);
    }

    /** Pengaman rute admin: lempar ke login bila belum masuk */
    public static function requireLogin(): array
    {
        if (self::check()) return [];
        flash_set('info', 'Silakan masuk terlebih dahulu.');
        return ['redirect' => '/admin/login'];
    }

    /* ---------------- CSRF ---------------- */

    public static function csrfToken(): string
    {
        if (empty($_SESSION['csrf'])) {
            $_SESSION['csrf'] = bin2hex(random_bytes(20));
        }
        return (string)$_SESSION['csrf'];
    }

    public static function csrfField(): string
    {
        return '<input type="hidden" name="_csrf" value="' . e(self::csrfToken()) . '">';
    }

    /** Verifikasi CSRF pada semua POST; TRUE bila sah */
    public static function csrfVerify(): bool
    {
        $sent = (string)($_POST['_csrf'] ?? '');
        $known = (string)($_SESSION['csrf'] ?? '');
        return $known !== '' && $sent !== '' && hash_equals($known, $sent);
    }

    /** Kembalikan redirect bila CSRF gagal (dipanggil awal tiap aksi POST) */
    public static function csrfGuard(): ?array
    {
        if (self::csrfVerify()) return null;
        flash_set('err', 'Sesi kedaluwarsa atau token keamanan tidak sah. Coba lagi.');
        return ['redirect' => $_SERVER['HTTP_REFERER'] ?? '/admin'];
    }
}
