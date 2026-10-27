/**
 * The opening story plays once per browser session. An inline script in the
 * root layout marks <html data-hw-intro="seen"> before first paint when it has
 * already played (or the visitor prefers reduced motion), so repeat page loads
 * never flash the overlay.
 */
export const INTRO_STORAGE_KEY = "hw-intro";
export const INTRO_DONE_EVENT = "hw:intro-done";

export const INTRO_BOOT_SCRIPT = `try{var d=document.documentElement;if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-hw-intro","seen")}}catch(e){document.documentElement.setAttribute("data-hw-intro","seen")}`;
