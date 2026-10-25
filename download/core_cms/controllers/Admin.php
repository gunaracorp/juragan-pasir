<?php
/**
 * JURAGAN CORE CMS — Controller Admin
 * Panel CMS per-tenant: dashboard, halaman, artikel, media, pengaturan.
 * Semua POST dilindungi CSRF; setiap simpanan menghapus cache tenant
 * sehingga frontend langsung menampilkan perubahan (Masterplan BAB 4.4).
 */
declare(strict_types=1);

final class Admin
{
    /* ================= GET ================= */

    public static function get(string $sub)
    {
        $sub = '/' . trim($sub, '/');

        if ($sub === '/login') return self::loginForm();
        if ($sub === '/logout') {
            Auth::logout();
            flash_set('ok', 'Anda telah keluar.');
            return ['redirect' => '/admin/login'];
        }

        $guard = Auth::requireLogin();
        if ($guard) return $guard;

        if ($sub === '/' || $sub === '')          return self::dashboard();
        if ($sub === '/pages')                    return self::listPages();
        if ($sub === '/pages/new')                return self::formPage(null);
        if (preg_match('#^/pages/(\d+)/edit$#', $sub, $m)) return self::formPage((int)$m[1]);
        if ($sub === '/articles')                 return self::listArticles();
        if ($sub === '/articles/new')             return self::formArticle(null);
        if (preg_match('#^/articles/(\d+)/edit$#', $sub, $m)) return self::formArticle((int)$m[1]);
        if ($sub === '/media')                    return self::mediaPage();
        if ($sub === '/settings')                 return self::formSettings();

        return ['redirect' => '/admin'];
    }

    /* ================= POST ================= */

    public static function post(string $sub)
    {
        $sub = '/' . trim($sub, '/');

        if ($sub === '/login') {
            if (!Auth::csrfVerify()) {
                flash_set('err', 'Token keamanan tidak sah. Coba lagi.');
                return ['redirect' => '/admin/login'];
            }
            if (Auth::attempt(post('username'), post('password'))) {
                flash_set('ok', 'Selamat datang, ' . $_SESSION['admin_name'] . '!');
                return ['redirect' => '/admin'];
            }
            flash_set('err', 'Username atau sandi salah.');
            return ['redirect' => '/admin/login'];
        }

        $guard = Auth::requireLogin();
        if ($guard) return $guard;
        $csrf = Auth::csrfGuard();
        if ($csrf) return $csrf;

        if ($sub === '/pages/save')        return self::savePage();
        if ($sub === '/pages/delete')      return self::deletePage();
        if ($sub === '/articles/save')     return self::saveArticle();
        if ($sub === '/articles/delete')   return self::deleteArticle();
        if ($sub === '/media/upload')      return self::uploadMedia();
        if ($sub === '/media/delete')      return self::deleteMedia();
        if ($sub === '/settings/save')     return self::saveSettings();
        if ($sub === '/cache/clear')       return self::clearCache();

        return ['redirect' => '/admin'];
    }

    /* ---------------- Dashboard ---------------- */

    private static function dashboard()
    {
        $t = fn (string $x): string => Database::t($x);
        $seoIssues = [];

        foreach (Database::all("SELECT title, slug, is_home, meta_title, meta_description FROM {$t('pages')} WHERE is_published = 1") as $p) {
            if ($p['meta_title'] === '' || $p['meta_description'] === '') {
                $seoIssues[] = ['type' => 'Halaman', 'title' => $p['title'], 'slug' => $p['slug'], 'missing' => self::missing($p['meta_title'], $p['meta_description'])];
            }
        }
        foreach (Database::all("SELECT title, slug, meta_title, meta_description FROM {$t('articles')} WHERE is_published = 1 AND category = 'artikel'") as $a) {
            if ($a['meta_title'] === '' || $a['meta_description'] === '') {
                $seoIssues[] = ['type' => 'Artikel', 'title' => $a['title'], 'slug' => $a['slug'], 'missing' => self::missing($a['meta_title'], $a['meta_description'])];
            }
        }

        return View::layout('admin/layout', View::render('admin/dashboard', [
            'pageTitle'  => 'Dashboard',
            'counts'     => [
                'pages'    => Database::scalar("SELECT COUNT(*) FROM {$t('pages')}"),
                'articles' => Database::scalar("SELECT COUNT(*) FROM {$t('articles')}"),
                'media'    => Database::scalar("SELECT COUNT(*) FROM {$t('media')}"),
                'cache'    => Cache::count(),
            ],
            'cacheSize'  => self::humanSize(Cache::size()),
            'seoIssues'  => $seoIssues,
            'recent'     => Database::all("SELECT title, slug, category, updated_at FROM {$t('articles')} ORDER BY updated_at DESC, id DESC LIMIT 6"),
        ]));
    }

    private static function missing(string $mt, string $md): string
    {
        $out = [];
        if ($mt === '') $out[] = 'meta judul';
        if ($md === '') $out[] = 'meta deskripsi';
        return implode(' & ', $out);
    }

    private static function humanSize(int $b): string
    {
        if ($b >= 1048576) return number_format($b / 1048576, 1) . ' MB';
        if ($b >= 1024) return number_format($b / 1024, 1) . ' KB';
        return $b . ' B';
    }

    /* ---------------- Halaman (pages) ---------------- */

    private static function listPages()
    {
        return View::layout('admin/layout', View::render('admin/pages', [
            'pageTitle' => 'Halaman',
            'pages'     => Database::all('SELECT * FROM ' . Database::t('pages') . ' ORDER BY is_home DESC, sort_order, id'),
        ]));
    }

    private static function formPage(?int $id)
    {
        $page = $id ? Database::one('SELECT * FROM ' . Database::t('pages') . ' WHERE id = ?', [$id]) : null;
        if ($id && !$page) return ['redirect' => '/admin/pages'];
        return View::layout('admin/layout', View::render('admin/page_form', [
            'pageTitle' => $page ? 'Edit Halaman' : 'Halaman Baru',
            'page'      => $page,
            'mediaList' => Media::latest(),
        ]));
    }

    private static function savePage()
    {
        $id = (int)post('id');
        $title = post('title');
        if ($title === '') {
            flash_set('err', 'Judul wajib diisi.');
            return ['redirect' => '/admin/pages' . ($id ? "/{$id}/edit" : '/new')];
        }
        $slug = Database::uniqueSlug(Database::t('pages'), post('slug') !== '' ? slugify(post('slug')) : slugify($title), $id);
        $data = [
            'title'            => $title,
            'slug'             => $slug,
            'content'          => post('content'),
            'meta_title'       => mb_substr(post('meta_title'), 0, 190),
            'meta_description' => mb_substr(post('meta_description'), 0, 320),
            'og_image'         => post('og_image'),
            'is_home'          => post('is_home') === '1' ? 1 : 0,
            'is_published'     => post('is_published') === '1' ? 1 : 0,
            'sort_order'       => (int)post('sort_order'),
        ];

        if ($id) {
            Database::update(Database::t('pages'), $data, 'id = ?', [$id]);
            $msg = "Halaman \"{$title}\" diperbarui.";
        } else {
            $id = Database::insert(Database::t('pages'), $data);
            $msg = "Halaman \"{$title}\" dibuat.";
        }

        // Satu-satunya beranda: matikan is_home milik lain
        if ($data['is_home']) {
            Database::run('UPDATE ' . Database::t('pages') . ' SET is_home = 0 WHERE id != ?', [$id]);
        }

        Cache::purgeTenant();
        flash_set('ok', $msg . ' Frontend diperbarui otomatis.');
        return ['redirect' => '/admin/pages'];
    }

    private static function deletePage()
    {
        $id = (int)post('id');
        $p = Database::one('SELECT title, is_home FROM ' . Database::t('pages') . ' WHERE id = ?', [$id]);
        if ($p && !$p['is_home']) {
            Database::delete(Database::t('pages'), 'id = ?', [$id]);
            Cache::purgeTenant();
            flash_set('ok', "Halaman \"{$p['title']}\" dihapus.");
        } elseif ($p) {
            flash_set('err', 'Beranda tidak boleh dihapus — ubah dulu halaman lain menjadi beranda.');
        }
        return ['redirect' => '/admin/pages'];
    }

    /* ---------------- Artikel ---------------- */

    private static function listArticles()
    {
        $cat = query_str('cat');
        $sql = 'SELECT * FROM ' . Database::t('articles');
        $params = [];
        if ($cat !== '' && preg_match('/^[a-z0-9_-]{1,64}$/', $cat)) {
            $sql .= ' WHERE category = ?';
            $params[] = $cat;
        }
        $sql .= ' ORDER BY id DESC';
        return View::layout('admin/layout', View::render('admin/articles', [
            'pageTitle' => 'Artikel',
            'articles'  => Database::all($sql, $params),
            'cat'       => $cat,
        ]));
    }

    private static function formArticle(?int $id)
    {
        $a = $id ? Database::one('SELECT * FROM ' . Database::t('articles') . ' WHERE id = ?', [$id]) : null;
        if ($id && !$a) return ['redirect' => '/admin/articles'];
        return View::layout('admin/layout', View::render('admin/article_form', [
            'pageTitle' => $a ? 'Edit Artikel' : 'Artikel Baru',
            'a'         => $a,
            'mediaList' => Media::latest(),
        ]));
    }

    private static function saveArticle()
    {
        $id = (int)post('id');
        $title = post('title');
        if ($title === '') {
            flash_set('err', 'Judul wajib diisi.');
            return ['redirect' => '/admin/articles' . ($id ? "/{$id}/edit" : '/new')];
        }
        $cat = post('category', 'artikel');
        if (!preg_match('/^[a-z0-9_-]{1,64}$/', $cat)) $cat = 'artikel';

        $slug = Database::uniqueSlug(Database::t('articles'), post('slug') !== '' ? slugify(post('slug')) : slugify($title), $id);
        $publishedAt = post('published_at');
        $data = [
            'title'            => $title,
            'slug'             => $slug,
            'category'         => $cat,
            'excerpt'          => mb_substr(post('excerpt'), 0, 500),
            'content'          => post('content'),
            'image'            => post('image'),
            'meta_title'       => mb_substr(post('meta_title'), 0, 190),
            'meta_description' => mb_substr(post('meta_description'), 0, 320),
            'is_published'     => post('is_published') === '1' ? 1 : 0,
        ];

        if ($id) {
            $old = Database::one('SELECT published_at FROM ' . Database::t('articles') . ' WHERE id = ?', [$id]);
            $data['published_at'] = ($publishedAt !== '' && $publishedAt !== null) ? date('Y-m-d H:i:s', strtotime($publishedAt))
                : ($old['published_at'] ?? date('Y-m-d H:i:s'));
            $data['updated_at'] = date('Y-m-d H:i:s');
            Database::update(Database::t('articles'), $data, 'id = ?', [$id]);
            $msg = "Artikel \"{$title}\" diperbarui.";
        } else {
            $data['published_at'] = $publishedAt !== '' ? date('Y-m-d H:i:s', strtotime($publishedAt)) : date('Y-m-d H:i:s');
            $id = Database::insert(Database::t('articles'), $data);
            $msg = "Artikel \"{$title}\" dibuat.";
        }

        Cache::purgeTenant();
        flash_set('ok', $msg . ' Frontend diperbarui otomatis.');
        return ['redirect' => '/admin/articles'];
    }

    private static function deleteArticle()
    {
        $id = (int)post('id');
        $a = Database::one('SELECT title FROM ' . Database::t('articles') . ' WHERE id = ?', [$id]);
        if ($a) {
            Database::delete(Database::t('articles'), 'id = ?', [$id]);
            Cache::purgeTenant();
            flash_set('ok', "Artikel \"{$a['title']}\" dihapus.");
        }
        return ['redirect' => '/admin/articles'];
    }

    /* ---------------- Media ---------------- */

    private static function mediaPage()
    {
        return View::layout('admin/layout', View::render('admin/media', [
            'pageTitle' => 'Media',
            'media'     => Media::latest(120),
        ]));
    }

    private static function uploadMedia()
    {
        if (empty($_FILES['file'])) {
            flash_set('err', 'Tidak ada file terpilih.');
            return ['redirect' => '/admin/media'];
        }
        [$ok, $info] = Media::upload($_FILES['file']);
        flash_set($ok ? 'ok' : 'err', $ok ? "Media \"{$info}\" terunggah." : $info);
        return ['redirect' => '/admin/media'];
    }

    private static function deleteMedia()
    {
        $name = post('filename');
        Media::delete($name) ? flash_set('ok', 'Media dihapus.') : flash_set('err', 'Media tidak ditemukan.');
        return ['redirect' => '/admin/media'];
    }

    /* ---------------- Pengaturan ---------------- */

    private static function formSettings()
    {
        return View::layout('admin/layout', View::render('admin/settings', [
            'pageTitle' => 'Pengaturan',
            's'         => Settings::all(),
        ]));
    }

    private static function saveSettings()
    {
        $keys = ['site_title','tagline','meta_title','meta_description','og_image','whatsapp','wa_message',
                 'phone','email','hours','street','city','region','postal','lat','lng',
                 'footer_about','footer_text','ga_head'];
        $kv = [];
        foreach ($keys as $k) $kv[$k] = post($k);
        $kv['ld_localbusiness'] = post('ld_localbusiness') === '1' ? '1' : '0';
        $kv['ld_faq']           = post('ld_faq') === '1' ? '1' : '0';
        $kv['wa_float']         = post('wa_float') === '1' ? '1' : '0';

        Settings::putMany($kv);
        flash_set('ok', 'Pengaturan disimpan — frontend diperbarui otomatis.');
        return ['redirect' => '/admin/settings'];
    }

    /* ---------------- Cache ---------------- */

    private static function clearCache()
    {
        Cache::purgeTenant();
        flash_set('ok', 'Cache halaman dibersihkan. Kunjungan berikutnya merender ulang.');
        return ['redirect' => '/admin'];
    }

    /* ---------------- Form login ---------------- */

    private static function loginForm()
    {
        if (Auth::check()) return ['redirect' => '/admin'];
        return View::layout('admin/layout', View::render('admin/login', [
            'pageTitle' => 'Masuk',
        ]));
    }
}
