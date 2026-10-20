---
title: Pick and comment
description: Point at parts of a worktree's page, comment on each, and send them to a chat in Tori.
---

On a tab a worktree's dev server is serving, you can point at parts of the
page, write a comment on each, and send the lot to a chat in that worktree.
The agent gets your comments, what each part of the page is, and
screenshots.

## Starting

Two ways in:

- **Click the toolbar icon.** A tray opens at the bottom right of the page
  with the branch and a **Pick and comment** button showing your shortcut.
  The tray's header also has **Options** and **Close**.
- **Press the shortcut**, which goes straight to picking. It is
  Ctrl+Shift+C on a Mac and Alt+Shift+C elsewhere, and you can change it in
  `chrome://extensions/shortcuts` or from the
  [options](/docs/browser/extension/#options).

On a tab that is not a worktree, the toolbar icon opens the tray with the
reason instead: not a Tori worktree, Tori not running, or Tori not set up
for this browser. Browser pages such as `chrome://` refuse every extension,
so there the icon's tooltip is all you get.

Clicking the icon again closes the tray when you have not started, stops
picking while you pick, and picks again once stopped. Esc closes the tray
too.

## Picking

While picking, the page under the pointer gets an outline, with a label
naming the element and its size, such as `button.primary 88 x 32`. The
page does not react: a click on a link or a button picks it rather than
following or pressing it.

- **Click** an element to comment on it.
- **Drag** across text to select it. A **Pick selection** button appears
  under the end of the selection; it goes away when the selection does.

A comment box opens under the element, or above it when there is no room
below. It grows to six lines, then scrolls.

| Key | In the comment box |
| --- | --- |
| Enter | Add the comment |
| Shift+Enter | New line |
| Esc | Close the box, keep picking |

**Add** stays off until the box has text. Each picked element keeps a
dashed outline and a number matching the tray's list, and both follow it
as the page scrolls, resizes or redraws.

Esc with no comment box open stops picking. The tray stays while it holds
comments, and says how to pick more. With no comments but a
[page log](#the-page-log), it goes back to **Pick and comment** with the
send options under it.

## The tray

The tray lists your comments in order, each with what it points at. **x**
removes one, with its screenshots, and the rest are renumbered on the page
and in the list. A comment that has no screenshot says so; it goes as text
only.

The comments belong to the tab. A reload keeps them and brings the tray
back, saying to press the shortcut or click the icon to keep picking. They
are dropped when the tab closes, or when it moves to another worktree or
off localhost.

## Sending

What the tray offers depends on the live chats in this worktree:

- **One**: **Send to** and its title.
- **Several**: pick one under **Send to**, with the arrow keys or a click,
  then **Send**.
- **None**: the tray says so.

**New chat in Tori** sits beside those in every case. It brings Tori's
window forward on this worktree and opens a new chat draft holding the
comments, with the screenshots as chips. You choose the model and mode and
press Send there: nothing runs until you do. It needs the Tori window open.

A chat that is waiting on you, for a question or a permission, is not sent
to until you answer it in Tori. Only live chats are offered; the extension
never starts or resumes an agent.

After a send the tray says where it went, with **Show in Tori**, which
brings the window forward on that chat.

**Copy as Markdown** copies the comments in the same layout the agent gets,
and keeps them. **Cancel** throws them away.

## The page log

From the moment a localhost page loads, the extension notes what it says
went wrong:

- `console.error` and `console.warn`, with format strings such as `%s`
  filled in
- errors nothing caught, and promise rejections nothing handled, with the
  first lines of their stack
- requests through `fetch` or `XMLHttpRequest` that end with status 400
  or more, or never get an answer: the method, the address with its query
  string, and the status. A request the page cancels is not a failure
- Vite's error overlay and Next's build error dialog, each as one build
  error. When Next also prints that error to the console, it is kept once

Each message is cut at 500 characters. The same message several times in
a row is kept once with a count, such as `x3`. Errors keep the first 50,
since the first is usually the cause; warnings and requests keep the last
50 each.

On a worktree tab the tray shows a line such as
`Page log: 2 errors, 1 failed request`, and keeps it current while open.
Its errors are also [counted on the toolbar icon](/docs/browser/extension/#the-error-count).

Click the line to open the list: every entry not yet sent, newest first,
with its kind, its first line and its count. The kind of an entry that
counts on the icon is in amber. Each has a checkbox, checked when it
arrives; uncheck the ones the agent does not need. The line then says how
many are left out, such as `2 errors, 3 left out`. When the log let go of
entries it could not keep, the list ends with how many, such as
`250 more not kept`. Under the list, **More in DevTools > Tori** points to
the [DevTools panel](/docs/browser/devtools-panel/), which also shows the
bodies of failed requests.

Send, **New chat in Tori** and **Copy as Markdown** all add the checked
entries under the comments as a **Page log** section. Each line has its time from the
first comment, so what happened before you picked reads as negative,
such as `-3.4s`.

You can send with no comments at all. When the page is broken and the
log has something checked, the toolbar icon's tray offers Send, **New chat
in Tori** and **Copy as Markdown** under **Pick and comment**, and the agent
gets the log alone.

A send takes the checked entries and drops them from the list, so sending
twice from the same page does not repeat itself. The unchecked ones stay
for a later send. Copying does not count as a send.
A reload starts the log over; moving between routes inside the app does
not.

The log is turned off with **Console and network** in the
[options](/docs/browser/extension/#options). A change applies from the
next time a tab loads, and a tab that loaded before the extension was
installed has no log until it reloads.

## What a comment carries

For each comment, the agent gets:

- a **Where** block first, saying where in the code the element comes from,
  as far as the page can tell. See [Where in the code](#where-in-the-code)
- the page's address and the route
- a CSS selector that finds the element, and its path from the page's root
- its position and size, the window size, the pixel ratio and whether the
  page was in light or dark mode
- its HTML, with attributes cut to `id`, `class`, `role`, `data-testid`,
  `href`, `src`, `alt`, `type`, `name` and `aria-*`, and at most 4 KB
- its text, or the selected text, at most 1000 characters
- its styles: up to 40 computed values of the properties its
  [matched CSS rules](#matched-css-rules) set, or, when no rule
  matched, up to 40 styles that differ from the element's defaults
- two screenshots: the visible page as a JPEG and the element on its own
  as a PNG. They arrive as attachments the agent opens, named `[Image 1]`
  on in order. A send holds at most 10 screenshots

Never sent:

- the value of a password field, a field with `autocomplete="off"`, or one
  marked `data-sensitive`. It is blanked in the HTML and hidden in the
  screenshots, and a selection inside one is not offered
- cookies, storage, request and response headers or bodies, or anything
  outside the element, the screenshots and the [page log](#the-page-log).
  Request and response bodies go only from the
  [DevTools panel](/docs/browser/devtools-panel/), when you open them

Screenshots can be turned off in the
[options](/docs/browser/extension/#options); comments then go as text only.
Taking one needs the access a click on the icon or the shortcut grants, so
after a reload press either once more before picking.

## Where in the code

A selector leaves the agent searching for class names. The Where block
gives it the component, the file and the line instead, from whatever the
page offers. Each part is added when it is there and none is needed:

```
component: Button > Form > CheckoutPage
props: label="Pay", onClick=fn, password=[redacted]
source: src/components/Form.tsx:14
rules:
  src/settings/tabs.css:12-18 .tabs-header { gap: 24px; }
route: /checkout
data-testid: pay
id: checkout
aria-label: Pay now
```

With none of it available, the pick still carries the route and, when the
element or one around it has them, its `data-testid` and `aria-label`, and
the element's own `id`, plus its text in the rest of the comment.

### Components and props

Read from the page itself once the tray opens, with nothing to set up and
nothing running in the page before that:

| Framework | What it gives |
| --- | --- |
| React, including Next | The component chain and the props of the component that rendered the element |
| Vue 3 | The chain, the props, and the component's file |
| Svelte | The chain, and the element's own file and line |

The chain holds the six nearest named components, innermost first. It
leaves out unnamed components and providers, and a library's components
except the one your code used directly: a library button shows as `Button`
in your `Form`, without the library's own parts inside it or a framework's
router above your page. A production build, whose names are cut to a letter
or two, gives no chain.

Props are shallow. Text is cut at 200 characters and shown in quotes;
functions show as `fn`, elements as `<Name>`, lists as their length such
as `[3]`, and objects as their first five keys. `children` is left out, and
at most 20 props go. A prop whose name contains `pass`, `secret`, `token`
or `key` goes as `[redacted]`, and when the picked element is a
[field that is never sent](#what-a-comment-carries), every prop does.

Solid gives no chain yet; its file and line come from the plugin below.

### File and line

For the file and line in every framework, turn on
[code-inspector-plugin](https://github.com/zh-lx/code-inspector) in the
app's dev build. It writes each element's place in the source into the
page, and the extension reads it. It covers React, Vue, Preact, Solid,
Qwik, Svelte and Astro, on Vite, webpack, Rspack, Turbopack and esbuild.

Install it as a dev dependency, then add one line to the config:

```sh
pnpm add -D code-inspector-plugin
```

```ts
// vite.config.ts
import { codeInspectorPlugin } from "code-inspector-plugin";

export default defineConfig({
  plugins: [codeInspectorPlugin({ bundler: "vite" }), react()],
});
```

```ts
// next.config.ts, Next 15.3 and later with Turbopack
import { codeInspectorPlugin } from "code-inspector-plugin";

const nextConfig = {
  turbopack: { rules: codeInspectorPlugin({ bundler: "turbopack" }) },
};
```

```ts
// next.config.js, Next with webpack
const { codeInspectorPlugin } = require("code-inspector-plugin");

module.exports = {
  webpack: (config) => {
    config.plugins.push(codeInspectorPlugin({ bundler: "webpack" }));
    return config;
  },
};
```

```ts
// nuxt.config.ts
import { codeInspectorPlugin } from "code-inspector-plugin";

export default defineNuxtConfig({
  vite: { plugins: [codeInspectorPlugin({ bundler: "vite" })] },
});
```

You do not have to write these out. Tori reads each app in a worktree and
knows its framework, its bundler and its package manager:

- When a comment has a component but no file and line, the tray shows
  **File and line: add code-inspector-plugin to** and the config file, such
  as `next.config.ts`, with **Copy**. Copy puts the install command, with a
  `cd` into the app when it is not at the worktree's root, and the line for
  that config on the clipboard.
- The Files panel's [Scripts](/docs/editor/files/#scripts) tab shows the
  same for each app.

Neither shows once the plugin is in the app's `package.json`, or for a
Svelte app, which marks its own lines. Tori never edits your files: you
paste the line, install, and restart the dev server.

The line the plugin gives for a component's outermost element is where the
component is used, such as the `<Button>` in `Form.tsx`, rather than where
that element is written inside `Button.tsx`.

A line from Svelte wins over the plugin's. A file without a line, as Vue
gives, gives way to the plugin's line.

### Matched CSS rules

In place of a dump of computed styles, the block lists the CSS rules that
apply to the element, with where each one is written:

- at most 12, the most specific first, and between equals the later one,
  which is the one that wins
- rules whose selectors are only `*` or a tag, such as a reset's
  `*, ::before` or `button { font: inherit }`, are left out
- rules inside `@media` and `@supports` count only when they apply, and
  those inside `@layer` always; `@container` rules are left out
- each rule's declarations are cut at 300 characters

The place comes from Vite's dev server, which tags each stylesheet it
serves with its file. The lines are found in that sheet, as served:

| Stylesheet | Place |
| --- | --- |
| A CSS file on Vite | The file and its lines, such as `src/settings/tabs.css:12-18` |
| A Vue component's `<style>` | The `.vue` file, with no line |
| Tailwind's generated sheet | The file, with no line. Tailwind's classes are already in the HTML |
| Any other sheet | Its address, such as `/assets/index.css`, or `inline <style>` |

The lines are the sheet's as served, so a sheet a PostCSS step reshaped can
point a little off. When the served text and the rules do not line up at
all, the file goes alone rather than a wrong line.
Stylesheets from another origin cannot be read and are skipped.

## What a tab can reach

A tab speaks for the worktree its dev server runs in. It sees and sends to
that worktree's chats only: a chat belongs to the deepest worktree holding
its folder, so a repo's own checkout and a worktree nested inside it are
kept apart. A tab on no worktree reaches no chat.

## Limits

- Elements inside a frame from another site cannot be picked.
- Firefox, Safari and the phone are not supported yet.
