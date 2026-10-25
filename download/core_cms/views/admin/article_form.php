<?php
/** Form artikel — data: $a (null saat baru), $mediaList */
$isEdit = $a !== null;
$metaTitle = $a['meta_title'] ?? '';
$metaDesc  = $a['meta_description'] ?? '';
?>
<header class="admin-head row-between">
  <div><h1><?= $isEdit ? 'Edit Artikel' : 'Artikel Baru' ?></h1>
  <p class="muted">Kategori menentukan letak tampil: produk/testimoni/faq → beranda; artikel → halaman Artikel.</p></div>
  <a class="btn btn-ghost" href="/admin/articles">← Kembali</a>
</header>

<form method="post" action="/admin/articles/save" class="form-grid">
  <?= Auth::csrfField() ?>
  <input type="hidden" name="id" value="<?= $isEdit ? (int)$a['id'] : '' ?>">

  <div class="form-col-main">
    <label>Judul <span class="req">*</span>
      <input type="text" name="title" id="f-title" required value="<?= e($a['title'] ?? '') ?>" data-slug-source>
    </label>
    <label>Slug — kosongkan untuk otomatis
      <input type="text" name="slug" value="<?= e($a['slug'] ?? '') ?>">
    </label>
    <label>Ringkasan / peran (tampil di kartu)
      <textarea name="excerpt" rows="2" maxlength="500"><?= e($a['excerpt'] ?? '') ?></textarea>
    </label>
    <label>Isi (HTML)
      <textarea name="content" rows="16" class="mono"><?= e($a['content'] ?? '') ?></textarea>
    </label>
  </div>

  <div class="form-col-side">
    <div class="panel">
      <h3>Publikasi</h3>
      <label>Kategori
        <input type="text" name="category" list="cats" value="<?= e($a['category'] ?? 'artikel') ?>" required>
        <datalist id="cats"><option value="artikel"></option><option value="produk"></option><option value="testimoni"></option><option value="faq"></option></datalist>
      </label>
      <label class="check"><input type="checkbox" name="is_published" value="1" <?= !$isEdit || $a['is_published'] ? 'checked' : '' ?>> Tayangkan</label>
      <label>Tanggal tayang
        <input type="datetime-local" name="published_at" value="<?= e($isEdit && $a['published_at'] ? date('Y-m-d\TH:i', strtotime($a['published_at'])) : date('Y-m-d\TH:i')) ?>">
      </label>
    </div>

    <div class="panel">
      <h3>Gambar</h3>
      <label>Pilih dari media
        <input type="text" name="image" id="f-image" list="mediaUrls" value="<?= e($a['image'] ?? '') ?>" placeholder="/media/nama-file.jpg">
      </label>
      <p class="small muted">Unggah file baru di menu 🖼️ Media.</p>
    </div>

    <div class="panel">
      <h3>SEO</h3>
      <div class="serp">
        <div class="serp-url"><?= e(base_url()) ?>/artikel/<?= e($a['slug'] ?? 'slug-artikel') ?></div>
        <div class="serp-title"><?= e($metaTitle !== '' ? $metaTitle : ($a['title'] ?? 'Judul Artikel')) ?></div>
        <div class="serp-desc"><?= e($metaDesc !== '' ? $metaDesc : 'Deskripsi meta akan tampil di sini…') ?></div>
      </div>
      <label>Meta judul
        <input type="text" name="meta_title" maxlength="190" value="<?= e($metaTitle) ?>">
      </label>
      <label>Meta deskripsi
        <textarea name="meta_description" rows="3" maxlength="320"><?= e($metaDesc) ?></textarea>
      </label>
    </div>
  </div>

  <div class="form-foot">
    <button type="submit" class="btn btn-primary btn-big">💾 Simpan &amp; Perbarui Frontend</button>
    <span class="muted small">Menyimpan otomatis membersihkan cache halaman.</span>
  </div>
</form>

<datalist id="mediaUrls">
  <?php foreach (($mediaList ?? []) as $m): ?><option value="/media/<?= e($m['filename']) ?>"><?= e($m['original_name']) ?></option><?php endforeach; ?>
</datalist>
