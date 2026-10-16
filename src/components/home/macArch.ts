export type Mac = "arm" | "intel" | "other";

let found: Promise<Mac> | undefined;

// Safari and Firefox report "Intel Mac OS X" on every Mac, so the user agent
// alone cannot tell. Chromium answers through client hints; elsewhere the GPU
// name gives an Intel Mac away. Anything unsure stays Apple Silicon, which is
// what nearly every Mac sold since 2020 is.
export function detectMac(): Promise<Mac> {
  return (found ??= (async () => {
    // An iPad also says Macintosh, but has touch points.
    if (!/Macintosh/.test(navigator.userAgent) || navigator.maxTouchPoints > 1) return "other";
    const hints = (navigator as Navigator & { userAgentData?: { getHighEntropyValues(k: string[]): Promise<{ architecture?: string }> } })
      .userAgentData;
    if (hints) {
      try {
        const { architecture } = await hints.getHighEntropyValues(["architecture"]);
        if (architecture) return architecture === "x86" ? "intel" : "arm";
      } catch {}
    }
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      const info = gl?.getExtension("WEBGL_debug_renderer_info");
      const gpu = info ? String(gl!.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
      if (/intel|amd|radeon|nvidia/i.test(gpu)) return "intel";
    } catch {}
    return "arm";
  })());
}

// Any link carrying data-dl downloads the Apple Silicon build; on an Intel Mac
// it swaps to the build named in its data-intel.
export async function pointDownloads(scope: ParentNode = document) {
  if ((await detectMac()) !== "intel") return;
  for (const a of scope.querySelectorAll<HTMLAnchorElement>("a[data-dl][data-intel]")) a.href = a.dataset.intel!;
}
