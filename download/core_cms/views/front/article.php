<?php /** Detail artikel — data: $a */ ?>
<article class="sec shell">
  <div class="container narrow">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="/">Beranda</a> › <a href="/artikel">Artikel</a> › <span><?= e($a['title']) ?></span>
    </nav>
    <span class="cat-chip"><?= e(ucfirst($a['category'])) ?></span>
    <h1 class="post-title"><?= e($a['title']) ?></h1>
    <?php if (!empty($a['image'])): ?>
      <img class="post-img" src="/media/<?= e($a['image']) ?>" alt="<?= e($a['title']) ?>">
    <?php endif; ?>
    <p class="muted post-meta">Dipublikasikan <?= e(fmt_date_id($a['published_at'])) ?></p>
    <div class="post-body">
      <?= $a['content'] ?>
    </div>
    <?php $wa = wa_link(Settings::get('whatsapp'), 'Halo! Saya baca artikel "' . $a['title'] . '" — ingin bertanya lebih lanjut.'); if ($wa !== 'https://wa.me/'): ?>
    <div class="post-cta">
      <a class="btn btn-primary" href="<?= e($wa) ?>" target="_blank" rel="noopener">Tanya Lebih Lanjut via WhatsApp</a>
    </div>
    <?php endif; ?>
  </div>
</article>
