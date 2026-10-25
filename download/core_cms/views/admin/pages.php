<?php /** Daftar halaman — data: $pages */ ?>
<header class="admin-head row-between">
  <div><h1>Halaman</h1><p class="muted">Halaman utuh website: beranda, tentang, kontak, layanan, dst.</p></div>
  <a class="btn btn-primary" href="/admin/pages/new">+ Halaman Baru</a>
</header>

<table class="tbl wide">
  <thead><tr><th>Judul</th><th>Slug</th><th>Status</th><th>Diperbarui</th><th class="ta-r">Aksi</th></tr></thead>
  <tbody>
  <?php foreach ($pages as $p): ?>
    <tr>
      <td>
        <strong><?= e($p['title']) ?></strong>
        <?php if ($p['is_home']): ?><span class="chip chip-home">Beranda</span><?php endif; ?>
        <?php if (!$p['is_published']): ?><span class="chip chip-draft">Draf</span><?php endif; ?>
      </td>
      <td><code><?= e($p['slug']) ?></code></td>
      <td><?= $p['is_published'] ? '<span class="ok-line">✅ Tayang</span>' : '<span class="muted">Draf</span>' ?></td>
      <td class="muted small"><?= e(fmt_date_id($p['updated_at'], true)) ?></td>
      <td class="ta-r">
        <?php if ($p['is_published']): ?><a class="btn btn-small btn-ghost" href="/<?= e($p['is_home'] ? '' : $p['slug']) ?>" target="_blank" rel="noopener">Lihat</a><?php endif; ?>
        <a class="btn btn-small btn-ghost" href="/admin/pages/<?= (int)$p['id'] ?>/edit">Edit</a>
        <form method="post" action="/admin/pages/delete" class="inline" data-confirm="Hapus halaman ini?">
          <?= Auth::csrfField() ?><input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
          <button class="btn btn-small btn-danger" <?= $p['is_home'] ? 'disabled title="Beranda tidak bisa dihapus"' : '' ?>>Hapus</button>
        </form>
      </td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
