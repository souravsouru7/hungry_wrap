"""Prepare the "Why Choose Us" kit cutouts for the web.

The kit in `The_Hungry_Wrap_Why_Choose_Us_4K_Assets_Prompt/assets/` ships seven
transparent PNGs that were all upscaled so their longest edge is 3840px (see
`ASSET_MANIFEST.json` and `README_FIRST.md` — they are *not* native 4K, just
enlarged). That costs ~175MB of bytes for no extra detail, and two of the files
(`05_floating_onion`, `06_product_alternate_clean`) are 59MB each. One file,
`04_floating_herbs.png`, is truncated on disk; the decodable top ~69% is all we
need, so `LOAD_TRUNCATED_IMAGES` lets Pillow keep it.

This script writes tight, web-sized RGBA PNGs into `public/why-choose-us/`:

  * the hero wrap, the sauce ribbon and the onion cluster are kept whole,
    alpha-cropped and downscaled;
  * the tomato and herb sheets are *scattered clusters* of many subjects, so
    each is split into its individual blobs and the largest few are exported
    as standalone layers. That lets WhyChooseUs.tsx place one tomato in the
    upper right and single sprigs around the wrap, as the reference does,
    instead of dropping a whole contact sheet onto the canvas.

Usage:

    python scripts/prep-why-choose-us-assets.py \
        The_Hungry_Wrap_Why_Choose_Us_4K_Assets_Prompt/assets public/why-choose-us

Requires Pillow and numpy. Re-run it if the kit is ever re-exported; the
component reads the written sizes back from `_sizes.json`.
"""

import json
import os
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFile, ImageFilter

# `04_floating_herbs.png` is truncated in the kit. Decode what is there.
ImageFile.LOAD_TRUNCATED_IMAGES = True

SRC = sys.argv[1] if len(sys.argv) > 1 else "The_Hungry_Wrap_Why_Choose_Us_4K_Assets_Prompt/assets"
DST = sys.argv[2] if len(sys.argv) > 2 else "public/why-choose-us"

# Alpha below this is extraction dust: it shows up as a grey halo once the
# layer sits on the cream backdrop, and it inflates every bounding box.
ALPHA_FLOOR = 8

# Whole layers: (kit file, output name, longest edge in px).
# The sizes are chosen from how large each layer renders at a 1440px-wide
# viewport, doubled for 2x screens.
# `feather` blurs the alpha channel by that many source pixels before the
# downscale. The main wrap needs it: it was machine-extracted from the
# reference screenshot and the extraction sliced straight polygon edges
# through the subject, which read as hard seams against the cream backdrop.
# Softening the alpha turns those cuts into a short gradient. The decorative
# cutouts came out clean and are left alone.
WHOLE = [
    ("01_main_wrap_reference_cutout.png", "01_main_wrap.png", 1800, 10),
    ("02_sauce_splash.png", "02_sauce_splash.png", 1200, 0),
    ("05_floating_onion.png", "05_onion.png", 700, 0),
]

# Scatter sheets to split: (kit file, output prefix, how many blobs to keep,
# longest edge per blob). `min_frac` drops specks relative to the biggest blob.
SCATTER = [
    ("03_floating_tomatoes.png", "03_tomato", 2, 520, 0.22),
    ("04_floating_herbs.png", "04_herb", 4, 520, 0.12),
]

# Reject slivers: a blob whose short side is under this fraction of its long
# side is a subject the sheet clipped at its own edge, not a whole sprig.
MIN_ASPECT = 0.45

# Blob labelling runs on a mask downscaled to this longest edge — a plain
# Python BFS over 3840x3840 would take minutes, and blob *bounds* are all we
# need; the crop itself is taken from the full-resolution image.
LABEL_EDGE = 480


def load(name):
    """Open a kit PNG as RGBA with the sub-threshold alpha dust removed."""
    im = Image.open(os.path.join(SRC, name)).convert("RGBA")
    alpha = im.getchannel("A").point(lambda v: 0 if v < ALPHA_FLOOR else v)
    im.putalpha(alpha)
    return im


def autocrop(im):
    box = im.getchannel("A").getbbox()
    return im.crop(box) if box else im


def fit(im, edge):
    """Downscale so the longest edge is `edge`. Never upscales."""
    if max(im.size) > edge:
        im.thumbnail((edge, edge), Image.LANCZOS)
    return im


def save(im, name, sizes):
    path = os.path.join(DST, name)
    im.save(path, optimize=True)
    sizes[name] = list(im.size)
    print("%-22s %4dx%-4d %7.0f KB" % (name, im.size[0], im.size[1], os.path.getsize(path) / 1024))


def blob_boxes(mask):
    """Bounding boxes of each 8-connected True region, largest area first.

    `mask` is a small 2D boolean array. Returns boxes in *mask* coordinates.
    """
    h, w = mask.shape
    seen = np.zeros_like(mask)
    boxes = []
    neighbours = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]

    for sy in range(h):
        for sx in range(w):
            if not mask[sy, sx] or seen[sy, sx]:
                continue
            seen[sy, sx] = True
            queue = deque([(sy, sx)])
            top = bottom = sy
            left = right = sx
            area = 0
            while queue:
                y, x = queue.popleft()
                area += 1
                if y < top:
                    top = y
                if y > bottom:
                    bottom = y
                if x < left:
                    left = x
                if x > right:
                    right = x
                for dy, dx in neighbours:
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        queue.append((ny, nx))
            boxes.append((area, left, top, right, bottom))

    boxes.sort(reverse=True)
    return boxes


def split(name, prefix, keep, edge, min_frac, sizes):
    """Export the `keep` largest subjects of a scatter sheet as separate PNGs."""
    im = load(name)
    scale = max(im.size) / LABEL_EDGE
    small = im.getchannel("A").resize(
        (max(1, round(im.width / scale)), max(1, round(im.height / scale))), Image.BILINEAR
    )
    # A slightly generous threshold on the downscaled mask bridges the thin
    # stems of a parsley sprig, so one sprig stays one blob instead of twenty.
    boxes = blob_boxes(np.array(small) > 24)
    if not boxes:
        print("  (no blobs found in %s)" % name)
        return

    biggest = boxes[0][0]
    taken = 0
    for area, left, top, right, bottom in boxes:
        if taken >= keep or area < biggest * min_frac:
            break
        # Back to full-resolution coordinates, with a pixel of slack so the
        # soft edge of the subject is not shaved off.
        box = (
            max(0, int(left * scale) - 2),
            max(0, int(top * scale) - 2),
            min(im.width, int((right + 1) * scale) + 2),
            min(im.height, int((bottom + 1) * scale) + 2),
        )
        piece = autocrop(im.crop(box))
        if min(piece.size) < 8 or min(piece.size) / max(piece.size) < MIN_ASPECT:
            continue
        taken += 1
        save(fit(piece, edge), "%s_%s.png" % (prefix, "abcdefgh"[taken - 1]), sizes)


def main():
    os.makedirs(DST, exist_ok=True)
    sizes = {}

    for src_name, out_name, edge, feather in WHOLE:
        im = load(src_name)
        if feather:
            im.putalpha(im.getchannel("A").filter(ImageFilter.GaussianBlur(feather)))
        save(fit(autocrop(im), edge), out_name, sizes)

    for src_name, prefix, keep, edge, min_frac in SCATTER:
        split(src_name, prefix, keep, edge, min_frac, sizes)

    with open(os.path.join(DST, "_sizes.json"), "w") as fh:
        json.dump(sizes, fh, indent=2, sort_keys=True)
    print("\nwrote %d layers to %s" % (len(sizes), DST))


if __name__ == "__main__":
    main()
