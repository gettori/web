import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { Check } from "lucide";
import "../app/css/tokens.css";
import { Icon } from "../app/kit";
import { SITE } from "../config";
import sp from "./Spaces.module.css";
import s from "./Reach.module.css";

const LOOP = 13.6;
const STILL = 8;
const WIDTH = 760;
const HEIGHT = 470;
const COMMENT = "Keep Save off until the URL is valid.";
const CHAT = "Sign webhook payloads";
const ANDROID = "M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z";

// [element to reach, when the cursor leaves for it, when the press starts, when it ends]
const PATH: [string, number, number, number][] = [
  ["icon", 0.2, 1.0, 1.2],
  ["pick", 1.2, 2.2, 2.5],
  ["save", 2.5, 4.2, 4.5],
  ["add", 6.1, 6.8, 7.1],
  ["send", 7.1, 8.9, 9.3],
];

export default function Reach() {
  let fit!: HTMLDivElement;
  let page!: HTMLDivElement;
  const [t, setT] = createSignal(0);
  const [cw, setCw] = createSignal(WIDTH);
  const [live, setLive] = createSignal(false);
  const scale = () => Math.min(1, cw() / WIDTH);

  onMount(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLive(!reduced);
    if (reduced) setT(STILL);
    setCw(fit.clientWidth || WIDTH);
    let visible = false;
    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting), { threshold: 0.2 });
    io.observe(fit);
    const ro = new ResizeObserver((e) => setCw(e[0].contentRect.width || WIDTH));
    ro.observe(fit);
    const id = setInterval(() => {
      if (reduced || !visible || document.hidden) return;
      setT((x) => (x + 0.1 >= LOOP ? 0 : x + 0.1));
    }, 100);
    onCleanup(() => {
      clearInterval(id);
      io.disconnect();
      ro.disconnect();
    });
  });

  const at = (a: number, b = Infinity) => t() >= a && t() < b;
  const trayOpen = () => t() >= 1.2;
  const picking = () => at(2.5, 7.1);
  const hovering = () => at(3.3, 7.1);
  const boxOpen = () => at(4.5, 7.1);
  const added = () => t() >= 7.1;
  const sent = () => t() >= 9.3;
  const typed = () => COMMENT.slice(0, Math.floor(Math.min(1, Math.max(0, (t() - 4.9) / 1.5)) * COMMENT.length));
  const saveState = () => (added() ? "added" : hovering() ? "hover" : "rest");

  let rest: { x: number; y: number } | null = null;
  const cursor = () => {
    const now = t();
    if (!live() || now < 0.2 || now >= 12.6) return null;
    const step = [...PATH].reverse().find((p) => now >= p[1]);
    if (!step) return null;
    const el = page?.querySelector(`[data-aim="${step[0]}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      const b = page.getBoundingClientRect();
      rest = { x: (r.left + r.width / 2 - b.left) / scale(), y: (r.top + r.height / 2 - b.top) / scale() };
    }
    if (!rest) return null;
    const early = now < 0.35;
    return {
      x: rest.x + (early ? -90 : 0),
      y: rest.y + (early ? 90 : 0),
      down: PATH.some((p) => now >= p[2] && now < p[3]),
    };
  };

  return (
    <div class={sp.wrap} style={{ "--hue": "251 113 133" }}>
      <div class={sp.head}>
        <h2 class={`${sp.h2} ${s.heading}`}>
          In your browser.
          <br />
          <span class={sp.accent}>In your pocket.</span>
        </h2>
        <div class={sp.headRight}>
          <p>Point at what is wrong on the page and send it to the chat. Step away from the desk and answer the agent from your phone.</p>
        </div>
      </div>

      <div class={s.stage}>
        <div class={`${sp.panel} ${s.panel}`}>
          <div class={s.intro}>
            <b>Pick and comment</b>
            <p>The extension knows which worktree a localhost tab is serving. Click any element, say what should change, and the agent gets the comment, the element and a screenshot.</p>
          </div>
          <div ref={fit} class={s.fit} style={{ height: `${Math.round(HEIGHT * scale())}px` }}>
            <div ref={page} class={s.browser} style={{ transform: `scale(${scale()})` }} aria-hidden="true">
              <div class={s.bar}>
                <span class={s.lights}>
                  <i style={{ background: "#ff5f57" }} />
                  <i style={{ background: "#febc2e" }} />
                  <i style={{ background: "#28c840" }} />
                </span>
                <span class={s.url}>
                  <b>localhost:5173</b>/settings/webhooks
                </span>
                <span class={s.extBtn} data-aim="icon" data-on={trayOpen() ? "true" : "false"}>
                  <img src="/app-icon.png" alt="" />
                  <i />
                </span>
              </div>
              <div class={s.page}>
                <h3>Webhooks</h3>
                <p>Send signed events to your endpoint.</p>
                <label class={s.field}>
                  Endpoint URL
                  <span>https://hooli.dev/hooks</span>
                </label>
                <label class={s.field}>
                  Signing secret
                  <span>whsec_••••••••••••</span>
                </label>
                <div class={s.save} data-aim="save" data-state={saveState()}>
                  Save
                  <Show when={at(3.3, 4.5)}>
                    <span class={s.tag}>
                      button.primary <span>88 x 32</span>
                    </span>
                  </Show>
                  <Show when={added()}>
                    <span class={s.mark}>1</span>
                  </Show>
                </div>

                <Show when={boxOpen()}>
                  <div class={s.box}>
                    <div class={s.input}>
                      <Show when={typed()} fallback={<span class={s.placeholder}>What should change?</span>}>
                        {typed()}
                        <span class={s.caret} />
                      </Show>
                    </div>
                    <div class={s.row}>
                      <span class={s.btn}>Cancel</span>
                      <span class={s.btnPrimary} data-aim="add" data-down={at(6.8, 7.1) ? "true" : "false"}>
                        Add
                      </span>
                    </div>
                  </div>
                </Show>

                <Show when={trayOpen()}>
                  <div class={s.tray}>
                    <div class={s.trayHead}>
                      <b>Tori</b>
                      <code>feat/webhooks</code>
                      <Show when={added()}>
                        <span class={s.count}>1</span>
                      </Show>
                    </div>
                    <div class={s.trayBody}>
                      <Show when={!picking() && !added()}>
                        <span class={s.btnPrimary} data-aim="pick" data-down={at(2.2, 2.5) ? "true" : "false"}>
                          Pick and comment
                        </span>
                      </Show>
                      <Show when={picking()}>
                        <span class={s.status}>
                          <i />
                          Picking. Click an element.
                        </span>
                      </Show>
                      <Show when={added()}>
                        <div class={s.item}>
                          <span>1</span>
                          <div>
                            {COMMENT}
                            <small>button.primary</small>
                          </div>
                        </div>
                        <Show
                          when={sent()}
                          fallback={
                            <span class={s.btnPrimary} data-aim="send" data-down={at(8.9, 9.3) ? "true" : "false"}>
                              Send to {CHAT}
                            </span>
                          }
                        >
                          <div class={s.sent}>
                            <b>
                              <Icon icon={Check} size={14} strokeWidth={2.4} />
                              Sent to {CHAT}
                            </b>
                            <span class={`${s.btn} ${s.showIn}`}>Show in Tori</span>
                          </div>
                        </Show>
                      </Show>
                    </div>
                  </div>
                </Show>
              </div>

              <Show when={cursor()}>
                {(c) => (
                  <span class={s.cursor} aria-hidden="true" style={{ translate: `${c().x}px ${c().y}px` }}>
                    <svg width="18" height="22" viewBox="0 0 18 22" style={{ transform: c().down ? "scale(.82)" : "none" }}>
                      <path d="M1 1l15 11-7 1-4 7z" fill="#fff" stroke="#15171c" stroke-width="1.2" stroke-linejoin="round" />
                    </svg>
                  </span>
                )}
              </Show>
            </div>
          </div>
        </div>

        <div class={`${sp.panel} ${s.panel}`}>
          <div class={s.intro}>
            <b>The phone app</b>
            <p>Pair with a QR code, over Tailscale. Answer, steer or stop a turn from anywhere.</p>
          </div>
          <div class={s.stores}>
            <a href={SITE.android} class={s.store}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={ANDROID} />
              </svg>
              <span>
                <small>Download the APK</small>Android
              </span>
            </a>
          </div>
          <div class={s.phoneWrap}>
            <div class={s.phone} aria-hidden="true">
              <div class={s.island} />
              <div class={s["p-head"]}>
                <span class={s["p-back"]}>{"‹"}</span>
                <div>
                  <b>{CHAT}</b>
                  <small>
                    <i />
                    Needs you {"·"} api {"›"} feat/webhooks
                  </small>
                </div>
              </div>
              <div class={s["p-user"]}>run the webhook tests</div>
              <div class={s["p-text"]}>Signed payloads with the endpoint secret. Running the webhook tests now.</div>
              <div class={s["p-slot"]}>
                <div class={s["p-pending"]}>
                  <b>Allow Bash?</b>
                  <code>pnpm test webhooks</code>
                  <div class={s["p-btns"]}>
                    <span>Deny</span>
                    <span class={s["p-allow"]}>
                      Allow once
                      <i class={s.tap} />
                    </span>
                  </div>
                </div>
                <div class={s["p-done"]}>
                  <Icon icon={Check} size={22} strokeWidth={2} />
                  Back to work.
                </div>
              </div>
              <div class={s["p-composer"]}>Steer the running turn</div>
            </div>
          </div>
        </div>
      </div>

      <div class={s.links}>
        <a href="/docs/browser/pick-and-comment/">How pick and comment works {"->"}</a>
        <a href="/docs/phone/using-the-phone-app/">Using the phone app {"->"}</a>
      </div>
    </div>
  );
}
