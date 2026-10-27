"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/reduced-motion";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";

import { TEL_HREF, whatsappUrl } from "@/lib/site";

const BG = "linear-gradient(180deg, #fa9231 0%, #f0790f 100%)";
const BUTTON =
  "flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_14px_26px_-12px_rgba(224,106,16,0.85)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f47514] motion-reduce:transition-none";

/**
 * Bottom-right orange dock: separate WhatsApp and Call buttons that are always
 * visible, plus a back-to-top arrow that only appears once the visitor has
 * scrolled down.
 */
export default function FloatingActions() {
  const reduce = useReducedMotion();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
            initial={{ opacity: 0, y: 16, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.7 }}
            className={BUTTON}
            style={{ background: BG }}
          >
            <ArrowUp aria-hidden className="h-5 w-5" strokeWidth={2.8} />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={whatsappUrl("Hi! I'd like to know more about The Hungry Wrap.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={BUTTON}
        style={{ background: BG }}
      >
        <MessageCircle aria-hidden className="h-5 w-5" strokeWidth={2.5} />
      </a>

      <a href={TEL_HREF} aria-label="Call us" className={BUTTON} style={{ background: BG }}>
        <Phone aria-hidden className="h-5 w-5" strokeWidth={2.5} />
      </a>
    </div>
  );
}
