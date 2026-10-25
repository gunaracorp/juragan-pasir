<?php
/**
 * JURAGAN CORE CMS — SEO Engine
 * Fondasi teknis Masterplan BAB 6.2 ditanam otomatis:
 * sitemap.xml, robots.txt, JSON-LD, Open Graph, canonical — tanpa plugin.
 */
declare(strict_types=1);

final class Seo
{
    /** Susun data meta lengkap satu halaman */
    public static function meta(string $path, ?string $title, ?string $desc, ?string $ogImage = null): array
    {
        $site = Settings::get('site_title');
        return [
            'title'    => Settings::metaTitle($title !== $site ? $title : null),
            'desc'     => Settings::metaDesc($desc),
            'canonical'=> base_url($path),
            'og_image' => $ogImage ?: Settings::get('og_image'),
            'og_type'  => 'website',
            'site'     => $site,
        ];
    }

    /* ---------------- JSON-LD ---------------- */

    private static function ld(array $data): string
    {
        return '<script type="application/ld+json">'
            . json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_LINE_TERMINATORS)
            . '</script>';
    }

    public static function ldWebsite(): string
    {
        return self::ld([
            '@context' => 'https://schema.org',
            '@type'    => 'WebSite',
            'name'     => Settings::get('site_title'),
            'url'      => base_url('/'),
            'description' => Settings::get('meta_description') ?: Settings::get('tagline'),
            'inLanguage'  => 'id-ID',
        ]);
    }

    public static function ldLocalBusiness(): string
    {
        if (Settings::get('ld_localbusiness') !== '1') return '';
        $addr = [];
        if (Settings::get('street'))  $addr['streetAddress'] = Settings::get('street');
        if (Settings::get('city'))    $addr['addressLocality'] = Settings::get('city');
        if (Settings::get('region'))  $addr['addressRegion'] = Settings::get('region');
        if (Settings::get('postal'))  $addr['postalCode'] = Settings::get('postal');
        $addr['addressCountry'] = 'ID';
        if (empty($addr['streetAddress'])) return '';

        $data = [
            '@context' => 'https://schema.org',
            '@type'    => 'LocalBusiness',
            'name'     => Settings::get('site_title'),
            'url'      => base_url('/'),
            'address'  => $addr,
        ];
        if (Settings::get('phone')) $data['telephone'] = Settings::get('phone');
        if (Settings::get('email')) $data['email'] = Settings::get('email');
        if (Settings::get('hours')) $data['openingHours'] = Settings::get('hours');
        if (Settings::get('lat') !== '' && Settings::get('lng') !== '') {
            $data['geo'] = ['@type' => 'GeoCoordinates',
                'latitude' => (float)Settings::get('lat'), 'longitude' => (float)Settings::get('lng')];
        }
        if (Settings::get('og_image')) $data['image'] = base_url(Settings::get('og_image'));
        return self::ld($data);
    }

    public static function ldArticle(array $a): string
    {
        $data = [
            '@context'   => 'https://schema.org',
            '@type'      => 'Article',
            'headline'   => (string)$a['title'],
            'url'        => base_url('/artikel/' . $a['slug']),
            'inLanguage' => 'id-ID',
            'mainEntityOfPage' => base_url('/artikel/' . $a['slug']),
        ];
        if (!empty($a['published_at'])) $data['datePublished'] = date('c', strtotime((string)$a['published_at']));
        if (!empty($a['updated_at']))   $data['dateModified'] = date('c', strtotime((string)$a['updated_at']));
        if (!empty($a['image']))        $data['image'] = base_url('/media/' . $a['image']);
        $data['author'] = ['@type' => 'Organization', 'name' => Settings::get('site_title')];
        $desc = $a['excerpt'] !== '' ? (string)$a['excerpt'] : excerpt_of((string)$a['content']);
        if ($desc !== '') $data['description'] = $desc;
        return self::ld($data);
    }

    public static function ldBreadcrumbs(array $items): string
    {
        $list = [];
        $pos = 1;
        foreach ($items as $label => $url) {
            $list[] = ['@type' => 'ListItem', 'position' => $pos++, 'name' => (string)$label, 'item' => $url];
        }
        return self::ld([
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            'itemListElement' => $list,
        ]);
    }

    public static function ldFaq(array $faqs): string
    {
        if (Settings::get('ld_faq') !== '1' || !$faqs) return '';
        $ent = [];
        foreach ($faqs as $f) {
            $ent[] = [
                '@type'          => 'Question',
                'name'           => (string)$f['title'],
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => excerpt_of((string)$f['content'], 4000)],
            ];
        }
        return self::ld(['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $ent]);
    }

    /* ---------------- sitemap.xml & robots.txt ---------------- */

    public static function sitemapXml(array $urls): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
             . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $u) {
            $xml .= "  <url>\n"
                  . '    <loc>' . e($u['loc']) . "</loc>\n";
            if (!empty($u['lastmod'])) {
                $xml .= '    <lastmod>' . date('Y-m-d', strtotime((string)$u['lastmod'])) . "</lastmod>\n";
            }
            $xml .= "  </url>\n";
        }
        return $xml . '</urlset>';
    }

    public static function robotsTxt(): string
    {
        return "User-agent: *\n"
             . "Allow: /\n"
             . "Disallow: /admin\n"
             . "Disallow: /media\n"
             . "Disallow: /install\n\n"
             . "Sitemap: " . base_url('/sitemap.xml') . "\n";
    }
}
