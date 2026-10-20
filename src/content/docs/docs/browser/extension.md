---
title: The browser extension
description: Which worktree a localhost tab is serving, on the toolbar and in tab groups, and the extension's options.
---

The browser extension tells you which worktree a tab on `localhost` is
serving. With several branches running their dev servers at once, each tab
gets the branch's colour on the toolbar icon and, if you want, a tab group
named after the branch. On those tabs you can also
[pick parts of the page and comment on them](/docs/browser/pick-and-comment/)
for a chat in Tori.

It works in Chrome, Chromium, Brave, Edge and Arc, all of which install it
from the Chrome Web Store. It needs Tori 26.1020.0 or later. Firefox is
planned.

## Setting it up

Two halves: Tori tells the browser where it is, and the browser loads the
extension.

1. In Tori, Settings > Browser > **Install**. Tori writes a small file into
   the `NativeMessagingHosts` folder of each browser it finds, which is how
   a browser is allowed to start `tori` and talk to it, and gives the
   extension a key of its own. Tori writes nothing into a browser's folder
   until you click this.
2. Still in Settings > Browser, **Get the extension** opens its page in the
   Chrome Web Store, in your default browser. Add it there. To add it to
   another browser, open the same page in that one.

The extension then opens a [welcome page](#the-welcome-page), which checks
the connection straight away, and Settings > Browser turns **Connected**.

The **Browsers** row lists each browser Tori found and whether its file is
the one this version of Tori writes. **Connected** means the extension has
reached Tori since the last **Install**. It stays on while the browser is
idle, since the extension drops its connection whenever it has nothing to
do, and a restart of Tori resets it until the extension next calls. When the
extension and Tori are too far apart in version, the row says **Update the
extension** or **Update Tori** instead (see [Versions](#versions)).

**Install again** replaces the key: a browser still using the old one is
turned away and picks up the new one when it reconnects. **Revoke** drops the
extension's connection at once, and it reaches Tori again only after
**Install**.

To build it from source instead, run `pnpm --dir extension build` in a Tori
checkout and load `extension/dist/chrome` with **Load unpacked** in
`chrome://extensions`, Developer mode on. The unpacked build and the store
build share one extension id, so a browser loads one or the other, never
both.

## The welcome page

The first time the extension is added, it opens a welcome page:

- **Connection**: whether Tori is running and set up for this browser, with
  the minimum Tori version when it is not set up, and **Check again**
- **The toolbar icon**: what the dot and its tooltip mean
- **Shortcut**: the pick shortcut as the browser has it now, or **Not set**,
  with **Change**
- **Docs**: opens this page

Asking for the connection is also what tells Tori the extension is there, so
Settings > Browser turns **Connected** without a localhost tab open.

## The toolbar icon

A tab on `localhost`, `127.0.0.1` or `[::1]` with a port is looked up the
same way [`tori ports`](/docs/git/ports/#from-a-shell-or-an-agent) finds a
worktree's dev servers. When the port belongs to a worktree:

- the icon carries a dot in the colour of the worktree's space, mapped onto
  the nine colours a tab group can have
- hovering the icon shows the branch and the project, as `branch, project`
- when the page has [errors you have not sent](#the-error-count), the dot
  becomes their number

Any other tab gets no dot. Hovering says why:

| Title | Meaning |
| --- | --- |
| This tab is not a Tori worktree. | Not a local port, or no worktree is serving it |
| Tori is not running. | The browser started `tori`, but Tori itself is not running |
| Tori is not set up for this browser yet. | No file for this browser, or one naming a different extension: Tori > Settings > Browser > Install |
| This extension is too old for your Tori. Update it from the Chrome Web Store. | See [Versions](#versions) |
| Your Tori is too old for this extension. Update Tori. | See [Versions](#versions) |

Clicking the icon opens Tori's tray on the page: on a worktree tab, ready to
[pick and comment](/docs/browser/pick-and-comment/#starting); on any other,
with the same sentence.

The icon is updated each time a tab loads or changes address, so a dev
server that moves to another worktree shows the new one on the next reload.

### The error count

On a worktree tab, the icon counts what the
[page log](/docs/browser/pick-and-comment/#the-page-log) holds that points
at the page itself and has not been sent yet:

- errors nothing caught and promise rejections nothing handled, when they
  come from the page's own scripts. One from a script on another site, such
  as a CDN or analytics, is not counted. A rejection that says nothing about
  where it came from is counted
- Vite's error overlay and Next's build error dialog
- requests to the page's own server that answer 500 or more, or get no
  answer. A request the page cancels is not counted

`console.error`, warnings, 4xx answers and requests to other sites stay in
the log but never count. A message seen several times counts each time, and
past 999 the icon shows `999+`.

The count drops by what you send, from the tray or the
[DevTools panel](/docs/browser/devtools-panel/), and a reload starts it
over. Moving between routes inside the app keeps it. With **Console and
network** off in the [options](#options), there is no log and no count.

## Tab groups

With **Group tabs by branch** on, a worktree tab that is in no group joins
a group named after its branch, in its space's colour. Every tab for that
branch in the window joins the same group. A tab you grouped yourself is
left where it is.

The switch is in the [options](#options), and it is on by default. Turning
it off groups nothing new and leaves existing groups alone.

## Opening a server from Tori

Clicking a server's port in Tori, on the [worktree's
row](/docs/git/ports/#links-to-running-servers) or in **Scripts**, opens it in
your default browser. With the extension installed there, a second click does
not stack a second tab: Tori's new tab closes and the tab already on that port
comes to the front, in its window. When several tabs are on the port, the one
you used last wins.

Only a tab Tori opened in the last ten seconds is folded this way, and only
when another tab is already on the same port. A tab you open yourself, a tab a
link opened, and a tab Chrome restores or you reopen are never closed, so
several tabs on one server stay as they are.

Without the extension, or with a browser that is not your default, each click
opens a new tab as before. A Tori older than the extension also leaves the new
tab open.

## Options

The options page opens from the tray's **Options** button, or from the
extension's menu in the browser (Options).

| Row | What it does |
| --- | --- |
| Group tabs by branch | The [tab groups](#tab-groups) switch. On by default |
| Screenshots | Whether each comment takes a screenshot of the page and of the element. On by default; off sends comments as text only, from the next comment on |
| Console and network | Whether the extension keeps the [page log](/docs/browser/pick-and-comment/#the-page-log) of console errors and warnings and failed requests, counts its errors on the [toolbar icon](#the-error-count), and offers it in the tray and the [DevTools panel](/docs/browser/devtools-panel/). On by default; a change applies from the next time a tab loads |
| Shortcut | The key that starts and stops picking. **Change** opens the browser's shortcut page, the only place it can be set |
| Connection | Whether Tori is running and set up for this browser. **Check again** asks once more |

## Permissions

| Permission | Why |
| --- | --- |
| Native messaging | Starting `tori` to talk to the running app |
| Tabs | Reading a tab's address to find its worktree |
| Tab groups | Grouping tabs by branch |
| Storage | The options, and a tab's comments until they are sent |
| Active tab, scripting | Drawing the tray and the picker on the page you clicked, its screenshots, and the page log on localhost pages |
| `localhost` and `127.0.0.1` | The dev servers it reads |

It asks for nothing else, and reads no site but those two hosts.

## Versions

The extension updates itself from the store, and Tori updates when you
update it, so the two can be on different versions. Every message the
extension sends carries the version of the format it speaks, and Tori reads
a range of them. Inside the range, any pair works. Outside it, Tori turns
the extension away with the side to update, both on the toolbar icon and in
Settings > Browser:

- **Update the extension**: the extension is older than this Tori reads.
  The browser updates extensions on its own every few hours; in
  `chrome://extensions`, Developer mode, **Update** does it now.
- **Update Tori**: the extension is newer than this Tori reads. See
  [Updates](/docs/updates/).

The message clears with the next call that gets through.

## Privacy

Nothing leaves the browser except to the Tori app on your own Mac:

- The extension talks only to the `tori` the browser starts through native
  messaging, which hands everything to the running app. No server is
  involved, Tori's or anyone else's, and there are no analytics.
- It sees every tab's address, which is how it tells the localhost ones
  apart, and keeps the others to itself. For a tab on `localhost` or
  `127.0.0.1` it sends the address, to find its worktree, and, when you pick
  and send, the
  [comment and what comes with it](/docs/browser/pick-and-comment/):
  the element's HTML, text, styles and source, screenshots when they are on,
  and the page log entries you leave checked when it is on. A failed
  request's bodies go only from the
  [DevTools panel](/docs/browser/devtools-panel/), when you open them.
- Comments waiting to be sent, their screenshots, and the options stay in the
  browser's own storage for the extension.
- The only links it opens are this page and the browser's shortcut page.

What Tori does with a comment once it has it is the same as anything you type
into a chat: see [Files and privacy](/docs/reference/files-and-privacy/).

## What it can do

The extension connects as its own kind of caller, apart from shells, chats
and the phone. It may list sessions and read their tail, steer a live chat
with files it wrote into Tori's attachments, open a new chat draft for you
to send, bring the window forward on a chat, answer a chat's questions, and
read the project tree and the worktree serving a port. Everything that
touches a chat is held to the tab's worktree
([what a tab can reach](/docs/browser/pick-and-comment/#what-a-tab-can-reach)).
It cannot start sessions, and the
[tool table](/docs/automation/mcp-server/#every-tool) lists every method it
may call.
