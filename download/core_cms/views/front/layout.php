<?php
/**
 * Layout frontend — head SEO lengkap, header sticky, footer, tombol WA melayang.
 * Data tersedia: $content, $seo (title/desc/canonical/og_image/og_type/site), $nav, $is_home
 */
?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($seo['title']) ?></title>
<meta name="description" content="<?= e($seo['desc']) ?>">
<link rel="canonical" href="<?= e($seo['canonical']) ?>">
<meta name="robots" content="index, follow">
<meta property="og:type" content="<?= e($seo['og_type']) ?>">
<meta property="og:locale" content="id_ID">
<meta property="og:site_name" content="<?= e($seo['site']) ?>">
<meta property="og:title" content="<?= e($seo['title']) ?>">
<meta property="og:description" content="<?= e($seo['desc']) ?>">
<meta property="og:url" content="<?= e($seo['canonical']) ?>">
<?php if (!empty($seo['og_image'])): ?>
<meta property="og:image" content="<?= e($seo['og_image']) ?>">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($seo['title']) ?>">
<meta name="twitter:description" content="<?= e($seo['desc']) ?>">
<?php endif; ?>
<?= Settings::get('ga_head') ?>
<?= $schemas ?? '' ?>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛰️</text></svg>">
<link rel="stylesheet" href="<?= View::asset('css/style.css') ?>">
</head>
<body>
<header class="site-header" id="siteHeader">
  <div class="container header-inner">
    <a class="brand" href="/">
      <span class="brand-mark">JP</span>
      <span class="brand-text"><?= e(Settings::get('site_title')) ?></span>
    </a>
    <nav class="main-nav" id="mainNav">
      <a href="/" class="<?= !empty($is_home) ? 'active' : '' ?>">Beranda</a>
      <?php foreach (($nav ?? []) as $n): ?>
        <a href="/<?= e($n['slug']) ?>" class=""><?= e($n['title']) ?></a>
      <?php endforeach; ?>
      <a href="/artikel">Artikel</a>
      <?php $wa = wa_link(Settings::get('whatsapp'), Settings::get('wa_message')); if ($wa !== 'https://wa.me/'): ?>
        <a class="nav-cta" href="<?= e($wa) ?>" target="_blank" rel="noopener">Minta Penawaran</a>
      <?php endif; ?>
    </nav>
    <button class="nav-toggle" id="navToggle" aria-label="Buka menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</header>

<main>
<?= $content ?>
</main>

<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <div class="brand footer-brand"><span class="brand-mark">JP</span> <span><?= e(Settings::get('site_title')) ?></span></div>
      <p class="muted"><?= e(Settings::get('footer_about')) ?></p>
    </div>
    <div>
      <h4>Navigasi</h4>
      <a href="/">Beranda</a>
      <?php foreach (($nav ?? []) as $n): ?><a href="/<?= e($n['slug']) ?>"><?= e($n['title']) ?></a><?php endforeach; ?>
      <a href="/artikel">Artikel</a>
    </div>
    <div>
      <h4>Kontak</h4>
      <?php if (Settings::get('phone')): ?><p>📞 <?= e(Settings::get('phone')) ?></p><?php endif; ?>
      <?php if (Settings::get('email')): ?><p>✉️ <?= e(Settings::get('email')) ?></p><?php endif; ?>
      <?php if (Settings::get('hours')): ?><p>🕒 <?= e(Settings::get('hours')) ?></p><?php endif; ?>
      <?php if (Settings::get('street')): ?><p>📍 <?= e(Settings::get('street') . ', ' . Settings::get('city')) ?></p><?php endif; ?>
    </div>
  </div>
  <div class="container footer-bottom">
    <span><?= e(Settings::get('footer_text')) ?></span>
    <span class="muted">Ditenagai Core CMS — cepat, aman, milik sendiri.</span>
  </div>
</footer>

<?php if (Settings::get('wa_float') === '1' && ($wa = wa_link(Settings::get('whatsapp'), Settings::get('wa_message'))) !== 'https://wa.me/'): ?>
<a class="wa-float" href="<?= e($wa) ?>" target="_blank" rel="noopener" aria-label="Chat WhatsApp">
  <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff" aria-hidden="true"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.6c1.2.6 2.5.9 3.8.9 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-1.2 0-2.4-.3-3.5-.8l-.5-.3-4.9 1 1-4.8-.3-.5C7.2 18.4 6.8 16.7 6.8 15c0-5.1 4.1-9.2 9.2-9.2s9.2 4.1 9.2 9.2S21.1 25 16 25zm5-6.6c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.7-2.5-1.3-3.4-2.9-.3-.4.3-.4.7-1.4.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>
</a>
<?php endif; ?>

<script src="<?= View::asset('js/main.js') ?>" defer></script>
</body>
</html>
