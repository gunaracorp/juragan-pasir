<?php
/**
 * JURAGAN CORE CMS — Controller Frontend
 * Halaman publik: beranda (konten + grid otomatis dari kategori artikel),
 * halaman, artikel, sitemap, robots, media, aset tema.
 */
declare(strict_types=1);

final class Front
{
    private const CAT_PRODUCTS = 'produk';
    private const CAT_TESTI    = 'testimoni';
    private const CAT_FAQ      = 'faq';

    /* ---------------- Beranda ---------------- */

    public static function home()
    {
        $page = Database::one(
            'SELECT * FROM ' . Database::t('pages')
            . ' WHERE is_published = 1 AND is_home = 1 ORDER BY id LIMIT 1'
        );
        if ($page === null) {
            $page = Database::one(
                'SELECT * FROM ' . Database::t('pages') . ' WHERE is_published = 1 ORDER BY id LIMIT 1'
            );
        }
        if ($page === null) return ['status' => 404];

        $seo = Seo::meta('/', Settings::metaTitle(), Settings::metaDesc(null, (string)$page['content']),
            $page['og_image'] ?: null);
        $schemas = [Seo::ldWebsite(), Seo::ldLocalBusiness()];

        $faqs = self::byCat(self::CAT_FAQ);
        if ($faqs) $schemas[] = Seo::ldFaq($faqs);

        $html = View::layout('front/layout', View::render('front/home', [
            'page'         => $page,
            'products'     => self::byCat(self::CAT_PRODUCTS),
            'testimonials' => self::byCat(self::CAT_TESTI),
            'faqs'         => $faqs,
        ]), [
            'seo'          => $seo,
            'schemas'      => implode("\n", array_filter($schemas)),
            'nav'          => Router::navPages(),
            'is_home'      => true,
        ]);
        return $html;
    }

    /* ---------------- Halaman statis ---------------- */

    public static function page(string $slug)
    {
        if ($slug === '' || !preg_match('/^[a-z0-9-]{1,190}$/', $slug)) return ['status' => 404];

        $page = Database::one(
            'SELECT * FROM ' . Database::t('pages') . ' WHERE slug = ? AND is_published = 1 LIMIT 1',
            [$slug]
        );
        if ($page === null) return ['status' => 404];

        $seo = Seo::meta('/' . $slug, Settings::metaTitle($page['title'], $page['meta_title']),
            Settings::metaDesc($page['meta_description'] ?: null, (string)$page['content']),
            $page['og_image'] ?: null);

        $schemas = [
            Seo::ldWebsite(),
            Seo::ldBreadcrumbs(['Beranda' => base_url('/'), (string)$page['title'] => base_url('/' . $slug)]),
        ];

        return View::layout('front/layout', View::render('front/page', [
            'page'    => $page,
        ]), [
            'seo'     => $seo,
            'schemas' => implode("\n", array_filter($schemas)),
            'nav'     => Router::navPages(),
        ]);
    }

    /* ---------------- Artikel ---------------- */

    public static function articles()
    {
        $posts = Database::all(
            'SELECT * FROM ' . Database::t('articles')
            . ' WHERE is_published = 1 ORDER BY published_at DESC, id DESC LIMIT 60'
        );
        $seo = Seo::meta('/artikel', 'Artikel & Info Terbaru', 'Kumpulan artikel dan informasi terbaru dari ' . Settings::get('site_title') . '.');
        $schemas = [Seo::ldWebsite(), Seo::ldBreadcrumbs(['Beranda' => base_url('/'), 'Artikel' => base_url('/artikel')])];

        return View::layout('front/layout', View::render('front/articles', [
            'posts'   => $posts,
        ]), [
            'seo'     => $seo,
            'schemas' => implode("\n", array_filter($schemas)),
            'nav'     => Router::navPages(),
        ]);
    }

    public static function article(string $slug)
    {
        if (!preg_match('/^[a-z0-9-]{1,190}$/', $slug)) return ['status' => 404];

        $a = Database::one(
            'SELECT * FROM ' . Database::t('articles') . ' WHERE slug = ? AND is_published = 1 LIMIT 1',
            [$slug]
        );
        if ($a === null) return ['status' => 404];

        $seo = Seo::meta('/artikel/' . $slug, Settings::metaTitle($a['title'], $a['meta_title']),
            Settings::metaDesc($a['meta_description'] ?: null, (string)$a['content']),
            $a['image'] ?: null);

        $schemas = [
            Seo::ldArticle($a),
            Seo::ldBreadcrumbs(['Beranda' => base_url('/'), 'Artikel' => base_url('/artikel'), (string)$a['title'] => base_url('/artikel/' . $slug)]),
        ];

        return View::layout('front/layout', View::render('front/article', [
            'a'       => $a,
        ]), [
            'seo'     => $seo,
            'schemas' => implode("\n", array_filter($schemas)),
            'nav'     => Router::navPages(),
        ]);
    }

    private static function byCat(string $cat, int $limit = 12): array
    {
        return Database::all(
            'SELECT * FROM ' . Database::t('articles')
            . ' WHERE is_published = 1 AND category = ? ORDER BY id LIMIT ' . (int)$limit,
            [$cat]
        );
    }

    /* ---------------- Media & aset tema ---------------- */

    public static function media(string $name)
    {
        $out = Media::serve($name);
        return $out ?: ['status' => 404];
    }

    public static function asset(string $path)
    {
        $rel = str_replace(['..', "\0"], '', $path);

        // 1) Tema tenant dulu, 2) aset inti (admin.css/admin.js) sebagai fallback
        $candidates = [
            JRCMS_ROOT . '/themes/' . Tenant::theme() . '/assets/' . ltrim($rel, '/'),
            JRCMS_ROOT . '/assets/' . ltrim($rel, '/'),
        ];
        $base = realpath(JRCMS_ROOT . '/themes/' . Tenant::theme() . '/assets');
        $baseCore = realpath(JRCMS_ROOT . '/assets');

        $file = null; $root = null;
        foreach ($candidates as $i => $c) {
            $real = realpath($c);
            $root = $i === 0 ? $base : $baseCore;
            if ($real !== false && $root !== false && str_starts_with($real, $root) && is_file($real)) {
                $file = $real; break;
            }
        }
        if ($file === null) return ['status' => 404];

        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $mime = [
            'css' => 'text/css; charset=UTF-8', 'js' => 'application/javascript; charset=UTF-8',
            'svg' => 'image/svg+xml', 'png' => 'image/png', 'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg', 'webp' => 'image/webp', 'gif' => 'image/gif',
            'woff2' => 'font/woff2', 'woff' => 'font/woff', 'ico' => 'image/x-icon',
        ][$ext] ?? 'application/octet-stream';
        return ['file' => $file, 'mime' => $mime, 'cache_days' => 7];
    }

    /* ---------------- SEO teknis ---------------- */

    public static function sitemap()
    {
        $urls = [['loc' => base_url('/'), 'lastmod' => date('Y-m-d')]];
        foreach (Database::all('SELECT slug, updated_at FROM ' . Database::t('pages') . ' WHERE is_published = 1 AND is_home = 0') as $p) {
            $urls[] = ['loc' => base_url('/' . $p['slug']), 'lastmod' => $p['updated_at']];
        }
        foreach (Database::all('SELECT slug, updated_at FROM ' . Database::t('articles') . ' WHERE is_published = 1') as $a) {
            $urls[] = ['loc' => base_url('/artikel/' . $a['slug']), 'lastmod' => $a['updated_at']];
        }
        return ['raw' => Seo::sitemapXml($urls), 'mime' => 'application/xml; charset=UTF-8'];
    }

    public static function robots()
    {
        return ['raw' => Seo::robotsTxt(), 'mime' => 'text/plain; charset=UTF-8'];
    }
}
