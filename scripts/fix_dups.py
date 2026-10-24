#!/usr/bin/env python3
"""Ganti 5 gambar duplikat dengan kandidat alternatif."""
import os, io, hashlib, urllib.request
from PIL import Image

OUT = "/home/z/my-project/public/images"
BASE = "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/"

REPL = [
    ("pasir-vulkanik-3.jpg", "b62aa226d272.jpg"),
    ("truk-2.jpg", "98d4438a0452.jpg"),
    ("stokpasir-3.jpg", "573f173f5570.jpg"),
    ("silika-2.jpg", "369278f791a4.webp"),
    ("pengolahan-2.jpg", "5d98bc3052d0.jpg"),
]

for fname, src in REPL:
    dest = os.path.join(OUT, fname)
    if os.path.exists(dest):
        os.remove(dest)
    req = urllib.request.Request(BASE + src, headers={"User-Agent": "Mozilla/5.0"})
    raw = urllib.request.urlopen(req, timeout=60).read()
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    if im.width > 1600:
        im = im.resize((1600, int(im.height * 1600 / im.width)), Image.LANCZOS)
    im.save(dest, "JPEG", quality=82, optimize=True, progressive=True)
    print(f"[OK] {fname} <- {src} {im.width}x{im.height} {round(os.path.getsize(dest)/1024)}KB")

# verifikasi akhir
seen, dups, total = {}, [], 0
for f in sorted(os.listdir(OUT)):
    if not f.endswith(".jpg"): continue
    total += 1
    h = hashlib.md5(open(os.path.join(OUT, f), "rb").read()).hexdigest()
    if h in seen: dups.append((f, seen[h]))
    else: seen[h] = f
print(f"\nTOTAL: {total} gambar | DUP: {dups}")
