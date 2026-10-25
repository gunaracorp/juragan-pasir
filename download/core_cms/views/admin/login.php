<?php /** Form login — tanpa sidebar (layout menyesuaikan otomatis) */ ?>
<div class="login-wrap">
  <form method="post" action="/admin/login" class="login-card">
    <?= $csrf ?? Auth::csrfField() ?>
    <div class="login-brand"><span class="brand-mark big">JP</span></div>
    <h1>Panel CMS</h1>
    <p class="muted">Masuk untuk mengelola <strong><?= e(Settings::get('site_title')) ?></strong></p>

    <label>Username
      <input type="text" name="username" required autofocus autocomplete="username">
    </label>
    <label>Sandi
      <input type="password" name="password" required autocomplete="current-password">
    </label>
    <button type="submit" class="btn btn-primary btn-block">Masuk</button>
    <a class="muted small" href="/">← Kembali ke situs</a>
  </form>
</div>
