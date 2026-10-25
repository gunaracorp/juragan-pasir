<?php
/**
 * Layout admin — sidebar gelap, konten terang, flash message.
 * Data: $content, $pageTitle
 */
$flash = flash_take();
$me = Auth::check() ? $_SESSION['admin_name'] : '';
?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($pageTitle ?? 'Admin') ?> · <?= e(Settings::get('site_title')) ?></title>
<meta name="robots" content="noindex, nofollow">
<link rel="stylesheet" href="/assets/admin.css">
</head>
<body class="admin<?= Auth::check() ? ' has-sidebar' : '' ?>">

<?php if (Auth::check()): ?>
<aside class="sidebar">
  <div class="side-brand"><span class="brand-mark">JP</span> <div><strong><?= e(Settings::get('site_title')) ?></strong><small>Panel CMS</small></div></div>
  <nav class="side-nav">
    <a href="/admin" class="<?= (($pageTitle ?? '') === 'Dashboard') ? 'active' : '' ?>">📊 Dashboard</a>
    <a href="/admin/pages" class="<?= str_starts_with($pageTitle ?? '', 'Halaman') ? 'active' : '' ?>">📄 Halaman</a>
    <a href="/admin/articles" class="<?= str_contains($pageTitle ?? '', 'Artikel') ? 'active' : '' ?>">📝 Artikel</a>
    <a href="/admin/media" class="<?= ($pageTitle ?? '') === 'Media' ? 'active' : '' ?>">🖼️ Media</a>
    <a href="/admin/settings" class="<?= ($pageTitle ?? '') === 'Pengaturan' ? 'active' : '' ?>">⚙️ Pengaturan</a>
  </nav>
  <div class="side-foot">
    <a href="/" target="_blank" rel="noopener">🌐 Lihat Situs ↗</a>
    <form method="post" action="/admin/cache/clear">
      <?= Auth::csrfField() ?>
      <button type="submit" class="btn-side">🧹 Bersihkan Cache</button>
    </form>
    <a href="/admin/logout">🚪 Keluar (<?= e($me) ?>)</a>
  </div>
</aside>
<?php endif; ?>

<div class="admin-main">
  <?php if ($flash): ?>
    <div class="flash flash-<?= e($flash['type']) ?>"><?= e($flash['msg']) ?></div>
  <?php endif; ?>
  <?= $content ?>
</div>

<script src="/assets/admin.js" defer></script>
</body>
</html>
