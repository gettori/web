// The site is static, so who is visiting is decided in the browser.
export type Visitor = {
  userAgentData?: { platform?: string };
  platform?: string;
  maxTouchPoints?: number;
};

// An iPad asking for the desktop site says MacIntel too, and Tori does not run there.
export function onAMac(nav: Visitor): boolean {
  const platform = nav.userAgentData?.platform || nav.platform || "";
  return /^mac/i.test(platform) && (nav.maxTouchPoints ?? 0) <= 1;
}

// `?dev` points the link at a dev build, which registers its own scheme.
export function installLink(kind: string, id: string, search: string): string {
  const scheme = new URLSearchParams(search).has("dev") ? "tori-dev" : "tori";
  return `${scheme}://install?kind=${encodeURIComponent(kind)}&id=${encodeURIComponent(id)}`;
}

export function showInstall(win: Window, nav: Visitor, wait = 2000): void {
  const doc = win.document;
  const mac = onAMac(nav);
  for (const el of doc.querySelectorAll<HTMLElement>("[data-on]")) el.hidden = (el.dataset.on === "mac") !== mac;
  for (const a of doc.querySelectorAll<HTMLAnchorElement>("[data-install]")) {
    a.href = installLink(a.dataset.kind ?? "", a.dataset.id ?? "", win.location.search);
    // Opening the app takes focus from the page; a page that keeps it for two
    // seconds most likely has no Tori behind the link.
    a.addEventListener("click", () => {
      let left = false;
      const away = () => (left = true);
      win.addEventListener("blur", away, { once: true });
      win.setTimeout(() => {
        win.removeEventListener("blur", away);
        if (!left) a.parentElement?.querySelector<HTMLElement>("[data-fallback]")?.removeAttribute("hidden");
      }, wait);
    });
  }
}
