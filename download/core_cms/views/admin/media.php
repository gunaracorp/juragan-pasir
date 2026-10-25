<?php /** Media — data: $media */ ?>
<header class="admin-head row-between">
  <div><h1>Media</h1><p class="muted">JPG, PNG, WebP, GIF, PDF — maksimal 8 MB per file.</p></div>
</header>

<div class="panel upload-panel">
  <form method="post" action="/admin/media/upload" enctype="multipart/form-data" class="row-gap">
    <?= Auth::csrfField() ?>
    <input type="file" name="file" accept=".jpg,.jpeg,.png,.webp,.gif,.pdf" required>
    <button type="submit" class="btn btn-primary">⬆️ Unggah</button>
  </form>
</div>

<?php if (empty($media)): ?>
  <p class="muted">Belum ada media. Unggah gambar pertama Anda di atas.</p>
<?php else: ?>
<div class="media-grid">
  <?php foreach ($media as $m): ?>
  <figure class="media-card">
    <?php if (str_starts_with((string)$m['mime'], 'image/')): ?>
      <img src="/media/<?= e($m['filename']) ?>" alt="<?= e($m['original_name']) ?>" loading="lazy">
    <?php else: ?>
      <div class="media-pdf">📄 PDF</div>
    <?php endif; ?>
    <figcaption>
      <code class="small"><?= e('/media/' . $m['filename']) ?></code>
      <span class="muted small"><?= number_format((int)$m['size'] / 1024, 0) ?> KB</span>
      <div class="media-actions">
        <button class="btn btn-small btn-ghost" data-copy="/media/<?= e($m['filename']) ?>">Salin</button>
        <form method="post" action="/admin/media/delete" class="inline" data-confirm="Hapus media ini?">
          <?= Auth::csrfField() ?><input type="hidden" name="filename" value="<?= e($m['filename']) ?>">
          <button class="btn btn-small btn-danger">Hapus</button>
        </form>
      </div>
    </figcaption>
  </figure>
  <?php endforeach; ?>
</div>
<?php endif; ?>
