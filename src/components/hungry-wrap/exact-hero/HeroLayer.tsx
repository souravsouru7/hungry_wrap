import Image from "next/image";
import type { CSSProperties } from "react";

import type { HeroAsset } from "./assets";

type HeroLayerProps = {
  asset: HeroAsset;
  /** Centre point and width, as a percentage of the hero stage. */
  left: number;
  top: number;
  width: number;
  /** Static tilt baked onto the image itself. */
  rotate?: number;
  flip?: boolean;
  z?: number;
  opacity?: number;
  blur?: number;
  /** Continuous float. `bob: false` pins the layer (pedestal, backdrop). */
  bob?: boolean;
  bobY?: number;
  bobRotate?: number;
  duration?: number;
  delay?: number;
  /** `drift` swaps the bob for the slow rotate used by the sauce ribbon. */
  drift?: boolean;
  shadow?: string;
  sizes?: string;
  /** Hidden below `md` to keep the mobile composition uncluttered. */
  desktopOnly?: boolean;
  className?: string;
  /** GSAP entrance targets this wrapper; the inner nodes own the loop. */
  entrance?: string;
};

/**
 * One positioned PNG cutout.
 *
 * Three nested nodes on purpose: the outer div is placed and animated in by
 * GSAP, the middle one runs the CSS float loop, and the image carries the
 * static tilt. Keeping them separate means the entrance tween and the
 * infinite loop never fight over the same `transform`.
 */
export default function HeroLayer({
  asset,
  left,
  top,
  width,
  rotate = 0,
  flip = false,
  z = 10,
  opacity,
  blur,
  bob = true,
  bobY = 10,
  bobRotate = 0,
  duration = 6,
  delay = 0,
  drift = false,
  shadow,
  sizes = "(max-width: 768px) 45vw, 30vw",
  desktopOnly = false,
  className = "",
  entrance = "float",
}: HeroLayerProps) {
  const loopStyle = {
    "--hw-bob-y": `${bobY}px`,
    "--hw-bob-r": `${bobRotate}deg`,
    "--hw-bob-d": `${duration}s`,
    "--hw-bob-delay": `${delay}s`,
  } as CSSProperties;

  return (
    <div
      data-hero-entrance={entrance}
      className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 ${
        desktopOnly ? "hidden md:block" : ""
      } ${className}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        zIndex: z,
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      <div className={drift ? "hw-drift" : bob ? "hw-bob" : ""} style={loopStyle}>
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          draggable={false}
          aria-hidden={asset.alt === "" || undefined}
          className="h-auto w-full select-none"
          style={{
            transform: `rotate(${rotate}deg)${flip ? " scaleX(-1)" : ""}`,
            filter: shadow ? `drop-shadow(${shadow})` : undefined,
          }}
        />
      </div>
    </div>
  );
}
