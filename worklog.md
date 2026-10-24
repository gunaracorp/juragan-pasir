---
Task ID: redesign-total-1
Agent: Main agent (Z.ai)
Task: Total redesign CSS website Juragan Pasir mengikuti bahasa desain referensi gunara.web.id (pusatperizinan.com) milik pemilik yang sama (nomor WA identik +62 813-1651-6524).

Work Log:
- Analisis referensi visual via agent-browser screenshot gunara.web.id: zamrud gelap (#03231B–#163520), emas (#BD9726–#D4AE36), krem (#FBF9F2), judul serif (Playfair-style) dengan italic emas, kartu kaca ber-border emas, CTA pill emas, garis diagonal halus, cincin dekoratif.
- Sampling warna persis dari screenshot referensi via Python/PIL (scripts/sample_colors.py).
- REWRITE TOTAL globals.css: token warna night-*/gold-*/cream-*/ink-*/line/wa, remap token shadcn (:root), utility baru: font-display, text-gold-bright/deep, diagonal-lines, sand-dots, gold-divider, glass-card, shadow-soft/lift, gold-particle.
- FIX BUG KRITIS: rule lama `.grain-texture > * { position: relative }` menimpa utilitas `.absolute` Tailwind sehingga semua layer dekoratif menumpuk (hero jadi 2891px & konten tak terlihat). Diganti hanya `z-index: 1`.
- layout.tsx: tambah Playfair_Display (normal+italic) sebagai --font-playfair; themeColor #03231b.
- Komponen di-rewrite total: logo (lencana emas + siluet gundukan + bintang), icon.svg, header (gelap sticky glass + CTA pill emas "Konsultasi Gratis"), hero (rata kiri, serif + italic emas, kartu kaca "Garansi Mutu" + mini card 12.480+), stats (tile gelap angka serif emas + CountUp), section-heading (pill eyebrow + serif + gold-divider), products, calculator, segments, why-us, process (medali bernomor emas), coverage, testimonials, faq, footer, whatsapp-float (pill putih "Chat WhatsApp" + lingkaran hijau).
- quote-form.tsx: KIRIM LANGSUNG WHATSAPP — submit menyusun pesan rapi (nama, no, tipe klien, jenis pasir, volume, kota, catatan) lalu window.open(`https://wa.me/6281316516524?text=...`). Hapus kirim ke /api/quote. FIX nomor telpon salah yang hardcoded (0812-2000-8000 → SITE.phone +62 813-1651-6524).
- calculator.tsx: perbaikan format estimasi biaya ("Rp 811 – 953 ribu" bukan "Rp 1 rb – 1 rb").
- Verifikasi end-to-end via agent-browser: screenshot semua section desktop + mobile (390px), test submit form (URL wa.me ter-generate benar), tsc --noEmit bersih untuk src/, dev server 200 OK.

Stage Summary:
- Website Juragan Pasir kini memakai bahasa desain "kelas dunia" identik dengan brand keluarga gunara.web.id: zamrud gelap + emas + krem + serif Playfair.
- Konversi WhatsApp berfungsi: form → wa.me/6281316516524 dengan pesan terstruktur; nomor konsisten di header CTA, form, footer, float.
- Semua SEO (metadata, JSON-LD, sitemap, robots) dari iterasi sebelumnya tetap utuh.
- File terubah: globals.css, layout.tsx, icon.svg, 17 komponen juragan/*, (kalkulator & form patch lanjutan).
