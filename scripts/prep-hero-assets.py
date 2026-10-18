"""Downscale the hero kit PNGs back to their true source resolution.

Every file in the kit was upscaled so its longest edge is 3840px (see
asset_manifest.json), which adds ~43MB of bytes but no detail. This writes
tight, correctly sized RGBA PNGs into public/.
"""
from PIL import Image
import os, sys, json

src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
manifest = json.load(open(os.path.join(src, "asset_manifest.json")))
out = {}
for entry in manifest:
    name = entry["filename"]
    im = Image.open(os.path.join(src, "assets", name)).convert("RGBA")
    w, h = entry["source_size"]
    im = im.resize((w, h), Image.LANCZOS)
    # Kill the near-zero alpha dust so drop shadows stay clean.
    a = im.getchannel("A").point(lambda v: 0 if v < 6 else v)
    im.putalpha(a)
    bb = im.getchannel("A").getbbox()
    if bb:
        im = im.crop(bb)
    p = os.path.join(dst, name)
    im.save(p, optimize=True)
    out[name] = im.size
    print("%-24s %sx%s  %6.0f KB" % (name, im.size[0], im.size[1], os.path.getsize(p)/1024))
json.dump(out, open(os.path.join(dst, "_sizes.json"), "w"), indent=2)
