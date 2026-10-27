export type Faq = { q: string; a: string };
export type FaqGroup = { heading: string; items: Faq[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    heading: "Food & Menu Questions",
    items: [
      {
        q: "Is your food made fresh?",
        a: "Absolutely. We prepare our vegetables, proteins, and signature sauces fresh every single day to guarantee the best flavor.",
      },
      {
        q: "Do you have vegetarian options?",
        a: "Yes! We have a dedicated selection of flavorful vegetarian wraps, sides, and paneer specials.",
      },
    ],
  },
  {
    heading: "Tea Subscription Questions",
    items: [
      {
        q: "Can I roll over my unused tea to the next day?",
        a: "To keep these plans incredibly affordable for everyone, daily cups do not roll over. It is a fresh start every morning!",
      },
      {
        q: "Can I share my Double Dose tea with a friend?",
        a: "Yes. If you are on the Double Dose plan, you can redeem both cups at the exact same time to share with a friend.",
      },
    ],
  },
  {
    heading: "Orders & Delivery",
    items: [
      {
        q: "Do you deliver food to homes or offices?",
        a: "Yes, you can order directly through our website or find us on major food delivery applications for fast local delivery.",
      },
    ],
  },
];
