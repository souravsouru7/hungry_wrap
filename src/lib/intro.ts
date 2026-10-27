import { useSyncExternalStore } from "react";

import { INTRO_DONE_EVENT, INTRO_STORAGE_KEY } from "./intro-boot";

export { INTRO_DONE_EVENT };

export function isIntroDone() {
  return document.documentElement.dataset.hwIntro === "seen";
}

export function markIntroDone() {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // Storage blocked: the story simply plays again next visit.
  }
  document.documentElement.dataset.hwIntro = "seen";
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(INTRO_DONE_EVENT, onChange);
  return () => window.removeEventListener(INTRO_DONE_EVENT, onChange);
}

/** True once the opener has finished (or was skipped), so page entrances can start on cue. */
export function useIntroDone() {
  return useSyncExternalStore(subscribe, isIntroDone, () => false);
}
