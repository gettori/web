import Lenis from "lenis";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

export const lenis = reduced ? null : new Lenis({ allowNestedScroll: true });

// Lenis has work only while a scroll is easing out. `autoRaf` asks for a frame on every
// refresh for the life of the page, and each one makes the browser restyle every running
// animation, so the loop here runs for the length of a scroll and stops.
if (lenis) {
  let frame = 0;
  const step = (time: number) => {
    lenis.raf(time);
    frame = lenis.isScrolling === "smooth" ? requestAnimationFrame(step) : 0;
  };
  const scrollTo = lenis.scrollTo.bind(lenis);
  lenis.scrollTo = (...args) => {
    scrollTo(...args);
    if (frame || lenis.isScrolling !== "smooth") return;
    lenis.time = 0;
    frame = requestAnimationFrame(step);
  };
}
