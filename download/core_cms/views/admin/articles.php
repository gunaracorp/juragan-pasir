<?php /** Daftar artikel — data: $articles, $cat */ ?>
<header class="admin-head row-between">
  <div><h1>Artikel</h1><p class="muted">Kategori <code>produk</code>, <code>testimoni</code>, <code>faq</code> otomatis tampil di beranda; <code>artikel</code> tampil di halaman Artikel.</p></div>
  <a class="btn btn-primary" href="/admin/articles/new">+ Artikel Baru</a>
</header>

<div class="filter-row">
  <a class="chip <?= $cat === '' ? 'chip-on' : '' ?>" href="/admin/articles">Semua</a>
  <?php foreach (['artikel','produk','testimoni','faq'] as $c): ?>
    <a class="chip <?= $cat === $c ? 'chip-on' : '' ?>" href="/admin/articles?cat=<?= $c ?>"><?= ucfirst($c) ?></a>
  <?php endforeach; ?>
</div>

<table class="tbl wide">
  <thead><tr><th>Judul</th><th>Kategori</th><th>Status</th><th>Tayang</th><th class="ta-r">Aksi</th></tr></thead>
  <tbody>
  <?php foreach ($articles as $a): ?>
    <tr>
      <td><strong><?= e($a['title']) ?></strong><br><code class="small"><?= e($a['slug']) ?></code></td>
      <td><span class="cat-chip"><?= e(ucfirst($a['category'])) ?></span></td>
      <td><?= $a['is_published'] ? '<span class="ok-line">✅ Tayang</span>' : '<span class="muted">Draf</span>' ?></td>
      <td class="muted small"><?= e(fmt_date_id($a['published_at'])) ?></td>
      <td class="ta-r">
        <?php if ($a['is_published']): ?><a class="btn btn-small btn-ghost" href="/artikel/<?= e($a['slug']) ?>" target="_blank" rel="noopener">Lihat</a><?php endif; ?>
        <a class="btn btn-small btn-ghost" href="/admin/articles/<?= (int)$a['id'] ?>/edit">Edit</a>
        <form method="post" action="/admin/articles/delete" class="inline" data-confirm="Hapus artikel ini?">
          <?= Auth::csrfField() ?><input type="hidden" name="id" value="<?= (int)$a['id'] ?>">
          <button class="btn btn-small btn-danger">Hapus</button>
        </form>
      </td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
