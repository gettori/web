---
title: Go to anything
description: Cmd+K finds any space, project, branch, Topic, chat or session by name or by an issue or pull request number, runs any command, switches themes and settings, shows usage, and starts a chat or a worktree from what you typed.
---

Press `Cmd+K`, or choose **Go > Go to Anything** in the menu bar. It is the
same box as `Cmd+P` (see [Search and the omnibox](/docs/workspace/search-and-shortcuts/)),
opened on everything instead of on files. Type a few letters and one list holds
places, commands and settings, best match first. `Enter` takes the highlighted
row.

## What it finds

| Row | Shows | `Enter` |
| --- | --- | --- |
| Space | Its name and how many projects | Switches to it |
| Project | Its name and space | Switches to its space and opens it in the sidebar |
| Branch or worktree | The branch, `Space / Project`, its issue and pull request | Selects it |
| Topic | Its name and its repositories | Opens it |
| Topic member | The repository and the Topic | Opens the Topic on that repository |
| Review request | The pull request's title, who asked, and the project | Opens the review worktree, making it the first time |
| Chat | Its name and space | Opens it |
| Session | Its name and `Project / branch` | Opens it |
| Command | The command and its keys | Runs it |

Sessions in other spaces are found too. A plain branch that is not checked out
asks before Tori switches to it, as a click on its row does.

The word at the right end of a row names the kind. A dot shows a session that
waits on you or one that is working. The pull request chip has the colours the
sidebar gives it. A pull request in a space you are not in shows as Tori last
saw it, greyed out.

## With nothing typed

The list has three groups:

- **Needs you**: every session waiting on you, newest first, with what it
  waits for. It is the list the Inbox's **Needs you** tab counts.
- **Recent**: the last five places you were in, not counting the one you are
  in now. The first is highlighted, so `Cmd+K` then `Enter` takes you back,
  and doing it again flips you back.
- **Suggested**: a new session with your first agent, **Add worktree to** the
  project you are in, and **Open PR #214 in browser** when the branch has one.

When all three are empty, the list is the commands.

## How it ranks

A match on the whole title ranks above one at the start of a word, which ranks
above letters spread through it. Between two rows that match equally well:

1. the row you picked for the same text before comes first,
2. then places you were in more recently,
3. and the place you are in now comes last.

Some rows also answer to words that are not in their title: `wt` for the
**Add worktree** rows, `prefs` for every setting, `dark` and `light` for
themes, and `usage`, `quota` or `limits` for usage.

## Find by number

Type an issue or pull request number: `92`, `#92`, `tickets#92`,
`gettori/tickets#92`, or paste the issue's or pull request's URL. The results
come in this order:

1. The branch or Topic linked to that issue.
2. The branch whose pull request has that number.
3. A branch with that number in its name, such as `tickets-92-side-panel`.
4. A chat or session that mentioned the issue, with **mentions tickets#92**
   under it. See [Mentioned issues](#mentioned-issues).

The matched number is marked in its chip, and a row found by its issue shows
the issue's title. A number also matches inside a longer one, so `92` finds
`#1924`, below every exact match. A bare number matches any repository;
`tickets#92` matches only the repository named `tickets`.

In `Cmd+K`, `#92` is a number. `#` followed by anything else searches symbols
across the project, and so does `#92` typed from `Cmd+P`.

### Look an issue up

When no row has exactly that number and the branch you are in has issues set
up (see [Start from an issue](/docs/git/worktrees-and-branches/#start-from-an-issue)),
the last row is **Look up #118 in gettori/tickets**. `Enter` asks the host and
the row says **Looking up** while it waits. An issue it finds becomes **Start a
worktree from tickets#118:** and its title, which opens **Add worktree** on the
**Issue** tab with that issue filled in. When there is no such issue, the row
says why, and `Enter` asks again. With a Topic or a chat selected there is no
lookup.

## Keys

| Keys | What it does |
| --- | --- |
| `ArrowUp`, `ArrowDown` | Move the highlight |
| `Enter` | What the footer says: **Go**, **Run**, **Create**, **Apply** and so on |
| `Cmd+Enter` | Opens the row's pull request in your browser, or its issue when there is no pull request |
| `Escape` | Closes the box |
| `?` | Lists the filters |

The footer names what `Enter` does on the highlighted row, and shows **Open in
browser** when `Cmd+Enter` does something there.

## Filters

A prefix narrows the list:

| Prefix | Searches |
| --- | --- |
| `/` | Files in the project |
| `>` | Commands only |
| `@` | Symbols in the open file |
| `#` | Symbols across the project |
| `:` | A line number to jump to |
| `?` | What the prefixes do |

The tag at the right of the box names the filter and lights up while one is on.
Delete the prefix to come back to everything.

## Commands

Every command in Tori is a row, with its keys when it has them. A command that
cannot run right now is greyed out with the reason under it. Some rows depend
on where you are:

- **For the branch you are in**: **Open PR #214 in browser**, **Open issue #92
  in browser**, **Copy branch name**, **Copy path**, an **Open
  localhost:5173** row for each port it serves, and a **Run task:** row for
  each npm script, Make target and just recipe the project defines.
- **Sessions**: **New Claude session**, one row per agent you can start, and
  a **Stop** row for each running chat. **Session History** and **New
  Terminal** act on the branch or Topic you are in, and **Continue This
  Session in Chat** moves the terminal session in front into a chat.
- **Projects**: **Add worktree to tori...**, or **Add branch to tori...** for a
  plain repository, for every git project, and **Project settings: tori** for
  every project. The
  project you are in also gets a row for each section of its settings.
- **The workspace**: **New Topic...**, **New Space...**, **New Project...**,
  **Attach Folder...**, **Space Settings...**, **Sort Projects into
  Spaces...**, **Pair a Phone...**, and **Show Graph** with a branch selected.
- **The Inbox**: **Inbox: Needs You**, **Inbox: Permissions** and **Inbox:
  Review** open it on that tab.
- **Autopilot: Set sail** or **Autopilot: Drop anchor**, when **Enable
  autopilot** is on.

## Themes, settings and usage

**Themes.** Each theme is a row, such as **Theme: Tori Light**, with three of
its colours and a check on the one you use. Move onto a row with the arrow keys
and the whole window shows that theme without saving it. `Enter` keeps it.
`Escape`, or closing the box any other way, puts yours back.

**Settings.** **Settings: Appearance**, and a row like it for every tab, opens
Settings on that tab. **Preferences:** rows work as in the
[settings reference](/docs/reference/settings/): an on and off setting shows
**On** or **Off** and flips in place. Six settings with a few fixed values
also have one row per value, with a check on the one in force, and `Enter`
sets it:

| Setting | Values |
| --- | --- |
| When a chat needs a worktree | Ask me first, Create it, Refuse |
| Space tiles | Bottom, Left |
| Current line highlight | Nowhere, Gutter only, The line, Gutter and line |
| Open sessions in | Chat, Terminal (agent tab) |
| Transcript density | Comfortable, Compact |
| Timestamps | Prompts, Prompts and replies, Replies, Off |

The rows read like **Timestamps: Replies**.

**Usage.** Each account the title bar's usage strip shows is a row, **Claude**
or **Claude, Work**, with each window's level and the next reset, such as
`5 Hour 42%, Week 18%, resets in 2h 10m`. Its meter turns to the warning
colour past the account's **Warn at**. `Enter` opens that account's
[usage card](/docs/agents/accounts-and-usage/#the-usage-card) and keeps it
open.

## Paste a path or an address

Paste a file's absolute path, into `Cmd+K` or `Cmd+P`, and the list is the
branch, worktree or Topic repository that holds it, with the file under it.
`Enter` goes there and opens the file. A line number after the path, as a
compiler prints it (`App.tsx:12` or `App.tsx:12:5`), opens the file at that
line. A path inside no project Tori knows is searched as files, since `/` is
the files prefix.

Paste `localhost:5173`, with or without `http://` and a path, or the same
with `127.0.0.1`, and the list is the worktree serving that port. `Enter` goes
to the worktree, and `Cmd+Enter` opens the port in your browser.

## Start something new

Whatever you type, the list ends with **New chat:** and your text. `Enter`
starts a chat with the text in its draft, not sent.

When the text could be a branch name (no spaces, and a `-`, `/` or `_` in it)
and you are in a branch of a git project, **New worktree fix-login in tori**
comes just before it, or **New branch** in a plain repository. `Enter` opens
**Add worktree** with the name typed in. A branch that is already open gets no
such row.

When nothing matches, the box says so, then offers the new chat and branch, and
last **Search files for** your text, which switches the box to the files filter
with your text in it.

## Link an issue

A branch or worktree started from an issue is linked to it. To link one later,
or to link a Topic:

- Right-click the branch or worktree and choose **Link issue...**, or run
  **Link Issue to This Worktree...** from `Cmd+K`.
- Right-click the Topic and choose **Link issue...**, or run **Link Issue to
  This Topic...**. A Topic looks the issue up in its first repository's
  issue repos.

Type the issue as a number, `repo#N` or its URL. When the number is an issue in
more than one repository, Tori asks which one you meant. Linking a branch that
already has an issue replaces it. The issue's number then shows on the row, and
`Cmd+K` finds the branch by it.

**Unlink issue** in the same menu, or **Unlink Issue** and **Unlink Issue
from This Topic** in `Cmd+K`, removes the link. With a branch selected, `Cmd+K`
offers only the branch's pair; with a Topic selected, only the Topic's.

Only you link an issue. Agents never do.

### Mentioned issues

Tori notes the issues a chat mentions: one it reads with Tori's issue tool, and
one whose URL you send it. `Cmd+K` then finds the chat by that issue's number.

When the chat's branch or Topic has no issue yet, a **Mentioned** chip, such as
**Link #92**, shows in the lane strip above the composer. Click it to link that
issue. The **x** beside it hides that issue for this chat, and an older mention,
if there is one, takes its place. A chat in Home has no branch, so it gets no
chip.
