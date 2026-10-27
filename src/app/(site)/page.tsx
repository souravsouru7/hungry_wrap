import type { Metadata } from "next";

import FinalCtaFooter from "@/components/FinalCtaFooter";
import BestsellerCards from "@/components/home/BestsellerCards";
import FreshSteps from "@/components/home/FreshSteps";
import HomeHero from "@/components/home/HomeHero";
import Marquee from "@/components/home/motion/Marquee";
import ScrollProgress from "@/components/home/motion/ScrollProgress";
import VisitUs from "@/components/home/VisitUs";
import WhyUsStory from "@/components/home/WhyUsStory";
import { NAV_LINKS, ORDER_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "The Hungry Wrap | Kathi Rolls, Momos & Chai in Nagpur" },
  description:
    "Fresh kathi rolls, momos and chai made to order near Vasudev Nagar Metro, Hingna Road, Nagpur. See the menu and order on Swiggy or Zomato.",
};

/**
 * The landing page. Menu cards and category tiles read from `src/lib/menu.ts`
 * and deep-link into /menu; every order button goes to Swiggy or Zomato.
 */
export default function Home() {
  return (
    <main className="flex-1 overflow-x-clip bg-[#fff9f2]">
      <ScrollProgress />
      <HomeHero />
      <Marquee />
      <BestsellerCards />
      <FreshSteps />
      <WhyUsStory />
      <VisitUs />
      <FinalCtaFooter orderHref={ORDER_HREF} navLinks={NAV_LINKS} />
    </main>
  );
}
