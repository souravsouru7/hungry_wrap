"""Prepare the supplied Order CTA cutouts for browser delivery.

The source kit contains 3840px-square transparent exports. They are useful as
master files, but each already has a large transparent border and is much too
heavy for a single responsive CTA. This keeps the supplied artwork intact,
alpha-crops it, and writes a 2x-friendly copy to ``public/order-cta``.

Run from the repository root:

    python scripts/prep-order-cta-assets.py
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "The_Hungry_Wrap_Order_CTA_4K_Assets_Prompt" / "assets"
DESTINATION = ROOT / "public" / "order-cta"

# A 1600px longest edge is enough for the 58vw product stage at 2x while
# avoiding the oversized, screenshot-derived 4K originals in production.
MAX_EDGE = 1600


def prepare(source: Path) -> tuple[Image.Image, tuple[int, int]]:
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        image = image.crop(bbox)
    if max(image.size) > MAX_EDGE:
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
    return image, image.size


def main() -> None:
    DESTINATION.mkdir(parents=True, exist_ok=True)

    for source in sorted(SOURCE.glob("*.png")):
        image, size = prepare(source)
        target = DESTINATION / source.name
        image.save(target, optimize=True)
        print(f"{source.name}: {size[0]}x{size[1]}")


if __name__ == "__main__":
    main()
