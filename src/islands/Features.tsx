import { batch, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import ToriWindow, { LOOP, type Mode } from "./ToriWindow";
import s from "./Features.module.css";

type Step = {
  bar: string;
  color: string;
  glow: string;
  soft: string;
  title: string;
  body: string;
  facts: string[];
  mode: Mode;
  region: string;
};

const AMBER = { color: "var(--link)", glow: "rgba(217,164,104,.55)", soft: "rgba(217,164,104,.14)" };
const VIOLET = { color: "var(--work-hi)", glow: "rgba(192,132,252,.55)", soft: "rgba(192,132,252,.16)" };
const TEAL = { color: "var(--done-hi)", glow: "rgba(45,212,191,.5)", soft: "rgba(45,212,191,.14)" };
const ROSE = { color: "var(--need)", glow: "rgba(251,113,133,.55)", soft: "rgba(251,113,133,.16)" };

// One pixel inside the work card on its cut edges, so its own border never doubles the frame's.
const WITH_SIDEBAR = "0,45,909,684";
const WORK_CARD = "281,45,908,684";

const STEPS: Step[] = [
  {
    ...VIOLET,
    bar: "Fan out",
    title: "Try it three ways. Keep the best.",
    body: "Start two, three or four attempts at one task, each in its own worktree on its own branch. Promote the one you want, and the other attempts are deleted.",
    facts: ["2 to 4 attempts", "A worktree each", "Promote the winner"],
    mode: "fanout",
    region: WITH_SIDEBAR,
  },
  {
    ...AMBER,
    bar: "Undo turn",
    title: "Undo any turn.",
    body: "Every prompt snapshots the whole tree, without making a commit. Find a turn by its prompt, see what it changed, put the tree back. The revert saves a backup first.",
    facts: ["No commits made", "Rewind forks the chat", "Backup before revert"],
    mode: "undo",
    region: WORK_CARD,
  },
  {
    ...TEAL,
    bar: "Who wrote it",
    title: "Know who wrote every hunk.",
    body: "Open a hunk to see the turn and tool call behind it, and what the agent said first. When Tori cannot tell, it says so. Then ask that session why.",
    facts: ["Turn and tool call", "It never guesses", "Ask why in a fork"],
    mode: "who",
    region: WORK_CARD,
  },
  {
    ...VIOLET,
    bar: "Pull request",
    title: "Take the pull request to merged.",
    body: "Checks, the review verdict and the merge button sit beside the diff. Resolve a thread, watch the tests finish, and merge without opening a browser.",
    facts: ["GitHub and GitLab", "Line comments as one review", "Squash, merge or rebase"],
    mode: "pr",
    region: WORK_CARD,
  },
  {
    ...TEAL,
    bar: "Review",
    title: "Comment on a hunk. Watch it get fixed.",
    body: "A real editor and a Changes panel that stages, commits and opens the PR. A hunk comment lands in the session's composer with the lines attached.",
    facts: ["Stage by hunk or line", "AI drafted commit message", "Three pane merge"],
    mode: "review",
    region: WORK_CARD,
  },
  {
    ...ROSE,
    bar: "Debug",
    title: "Debug what the agent wrote.",
    body: "Set a breakpoint and press F5. Paused on a bad value, Ask puts the frame, the stack and the variables in the chat, and the agent fixes it from there.",
    facts: ["Breakpoints on F5", "Ask sends the frame", "JS, Python, Go, Rust, C"],
    mode: "debug",
    region: WORK_CARD,
  },
];

const SLIDE_MS = 520;

export default function Features() {
  let root!: HTMLDivElement;
  let frame!: HTMLDivElement;
  const tabs: HTMLButtonElement[] = [];
  const [step, setStep] = createSignal(0);
  const [leaving, setLeaving] = createSignal<{ i: number; time: number } | null>(null);
  const [dir, setDir] = createSignal(1);
  const [moved, setMoved] = createSignal(false);
  const [clock, setClock] = createSignal(0);
  const [pinned, setPinned] = createSignal(false);
  const [reduced, setReduced] = createSignal(false);
  const [frameWidth, setFrameWidth] = createSignal(0);
  const [running, setRunning] = createSignal(false);
  const [cycle, setCycle] = createSignal(0);
  const cur = () => STEPS[step()];
  const length = () => LOOP[cur().mode];
  const capState = (i: number) => (i === step() ? "now" : i === leaving()?.i ? "left" : "wait");

  let slide: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(slide));

  const go = (next: number, direction: number) => {
    clearTimeout(slide);
    batch(() => {
      if (!reduced()) setLeaving({ i: step(), time: clock() });
      setDir(direction);
      setMoved(true);
      setStep(next);
      setClock(0);
      setCycle((n) => n + 1);
    });
    slide = setTimeout(() => setLeaving(null), SLIDE_MS);
  };

  onMount(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    let visible = false;
    const sync = () => setRunning(visible && !document.hidden);
    const io = new IntersectionObserver(
      (e) => {
        visible = e[0].isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    document.addEventListener("visibilitychange", sync);
    setFrameWidth(frame.clientWidth);
    const ro = new ResizeObserver((e) => setFrameWidth(e[0].contentRect.width));
    ro.observe(frame);
    // Wall-clock time, so the demo ends when the compositor-driven progress bar does.
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      if (!running() || reduced()) return;
      const next = clock() + dt;
      if (next < length()) setClock(next);
      else if (pinned()) {
        setClock(0);
        setCycle((n) => n + 1);
      } else go((step() + 1) % STEPS.length, 1);
    }, 100);
    onCleanup(() => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", sync);
      io.disconnect();
      ro.disconnect();
    });
  });

  const pick = (i: number) => {
    setPinned(true);
    if (i === step()) {
      setClock(0);
      setCycle((n) => n + 1);
    } else go(i, i > step() ? 1 : -1);
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const by = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!by) return;
    e.preventDefault();
    const next = (i + by + STEPS.length) % STEPS.length;
    setPinned(true);
    go(next, by);
    tabs[next]?.focus();
  };

  return (
    <div ref={root} class={s.wrap} style={{ "--dir": dir() }}>
      <div class={s.glow} style={{ background: `radial-gradient(45% 45% at 62% 50%, ${cur().soft}, transparent 70%)` }} />
      <div class={s.row}>
        <div class={s.captions}>
          <div class={s.bars} role="tablist" aria-label="What Tori does">
            <For each={STEPS}>
              {(st, i) => (
                <button
                  ref={(el) => (tabs[i()] = el)}
                  type="button"
                  role="tab"
                  class={s.bar}
                  aria-selected={i() === step()}
                  tabindex={i() === step() ? 0 : -1}
                  onClick={() => pick(i())}
                  onKeyDown={(e) => onKey(e, i())}
                >
                  <span class={s.track}>
                    <Show when={i() === step()}>
                      <For each={[cycle()]}>
                        {() => (
                          <span
                            class={s.fill}
                            style={{
                              background: st.color,
                              "animation-duration": `${length()}s`,
                              "animation-play-state": running() ? "running" : "paused",
                            }}
                          />
                        )}
                      </For>
                    </Show>
                  </span>
                  <span class={s.barLabel} style={{ color: i() === step() ? st.color : undefined }}>
                    {st.bar}
                  </span>
                </button>
              )}
            </For>
          </div>
          <div class={s.caps} data-moved={moved() ? "true" : undefined}>
            <For each={STEPS}>
              {(st, i) => (
                <div class={s.cap} data-at={capState(i())} aria-hidden={i() !== step()}>
                  <div class={s.num} style={{ "-webkit-text-stroke": `1px ${st.glow}` }}>
                    0{i() + 1}
                  </div>
                  <h2>{st.title}</h2>
                  <p>{st.body}</p>
                  <div class={s.facts}>
                    <For each={st.facts}>{(f) => <span>{f}</span>}</For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
        <div ref={frame} class={s.frame}>
          <For each={[step()]}>
            {(i) => (
              <div class={s.slide} data-enter={moved() ? "true" : undefined}>
                <ToriWindow mode={STEPS[i].mode} region={STEPS[i].region} skipChaos maxScale={1.5} initialWidth={frameWidth() || undefined} time={reduced() ? undefined : clock()} />
              </div>
            )}
          </For>
          <Show when={leaving()} keyed>
            {(l) => (
              <div class={`${s.slide} ${s.leaving}`} aria-hidden="true">
                <ToriWindow mode={STEPS[l.i].mode} region={STEPS[l.i].region} skipChaos maxScale={1.5} initialWidth={frameWidth() || undefined} time={l.time} />
              </div>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
}
