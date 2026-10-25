<?php
/**
 * Form halaman — data: $page (null saat baru), $mediaList
 * Ada pratinjau SERP (hasil Google) yang terupdate via admin.js.
 */
$isEdit = $page !== null;
$action = '/admin/pages/save';
$metaTitle = $page['meta_title'] ?? '';
$metaDesc  = $page['meta_description'] ?? '';
$slugForPreview = $page['slug'] ?? 'nama-halaman';
?>
<header class="admin-head row-between">
  <div><h1><?= $isEdit ? 'Edit Halaman' : 'Halaman Baru' ?></h1>
  <p class="muted">Konten mendukung HTML penuh. Gunakan class section tema (<code>sec</code>, <code>grid grid-3</code>, <code>card</code>) agar tampil rapi.</p></div>
  <a class="btn btn-ghost" href="/admin/pages">← Kembali</a>
</header>

<form method="post" action="<?= $action ?>" class="form-grid">
  <?= Auth::csrfField() ?>
  <input type="hidden" name="id" value="<?= $isEdit ? (int)$page['id'] : '' ?>">

  <div class="form-col-main">
    <label>Judul <span class="req">*</span>
      <input type="text" name="title" id="f-title" required value="<?= e($page['title'] ?? '') ?>" data-slug-source>
    </label>
    <label>Slug (URL) — kosongkan untuk otomatis
      <input type="text" name="slug" value="<?= e($page['slug'] ?? '') ?>" placeholder="otomatis-dari-judul">
    </label>
    <label>Konten (HTML)
      <textarea name="content" rows="22" class="mono"><?= e($page['content'] ?? '') ?></textarea>
    </label>
  </div>

  <div class="form-col-side">
    <div class="panel">
      <h3>Publikasi</h3>
      <label class="check"><input type="checkbox" name="is_published" value="1" <?= !$isEdit || $page['is_published'] ? 'checked' : '' ?>> Tayangkan</label>
      <label class="check"><input type="checkbox" name="is_home" value="1" <?= $isEdit && $page['is_home'] ? 'checked' : '' ?>> Jadikan beranda (menonaktifkan beranda lain)</label>
      <label>Urutan menu
        <input type="number" name="sort_order" value="<?= (int)($page['sort_order'] ?? 0) ?>">
      </label>
    </div>

    <div class="panel">
      <h3>SEO</h3>
      <div class="serp" id="serp">
        <div class="serp-url"><?= e(base_url()) ?>/<?= e($slugForPreview) ?></div>
        <div class="serp-title" id="serp-title"><?= e($metaTitle !== '' ? $metaTitle : ($page['title'] ?? 'Judul Halaman')) ?></div>
        <div class="serp-desc" id="serp-desc"><?= e($metaDesc !== '' ? $metaDesc : 'Deskripsi meta akan tampil di sini…') ?></div>
      </div>
      <label>Meta judul (maks 60 karakter ideal)
        <input type="text" name="meta_title" id="f-metataitle" maxlength="190" value="<?= e($metaTitle) ?>">
      </label>
      <label>Meta deskripsi (maks 155 karakter ideal)
        <textarea name="meta_description" id="f-metadesc" rows="3" maxlength="320"><?= e($metaDesc) ?></textarea>
      </label>
      <label>Gambar OG (URL)
        <input type="text" name="og_image" id="f-og" list="mediaUrls" value="<?= e($page['og_image'] ?? '') ?>" placeholder="pilih dari media tersimpan">
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
