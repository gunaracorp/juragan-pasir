<?php /** Pengaturan — data: $s (seluruh settings) */ ?>
<header class="admin-head">
  <h1>Pengaturan</h1>
  <p class="muted">Identitas situs, kontak (dipakai tombol WhatsApp otomatis), dan saklar SEO.</p>
</header>

<form method="post" action="/admin/settings/save" class="form-grid">
  <?= Auth::csrfField() ?>

  <div class="form-col-main">
    <div class="panel">
      <h3>Identitas</h3>
      <label>Nama situs
        <input type="text" name="site_title" value="<?= e($s['site_title']) ?>" required>
      </label>
      <label>Tagline
        <input type="text" name="tagline" value="<?= e($s['tagline']) ?>">
      </label>
      <label>Tentang footer
        <textarea name="footer_about" rows="3"><?= e($s['footer_about']) ?></textarea>
      </label>
      <label>Teks hak cipta
        <input type="text" name="footer_text" value="<?= e($s['footer_text']) ?>">
      </label>
    </div>

    <div class="panel">
      <h3>Kontak &amp; WhatsApp</h3>
      <label>Nomor WhatsApp (format 62…, tanpa +)
        <input type="text" name="whatsapp" value="<?= e($s['whatsapp']) ?>" placeholder="6281316516524">
      </label>
      <label>Pesan WhatsApp bawaan
        <textarea name="wa_message" rows="2"><?= e($s['wa_message']) ?></textarea>
      </label>
      <label>Telepon
        <input type="text" name="phone" value="<?= e($s['phone']) ?>">
      </label>
      <label>Email
        <input type="email" name="email" value="<?= e($s['email']) ?>">
      </label>
      <label>Jam operasional
        <input type="text" name="hours" value="<?= e($s['hours']) ?>">
      </label>
    </div>

    <div class="panel">
      <h3>Alamat (untuk JSON-LD LocalBusiness)</h3>
      <label>Jalan
        <input type="text" name="street" value="<?= e($s['street']) ?>">
      </label>
      <div class="row-2">
        <label>Kota<input type="text" name="city" value="<?= e($s['city']) ?>"></label>
        <label>Provinsi<input type="text" name="region" value="<?= e($s['region']) ?>"></label>
      </div>
      <div class="row-2">
        <label>Kode pos<input type="text" name="postal" value="<?= e($s['postal']) ?>"></label>
        <label>Latitude<input type="text" name="lat" value="<?= e($s['lat']) ?>"></label>
      </div>
      <label>Longitude<input type="text" name="lng" value="<?= e($s['lng']) ?>"></label>
    </div>
  </div>

  <div class="form-col-side">
    <div class="panel">
      <h3>SEO Global</h3>
      <label>Meta judul situs
        <input type="text" name="meta_title" maxlength="190" value="<?= e($s['meta_title']) ?>">
      </label>
      <label>Meta deskripsi situs
        <textarea name="meta_description" rows="4" maxlength="320"><?= e($s['meta_description']) ?></textarea>
      </label>
      <label>Gambar OG bawaan (URL)
        <input type="text" name="og_image" value="<?= e($s['og_image']) ?>">
      </label>
      <label class="check"><input type="checkbox" name="ld_localbusiness" value="1" <?= $s['ld_localbusiness'] === '1' ? 'checked' : '' ?>> Sisipkan JSON-LD LocalBusiness</label>
      <label class="check"><input type="checkbox" name="ld_faq" value="1" <?= $s['ld_faq'] === '1' ? 'checked' : '' ?>> Sisipkan JSON-LD FAQPage (dari kategori faq)</label>
    </div>

    <div class="panel">
      <h3>Tambahan</h3>
      <label class="check"><input type="checkbox" name="wa_float" value="1" <?= $s['wa_float'] === '1' ? 'checked' : '' ?>> Tombol WhatsApp melayang</label>
      <label>Kode head pihak ketiga (mis. Google Analytics)
        <textarea name="ga_head" rows="5" class="mono"><?= e($s['ga_head']) ?></textarea>
      </label>
      <p class="small muted">⚠️ Kode di sini dimasukkan mentah ke &lt;head&gt;. Isi hanya dari layanan yang Anda percaya.</p>
    </div>
  </div>

  <div class="form-foot">
    <button type="submit" class="btn btn-primary btn-big">💾 Simpan Pengaturan</button>
  </div>
</form>
