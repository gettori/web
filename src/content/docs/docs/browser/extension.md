---
title: The browser extension
description: Which worktree a localhost tab is serving, on the toolbar and in tab groups.
---

The browser extension tells you which worktree a tab on `localhost` is
serving. With several branches running their dev servers at once, each tab
gets the branch's colour on the toolbar icon and, if you want, a tab group
named after the branch.

It works in Chrome, Chromium, Brave, Edge and Arc. Firefox is planned.

## Setting it up

Two halves: Tori tells the browser where it is, and the browser loads the
extension.

1. In Tori, Settings > Browser > **Install**. Tori writes a small file into
   the `NativeMessagingHosts` folder of each browser it finds, which is how
   a browser is allowed to start `tori` and talk to it, and gives the
   extension a key of its own. Tori writes nothing into a browser's folder
   until you click this.
2. Load the extension. It is not in the Chrome Web Store yet, so for now it
   is built from source: `pnpm --dir extension build` in a Tori checkout
   gives `extension/dist/chrome`. In `chrome://extensions` turn on
   Developer mode, then **Load unpacked** and pick that folder.

The unpacked build and the store build share one extension id, so a browser
loads one or the other, never both.

The **Browsers** row lists each browser Tori found and whether its file is
the one this version of Tori writes. **Connected** says whether a browser is
talking to Tori right now.

**Install again** replaces the key: a browser still using the old one is
turned away and picks up the new one when it reconnects. **Revoke** drops the
extension's connection at once, and it reaches Tori again only after
**Install**.

## The toolbar icon

A tab on `localhost`, `127.0.0.1` or `[::1]` with a port is looked up the
same way [`tori ports`](/docs/git/ports/#from-a-shell-or-an-agent) finds a
worktree's dev servers. When the port belongs to a worktree:

- the icon carries a dot in the colour of the worktree's space, mapped onto
  the nine colours a tab group can have
- hovering the icon shows the branch and the project, as `branch, project`

Any other tab gets no dot. Hovering says why:

| Title | Meaning |
| --- | --- |
| not a Tori worktree | Not a local port, or no worktree is serving it |
| Tori is not running | The browser started `tori`, but Tori itself is not running |
| not set up: Tori > Settings > Browser > Install | No file for this browser, or one naming a different extension |

The icon is updated each time a tab loads or changes address, so a dev
server that moves to another worktree shows the new one on the next reload.

## Tab groups

With **Group tabs by branch** on, a worktree tab that is in no group joins
a group named after its branch, in its space's colour. Every tab for that
branch in the window joins the same group. A tab you grouped yourself is
left where it is.

The switch is in the extension's popup, and it is on by default. Turning it
off groups nothing new and leaves existing groups alone.

## The popup

Clicking the icon shows the tab's branch and project, or why it has none,
and the groups switch.

## Permissions

| Permission | Why |
| --- | --- |
| Native messaging | Starting `tori` to talk to the running app |
| Tabs | Reading a tab's address to find its worktree |
| Tab groups | Grouping tabs by branch |
| Storage | Remembering the groups switch |
| Active tab, scripting | Reserved for features that act on the page you are on |
| `localhost` and `127.0.0.1` | The dev servers it reads |

Debugger, web request and access to other sites are optional: nothing asks
for them yet.

## What it can do

The extension connects as its own kind of caller, apart from shells, chats
and the phone. It may list sessions and read their tail, steer a chat,
answer its questions, and read the project tree and the worktree serving a
port. It cannot start sessions, and the
[tool table](/docs/automation/mcp-server/#every-tool) lists every method it
may call.
