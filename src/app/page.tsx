import FinalCtaFooter from "@/components/FinalCtaFooter";
import FreshIngredientsSection from "@/components/hungry-wrap/fresh-ingredients/FreshIngredientsSection";
import HungryWrapHero from "@/components/hungry-wrap/exact-hero/HungryWrapHero";
import MenuSection from "@/components/sections/MenuSection";
import OrderFavoriteWrapCTA from "@/components/hungry-wrap/order-favorite-wrap-cta/OrderFavoriteWrapCTA";
import OurStorySection from "@/components/hungry-wrap/our-story/OurStorySection";
import TestimonialsSection from "@/components/hungry-wrap/testimonials/TestimonialsSection";
import WhyChooseUs from "@/components/hungry-wrap/why-choose-us/WhyChooseUs";

/**
 * The landing page. Each section owns its own backdrop, scroll entrance and
 * `id`, so they stack in reading order with nothing to coordinate here.
 *
 * <TestimonialsSection /> ships with placeholder reviews from the design mock.
 * Pass verified customer feedback via its `testimonials` prop before launch.
 */
export default function Home() {
  return (
    <main className="flex-1 bg-[#f6e6d2]">
      <HungryWrapHero />
      <FreshIngredientsSection />
      <MenuSection />
      <WhyChooseUs />
      <OrderFavoriteWrapCTA />
      <TestimonialsSection />
      <OurStorySection />
      <FinalCtaFooter orderHref="#order" />
    </main>
  );
}
