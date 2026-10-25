<?php
/**
 * JURAGAN CORE CMS — Media
 * Unggahan difilter ketat (ekstensi + MIME + ukuran), nama file acak,
 * tersimpan di storage/uploads/{prefiks-tenant}/ dan dilayani via /media/{nama}.
 */
declare(strict_types=1);

final class Media
{
    private const ALLOWED = [
        'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
        'webp' => 'image/webp', 'gif' => 'image/gif', 'pdf' => 'application/pdf',
    ];
    private const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

    public static function dir(): string
    {
        return JRCMS_ROOT . '/storage/uploads/' . Tenant::prefix();
    }

    /** Proses $_FILES['file']; kembalikan [ok(bool), filename|pesan] */
    public static function upload(array $file): array
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            return [false, 'Unggahan gagal atau tidak ada file terpilih.'];
        }
        if ((int)$file['size'] > self::MAX_BYTES) {
            return [false, 'Ukuran maksimal 8 MB.'];
        }

        $ext = strtolower(pathinfo((string)$file['name'], PATHINFO_EXTENSION));
        if (!isset(self::ALLOWED[$ext])) {
            return [false, 'Format tidak diizinkan. Gunakan: jpg, png, webp, gif, atau pdf.'];
        }

        // Verifikasi MIME sesungguhnya (bukan sekadar nama file)
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) ?: '';
        if ($mime !== self::ALLOWED[$ext]) {
            return [false, 'Isi file tidak cocok dengan formatnya.'];
        }

        if (!is_dir(self::dir())) @mkdir(self::dir(), 0775, true);

        $name = date('Ymd') . '-' . bin2hex(random_bytes(5)) . '.' . $ext;
        $dest = self::dir() . '/' . $name;
        if (!@move_uploaded_file($file['tmp_name'], $dest)) {
            return [false, 'Gagal menyimpan file ke folder unggahan.'];
        }
        @chmod($dest, 0644);

        Database::insert(Database::t('media'), [
            'filename'      => $name,
            'original_name' => mb_substr((string)$file['name'], 0, 190),
            'mime'          => $mime,
            'size'          => (int)$file['size'],
        ]);
        return [true, $name];
    }

    /** Aliran file media ke browser (dengan cache browser panjang) */
    public static function serve(string $name): ?array
    {
        $name = basename($name);
        if (!preg_match('/^[a-z0-9-]+\.[a-z0-9]+$/', $name)) return null;

        $path = self::dir() . '/' . $name;
        if (!is_file($path)) return null;

        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        $mime = self::ALLOWED[$ext] ?? 'application/octet-stream';
        return ['file' => $path, 'mime' => $mime, 'cache_days' => 30];
    }

    public static function delete(string $name): bool
    {
        $name = basename($name);
        $row = Database::one(
            'SELECT id, filename FROM ' . Database::t('media') . ' WHERE filename = ?',
            [$name]
        );
        if ($row === null) return false;
        Database::delete(Database::t('media'), 'id = ?', [(int)$row['id']]);
        $p = self::dir() . '/' . $name;
        if (is_file($p)) @unlink($p);
        return true;
    }

    /** Daftar media terbaru untuk pemilih gambar di form */
    public static function latest(int $limit = 60): array
    {
        return Database::all(
            'SELECT * FROM ' . Database::t('media') . ' ORDER BY id DESC LIMIT ' . (int)$limit
        );
    }
}
