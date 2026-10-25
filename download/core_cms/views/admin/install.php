<?php
/**
 * Halaman installer — data: $locked, $result (hasil aksi), $csrf, $tenant
 * Mode 1 (belum terkunci): instalasi awal. Mode 2 (terkunci): tambah tenant.
 * Dokumen mandiri — tidak memakai layout admin (DB mungkin belum siap).
 */
$ok = is_array($result) && !empty($result['ok']);
$flash = flash_take();
?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Installer · Core CMS</title>
<meta name="robots" content="noindex, nofollow">
<link rel="stylesheet" href="/assets/admin.css">
</head>
<body class="admin">
<div class="admin-main" style="margin-left:0">
  <?php if ($flash): ?><div class="flash flash-<?= e($flash['type']) ?>"><?= e($flash['msg']) ?></div><?php endif; ?>

  <div class="install-wrap">
    <div class="install-card">
      <div class="login-brand"><span class="brand-mark big">JP</span></div>
      <h1>Core CMS — Installer</h1>
      <p class="muted">Tenant aktif: <strong><?= e($tenant['host']) ?></strong> (prefiks <code><?= e($tenant['prefix']) ?></code>)</p>

      <?php if ($ok): ?>
        <div class="flash flash-ok">
          <strong>Berhasil!</strong>
          <ul class="small"><?php foreach ($result['messages'] as $m): ?><li><?= e($m) ?></li><?php endforeach; ?></ul>
        </div>
        <p><a class="btn btn-primary" href="/admin">→ Buka Panel Admin</a></p>
        <p class="small muted">Catatan keamanan: biarkan <code>storage/install.lock</code> tetap ada, dan pastikan folder core berada di luar <code>public_html</code>.</p>
      <?php else: ?>
        <?php if (is_array($result)): ?>
          <div class="flash flash-err"><strong>Gagal:</strong>
            <ul class="small"><?php foreach ($result['errors'] as $er): ?><li><?= e($er) ?></li><?php endforeach; ?></ul>
            <?php if (!empty($result['messages'])): ?><ul class="small"><?php foreach ($result['messages'] as $m): ?><li>✅ <?= e($m) ?></li><?php endforeach; ?></ul><?php endif; ?>
          </div>
        <?php endif; ?>

        <?php if (!$locked): ?>
          <h2>Langkah 1 · Instalasi Awal</h2>
          <p class="small muted">Isi kredensial database dari cPanel → MySQL® Databases. Driver MySQL untuk produksi; SQLite hanya untuk uji lokal.</p>
          <form method="post" action="/install" class="form-plain">
            <?= $csrf ?>
            <label>Driver database
              <select name="driver"><option value="mysql">MySQL (cPanel produksi)</option><option value="sqlite">SQLite (lokal/dev)</option></select>
            </label>
            <div class="row-2">
              <label>Host MySQL<input type="text" name="db_host" value="localhost"></label>
              <label>Nama database<input type="text" name="db_name" placeholder="user_cms"></label>
            </div>
            <div class="row-2">
              <label>User MySQL<input type="text" name="db_user"></label>
              <label>Sandi MySQL<input type="password" name="db_pass"></label>
            </div>
            <div class="row-2">
              <label>Nama situs (tenant)<input type="text" name="site_title" value="Juragan Pasir Galunggung"></label>
              <label>Prefiks tabel<input type="text" name="prefix" value="t1_" pattern="[a-z][a-z0-9]*_"></label>
            </div>
            <div class="row-2">
              <label>Username admin<input type="text" name="admin_user" required></label>
              <label>Sandi admin (min. 8)<input type="password" name="admin_pass" required minlength="8"></label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">🚀 Pasang Sekarang</button>
          </form>
        <?php else: ?>
          <h2>Tambah Tenant Baru</h2>
          <p class="small muted">Sistem sudah terpasang. Mode ini membuat tabel + akun admin + seed untuk prefiks baru. Domain baru nantinya didaftarkan di <code>config/tenants.php</code>.</p>
          <form method="post" action="/install" class="form-plain">
            <?= $csrf ?>
            <div class="row-2">
              <label>Nama tenant baru<input type="text" name="tenant_name" required></label>
              <label>Prefiks tabel baru<input type="text" name="prefix" placeholder="t2_" pattern="[a-z][a-z0-9]*_" required></label>
            </div>
            <div class="row-2">
              <label>Username admin yang ada<input type="text" name="admin_user" required></label>
              <label>Sandi admin yang ada<input type="password" name="admin_pass" required></label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">➕ Buat Tenant</button>
          </form>
        <?php endif; ?>
      <?php endif; ?>
    </div>
  </div>
</div>
</body>
</html>
