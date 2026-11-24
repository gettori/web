const IDLE_MS = 30_000;
const UNFOCUSED_MS = 3_000;

/** True while the page is resting, which is when every loop on it should hold still. */
export const resting = () => document.documentElement.hasAttribute("data-rest");

/**
 * Puts the page to rest when nobody has scrolled, typed or moved a pointer over it for
 * a while, or a few seconds after its window loses focus, and wakes it on the next
 * input. A page left open then draws nothing, where its loops would otherwise keep
 * the GPU busy for as long as the tab is on screen.
 */
export function watchRest() {
  const root = document.documentElement;
  let timer = 0;
  let armed = 0;
  const arm = () => {
    armed = performance.now();
    root.removeAttribute("data-rest");
    clearTimeout(timer);
    timer = window.setTimeout(() => root.setAttribute("data-rest", ""), document.hasFocus() ? IDLE_MS : UNFOCUSED_MS);
  };
  // A moving pointer reports hundreds of times a second, and one re-arm a second is enough.
  const touch = () => (resting() || performance.now() - armed > 1000) && arm();
  for (const type of ["pointermove", "pointerdown", "wheel", "scroll", "keydown", "touchstart"]) {
    addEventListener(type, touch, { capture: true, passive: true });
  }
  addEventListener("focus", arm);
  addEventListener("blur", arm);
  arm();
}
