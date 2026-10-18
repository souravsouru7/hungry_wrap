"""Prepare the 2.5D kit cutouts for the web.

The PNGs shipped in `The_Hungry_Wrap_2_5D_Animation_Kit/assets/` are screenshot
crops of a contact sheet: the transparency checkerboard, the cell frame lines
and the file-name captions are all baked in as opaque pixels, and several files
carry no usable alpha at all. This keys that background out, drops the caption
lettering and frame lines, despills the light fringe left on soft edges,
autocrops and writes clean-alpha PNGs.

    python scripts/clean-kit-assets.py         The_Hungry_Wrap_2_5D_Animation_Kit/assets public/assets/hungry-wrap
    python scripts/remove-wrapper-mark.py public/assets/hungry-wrap/packaged_wrap.png

Requires Pillow and numpy. The output is still only good enough for a preview —
see HERO_PREVIEW_NOTES.md for what has to be reshot before launch.
"""
import sys, os
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SRC, DST = sys.argv[1], sys.argv[2]
os.makedirs(DST, exist_ok=True)

# name: (strip dark caption band?, min blob area as a fraction of the largest blob,
#        drop blobs touching the frame edge?)
PROFILES = {
    "tortilla":        (True,  0.30, True),
    "finished_wrap":   (True,  0.30, True),
    "packaged_wrap":   (True,  0.30, True),
    "lettuce":         (False, 0.08, True),
    "tomato":          (False, 0.04, True),
    "onion":           (False, 0.04, True),
    "grilled_chicken": (False, 0.03, True),
    "sauce":           (False, 0.02, True),
    "herbs":           (False, 0.004, False),
    "spices":          (False, 0.002, False),
    "floating_leaves": (False, 0.004, False),
}

# Some cells in the sheet bleed into their neighbour; crop to the subject first.
PRECROP = {
    "floating_leaves": (168, 0, 476, 520),
}

def is_bg(rgb):
    r, g, b = (rgb[..., i].astype(int) for i in range(3))
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = mx - mn
    return ((mn > 165) & (sat < 30)) | ((mx < 70) & (sat < 26))

def border_flood(mask):
    h, w = mask.shape
    out = np.zeros_like(mask)
    q = deque()
    for y in range(h):
        for x in (0, w - 1):
            if mask[y, x] and not out[y, x]:
                out[y, x] = True; q.append((y, x))
    for x in range(w):
        for y in (0, h - 1):
            if mask[y, x] and not out[y, x]:
                out[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not out[ny, nx]:
                out[ny, nx] = True; q.append((ny, nx))
    return out

def strip_caption_band(a):
    """Trim the dark caption strip baked onto the bottom of a sheet cell."""
    lum = a[..., :3].mean(axis=2)
    rows = lum.mean(axis=1)
    h = a.shape[0]
    n = 0
    while n < h // 4 and rows[h - 1 - n] < 95:
        n += 1
    return a[: h - n - 2] if n else a

def filter_blobs(al, min_frac, drop_edge):
    solid = al > 0.35
    h, w = solid.shape
    lab = np.zeros((h, w), dtype=np.int32)
    areas, touches = [0], [False]
    cur = 0
    for sy in range(h):
        row = solid[sy]
        for sx in range(w):
            if not row[sx] or lab[sy, sx]:
                continue
            cur += 1
            area, touch = 0, False
            q = deque([(sy, sx)])
            lab[sy, sx] = cur
            while q:
                y, x = q.popleft()
                area += 1
                if y in (0, h - 1) or x in (0, w - 1):
                    touch = True
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and solid[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = cur; q.append((ny, nx))
            areas.append(area); touches.append(touch)
    if cur == 0:
        return al
    biggest = max(areas)
    keep = np.zeros(cur + 1, dtype=bool)
    for i in range(1, cur + 1):
        keep[i] = areas[i] >= biggest * min_frac and not (drop_edge and touches[i])
    if not keep.any():
        keep[int(np.argmax(areas))] = True
    mask = (keep[lab] * 255).astype(np.uint8)
    grown = np.array(Image.fromarray(mask, "L").filter(ImageFilter.MaxFilter(5)))
    return al * (grown.astype(float) / 255.0)

def clean(name, pad=10):
    caption, min_frac, drop_edge = PROFILES[name]
    im = Image.open(os.path.join(SRC, name + ".png")).convert("RGBA")
    if name in PRECROP:
        im = im.crop(PRECROP[name])
    a = np.array(im)
    if caption:
        a = strip_caption_band(a)
    rgb, alpha = a[..., :3], a[..., 3].astype(float) / 255.0
    alpha[border_flood(is_bg(rgb))] = 0.0

    soft = Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.8))
    al = np.clip((np.array(soft).astype(float) / 255.0 - 0.35) / 0.5, 0, 1)
    al = filter_blobs(al, min_frac, drop_edge)

    edge = (al > 0.02) & (al < 0.98)
    rgbf = rgb.astype(float)
    with np.errstate(invalid="ignore", divide="ignore"):
        un = (rgbf - (1 - al)[..., None] * 226.0) / np.maximum(al, 0.05)[..., None]
    rgbf[edge] = np.clip(un[edge], 0, 255)

    img = Image.fromarray(np.dstack([rgbf.astype(np.uint8), (al * 255).astype(np.uint8)]), "RGBA")
    box = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if box:
        l, t, r, b = box
        img = img.crop((max(0, l - pad), max(0, t - pad),
                        min(img.width, r + pad), min(img.height, b + pad)))
    out_path = os.path.join(DST, name + ".png")
    img.save(out_path, optimize=True)
    clear = 100 * float((np.array(img.getchannel("A")) < 8).mean())
    print(f"{name:18s} {im.size[0]}x{im.size[1]} -> {img.size[0]}x{img.size[1]}  transparent {clear:.0f}%")

for n in PROFILES:
    clean(n)
