<?php
/**
 * Beranda — konten section dari halaman "beranda" (diedit via admin)
 * + grid otomatis: Produk, Testimoni, FAQ (dari kategori artikel) + CTA penutup.
 * Data: $page, $products, $testimonials, $faqs
 */
?>
<?= $page['content'] /* section hero, stats, segmen, keunggulan, proses */ ?>

<?php if (!empty($products)): ?>
<section class="sec shell-alt" id="produk">
  <div class="container">
    <p class="eyebrow reveal">Produk Pasir</p>
    <h2 class="reveal">Enam Jenis Pasir, <span class="hl">Satu Standar Mutu</span></h2>
    <p class="section-desc reveal">Setiap jenis pasir punya karakter dan kegunaan teknisnya masing-masing. Semua dikurasi di titik muat: disaring, dibersihkan, dan disertai spesifikasi tertulis.</p>
    <div class="grid grid-3">
      <?php foreach ($products as $p): $link = '/artikel/' . e($p['slug']); ?>
      <article class="card prod reveal">
        <?php if (!empty($p['image'])): ?><img class="prod-img" src="/media/<?= e($p['image']) ?>" alt="<?= e($p['title']) ?>" loading="lazy"><?php endif; ?>
        <h3><a href="<?= $link ?>"><?= e($p['title']) ?></a></h3>
        <p><?= e($p['excerpt']) ?></p>
        <div class="prod-actions">
          <a class="btn btn-small btn-ghost" href="<?= $link ?>">Detail &amp; Spesifikasi</a>
        </div>
      </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if (!empty($testimonials)): ?>
<section class="sec shell" id="testimoni">
  <div class="container">
    <p class="eyebrow reveal">Kata Mereka</p>
    <h2 class="reveal">Kepercayaan yang Terbangun <span class="hl">Ritase demi Ritase</span></h2>
    <p class="section-desc reveal">Rating 4,9/5 dari 1.248 ulasan terverifikasi. Berikut suara asli dari tiap segmen klien kami.</p>
    <div class="grid grid-2">
      <?php foreach ($testimonials as $t): ?>
      <article class="card testi reveal">
        <div class="testi-head">
          <span class="avatar"><?= e(initials_of($t['title'])) ?></span>
          <div><strong><?= e($t['title']) ?></strong><small><?= e($t['excerpt']) ?></small></div>
          <span class="stars" aria-label="Rating 5 dari 5">★★★★★</span>
        </div>
        <?= $t['content'] ?>
      </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if (!empty($faqs)): ?>
<section class="sec shell-alt" id="faq">
  <div class="container narrow">
    <p class="eyebrow reveal">Tanya Jawab</p>
    <h2 class="reveal">Pertanyaan yang <span class="hl">Sering Diajukan</span></h2>
    <p class="section-desc reveal">Belum menemukan jawabannya? Tim kami membalas WhatsApp kerja hari yang sama.</p>
    <div class="faq-list">
      <?php foreach ($faqs as $f): ?>
      <details class="faq reveal">
        <summary><?= e($f['title']) ?></summary>
        <div class="faq-a"><?= $f['content'] ?></div>
      </details>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php $wa = wa_link(Settings::get('whatsapp'), Settings::get('wa_message')); if ($wa !== 'https://wa.me/'): ?>
<section class="sec cta-band" id="penawaran">
  <div class="container cta-inner reveal">
    <div>
      <h2>Siap Pastikan Pasir Proyek Anda <span class="hl">Tidak Pernah Telat?</span></h2>
      <p>Ceritakan kebutuhan Anda hari ini — penawaran tertulis tiba maksimal 1×24 jam.</p>
    </div>
    <a class="btn btn-invert btn-big" href="<?= e($wa) ?>" target="_blank" rel="noopener">Minta Penawaran via WhatsApp</a>
  </div>
</section>
<?php endif; ?>
