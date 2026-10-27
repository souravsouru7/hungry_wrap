import type { Metadata } from "next";
import { Anton, Baloo_2, Caveat_Brush, Geist, Geist_Mono, Pacifico, Poppins } from "next/font/google";
import FloatingActions from "@/components/FloatingActions";
import IntroLoader from "@/components/IntroLoader";
import MotionProvider from "@/components/MotionProvider";
import { INTRO_BOOT_SCRIPT } from "@/lib/intro-boot";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face for the hero's kinetic headlines.
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Exact-copy hero: chunky rounded display, marker script for the wall
// slogan, and a rounded grotesque for nav/body copy.
const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const marker = Caveat_Brush({
  variable: "--font-marker",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// "Why Choose Us": the reference headline is a rounded, chunky hand-drawn
// face rather than the hero's connected script, so that section gets its own
// display font instead of borrowing Pacifico.
const baloo = Baloo_2({
  variable: "--font-baloo",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} | Fresh Wraps in Nagpur`,
  description:
    "Fresh ingredients, bold flavors and wraps made to satisfy your cravings. Find us near Vasudev Nagar Metro Station, Hingna Road, Nagpur, or order on Swiggy and Zomato.",
  openGraph: {
    title: SITE.name,
    description: "Wraps so good, you'll come back for more!",
    siteName: SITE.name,
    images: [{ url: "/brand/logo.png", width: 640, height: 559, alt: SITE.name }],
  },
};

const RESTAURANT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  image: `${SITE.url}/brand/logo.png`,
  url: SITE.url,
  hasMap: SITE.links.maps,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Vasudev Nagar Metro Station, Near, Hingna Rd, Rajendra Nagar",
    addressLocality: "Nagpur",
    addressRegion: "Maharashtra",
    postalCode: "440036",
    addressCountry: "IN",
  },
  sameAs: [SITE.links.instagram, SITE.links.swiggy, SITE.links.zomato],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The boot script may mark <html data-hw-intro> before React hydrates.
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${pacifico.variable} ${marker.variable} ${baloo.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(RESTAURANT_JSON_LD) }} />
        <MotionProvider>
          <IntroLoader />
          {children}
          <FloatingActions />
        </MotionProvider>
      </body>
    </html>
  );
}
