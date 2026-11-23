import { splitProps, type Component, type JSX } from "solid-js";
import styles from "./css/gitMarks.module.css";

const DEFAULT_STROKE = 1.75;

export type GitMarkProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
  active?: boolean;
  current?: boolean;
};

// The vendored stylesheet pins to element order inside each glyph, so the shapes
// stay direct children in Lucide's order.
function Frame(props: GitMarkProps & { mark: string; children: JSX.Element }) {
  const [local, rest] = splitProps(props, ["size", "strokeWidth", "active", "current", "class", "mark", "children"]);
  return (
    <svg
      viewBox="0 0 24 24"
      width={local.size ?? 16}
      height={local.size ?? 16}
      fill="none"
      stroke="currentColor"
      stroke-width={local.strokeWidth ?? DEFAULT_STROKE}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      data-mark={local.mark}
      data-active={local.active ? "true" : "false"}
      data-current={local.current ? "true" : undefined}
      classList={{ [styles.mark]: true, [local.class ?? ""]: !!local.class }}
      {...rest}
    >
      {local.children}
    </svg>
  );
}

export const BranchMark: Component<GitMarkProps> = (props) => (
  <Frame {...props} mark="branch">
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M6 21V9a9 9 0 0 0 9 9" />
  </Frame>
);

export const WorktreeMark: Component<GitMarkProps & { stub?: boolean }> = (props) => {
  const [local, rest] = splitProps(props, ["stub"]);
  return (
    <Frame {...rest} mark="worktree" data-stub={local.stub ? "true" : undefined}>
      <path d="M18 19a5 5 0 0 1-5-5v8" />
      <path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5" />
      <circle cx="13" cy="12" r="2" />
      <circle cx="20" cy="19" r="2" />
    </Frame>
  );
};
