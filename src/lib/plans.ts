/** Menu price of one THW Special Chai; every "regular price" below derives from it. */
export const CHAI_PRICE = 11;

export type TeaPlan = {
  name: string;
  price: number;
  period: "Week" | "Month";
  regular: number;
  deal: string;
  value: string;
  badge?: string;
};

export const TEA_PLANS: TeaPlan[] = [
  {
    name: "The Weekly Sipper",
    price: 59,
    period: "Week",
    regular: 7 * CHAI_PRICE,
    deal: "1 Cup of hot Tea every day for 7 days.",
    value: "You save time and cash, making it the perfect plan for the busy work week.",
  },
  {
    name: "The Monthly Brewer",
    price: 249,
    period: "Month",
    regular: 30 * CHAI_PRICE,
    badge: "Best Seller",
    deal: "1 Cup of hot Tea every day for 30 days.",
    value:
      "You get nearly a whole week of tea for free. Plus, show this pass and get a 10% discount on any food item purchased alongside your daily tea!",
  },
  {
    name: "The Double Dose",
    price: 449,
    period: "Month",
    regular: 60 * CHAI_PRICE,
    deal: "2 Cups of Tea daily (Morning & Evening) for 30 days.",
    value:
      "Save Rs. 211! Built for the ultimate tea lover who needs that morning kickstart and evening wind-down.",
  },
];

export const HOW_IT_WORKS = [
  { title: "Subscribe", body: "Pick your plan online or at the billing counter." },
  { title: "Flash Your Pass", body: "Show your active subscription screen or QR code to our barista." },
  { title: "Sip & Go", body: "Skip the payment hassle and get your fresh tea instantly." },
];
