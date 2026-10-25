<?php
/**
 * JURAGAN CORE CMS — Database (PDO)
 * Satu koneksi, tabel berprefiks per tenant (Masterplan BAB 4.3, Tabel 4.2).
 * Driver: mysql untuk produksi cPanel, sqlite untuk lokal/dev.
 */
declare(strict_types=1);

final class Database
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo instanceof PDO) return self::$pdo;

        $db = Config::get('db', []);
        $driver = $db['driver'] ?? 'mysql';

        try {
            if ($driver === 'sqlite') {
                $path = $db['sqlite_path'] ?? (JRCMS_ROOT . '/storage/cms.sqlite');
                self::$pdo = new PDO('sqlite:' . $path);
                self::$pdo->exec('PRAGMA journal_mode = WAL');
                self::$pdo->exec('PRAGMA foreign_keys = ON');
            } else {
                $dsn = sprintf(
                    'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                    $db['host'] ?? 'localhost',
                    $db['port'] ?? '3306',
                    $db['name'] ?? 'cms',
                    $db['charset'] ?? 'utf8mb4'
                );
                self::$pdo = new PDO($dsn, $db['user'] ?? '', $db['pass'] ?? '');
                self::$pdo->exec("SET sql_mode='ANSI_QUOTES,NO_ENGINE_SUBSTITUTION'");
            }
        } catch (Throwable $e) {
            error_log('[CoreCMS] DB connect gagal: ' . $e->getMessage());
            throw new RuntimeException('Koneksi database gagal. Periksa config/config.php.');
        }

        self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return self::$pdo;
    }

    /** Nama tabel berprefiks tenant, mis. t1_pages */
    public static function t(string $table): string
    {
        return Tenant::prefix() . $table;
    }

    /** Fragmen waktu-saat-ini sesuai driver */
    public static function now(): string
    {
        return (Config::get('db.driver') === 'sqlite') ? "datetime('now')" : 'NOW()';
    }

    public static function run(string $sql, array $params = []): PDOStatement
    {
        $st = self::pdo()->prepare($sql);
        $st->execute($params);
        return $st;
    }

    public static function all(string $sql, array $params = []): array
    {
        return self::run($sql, $params)->fetchAll();
    }

    public static function one(string $sql, array $params = []): ?array
    {
        $row = self::run($sql, $params)->fetch();
        return $row === false ? null : $row;
    }

    public static function scalar(string $sql, array $params = []): int
    {
        return (int)self::run($sql, $params)->fetchColumn();
    }

    public static function insert(string $table, array $data): int
    {
        $cols = array_keys($data);
        $sql = 'INSERT INTO ' . $table . ' (' . implode(',', $cols) . ') VALUES ('
             . implode(',', array_fill(0, count($cols), '?')) . ')';
        self::run($sql, array_values($data));
        return (int)self::pdo()->lastInsertId();
    }

    public static function update(string $table, array $data, string $where, array $whereParams = []): int
    {
        $set = [];
        foreach (array_keys($data) as $c) $set[] = $c . ' = ?';
        $sql = 'UPDATE ' . $table . ' SET ' . implode(', ', $set) . ' WHERE ' . $where;
        return self::run($sql, array_merge(array_values($data), $whereParams))->rowCount();
    }

    public static function delete(string $table, string $where, array $whereParams = []): int
    {
        return self::run('DELETE FROM ' . $table . ' WHERE ' . $where, $whereParams)->rowCount();
    }

    /** Slug unik dalam satu tabel (tambah -2, -3, ... bila bentrok) */
    public static function uniqueSlug(string $table, string $slug, int $ignoreId = 0): string
    {
        $base = $slug;
        $i = 1;
        while (true) {
            $row = self::one(
                'SELECT id FROM ' . $table . ' WHERE slug = ? AND id != ? LIMIT 1',
                [$slug, $ignoreId]
            );
            if ($row === null) return $slug;
            $i++;
            $slug = $base . '-' . $i;
        }
    }
}
