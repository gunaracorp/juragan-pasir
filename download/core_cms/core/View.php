<?php
/**
 * JURAGAN CORE CMS — View
 * Template engine murni PHP: render view → sisipkan ke layout.
 * Tanpa compile, tanpa build — mudah dibaca & diedit langsung di cPanel.
 */
declare(strict_types=1);

final class View
{
    /** Render satu file view (folder views/ atau tema) dan kembalikan HTML */
    public static function render(string $__tpl, array $__data = []): string
    {
        $__file = self::locate($__tpl);
        if ($__file === null) {
            throw new RuntimeException('View tidak ditemukan: ' . $__tpl);
        }
        extract($__data, EXTR_SKIP);
        ob_start();
        include $__file;
        return (string)ob_get_clean();
    }

    /** Bungkus konten dengan layout (front atau admin) */
    public static function layout(string $__layout, string $__content, array $__data = []): string
    {
        $__data['content'] = $__content;
        $__file = self::locate($__layout);
        if ($__file === null) {
            throw new RuntimeException('Layout tidak ditemukan: ' . $__layout);
        }
        extract($__data, EXTR_SKIP);
        ob_start();
        include $__file;
        return (string)ob_get_clean();
    }

    /**
     * Cari view: tema tenant dulu (themes/{theme}/views/...),
     * lalu views/ bawaan core. Override tema tanpa menyentuh inti.
     */
    public static function locate(string $tpl): ?string
    {
        $rel = ltrim(str_replace(['..', "\0"], '', $tpl), '/');
        if (!str_ends_with($rel, '.php')) $rel .= '.php';

        $themeFile = JRCMS_ROOT . '/themes/' . Tenant::theme() . '/views/' . $rel;
        if (is_file($themeFile)) return $themeFile;

        $coreFile = JRCMS_ROOT . '/views/' . $rel;
        if (is_file($coreFile)) return $coreFile;

        return null;
    }

    /** URL aset tema: /assets/... disajikan lewat front controller (dengan cache header) */
    public static function asset(string $path): string
    {
        return '/assets/' . ltrim($path, '/');
    }
}
