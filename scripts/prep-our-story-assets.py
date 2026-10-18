"""Prepare the "Our Story" layers for the web.

Reproduces `public/our-story/` from the kit: alpha-crop, then downscale to the
delivery size recorded in `src/components/hungry-wrap/our-story/assets.ts`.

It also fixes one defect in the supplied art. `05_leaf_cluster` and
`06_foreground_blurred_leaves` are blurred *photographs*, not cutouts: their
content runs hard to the left, right and bottom edges of the canvas (mean edge
alpha 91-184 of 255). Placed as foreground foliage they therefore end in a
straight line wherever an edge falls inside the section, which reads as a grey
rectangle sitting over the restaurant photo. Feathering those borders lets the
layer dissolve instead, which is what defocused foreground greenery does.

Usage:

    python scripts/prep-our-story-assets.py

Requires Pillow and numpy.
"""

import json
import os

import numpy as np
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

SRC = "The_Hungry_Wrap_Our_Story_4K_Assets_Prompt/assets"
DST = "public/our-story"

ALPHA_FLOOR = 8

# (file, longest delivery edge). These reproduce the sizes already declared in
# assets.ts, so the component needs no change.
LAYERS = [
    ("01_restaurant_organic_cutout.png", 1920),
    ("02_leaf_top.png", 880),
    ("03_leaf_right.png", 880),
    ("04_leaf_lower.png", 880),
    ("05_leaf_cluster.png", 1120),
    ("06_foreground_blurred_leaves.png", 1120),
    ("07_orange_brush_underline.png", 900),
]

# Layers whose own canvas edge cuts through opaque content.
FEATHER_EDGES = {"05_leaf_cluster.png", "06_foreground_blurred_leaves.png"}

# How far the falloff reaches, as a fraction of the layer's width/height.
FEATHER_FRACTION = 0.14

# An edge is left alone when its content already fades out on its own.
HARD_EDGE_ALPHA = 40


def ramp(length, span):
    """0 -> 1 over `span` px, then flat. Smoothstep, so there is no crease."""
    r = np.ones(length, dtype=np.float32)
    span = max(1, min(span, length))
    t = np.linspace(0.0, 1.0, span, dtype=np.float32)
    r[:span] = t * t * (3.0 - 2.0 * t)
    return r


def feather_borders(im, name):
    """Fade the alpha in from whichever canvas edges cut through the subject."""
    if name not in FEATHER_EDGES:
        return im

    alpha = np.array(im.getchannel("A")).astype(np.float32)
    h, w = alpha.shape
    mask = np.ones((h, w), dtype=np.float32)

    if alpha[:, 0].mean() > HARD_EDGE_ALPHA:
        mask *= ramp(w, int(w * FEATHER_FRACTION))[None, :]
    if alpha[:, -1].mean() > HARD_EDGE_ALPHA:
        mask *= ramp(w, int(w * FEATHER_FRACTION))[::-1][None, :]
    if alpha[0, :].mean() > HARD_EDGE_ALPHA:
        mask *= ramp(h, int(h * FEATHER_FRACTION))[:, None]
    if alpha[-1, :].mean() > HARD_EDGE_ALPHA:
        mask *= ramp(h, int(h * FEATHER_FRACTION))[::-1][:, None]

    im.putalpha(Image.fromarray((alpha * mask).astype(np.uint8)))
    return im


def main():
    os.makedirs(DST, exist_ok=True)
    sizes = {}

    for name, edge in LAYERS:
        im = Image.open(os.path.join(SRC, name)).convert("RGBA")
        im.putalpha(im.getchannel("A").point(lambda v: 0 if v < ALPHA_FLOOR else v))

        before = {
            "left": round(float(np.array(im.getchannel("A"))[:, 0].mean())),
            "right": round(float(np.array(im.getchannel("A"))[:, -1].mean())),
            "bottom": round(float(np.array(im.getchannel("A"))[-1, :].mean())),
        }
        im = feather_borders(im, name)

        box = im.getchannel("A").getbbox()
        if box:
            im = im.crop(box)
        if max(im.size) > edge:
            im.thumbnail((edge, edge), Image.LANCZOS)

        path = os.path.join(DST, name)
        im.save(path, optimize=True)
        sizes[name] = list(im.size)
        note = "  feathered, was L%(left)s R%(right)s B%(bottom)s" % before if name in FEATHER_EDGES else ""
        print("%-36s %4dx%-4d %7.0f KB%s"
              % (name, im.size[0], im.size[1], os.path.getsize(path) / 1024, note))

    with open(os.path.join(DST, "_sizes.json"), "w") as fh:
        json.dump(sizes, fh, indent=2, sort_keys=True)
    print("\nwrote %d layers to %s" % (len(sizes), DST))


if __name__ == "__main__":
    main()
