"""Remove the garbled, AI-generated brand mark printed on the takeaway paper in
packaged_wrap.png — it is not The Hungry Wrap's logo and must not ship. The
region is smudged down to flat paper tone and a little grain is added back.

    python scripts/remove-wrapper-mark.py public/assets/hungry-wrap/packaged_wrap.png

Run this after clean-kit-assets.py, which regenerates the file.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

p = sys.argv[1]
im = Image.open(p).convert("RGBA")
rgb = im.convert("RGB")
a = np.array(im).astype(float)

x0, x1, y0, y1 = 88, 310, 110, 275
region = rgb.crop((x0, y0, x1, y1))
# two median passes wipe the thin printed strokes but keep the paper's shading
smooth = region.filter(ImageFilter.MedianFilter(9)).filter(ImageFilter.MedianFilter(9))
smooth = smooth.filter(ImageFilter.GaussianBlur(2.0))
sm = np.array(smooth).astype(float)

rng = np.random.default_rng(7)
sm += rng.normal(0, 2.4, sm.shape)          # paper grain back in
sm = np.clip(sm, 0, 255)

m = np.zeros((y1 - y0, x1 - x0), dtype=np.uint8)
m[6:-6, 6:-6] = 255
m = np.array(Image.fromarray(m, "L").filter(ImageFilter.GaussianBlur(7))).astype(float) / 255.0

dst = a[y0:y1, x0:x1]
dst[..., :3] = dst[..., :3] * (1 - m[..., None]) + sm * m[..., None]
Image.fromarray(a.astype(np.uint8), "RGBA").save(p, optimize=True)
print("patched")
