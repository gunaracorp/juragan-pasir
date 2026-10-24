#!/usr/bin/env python3
"""Unduh gambar hasil image-search (URL dikumpulkan dari output CLI), validasi & optimasi."""
import os, io, json, urllib.request
from PIL import Image

OUT = "/home/z/my-project/public/images"
os.makedirs(OUT, exist_ok=True)
BASE = "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/"

# prefix: list of (hash, ext, w, h, source)
DATA = {
    "pasir-vulkanik": [
        ("7836625ecaa3", "jpg", 1500, 1101, "Shutterstock"),
        ("c1c4482d9bef", "jpg", 1500, 1100, "Shutterstock"),
        ("b62aa226d272", "jpg", 1000, 1500, "Wallpapers"),
        ("bd3be54a34f3", "jpg", 2048, 1363, "Fotoref"),
    ],
    "truk": [
        ("599ad027d1e4", "jpg", 1500, 1101, "Shutterstock"),
        ("34d91f4b103c", "jpg", 1600, 1156, "Dreamstime"),
        ("54371cd1a0a2", "jpg", 1152, 768, "BoomBucket"),
        ("98d4438a0452", "jpg", 1280, 720, "YouTube"),
    ],
    "eksavator": [
        ("087b12f84846", "jpg", 1280, 720, "YouTube"),
        ("96598048e77d", "jpg", 1280, 720, "YouTube"),
        ("e7c88d963b62", "jpg", 1672, 941, "Komatsu"),
        ("33e53aba58e0", "png", 1590, 890, "SANY"),
    ],
    "stokpasir": [
        ("573f173f5570", "jpg", 1300, 956, "Alamy"),
        ("1add8ecc056b", "jpg", 1600, 1290, "Dreamstime"),
        ("ece58ac1eb73", "jpg", 1500, 1102, "Shutterstock"),
        ("db77ac329706", "jpeg", 2200, 1650, "MorningSun"),
    ],
    "galunggung": [
        ("66834b30db8c", "jpg", 1440, 960, "Tiket"),
        ("33f1d4b8a978", "jpg", 1000, 1500, "BeauTraveler"),
        ("5c3e54a6f943", "jpg", 1920, 1080, "Azimuth"),
        ("acd8b97384a8", "jpg", 1200, 800, "Kompas"),
    ],
    "filter": [
        ("fb8da3f5ad69", "jpg", 2016, 1134, "MAKWater"),
        ("9b0ac72c4920", "jpg", 2500, 1875, "Everfilt"),
        ("370162f86714", "jpg", 1280, 948, "MatPools"),
        ("7dd3262288f1", "jpeg", 1200, 675, "Testbook"),
    ],
    "cor": [
        ("9d6b91ec42a3", "jpg", 1300, 1026, "Alamy"),
        ("781f0f31ee07", "jpg", 1280, 720, "YouTube"),
        ("ba005eb43cec", "jpg", 1350, 900, "Sherman"),
        ("58c58176ea0a", "jpg", 1280, 720, "YouTube"),
    ],
    "silika": [
        ("563e2bc62ada", "jpg", 2500, 1667, "lava.gr"),
        ("c693c0660f79", "png", 1000, 1000, "etihadsouq"),
        ("10ada1ec1ef8", "jpg", 1500, 1225, "Shutterstock"),
        ("369278f791a4", "webp", 1000, 1000, "CigarCity"),
    ],
    "toko": [
        ("67d7af6d5ba5", "jpg", 768, 1024, "Ottr"),
        ("6df159a54040", "png", 2500, 1624, "NJGravel"),
        ("55d7c4861a36", "jpg", 1000, 1000, "Yelp"),
        ("85cb7799f7d3", "jpg", 1875, 1875, "BigTex"),
    ],
    "pengolahan": [
        ("aa19ebb59e63", "jpg", 2560, 1920, "GenKinetics"),
        ("e200629d68a8", "jpg", 1280, 768, "MEKA"),
        ("8e27234b6da0", "jpg", 1500, 1099, "Shutterstock"),
        ("5d98bc3052d0", "jpg", 1280, 720, "YouTube"),
    ],
    "genggam": [
        ("15e4db32f5b2", "jpg", 1280, 720, "YouTube"),
        ("e98359c46ac3", "jpg", 2300, 2300, "Leatherology"),
        ("f49936952ef0", "jpg", 1920, 1920, "SallyHansen"),
    ],
}
MAX_PER_CAT = 3
manifest = []
for prefix, items in DATA.items():
    # urutkan: sumber YouTube terakhir, resolusi besar dulu
    items = sorted(items, key=lambda it: (it[4] == "YouTube", -it[2]))
    n = 0
    for h, ext, w, hh, src in items:
        if n >= MAX_PER_CAT: break
        if w < 650: continue
        fname = f"{prefix}-{n+1}.jpg"
        dest = os.path.join(OUT, fname)
        try:
            req = urllib.request.Request(BASE + h + "." + ext, headers={"User-Agent": "Mozilla/5.0"})
            raw = urllib.request.urlopen(req, timeout=60).read()
            im = Image.open(io.BytesIO(raw)).convert("RGB")
            if im.width > 1600:
                im = im.resize((1600, int(im.height * 1600 / im.width)), Image.LANCZOS)
            im.save(dest, "JPEG", quality=82, optimize=True, progressive=True)
            kb = round(os.path.getsize(dest) / 1024)
            manifest.append({"file": fname, "w": im.width, "h": im.height, "kb": kb, "cat": prefix})
            print(f"[OK] {fname} {im.width}x{im.height} {kb}KB")
            n += 1
        except Exception as e:
            print(f"[ERR] {fname} ({h}.{ext}): {e}")
    if n == 0:
        print(f"[WARN] kategori {prefix} kosong")

json.dump(manifest, open("/home/z/my-project/scripts/imgsearch/manifest.json", "w"), indent=1)
print(f"\nTOTAL: {len(manifest)} gambar")
