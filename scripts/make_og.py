#!/usr/bin/env python3
"""Buat OG image 1200x630 bernuansa brand zamrud+emas dari foto kawah Galunggung."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
base = Image.open("/home/z/my-project/public/images/galunggung-2.jpg").convert("RGB")
# crop tengah ke rasio 1200x630
r = W / H
cw = base.width
ch = int(base.width / r)
if ch > base.height:
    ch = base.height
    cw = int(base.height * r)
x0 = (base.width - cw) // 2
y0 = max(0, int((base.height - ch) * 0.42))
base = base.crop((x0, y0, x0 + cw, y0 + ch)).resize((W, H), Image.LANCZOS)

# overlay zamrud gelap gradasi agar teks terbaca
ov = Image.new("RGBA", (W, H))
d = ImageDraw.Draw(ov)
for y in range(H):
    t = y / H
    a = int(15 + 165 * t ** 1.6)  # makin bawah makin gelap
    d.line([(0, y), (W, y)], fill=(2, 23, 16, a))
base = Image.alpha_composite(base.convert("RGBA"), ov).convert("RGB")

# strip emas tipis atas
d = ImageDraw.Draw(base)
d.rectangle([0, 0, W, 6], fill=(212, 174, 54))
d.rectangle([0, H - 6, W, H], fill=(189, 151, 38))

def font(path, size):
    return ImageFont.truetype(path, size)

SERIF_B = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SANS_R = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

def center(draw, text, f, y, fill):
    bb = draw.textbbox((0, 0), text, font=f)
    w = bb[2] - bb[0]
    draw.text(((W - w) / 2, y), text, font=f, fill=fill)

# eyebrow dengan dot emas
d = ImageDraw.Draw(base)
center(d, "•  ASLI LERENG GUNUNG GALUNGGUNG — TASIKMALAYA  •", font(SANS_B, 22), 150, (240, 208, 112))
center(d, "JURAGAN PASIR GALUNGGUNG", font(SERIF_B, 84), 215, (255, 255, 255))
center(d, "Pasir Terbaik di Dunia", font(SERIF_B, 62), 330, (240, 208, 112))
center(d, "Pasir vulkanik untuk perseorangan, kontraktor, perusahaan & instansi", font(SANS_R, 26), 445, (235, 235, 230))
center(d, "wa.me/6281316516524  •  kirim ke 34 provinsi", font(SANS_B, 24), 505, (200, 205, 200))

base.save("/home/z/my-project/public/og-image.jpg", "JPEG", quality=85, optimize=True)
print("og-image.jpg OK", base.size)
