<?php /** Dashboard — data: $counts, $cacheSize, $seoIssues, $recent */ ?>
<header class="admin-head">
  <h1>Dashboard</h1>
  <p class="muted">Ringkasan kesehatan situs &amp; konten Anda.</p>
</header>

<div class="stat-cards">
  <div class="stat-card"><strong><?= (int)$counts['pages'] ?></strong><span>Halaman</span><a href="/admin/pages">Kelola →</a></div>
  <div class="stat-card"><strong><?= (int)$counts['articles'] ?></strong><span>Artikel</span><a href="/admin/articles">Kelola →</a></div>
  <div class="stat-card"><strong><?= (int)$counts['media'] ?></strong><span>Media</span><a href="/admin/media">Kelola →</a></div>
  <div class="stat-card"><strong><?= (int)$counts['cache'] ?></strong><span>File cache (<?= e($cacheSize) ?>)</span><a href="/" target="_blank" rel="noopener">Lihat situs →</a></div>
</div>

<div class="panel-grid">
  <section class="panel">
    <h2>🩺 Kesehatan SEO</h2>
    <p class="muted small">Fondasi teknis sudah otomatis (sitemap, canonical, JSON-LD, OG). Tinggal melengkapi meta konten berikut agar maksimal di hasil pencarian:</p>
    <?php if (empty($seoIssues)): ?>
      <p class="ok-line">✅ Semua halaman &amp; artikel sudah punya meta judul dan deskripsi. Mantap!</p>
    <?php else: ?>
      <table class="tbl">
        <thead><tr><th>Tipe</th><th>Judul</th><th>Belum diisi</th><th></th></tr></thead>
        <tbody>
        <?php foreach (array_slice($seoIssues, 0, 12) as $i): ?>
          <tr>
            <td><?= e($i['type']) ?></td>
            <td><strong><?= e($i['title']) ?></strong></td>
            <td><span class="chip chip-warn"><?= e($i['missing']) ?></span></td>
            <td><a class="small" href="/admin/<?= $i['type'] === 'Halaman' ? 'pages' : 'articles' ?>">Edit →</a></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
      <?php if (count($seoIssues) > 12): ?><p class="muted small">…dan <?= count($seoIssues) - 12 ?> lagi.</p><?php endif; ?>
    <?php endif; ?>
    <p class="small"><strong>Ritual mingguan:</strong> setelah publish, verifikasi domain di <a href="https://search.google.com/search-console" target="_blank" rel="noopener">Google Search Console</a> dan submit <code><?= e(base_url('/sitemap.xml')) ?></code>.</p>
  </section>

  <section class="panel">
    <h2>🕒 Diperbarui Terakhir</h2>
    <?php if (empty($recent)): ?>
      <p class="muted">Belum ada artikel.</p>
    <?php else: ?>
      <ul class="mini-list">
        <?php foreach ($recent as $r): ?>
        <li><span class="cat-chip"><?= e(ucfirst($r['category'])) ?></span> <strong><?= e($r['title']) ?></strong><br><small class="muted"><?= e(fmt_date_id($r['updated_at'], true)) ?></small></li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
    <div class="quick">
      <a class="btn btn-primary" href="/admin/articles/new">+ Artikel Baru</a>
      <a class="btn btn-ghost" href="/admin/pages/new">+ Halaman Baru</a>
    </div>
  </section>
</div>
