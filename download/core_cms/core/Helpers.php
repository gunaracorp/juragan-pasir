<?php
/**
 * JURAGAN CORE CMS — Helpers
 * Fungsi global murni PHP. Tanpa Composer, tanpa dependensi.
 */
declare(strict_types=1);

if (!function_exists('e')) {
    /** Escape output HTML (anti-XSS) */
    function e(?string $v): string {
        return htmlspecialchars((string)$v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}

if (!function_exists('slugify')) {
    /** Ubah teks menjadi slug URL aman */
    function slugify(string $text): string {
        $text = strtolower(trim($text));
        $map = ['á'=>'a','à'=>'a','é'=>'e','è'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ñ'=>'n','ü'=>'u'];
        $text = strtr($text, $map);
        $text = preg_replace('~[^a-z0-9]+~u', '-', $text);
        $text = trim($text, '-');
        return $text !== '' ? $text : 'halaman-' . substr(md5((string)mt_rand()), 0, 5);
    }
}

if (!function_exists('base_url')) {
    /** URL dasar dinamis per-tenant (mengikuti domain yang diakses) */
    function base_url(string $path = ''): string {
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
            || (($_SERVER['SERVER_PORT'] ?? '') === '443');
        $url = ($https ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        return $url . '/' . ltrim($path, '/');
    }
}

if (!function_exists('post')) {
    function post(string $key, string $default = ''): string {
        return isset($_POST[$key]) && is_scalar($_POST[$key]) ? trim((string)$_POST[$key]) : $default;
    }
}

if (!function_exists('query_str')) {
    function query_str(string $key, string $default = ''): string {
        return isset($_GET[$key]) && is_scalar($_GET[$key]) ? trim((string)$_GET[$key]) : $default;
    }
}

if (!function_exists('flash_set')) {
    /** Simpan pesan sekali-tampil (flash) di session */
    function flash_set(string $type, string $msg): void {
        $_SESSION['flash'] = ['type' => $type, 'msg' => $msg];
    }
}

if (!function_exists('flash_take')) {
    /** Ambil & hapus flash message */
    function flash_take(): ?array {
        if (empty($_SESSION['flash'])) return null;
        $f = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $f;
    }
}

if (!function_exists('fmt_date_id')) {
    /** Format tanggal berbahasa Indonesia */
    function fmt_date_id(?string $dt, bool $withTime = false): string {
        if (!$dt) return '';
        $bulan = [1=>'Januari','Februari','Maret','April','Mei','Juni','Juli',
                  'Agustus','September','Oktober','November','Desember'];
        $ts = strtotime($dt);
        if ($ts === false) return $dt;
        $out = (int)date('j', $ts) . ' ' . $bulan[(int)date('n', $ts)] . ' ' . date('Y', $ts);
        if ($withTime) $out .= ' · ' . date('H:i', $ts) . ' WIB';
        return $out;
    }
}

if (!function_exists('wa_link')) {
    /** Tautan WhatsApp dengan pesan terisi otomatis */
    function wa_link(string $number, string $message): string {
        $num = preg_replace('/[^0-9]/', '', $number);
        return 'https://wa.me/' . $num . '?text=' . rawurlencode($message);
    }
}

if (!function_exists('excerpt_of')) {
    /** Ringkasan teks dari HTML */
    function excerpt_of(string $html, int $len = 155): string {
        $text = trim(preg_replace('/\s+/', ' ', strip_tags($html)) ?? '');
        if (mb_strlen($text) <= $len) return $text;
        $cut = mb_substr($text, 0, $len);
        $sp = mb_strrpos($cut, ' ');
        return ($sp !== false ? mb_substr($cut, 0, $sp) : $cut) . '…';
    }
}

if (!function_exists('initials_of')) {
    function initials_of(string $name): string {
        $parts = preg_split('/\s+/', trim($name)) ?: [];
        $ini = '';
        foreach (array_slice($parts, 0, 2) as $p) $ini .= mb_strtoupper(mb_substr($p, 0, 1));
        return $ini !== '' ? $ini : 'JP';
    }
}
