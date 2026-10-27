"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/reduced-motion";
import { useState } from "react";
import type { FormEvent } from "react";

import { whatsappUrl } from "@/lib/site";

const input =
  "peer w-full rounded-2xl bg-[#fff9f2] px-4 pt-6 pb-2 font-[family-name:var(--font-poppins)] text-[#211b18] ring-1 ring-[#f0e5da] outline-none transition-shadow placeholder:text-transparent focus:bg-white focus:ring-2 focus:ring-[#f47514]";
const label =
  "pointer-events-none absolute left-4 top-4 origin-left font-[family-name:var(--font-poppins)] text-sm text-[#8a8079] transition-all duration-200 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#f47514] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs";

function PaperPlane({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M21.5 2.5 10.5 13.5M21.5 2.5l-7 19-4-8-8-4 19-7Z" />
    </svg>
  );
}

/** Hands the enquiry to WhatsApp with the fields prefilled; nothing is stored. */
export default function ContactForm() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState("");
  const [sent, setSent] = useState(0);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = `Hi! I'm ${data.get("name")} (${data.get("phone")}).\n${data.get("message")}`;
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    setStatus("Opening WhatsApp with your message…");
    setSent((n) => n + 1);
    form.reset();
  };

  return (
    <form onSubmit={submit} noValidate className="mt-5 space-y-4">
      <div className="relative">
        {/* suppressHydrationWarning: form-filler extensions (e.g. Edge's `fdprocessedid`) tag fields before React hydrates. */}
        <input suppressHydrationWarning id="cf-name" name="name" required autoComplete="name" placeholder="Name" className={input} />
        <label htmlFor="cf-name" className={label}>
          Name
        </label>
      </div>
      <div className="relative">
        <input suppressHydrationWarning id="cf-phone" name="phone" type="tel" required autoComplete="tel" placeholder="Phone Number" className={input} />
        <label htmlFor="cf-phone" className={label}>
          Phone Number
        </label>
      </div>
      <div className="relative">
        <textarea suppressHydrationWarning id="cf-message" name="message" required rows={5} placeholder="Message" className={`${input} resize-none`} />
        <label htmlFor="cf-message" className={label}>
          Message
        </label>
      </div>
      <motion.button
        suppressHydrationWarning
        type="submit"
        whileHover={reduce ? undefined : { scale: 1.03 }}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-3.5 font-[family-name:var(--font-poppins)] font-semibold text-white shadow-[0_14px_26px_-14px_rgba(224,106,16,0.8)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f47514]"
        style={{ background: "linear-gradient(180deg, #fa9231 0%, #f0790f 100%)" }}
      >
        Submit
        <span className="relative h-5 w-5">
          <AnimatePresence initial={false}>
            <motion.span
              key={sent}
              className="absolute inset-0"
              initial={{ x: -24, y: 24, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { x: 60, y: -60, rotate: 20, opacity: 0, transition: { duration: 0.6, ease: "easeIn" } }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.35 }}
            >
              <PaperPlane className="h-5 w-5" />
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
      <p aria-live="polite" className="min-h-5 font-[family-name:var(--font-poppins)] text-xs text-[#77716c]">
        {status}
      </p>
    </form>
  );
}
