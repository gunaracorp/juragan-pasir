<?php
/**
 * CONTOH konfigurasi — installer akan menulis config/config.php sungguhan.
 * Salin manual ke config/config.php hanya bila ingin konfigurasi tanpa installer.
 */
return [
    'db' => [
        'driver' => 'mysql',          // 'mysql' produksi cPanel | 'sqlite' dev lokal
        'host'   => 'localhost',
        'port'   => '3306',
        'name'   => 'user_cms',
        'user'   => 'user_cms',
        'pass'   => 'sandi-anda',
        'charset'=> 'utf8mb4',
    ],
    'app' => [
        'debug'     => false,          // TRUE hanya saat debugging — jangan di produksi
        'timezone'  => 'Asia/Jakarta',
        'cache_on'  => true,
        'cache_ttl' => 86400,          // detik; 0 = tidak pernah kedaluwarsa
    ],
];
