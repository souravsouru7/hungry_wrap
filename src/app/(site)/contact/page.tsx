import type { Metadata } from "next";

import ContactForm from "@/components/contact/ContactForm";
import FinalCtaFooter from "@/components/FinalCtaFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import SceneFrame from "@/components/three/SceneFrame";
import { HERO_ASSETS } from "@/components/hungry-wrap/exact-hero/assets";
import { NAV_LINKS, ORDER_HREF, SITE, TEL_HREF, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Contact Us | Location, Hours & Delivery | The Hungry Wrap Nagpur" },
  description:
    "Find The Hungry Wrap near Vasudev Nagar Metro Station, Hingna Road, Nagpur. See opening hours and order on Swiggy or Zomato. Fresh wraps made to order!",
};

const link = "underline decoration-[#f47514] decoration-2 underline-offset-4 transition-colors hover:text-[#f47514]";
const h2 = "font-[family-name:var(--font-baloo)] text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold tracking-tight text-[#211b18]";
const card = "rounded-3xl bg-white p-7 shadow-[0_18px_36px_-24px_rgba(90,55,20,0.45)] sm:p-8";

export default function ContactPage() {
  return (
    <main className="flex-1 bg-[#fff9f2]" style={{ "--hw-page-bg": "#fff9f2" } as React.CSSProperties}>
      <PageHero
        title="Contact"
        accent="Hungry Wrap"
        lead="We would love to hear from you! Whether you want to place a large order, ask a question, or give us feedback, here is how you can reach us."
      />

      <section id="contact-track" className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-2 lg:gap-12">
        {/* The pin drops onto the cafe; scrolling tilts the map into view. */}
        <SceneFrame
          scene="contact"
          track="#contact-track"
          start="top 80%"
          end="bottom 60%"
          fallback={{ ...HERO_ASSETS.blob }}
        />

        <div className="space-y-8 font-[family-name:var(--font-poppins)] text-[#5b514a]">
          <Reveal>
            <TiltCard className="rounded-3xl" max={5}>
              <section data-reveal className={card}>
                <h2 className={h2}>Visit Our Cafe</h2>
                <p className="mt-3">
                  <strong className="text-[#211b18]">Address:</strong> {SITE.address}
                </p>
                <p className="mt-2">
                  <a className={link} href={SITE.links.maps} target="_blank" rel="noopener noreferrer">
                    Get directions on Google Maps
                  </a>
                </p>
                <h3 className="mt-5 font-semibold text-[#211b18]">Opening Hours</h3>
                <ul className="mt-2 space-y-1.5">
                  {SITE.hours.map((h) => (
                    <li key={h.days} className="flex justify-between gap-4 rounded-xl bg-[#fff9f2] px-4 py-2">
                      <span>{h.days}</span>
                      <span className="font-semibold text-[#211b18]">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </TiltCard>
          </Reveal>

          <Reveal>
            <TiltCard className="rounded-3xl" max={5}>
              <section data-reveal className={card}>
                <h2 className={h2}>Get in Touch</h2>
                <ul className="mt-3 space-y-2">
                  <li>
                    <strong className="text-[#211b18]">Call / WhatsApp:</strong>{" "}
                    <a className={link} href={TEL_HREF}>
                      {SITE.phoneDisplay}
                    </a>
                    {" · "}
                    <a className={link} href={whatsappUrl("Hi! I'd like to know more about The Hungry Wrap.")} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <strong className="text-[#211b18]">Delivery Orders:</strong>{" "}
                    <a className={link} href={SITE.links.swiggy} target="_blank" rel="noopener noreferrer">
                      Swiggy
                    </a>
                    {" · "}
                    <a className={link} href={SITE.links.zomato} target="_blank" rel="noopener noreferrer">
                      Zomato
                    </a>
                  </li>
                  <li>
                    <strong className="text-[#211b18]">Instagram:</strong>{" "}
                    <a className={link} href={SITE.links.instagram} target="_blank" rel="noopener noreferrer">
                      @thehungrywrap
                    </a>
                  </li>
                </ul>
              </section>
            </TiltCard>
          </Reveal>

          <Reveal>
            <section data-reveal className={card}>
              <h2 className={h2}>Send Us a Message</h2>
              <ContactForm />
            </section>
          </Reveal>
        </div>
      </section>

      <FinalCtaFooter orderHref={ORDER_HREF} navLinks={NAV_LINKS} />
    </main>
  );
}
