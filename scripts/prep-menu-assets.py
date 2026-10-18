"""Create browser-sized derivatives of the supplied 4K menu PNG exports.

The inputs are the requested ``assets/4K_upscaled`` files. The output retains
their transparency while avoiding four 3840px downloads for a card grid.
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "The_Hungry_Wrap_NEW_AI_Menu_4K_Assets_and_NextJS_Prompt" / "assets" / "4K_upscaled"
DESTINATION = ROOT / "public" / "images" / "menu"
MAX_EDGE = 1280


def main() -> None:
    DESTINATION.mkdir(parents=True, exist_ok=True)
    for source in sorted(SOURCE.glob("*.png")):
        image = Image.open(source).convert("RGBA")
        # Keep the full composition because a few wraps deliberately touch a
        # canvas edge. This preserves the asset replacement contract exactly.
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        image.save(DESTINATION / source.name, optimize=True)
        print(f"{source.name}: {image.width}x{image.height}")


if __name__ == "__main__":
    main()
