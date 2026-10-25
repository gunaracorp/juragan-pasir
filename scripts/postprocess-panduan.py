#!/usr/bin/env python3
"""Post-process panduan-cpanel.pdf:
1. Stamp page numbers (skip cover p1 & ending p19; body = 1..17, bottom-center)
2. Set complete PDF metadata
"""
import io
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas

SRC = '/home/z/my-project/scripts/panduan-cpanel.pdf'
OUT = '/home/z/my-project/scripts/panduan-cpanel-final.pdf'

reader = PdfReader(SRC)
writer = PdfWriter()
n = len(reader.pages)

for i, page in enumerate(reader.pages):
    w = float(page.mediabox.width)
    h = float(page.mediabox.height)
    is_cover = (i == 0)
    is_ending = (i == n - 1)
    if not is_cover and not is_ending:
        body_num = i  # page2 -> 1, page3 -> 2, ...
        buf = io.BytesIO()
        c = canvas.Canvas(buf, pagesize=(w, h))
        c.setFont('Helvetica', 8.5)
        c.setFillColorRGB(0x5A / 255, 0x6B / 255, 0x5E / 255)
        c.drawCentredString(w / 2, 16, str(body_num))
        c.save()
        buf.seek(0)
        overlay = PdfReader(buf).pages[0]
        page.merge_page(overlay)
    writer.add_page(page)

writer.add_metadata({
    '/Title': 'Panduan Lengkap Deploy cPanel — Dari Nol ke Website Online',
    '/Author': 'Z.ai',
    '/Subject': 'Tutorial deploy cPanel dari hulu ke hilir untuk pemula — JURAGAN CORE CMS. Tema oleh PT Digital Bisnis Manajemen (digiman.id).',
    '/Creator': 'JURAGAN CORE CMS · Creative Flow Pipeline',
    '/Producer': 'Playwright + Paged.js',
})

with open(OUT, 'wb') as f:
    writer.write(f)

print(f'OK: {n} pages processed -> {OUT}')
print('Cover & ending tanpa nomor; body pages 2-18 bernomor 1-17.')
