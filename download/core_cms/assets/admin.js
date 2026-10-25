/* JURAGAN CORE CMS — admin.js (vanilla, tanpa dependensi) */
document.addEventListener('DOMContentLoaded', function () {
  // Konfirmasi hapus
  document.querySelectorAll('form[data-confirm]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (!window.confirm(f.getAttribute('data-confirm') || 'Yakin?')) e.preventDefault();
    });
  });

  // Salin path media
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy');
      (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(function () {
        var t = b.textContent; b.textContent = '✔ Tersalin';
        setTimeout(function () { b.textContent = t; }, 1400);
      }).catch(function () {});
    });
  });

  // Pratinjau SERP live (form halaman)
  var title = document.getElementById('f-title');
  var metaT = document.getElementById('f-metataitle');
  var metaD = document.getElementById('f-metadesc');
  if (title && metaT && metaD) {
    var sT = document.getElementById('serp-title');
    var sD = document.getElementById('serp-desc');
    var site = sT ? sT.textContent.split('—').pop().trim() : '';
    var sync = function () {
      if (sT) sT.textContent = metaT.value || (title.value + (site ? ' — ' + site : ''));
      if (sD) sD.textContent = metaD.value || 'Deskripsi meta akan tampil di sini…';
    };
    title.addEventListener('input', sync);
    metaT.addEventListener('input', sync);
    metaD.addEventListener('input', sync);
  }
});
