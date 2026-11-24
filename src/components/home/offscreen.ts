// A sliver at the edge of the viewport counts as out of view, so a section that has
// only begun to scroll in does not run its animations for the few pixels on show.
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) e.target.toggleAttribute("data-offscreen", !e.isIntersecting);
  },
  { rootMargin: "-8% 0px" },
);

for (const el of document.querySelectorAll("main > :not(script, style), footer, [data-motion]")) io.observe(el);
