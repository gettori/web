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

On a worktree tab the tray shows a count, such as
`Page log: 2 errors, 1 failed request`, and keeps it current while open.
Send, **New chat in Tori** and **Copy as Markdown** all add the log under
the comments as a **Page log** section. Each line has its time from the
first comment, so what happened before you picked reads as negative,
such as `-3.4s`.

You can send with no comments at all. When the page is broken and the
log has something, the toolbar icon's tray offers Send, **New chat in
Tori** and **Copy as Markdown** under **Pick and comment**, and the agent
gets the log alone.

A send takes only what came after the last send, so sending twice from
the same page does not repeat itself. Copying does not count as a send.
A reload starts the log over; moving between routes inside the app does
not.

The log is turned off with **Console and network** in the
[options](/docs/browser/extension/#options). A change applies from the
next time a tab loads, and a tab that loaded before the extension was
installed has no log until it reloads.

## What a comment carries

For each comment, the agent gets:

- the page's address and the route
- a CSS selector that finds the element, and its path from the page's root
- its position and size, the window size, the pixel ratio and whether the
  page was in light or dark mode
- its HTML, with attributes cut to `id`, `class`, `role`, `data-testid`,
  `href`, `src`, `alt`, `type`, `name` and `aria-*`, and at most 4 KB
- its text, or the selected text, at most 1000 characters
- up to 40 styles that differ from the element's defaults
- two screenshots: the visible page as a JPEG and the element on its own
  as a PNG. They arrive as attachments the agent opens, named `[Image 1]`
  on in order. A send holds at most 10 screenshots

Never sent:

- the value of a password field, a field with `autocomplete="off"`, or one
  marked `data-sensitive`. It is blanked in the HTML and hidden in the
  screenshots, and a selection inside one is not offered
- cookies, storage, request and response headers or bodies, or anything
  outside the element, the screenshots and the [page log](#the-page-log)

Screenshots can be turned off in the
[options](/docs/browser/extension/#options); comments then go as text only.
Taking one needs the access a click on the icon or the shortcut grants, so
after a reload press either once more before picking.

## What a tab can reach

A tab speaks for the worktree its dev server runs in. It sees and sends to
that worktree's chats only: a chat belongs to the deepest worktree holding
its folder, so a repo's own checkout and a worktree nested inside it are
kept apart. A tab on no worktree reaches no chat.

## Limits

- Elements inside a frame from another site cannot be picked.
- Firefox, Safari and the phone are not supported yet.
