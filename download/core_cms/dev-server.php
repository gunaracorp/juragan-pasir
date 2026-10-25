<?php
/**
 * Router script untuk pengembangan lokal: php -S 127.0.0.1:8099 dev-server.php
 * Semua request dialirkan ke front controller — tidak ada file statis
 * yang bocor langsung (keamanan sama seperti Apache + .htaccess).
 */
require __DIR__ . '/index.php';
