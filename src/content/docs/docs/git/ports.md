---
title: Ports and dev servers
description: See which dev server each worktree is running, and give every worktree its own block of ports.
---

Two worktrees of one project both start a dev server, and one of them either
fails or quietly moves to another port. Tori helps from two sides: it shows
which server belongs to which worktree, and it hands each worktree a block of
ports its servers can use.

## Links to running servers

Turn on **Show dev server links** in [Project
settings](/docs/workspace/project-settings/#tooling) > **Tooling** >
**Dev servers**, and every server listening from that project shows up as a
link, with nothing else to set up and whatever port it picked:

- On the worktree's row in the sidebar, as `:5173`. Click it to open
  `http://localhost:5173` in your browser. It is amber while the [browser
  extension](/docs/browser/extension/) is connected, grey otherwise.
- At the top of the **Scripts** section, as `localhost:5173`. Click to open it,
  or right-click for **Open in browser** and **Copy URL**.

With the [browser extension](/docs/browser/extension/#opening-a-server-from-tori)
installed, clicking a port that already has a tab brings that tab to the front
instead of opening another.

It is off by default, per project. Finding servers runs `lsof`, so a project
that serves nothing, a CLI or an Android app, never pays for it. It works for
every kind of project: a bare repo's worktrees, a normal clone, and a plain
folder.

A server belongs to the worktree its process runs in, so a server started from
a package folder inside the worktree counts too. When worktrees are nested,
the deepest one wins. A server running somewhere else that listens on a port
of the worktree's [block](#a-block-of-ports-per-worktree) counts too, which is
how a Docker container published on `$TORI_PORT` shows up. Other servers on the
machine are not shown, and neither are Tori's own language servers and debug
adapters.

There is no timer. The links refresh when the Tori window gets focus or comes
back on screen, a few seconds after a terminal goes quiet, and when a [run
command](/docs/git/worktrees-and-branches/#a-run-command-for-each-worktree)
starts or stops. So a server you start in a Tori terminal shows up shortly
after it prints its banner. A server started in another app shows up the next
time you come back to Tori, and a server that dies by itself stays listed
until the next refresh. Nothing is scanned while the window is hidden.

Any process listening on TCP from the worktree gets a link, so a
`node --inspect` port shows up next to the dev server.

## A block of ports per worktree

Every terminal tab, chat session, [setup
command](/docs/git/worktrees-and-branches/#a-setup-command-for-new-worktrees),
[run command](/docs/git/worktrees-and-branches/#a-run-command-for-each-worktree)
and [teardown command](/docs/git/worktrees-and-branches/#a-teardown-command-before-removal)
Tori starts in a checkout gets ten ports in its environment:

| Variable | Value |
| --- | --- |
| `TORI_PORT` | The first port of the block, for example `40010` |
| `TORI_PORT_1` to `TORI_PORT_9` | The nine after it |

To export fewer, set **Ports per worktree** under Project settings >
Tooling > **Dev servers**, or let the repository propose a count in
[`.tori/project.json`](/docs/git/project-config/). With 3, only `TORI_PORT`,
`TORI_PORT_1` and `TORI_PORT_2` are set. The block itself stays ten wide.

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

For a Tauri app, the template pins Vite to port 1420 with `strictPort`, so a
second worktree's `tauri dev` fails instead of moving. Read the block in
`vite.config.ts`:

```ts
server: { port: Number(process.env.TORI_PORT) || 1420, strictPort: true },
```

and point Tauri at the same port in the run command:

```sh
tauri dev --config "{\"build\":{\"devUrl\":\"http://localhost:${TORI_PORT:-1420}\"}}"
```

The `:-5173` fallback keeps the script working outside Tori. With two servers
in one worktree, give the second one `$TORI_PORT_1`.

An agent can read `$TORI_PORT` too, so it knows where its server will be
before starting anything.

The registry of blocks is `~/.config/tori/ports.json`.

## From a shell or an agent

The same answers are on the [CLI](/docs/automation/cli/) and the [MCP
server](/docs/automation/mcp-server/#every-tool), and they work with the window
closed:

```sh
$ tori ports
main  ~/work/api  base 40000  5173
fix/retry  ~/work/api-fix-retry  base 40010  40010,40011
```

- `tori ports` lists every worktree with a server listening or a block: its
  branch, folder, block base and listening ports. `--json` for scripts. The MCP
  tool is `ports_list`.
- `tori open --browser` opens the worktree you are in at
  `http://localhost:<port>` in your default browser. Give a branch to open
  another worktree of the same project. The port is `$TORI_PORT` when a server
  listens on it, and the lowest listening port otherwise.
- The MCP tool `worktree_at` takes a port and answers the worktree serving it,
  or nothing.

These scan when asked rather than on the window's refreshes, and answer from a
scan up to two seconds old. A port nobody owns is looked for again at once, so a
server that just started is found.
