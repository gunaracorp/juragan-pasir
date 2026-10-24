"""Sample exact colors from reference screenshots (gunara.web.id)."""
from PIL import Image

def px(path, points, label):
    img = Image.open(path).convert("RGB")
    print(f"\n=== {label} ({img.size[0]}x{img.size[1]}) ===")
    for name, (x, y) in points.items():
        if x < img.size[0] and y < img.size[1]:
            r, g, b = img.getpixel((x, y))
            print(f"  {name:28s} ({x:4d},{y:4d}) = #{r:02X}{g:02X}{b:02X}")

# ref2.png — hero dark section
px("/home/z/my-project/scripts/ref2.png", {
    "hero bg top-left":        (30, 120),
    "hero bg mid":             (400, 120),
    "hero bg right":           (1200, 100),
    "hero bg deep":            (300, 500),
    "headline white":          (100, 230),
    "headline gold 'Standar'": (300, 290),
    "badge bg":                (200, 145),
    "badge gold dot":          (55, 146),
    "body text muted":         (100, 392),
    "card bg (ISO glass)":     (1050, 340),
    "card gold border":        (863, 340),
    "wa green circle":         (1232, 497),
    "topbar bg":               (600, 36),
    "logo badge gold":         (51, 36),
    "cta gold btn":            (1170, 36),
}, "ref2 HERO")

# ref3.png — stats cards on dark
px("/home/z/my-project/scripts/ref3.png", {
    "dark bg":                 (640, 100),
    "gold number":             (180, 533),
    "card bg":                 (180, 470),
    "icon circle":             (180, 470),
    "label caps":              (180, 561),
}, "ref3 STATS")

# ref4.png — light section cards
px("/home/z/my-project/scripts/ref4.png", {
    "cream bg":                (640, 470),
    "white card":              (200, 300),
    "card title serif":        (150, 328),
    "icon sq dark green":      (86, 268),
    "icon gold glyph":         (86, 268),
    "body text gray":          (200, 370),
    "card border/shadow edge": (33, 300),
}, "ref4 LIGHT CARDS")
