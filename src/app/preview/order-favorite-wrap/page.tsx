import type { Metadata } from "next";
import OrderFavoriteWrapCTA from "@/components/hungry-wrap/order-favorite-wrap-cta/OrderFavoriteWrapCTA";

export const metadata: Metadata = {
  title: "Order CTA preview — The Hungry Wrap",
  description: "Preview of The Hungry Wrap order call-to-action.",
  robots: { index: false, follow: false },
};

export default function OrderFavoriteWrapPreviewPage() {
  return (
    <main className="min-h-screen bg-[#fff8ef]">
      <OrderFavoriteWrapCTA />
    </main>
  );
}
