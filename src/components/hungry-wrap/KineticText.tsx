import { SCENES } from "./scenes";

/**
 * The five headlines of the journey, stacked on the same centre point. All of
 * them are real text in the document (so the section reads correctly to
 * assistive tech and to crawlers); the timeline reveals one at a time.
 *
 * Words are wrapped individually so the timeline can stagger them.
 */
export default function KineticText() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center px-5 text-center sm:px-10">
      <div className="relative w-full max-w-[72rem]">
        {SCENES.map((scene, index) => {
          const Heading = index === 0 ? "h1" : "h2";
          return (
            <div
              key={scene.id}
              data-kinetic-line={scene.id}
              className="absolute inset-x-0 top-1/2"
              style={{ transform: "translateY(-50%)", willChange: "transform, opacity" }}
            >
              <p
                data-kinetic-kicker
                className="mb-7 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-[color:var(--hero-accent)] sm:mb-10 sm:text-xs"
              >
                {scene.kicker}
              </p>
              <Heading className="mx-auto max-w-[18ch] text-balance font-display text-[clamp(2.3rem,7.4vw,6.75rem)] uppercase leading-[0.92] tracking-[-0.01em] text-[color:var(--hero-ink)]">
                {scene.headline.split(" ").map((word, wordIndex) => (
                  <span key={`${scene.id}-${wordIndex}`} className="inline-block overflow-hidden align-bottom">
                    <span data-kinetic-word className="inline-block will-change-transform">
                      {word}
                      {wordIndex < scene.headline.split(" ").length - 1 ? " " : ""}
                    </span>
                  </span>
                ))}
              </Heading>
            </div>
          );
        })}
      </div>
    </div>
  );
}
