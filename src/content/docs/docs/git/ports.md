---
title: Ports and dev servers
description: See which dev server each worktree is running, and give every worktree its own block of ports.
---

Two worktrees of one project both start a dev server, and one of them either
fails or quietly moves to another port. Tori helps from two sides: it shows
which server belongs to which worktree, and it hands each worktree a block of
ports its servers can use.

## Links to running servers

Every server listening from a worktree shows up as a link, with nothing to set
up and whatever port it picked:

- On the worktree's row in the sidebar, as `:5173`. Click it to open
  `http://localhost:5173` in your browser.
- At the top of the **Scripts** section, as `localhost:5173`. Click to open it,
  or right-click for **Open in browser** and **Copy URL**.

A server belongs to the worktree its process runs in, so a server started from
a package folder inside the worktree counts too. When worktrees are nested,
the deepest one wins. Servers running anywhere else on the machine are not
shown, and neither are Tori's own language servers and debug adapters.

The list refreshes every 30 seconds while the Tori window is visible, when the
window gets focus, and a few seconds after a terminal goes quiet, so a server
you just started shows up shortly after it prints its banner. Nothing is
scanned while the window is hidden. A stopped server's link goes away on the
next refresh.

Any process listening on TCP from the worktree gets a link, so a
`node --inspect` port shows up next to the dev server.

## A block of ports per worktree

Every terminal tab, chat session and [setup
command](/docs/git/worktrees-and-branches/#a-setup-command-for-new-worktrees)
Tori starts in a checkout gets ten ports in its environment:

| Variable | Value |
| --- | --- |
| `TORI_PORT` | The first port of the block, for example `40010` |
| `TORI_PORT_1` to `TORI_PORT_9` | The nine after it |

The block stays the same for the life of the worktree, so a server that uses
it keeps the same URL. The main checkout gets one too, and a submodule uses its
worktree's block. A folder outside any git checkout gets no block.

Blocks are handed out the first time something starts in a checkout. Tori
skips any block where a port is already in use. Removing a worktree from Tori
frees its block at once; a worktree folder deleted some other way frees its
block the next time anything starts in a checkout.

### Using the block

Tori does not set `PORT`. A server uses the block only when you pass it the
port. If you did that and two servers in one worktree picked up the same
variable, they would collide with each other.

For Vite and anything built on it, pass the flag:

```sh
vite --port ${TORI_PORT:-5173}
```

For servers that read `PORT` (Next.js, Express, Nuxt, Rails):

```sh
PORT=$TORI_PORT next dev
```

The `:-5173` fallback keeps the script working outside Tori. With two servers
in one worktree, give the second one `$TORI_PORT_1`.

An agent can read `$TORI_PORT` too, so it knows where its server will be
before starting anything.

The registry of blocks is `~/.config/tori/ports.json`.
