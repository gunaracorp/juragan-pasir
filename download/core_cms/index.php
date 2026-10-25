<?php
/**
 * JURAGAN CORE CMS — index.php (front controller inti)
 * File ini TIDAK ditempatkan di public_html. Setiap addon domain cukup
 * memuat satu index.php tipis yang mendefinisikan JRCMS_CORE lalu
 * me-require file ini (lihat docs/kit-domain/).
 */
declare(strict_types=1);

if (!defined('JRCMS_CORE')) {
    define('JRCMS_CORE', __DIR__);
}
define('JRCMS_ROOT', JRCMS_CORE);

require JRCMS_ROOT . '/core/Bootstrap.php';
Bootstrap::run();
