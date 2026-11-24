/**
 * Stops the parts of a scene that twinkle in place outside the box it is cropped to.
 * An animation nobody can see is not handed to the compositor, so each one costs a
 * main-thread frame on every refresh for as long as the scene is on screen.
 */
export function stillCropped(scene: Element) {
  const box = scene.getBoundingClientRect();
  for (const el of scene.querySelectorAll<SVGElement>(".ts-tw, .ts-sh, .ts-glow")) {
    const r = el.getBoundingClientRect();
    const cropped = r.right <= box.left || r.left >= box.right || r.bottom <= box.top || r.top >= box.bottom;
    el.style.animationName = cropped ? "none" : "";
  }
}
