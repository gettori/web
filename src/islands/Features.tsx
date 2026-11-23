import { createEffect, createSignal, For, on, onCleanup, onMount } from "solid-js";
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

// Every crop is 920 by 696, so the frame keeps its size from tab to tab.
const WITH_SIDEBAR = "0,44,920,696";
const WORK_CARD = "280,44,920,696";

const STEPS: Step[] = [
  {
    ...ROSE,
    bar: "One tree",
    title: "Eleven terminals. One tree.",
    body: "Every session rolls up to its branch, project and space. Sidebar, tabs, menu bar, Dock, notifications and your phone all read the same status.",
    facts: ["Rolls up to the space", "One status, six places", "Rose means it needs you"],
    mode: "tree",
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
    bar: "Topics",
    title: "One branch across repos.",
    body: "A change that spans an API, its app and its SDK is one Topic: one branch name across the repos you pick, opened as one workspace with one chat that sees all of them.",
    facts: ["One branch name", "One search, one chat", "Read-only references"],
    mode: "topics",
    region: WITH_SIDEBAR,
  },
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

export default function Features() {
  let root!: HTMLDivElement;
  const tabs: HTMLButtonElement[] = [];
  const [step, setStep] = createSignal(0);
  const [clock, setClock] = createSignal(0);
  const [pinned, setPinned] = createSignal(false);
  const [reduced, setReduced] = createSignal(false);
  const cur = () => STEPS[step()];
  const length = () => LOOP[cur().mode];

  createEffect(on(step, () => setClock(0), { defer: true }));

  onMount(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    let visible = false;
    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting), { threshold: 0.25 });
    io.observe(root);
    const id = setInterval(() => {
      if (!visible || document.hidden || reduced()) return;
      const next = clock() + 0.1;
      if (next < length()) setClock(next);
      else if (pinned()) setClock(0);
      else setStep((n) => (n + 1) % STEPS.length);
    }, 100);
    onCleanup(() => {
      clearInterval(id);
      io.disconnect();
    });
  });

  const pick = (i: number) => {
    setPinned(true);
    if (i === step()) setClock(0);
    else setStep(i);
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const by = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!by) return;
    e.preventDefault();
    const next = (i + by + STEPS.length) % STEPS.length;
    pick(next);
    tabs[next]?.focus();
  };

  const fill = (i: number) => {
    if (i !== step()) return 0;
    return reduced() ? 100 : Math.round((clock() / length()) * 100);
  };

  return (
    <div ref={root} class={s.wrap}>
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
                    <span style={{ width: `${fill(i())}%`, background: st.color }} />
                  </span>
                  <span class={s.barLabel} style={{ color: i() === step() ? st.color : undefined }}>
                    {st.bar}
                  </span>
                </button>
              )}
            </For>
          </div>
          <div class={s.caps}>
            <For each={STEPS}>
              {(st, i) => (
                <div class={s.cap} data-at={i() === step() ? "now" : i() < step() ? "past" : "next"} aria-hidden={i() !== step()}>
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
        <div
          class={s.frame}
          style={{
            background: `linear-gradient(140deg, ${cur().glow}, var(--glass-hi) 40%, var(--glass))`,
            "box-shadow": `0 50px 140px light-dark(rgba(40,36,70,.22), rgba(0,0,0,.65)), 0 0 100px ${cur().soft}`,
          }}
        >
          <div class={s.clip}>
            <ToriWindow mode={cur().mode} region={cur().region} skipChaos maxScale={1.5} time={reduced() ? undefined : clock()} />
          </div>
        </div>
      </div>
    </div>
  );
}
