<?php /** Daftar artikel — data: $posts */ ?>
<section class="sec shell">
  <div class="container narrow">
    <p class="eyebrow">Informasi</p>
    <h1>Artikel &amp; <span class="hl">Info Terbaru</span></h1>
    <p class="section-desc">Kumpulan tulisan, tips, dan kabar terbaru dari kami.</p>

    <?php if (empty($posts)): ?>
      <p class="muted">Belum ada artikel yang diterbitkan.</p>
    <?php else: ?>
    <div class="grid grid-2">
      <?php foreach ($posts as $p): ?>
      <article class="card post reveal">
        <?php if (!empty($p['image'])): ?><img class="prod-img" src="/media/<?= e($p['image']) ?>" alt="<?= e($p['title']) ?>" loading="lazy"><?php endif; ?>
        <span class="cat-chip"><?= e(ucfirst($p['category'])) ?></span>
        <h3><a href="/artikel/<?= e($p['slug']) ?>"><?= e($p['title']) ?></a></h3>
        <p><?= e($p['excerpt'] !== '' ? $p['excerpt'] : excerpt_of((string)$p['content'], 140)) ?></p>
        <small class="muted"><?= e(fmt_date_id($p['published_at'])) ?></small>
      </article>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
  </div>
</section>
