/* JURAGAN PASIR — main.js (vanilla, tanpa framework, tanpa build)
   Animasi: reveal on scroll, counter angka, header sticky, menu mobile.
   Menghormati prefers-reduced-motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header sticky state ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reveals.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Counter angka (statistik) ---------- */
  function animateCount(el) {
    var raw = el.getAttribute('data-count') || '0';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var target = parseFloat(raw.replace(',', '.'));
    if (isNaN(target)) return;
    var dur = 1600;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      var val = target * eased;
      var text = decimals > 0
        ? val.toFixed(decimals).replace('.', ',')
        : Math.round(val).toLocaleString('id-ID');
      el.textContent = text + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    if (reduce) {
      el.textContent = (decimals > 0 ? target.toFixed(decimals).replace('.', ',')
        : target.toLocaleString('id-ID')) + suffix;
      return;
    }
    requestAnimationFrame(frame);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            animateCount(en.target);
            io2.unobserve(en.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { io2.observe(el); });
    }
  }
})();
