import { strict as assert } from "node:assert";
import { test } from "node:test";
import { Window } from "happy-dom";
import { installLink, onAMac, showInstall, type Visitor } from "./visitor.ts";

test("a Mac is told apart from everything else, by either platform field", () => {
  assert.equal(onAMac({ userAgentData: { platform: "macOS" } }), true);
  assert.equal(onAMac({ platform: "MacIntel", maxTouchPoints: 0 }), true);
  assert.equal(onAMac({ userAgentData: { platform: "Windows" }, platform: "MacIntel" }), false);
  assert.equal(onAMac({ platform: "Win32" }), false);
  assert.equal(onAMac({ platform: "Linux x86_64" }), false);
  assert.equal(onAMac({ platform: "MacIntel", maxTouchPoints: 5 }), false);
  assert.equal(onAMac({}), false);
});

test("the link names the kind and id, under tori-dev only with ?dev", () => {
  assert.equal(installLink("themes", "nord", ""), "tori://install?kind=themes&id=nord");
  assert.equal(installLink("themes", "nord", "?dev"), "tori-dev://install?kind=themes&id=nord");
  assert.equal(installLink("lsp", "csharp", "?x=1&dev=1"), "tori-dev://install?kind=lsp&id=csharp");
});

// The pack page's install section, as `[id].astro` renders it.
const SECTION = `
  <div data-on="mac" hidden>
    <a href="tori://install?kind=themes&id=nord" data-install data-kind="themes" data-id="nord">Install in Tori</a>
    <p data-fallback hidden>Nothing opened?</p>
  </div>
  <p data-on="other">Use the file below.</p>`;

function page(nav: Visitor, url = "https://gettori.app/packs/themes/nord/", wait = 2000) {
  const win = new Window({ url });
  win.document.body.innerHTML = SECTION;
  showInstall(win as unknown as globalThis.Window, nav, wait);
  const $ = (q: string) => win.document.querySelector(q) as unknown as HTMLElement;
  return { win, $ };
}

test("a Mac sees the link, and under ?dev the dev scheme", async () => {
  const { win, $ } = page({ userAgentData: { platform: "macOS" } }, "https://gettori.app/packs/themes/nord/?dev");
  assert.equal($('[data-on="mac"]').hidden, false);
  assert.equal($('[data-on="other"]').hidden, true);
  assert.equal($("[data-install]").getAttribute("href"), "tori-dev://install?kind=themes&id=nord");
  await win.happyDOM.close();
});

test("anything else sees the file steps and no link", async () => {
  for (const nav of [{ platform: "Win32" }, { userAgentData: { platform: "Linux" } }, { platform: "MacIntel", maxTouchPoints: 5 }]) {
    const { win, $ } = page(nav);
    assert.equal($('[data-on="mac"]').hidden, true);
    assert.equal($('[data-on="other"]').hidden, false);
    await win.happyDOM.close();
  }
});

test("a click that keeps the page focused shows the fallback; one that leaves it does not", async () => {
  for (const leaves of [false, true]) {
    const { win, $ } = page({ platform: "MacIntel" }, undefined, 20);
    const a = $("[data-install]");
    a.addEventListener("click", (e) => e.preventDefault());
    a.click();
    if (leaves) win.dispatchEvent(new win.Event("blur"));
    await new Promise((r) => setTimeout(r, 60));
    assert.equal($("[data-fallback]").hidden, leaves);
    await win.happyDOM.close();
  }
});
