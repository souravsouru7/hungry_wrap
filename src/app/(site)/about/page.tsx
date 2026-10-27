import type { Metadata } from "next";
import Image from "next/image";

import FinalCtaFooter from "@/components/FinalCtaFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ClipReveal from "@/components/motion/ClipReveal";
import ScrollLine from "@/components/motion/ScrollLine";
import Scene3D from "@/components/three/Scene3D";
import { OUR_STORY_ASSETS } from "@/components/hungry-wrap/our-story/assets";
import { NAV_LINKS, ORDER_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About Us | The Story of Hungry Wrap Cafe" },
  description:
    "Learn the story behind Hungry Wrap. We are a local cafe passionate about serving high-quality wraps, quick bites, and daily tea to our community in Kalpetta.",
};

const CHAPTERS = [
  {
    step: "01",
    heading: "Our Food Philosophy",
    body: "At Hungry Wrap, fast food does not mean junk food. Our mission is to serve meals made with clean ingredients, perfectly balanced spices, and a whole lot of care. We partner with local suppliers in Kerala to ensure our produce is crisp and our meats are fresh.",
  },
  {
    step: "02",
    heading: "More Than Just Food",
    body: "We designed Hungry Wrap to be a community staple. Whether you are a student grabbing a quick snack, an office worker relying on our daily tea subscription, or friends meeting up for evening bites, you are treated like family the moment you walk to the counter.",
  },
];

const card =
  "rounded-[1.75rem] bg-white/92 p-7 shadow-[0_24px_50px_-30px_rgba(90,55,20,0.55)] ring-1 ring-white/70 sm:p-10";

export default function AboutPage() {
  const photo = OUR_STORY_ASSETS.restaurant;
  const brush = OUR_STORY_ASSETS.brushUnderline;

  return (
    <main className="flex-1 bg-[#fff9f2]">
      <PageHero
        kicker="About Us"
        title="Our"
        accent="Story"
        lead="Every great cafe starts with a simple craving. For Hungry Wrap, it was the search for the perfect, easy-to-eat meal that does not compromise on flavor or quality. We noticed that finding a truly fresh, satisfying wrap was harder than it should be, so we built a kitchen to make them ourselves."
      />

      {/* The camera flies through a field of fresh ingredients behind the story. */}
      <section id="about-track" className="relative">
        <div className="sticky top-0 -mb-[100svh] h-[100svh]">
          <Scene3D scene="about" track="#about-track" start="top top" end="bottom bottom" className="h-full w-full" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <div className="flex min-h-[90vh] items-center py-16">
            <ClipReveal className="w-full">
              <div className={`${card} !p-3 sm:!p-4`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 1024px) 100vw, 960px"
                  className="h-auto w-full rounded-[1.4rem]"
                />
                <div className="px-4 pt-6 pb-4 text-center">
                  <p className="font-[family-name:var(--font-baloo)] text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-[#211b18]">
                    Built from a simple <span className="relative inline-block text-[#f47514]">
                      craving
                      <Image src={brush.src} alt="" width={brush.width} height={brush.height} className="hw-page-brush absolute -bottom-2 left-0 h-auto w-full" />
                    </span>
                  </p>
                </div>
              </div>
            </ClipReveal>
          </div>

          <div className="relative pb-[20vh] pl-10 sm:pl-16">
            <ScrollLine className="left-3 sm:left-6" />
            {CHAPTERS.map((c) => (
              <div key={c.step} className="flex min-h-[85vh] items-center">
                <Reveal className="w-full max-w-xl">
                  <article className={`${card} relative`}>
                    <span
                      data-reveal
                      aria-hidden
                      className="absolute top-10 -left-[2.65rem] h-5 w-5 rounded-full border-4 border-[#fff9f2] bg-[#f47514] shadow-[0_0_0_6px_rgba(244,117,20,0.18)] sm:-left-[3.6rem]"
                    />
                    <p data-reveal className="font-[family-name:var(--font-baloo)] text-5xl font-extrabold text-[#f47514]/25">
                      {c.step}
                    </p>
                    <h2 data-reveal className="mt-1 font-[family-name:var(--font-baloo)] text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#211b18]">
                      {c.heading}
                    </h2>
                    <p data-reveal className="mt-4 font-[family-name:var(--font-poppins)] leading-relaxed text-[#5b514a]">
                      {c.body}
                    </p>
                  </article>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCtaFooter orderHref={ORDER_HREF} navLinks={NAV_LINKS} />
    </main>
  );
}
