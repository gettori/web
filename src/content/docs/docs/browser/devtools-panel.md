---
title: The DevTools panel
description: A Tori tab in the browser's DevTools that lists the page's errors and failed requests, with their bodies, sends the ones you pick to a chat, and comments on the element selected in Elements, plus a Tori pane in Elements that shows a selected element's component, file and line.
---

The extension adds a **Tori** tab to the browser's DevTools. It lists the
same [page log](/docs/browser/pick-and-comment/#the-page-log) as the tray,
adds what only DevTools can see about a failed request, and sends the
entries you pick to a chat in the worktree.

## Opening it

Open DevTools on a worktree tab (Cmd+Opt+I on a Mac, F12 elsewhere) and
choose **Tori** among its tabs. An extension cannot open DevTools for you,
so the toolbar icon opens the tray instead, and the tray's open page log
says **More in DevTools > Tori**. DevTools opens again on the tab used
last.

The header shows the branch, and how many entries are
[counted on the toolbar icon](/docs/browser/extension/#the-error-count).
In place of the list, the panel can say:

| Message | Meaning |
| --- | --- |
| This tab is not a Tori worktree. | The page is not served by one of your worktrees, or Tori is not running or not set up |
| The page log is off in the Tori options. | **Console and network** is off in the [options](/docs/browser/extension/#options) |
| Reload the page to start the page log. | The page loaded before the extension was installed or the option was turned on |
| Nothing on this page yet. | The log is empty |

## Commenting on the selected element

Select an element in the **Elements** tab, then press **Comment on
selected element** in the Tori panel's header. The page scrolls the
element into view and opens the comment box beside it, the same box a
[pick](/docs/browser/pick-and-comment/#picking) opens. Click in the box and
write the comment. It joins the comments in the tray, and you send them
from the [tray](/docs/browser/pick-and-comment/#sending), not from the
panel.

The button shows only on a worktree tab. Instead of opening the box, the
panel can say:

| Message | Meaning |
| --- | --- |
| Select an element on this page in the Elements panel. One inside a frame cannot be picked. | Nothing is selected, or the element is inside a frame |
| Select an element inside the page, not the whole document. | The selection is `html`, `head` or `body` |
| That element has no size on the page, so there is nothing to point at. | The element is hidden or has no width or height |
| That is Tori's own overlay. | The selection is part of Tori's tray or comment box |
| Tori could not reach the page. Reload it and try again. | The picker did not answer on the page |

## The Tori pane in Elements

The **Elements** tab gets a **Tori** pane in its sidebar, next to
**Styles** and **Computed**. For the element selected in Elements, it
shows what a comment on that element would carry and where it would go:

| Row | What it shows |
| --- | --- |
| Element | The tag, with its id or first class, as in the comment box |
| Components | The [component chain](/docs/browser/pick-and-comment/#components-and-props), innermost first, or **No components found** |
| Source | The [file and line](/docs/browser/pick-and-comment/#file-and-line), or **No source line** |
| Worktree | The branch serving the tab |
| Sends to | The chat chosen in the tray. If the tray has not chosen one, the first live chat in the worktree, or **New chat in Tori** when there is none |

The pane follows the selection, and reads again when you come back to the
pane or the page reloads. Opening it on a worktree tab loads Tori's picker
into the page, the same as the toolbar icon does.

**Comment** opens the page's comment box on the element, the same as
**Comment on selected element** in the panel. On `html`, `head`, `body`
or an element with no size, the pane still shows the element, but
**Comment** is off and the reason shows beside it. In place of the rows,
the pane can say the sentences from the panel's tables above: that the tab
is not a Tori worktree, that the element is in a frame or in Tori's
overlay, or that Tori could not reach the page.

## The list

Every entry not yet sent, newest first, with its kind, its first line and
its count. The kind of an entry counted on the toolbar icon is in amber.
The list follows the page as it goes, and starts over when the page
reloads.

DevTools also sees requests to the page's own server that answer 500 or
more, or get no answer, from the moment DevTools opens: page loads,
scripts and images as well as `fetch` and `XMLHttpRequest`. A request the
page log also noted shows as one entry, not two. One only DevTools saw
gets its own entry. Requests to other sites, and requests the page
cancels, are left out.

## Bodies

An entry with a request behind it has **Bodies**. It opens the request's
address, the body the page sent and the body the server answered, as text.
A binary answer shows as `(binary)`. **Hide** closes it.

An entry's bodies go with it only while they are open, each cut at 4 KB.
Closed, the entry goes as its one line, like from the tray. Headers never
go.

## Sending

Each entry has a checkbox, checked when it arrives. Choose a live chat in
this worktree under **Send to**, or **New chat in Tori**, and press
**Send** with the number of checked entries. The agent gets them as a
**Page log** section, the same as from the
[tray](/docs/browser/pick-and-comment/#sending), and the same rules hold:
a chat waiting on you is not sent to, and a new chat opens as a draft you
send from Tori.

A send from the panel carries only the log. Comments waiting in the tray
stay there. What you send drops out of the list, out of the tray's list,
and off the count on the toolbar icon.
