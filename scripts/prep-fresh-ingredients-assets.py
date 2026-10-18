"""Prepare the "Fresh Ingredients" layers for the web.

The supplied kit is in worse shape than the other three. Measured coverage of
`assets/` (fraction of the 3840x3840 canvas that is opaque):

    01_tomatoes           20.6%   clean
    02_lettuce            14.4%   clean
    03_grilled_chicken    11.9%   usable, edges a little jagged
    04_signature_sauce     0.6%   EMPTY - the sauce bowl is simply not there
    05_floating_tomatoes  25.3%   torn blob, 35% of it is baked-in backdrop
    06_floating_greens    26.2%   torn blob, 23% baked-in backdrop
    07_cucumber_onion      0.1%   EMPTY - a few stray slivers
    08_top_left_leaf      33.0%   clean
    09_orange_disc           -    clean (translucent by design)

So four of the nine cannot be used as shipped. This script:

  * passes through the five clean/usable files, alpha-cropped and downscaled;
  * peels the baked backdrop off `05` and splits out the individual subjects
    that survive (a tomato wedge, a lettuce frill, a cucumber slice);
  * borrows clean cutouts from `public/assets/hungry-wrap/` - already keyed by
    `scripts/clean-kit-assets.py` - for the onion rings, tomato slices, herb
    leaves and seasoning flecks that `06`/`07` failed to provide.

`06_floating_greens` is deliberately NOT salvaged. Its subject is a grilled
chicken piece whose mid-tones sit in the same cream/tan family as the backdrop
behind it, so keying the backdrop shreds the chicken into lacework. `03` is the
same ingredient, cleanly cut, and the collage uses that instead.

The signature-sauce bowl has no source at all and is drawn as SVG in
FreshIngredientsSection.tsx.

Usage:

    python scripts/prep-fresh-ingredients-assets.py

Requires Pillow and numpy.
"""

import json
import os
from collections import deque

import numpy as np
from PIL import Image, ImageFile, ImageFilter

ImageFile.LOAD_TRUNCATED_IMAGES = True

KIT = "The_Hungry_Wrap_Fresh_Ingredients_4K_Assets_Prompt/assets"
BORROW = "public/assets/hungry-wrap"
DST = "public/fresh-ingredients"

ALPHA_FLOOR = 8

# Output sharpening. The kit art was extracted from a low-resolution concept
# image and enlarged, so it carries far less real detail than its pixel
# dimensions suggest: halving one of these files costs only ~14% of its
# gradient energy, where a genuinely sharp photo loses ~79%. Upscaling cannot
# put detail back, but an unsharp mask restores the local contrast the
# enlargement smeared, which is what reads as "blurry" on screen. Applied
# after the downscale, to RGB only so the alpha edge stays clean.
SHARPEN = (2, 140, 3)  # radius px, percent, threshold

# Smooth gradients band under an unsharp mask, so they opt out.
NO_SHARPEN = {"09_orange_disc.png"}


# (source folder, source file, output name, longest edge, alpha feather).
# `feather` blurs the alpha by that many source pixels before the downscale;
# `03_grilled_chicken` is cut with a jagged, stair-stepped outline that reads
# as torn meat once it is the collage centrepiece, and a few pixels of
# softening settles it without losing the shape.
PASSTHROUGH = [
    (KIT, "01_tomatoes.png", "01_tomatoes.png", 520, 0),
    (KIT, "02_lettuce.png", "02_lettuce.png", 620, 0),
    (KIT, "03_grilled_chicken.png", "03_grilled_chicken.png", 900, 6),
    (KIT, "08_top_left_leaf.png", "08_top_left_leaf.png", 620, 0),
    (KIT, "09_orange_disc.png", "09_orange_disc.png", 1100, 0),
    # Clean keyed cutouts from the 2.5D kit, standing in for the kit files
    # that shipped empty or unusable.
    (BORROW, "onion.png", "13_onion_rings.png", 520, 0),
    (BORROW, "tomato.png", "14_tomato_slices.png", 520, 0),
    (BORROW, "herbs.png", "15_herb_leaves.png", 620, 0),
    (BORROW, "spices.png", "16_spice_flecks.png", 700, 0),
    # Sharper stand-ins for two of the kit's card photos. Despite being ~390px
    # against the kit's ~2000px, these carry far more real detail (measured
    # local contrast at the card's render size: lettuce +47%, chicken +153%),
    # because the kit art is a low-resolution extract blown up. The subject
    # still matches the reference in both cases.
    (BORROW, "lettuce.png", "17_lettuce_sharp.png", 460, 0),
    (BORROW, "grilled_chicken.png", "18_chicken_sharp.png", 520, 0),
]

# Subjects to lift out of the keyed `05`, by descending blob area.
# rank -> (output name, longest edge)
SPLIT_05 = {
    0: ("10_lettuce_frill.png", 460),
    1: ("11_tomato_wedge.png", 460),
    3: ("12_cucumber_slice.png", 420),
}

LABEL_EDGE = 520


def load(folder, name):
    im = Image.open(os.path.join(folder, name)).convert("RGBA")
    im.putalpha(im.getchannel("A").point(lambda v: 0 if v < ALPHA_FLOOR else v))
    return im


def autocrop(im):
    box = im.getchannel("A").getbbox()
    return im.crop(box) if box else im


def fit(im, edge):
    if max(im.size) > edge:
        im.thumbnail((edge, edge), Image.LANCZOS)
    return im


def sharpen(im, name):
    if name in NO_SHARPEN:
        return im
    radius, percent, threshold = SHARPEN
    rgb = im.convert("RGB").filter(
        ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=threshold))
    rgb.putalpha(im.getchannel("A"))
    return rgb


def save(im, name, sizes):
    im = sharpen(im, name)
    path = os.path.join(DST, name)
    im.save(path, optimize=True)
    sizes[name] = list(im.size)
    print("%-24s %4dx%-4d %7.0f KB" % (name, im.size[0], im.size[1], os.path.getsize(path) / 1024))


def is_backdrop(rgb):
    """The cream wash and the orange disc that were composited into `05`."""
    r, g, b = (rgb[..., i].astype(int) for i in range(3))
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = mx - mn
    cream = (mn > 150) & (sat < 90)
    wash = (r > 215) & (g > 120) & (g < 205) & (b < 165) & (sat > 55)
    return cream | wash


def peel(bgmask, outside):
    """Backdrop pixels reachable from the transparent exterior.

    The cutout is a torn blob: its backdrop sits INSIDE the alpha shape, so a
    flood seeded at the canvas border never reaches it. Seeding at the
    transparent exterior and growing inward through backdrop-coloured pixels
    peels it off while leaving pale highlights in the middle of a subject.
    """
    h, w = bgmask.shape
    out = np.zeros_like(bgmask)
    ys, xs = np.nonzero(outside)
    q = deque(zip(ys.tolist(), xs.tolist()))
    while q:
        y, x = q.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and bgmask[ny, nx] and not out[ny, nx]:
                out[ny, nx] = True
                q.append((ny, nx))
    return out


def blob_boxes(mask):
    """Bounding boxes of 8-connected regions, largest area first."""
    h, w = mask.shape
    seen = np.zeros_like(mask)
    res = []
    nb = ((-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1))
    for sy in range(h):
        for sx in range(w):
            if not mask[sy, sx] or seen[sy, sx]:
                continue
            seen[sy, sx] = True
            q = deque([(sy, sx)])
            top = bot = sy
            left = right = sx
            area = 0
            while q:
                y, x = q.popleft()
                area += 1
                top = min(top, y); bot = max(bot, y)
                left = min(left, x); right = max(right, x)
                for dy, dx in nb:
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        q.append((ny, nx))
            res.append((area, left, top, right, bot))
    res.sort(reverse=True)
    return res


def split_floating_tomatoes(sizes):
    im = load(KIT, "05_floating_tomatoes.png")
    rgb = np.array(im.convert("RGB"))
    alpha = np.array(im.getchannel("A"))

    kept = alpha.copy()
    kept[peel(is_backdrop(rgb) & (alpha > 40), alpha <= 40)] = 0
    kept[kept < 12] = 0
    im.putalpha(Image.fromarray(kept))
    print("  05: backdrop peeled, %.1f%% -> %.1f%% opaque"
          % (100 * (alpha > 200).mean(), 100 * (kept > 200).mean()))

    scale = max(im.size) / LABEL_EDGE
    small = Image.fromarray(kept).resize(
        (round(im.width / scale), round(im.height / scale)), Image.BILINEAR)

    for rank, box in enumerate(blob_boxes(np.array(small) > 40)):
        if rank not in SPLIT_05:
            continue
        name, edge = SPLIT_05[rank]
        _, left, top, right, bot = box
        piece = autocrop(im.crop((
            max(0, int(left * scale) - 3),
            max(0, int(top * scale) - 3),
            min(im.width, int((right + 1) * scale) + 3),
            min(im.height, int((bot + 1) * scale) + 3),
        )))
        save(fit(piece, edge), name, sizes)


def main():
    os.makedirs(DST, exist_ok=True)
    sizes = {}
    for folder, src, out, edge, feather in PASSTHROUGH:
        im = load(folder, src)
        if feather:
            im.putalpha(im.getchannel("A").filter(ImageFilter.GaussianBlur(feather)))
        save(fit(autocrop(im), edge), out, sizes)
    split_floating_tomatoes(sizes)

    with open(os.path.join(DST, "_sizes.json"), "w") as fh:
        json.dump(sizes, fh, indent=2, sort_keys=True)
    print("\nwrote %d layers to %s" % (len(sizes), DST))


if __name__ == "__main__":
    main()
