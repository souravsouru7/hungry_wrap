/**
 * The organic divider that parts one section from the one above it.
 *
 * The wave is painted in the *incoming* section's own background colour, so
 * it genuinely covers the bottom edge of the section above rather than
 * drawing a stripe of some third colour between them. That is what went
 * wrong on the Order CTA, whose wave was filled pure white against a cream
 * neighbour and read as a hard white band.
 *
 * The soft shadow cast upward out of the curve is what gives the seam its
 * depth: the section reads as a panel laid over the one above, instead of two
 * flat blocks meeting at a line.
 */
type SectionWaveProps = {
  /** The section's own background colour. */
  fill: string;
  /** `dip` falls away from the left, `rise` lifts into it. */
  variant?: "dip" | "rise";
  /** Tailwind height utility; defaults to a responsive clamp. */
  className?: string;
};

const PATHS = {
  dip: "M0 0H2048V27C1688 150 1302 6 962 91C600 181 257 55 0 124V0Z",
  rise: "M0 0H2048V118C1796 48 1444 164 1102 86C762 9 346 150 0 31V0Z",
} as const;

export default function SectionWave({ fill, variant = "dip", className = "" }: SectionWaveProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 2048 150"
      preserveAspectRatio="none"
      className={`hw-section-wave pointer-events-none absolute inset-x-0 top-0 z-[2] w-full ${
        className || "h-[clamp(2.25rem,4vw,5rem)]"
      }`}
    >
      <path d={PATHS[variant]} fill={fill} />
    </svg>
  );
}
