---
title: Commands from the repository
description: Let a repository propose its own setup, run and teardown commands, port count and verification commands in .tori/project.json, used only after you accept them.
---

A team that wants every clone to install the same way can write that down
once, in the repository, instead of each person typing it into Project
settings. Tori reads it as a proposal: nothing in it runs until you have seen
it and accepted it.

## The file

Put `.tori/project.json` at the top of the repository and commit it. Every
field is optional:

```jsonc
{
  // Comments are fine, the file is read as JSON5.
  "setupCommand": "pnpm install --frozen-lockfile",
  "runCommand": "pnpm dev --port $TORI_PORT",
  "teardownCommand": "docker compose down --volumes",
  "ports": 3,
  "checks": ["pnpm test", "pnpm lint"]
}
```

| Field | What it proposes |
| --- | --- |
| `setupCommand` | The [setup command](/docs/git/worktrees-and-branches/#a-setup-command-for-new-worktrees) for new worktrees |
| `runCommand` | The [run command](/docs/git/worktrees-and-branches/#a-run-command-for-each-worktree) started from a worktree's row |
| `teardownCommand` | The [teardown command](/docs/git/worktrees-and-branches/#a-teardown-command-before-removal) run before a worktree is removed |
| `ports` | How many ports of each worktree's [block of ten](/docs/git/ports/#a-block-of-ports-per-worktree) are exported, from 1 to 10. With `3`, a worktree gets `TORI_PORT`, `TORI_PORT_1` and `TORI_PORT_2` |
| `checks` | The [commands that count as a check](/docs/reference/security/#what-counts-as-a-check) |

A key Tori does not know, a value of the wrong type, an empty command and a
`ports` outside 1 to 10 are ignored. A file left with nothing usable proposes
nothing. Opened in Tori's editor, the file is checked against a schema, so a
mistake is underlined as you type.

Whether a worktree also runs the command on creation, waits for setup, or
opens the browser stays your choice in Project settings. The file cannot set
those.

### If git does not see the file

Tori keeps its own files out of git by adding `.tori` to the repository's
`.git/info/exclude`, so in a repository Tori has already worked in, a new
`.tori/project.json` does not show as a change. Add it once by hand, and git
tracks it from then on:

```sh
git add -f .tori/project.json
```

## Accepting it

The first time you open a worktree whose file you have not answered, a toast
says **This repo proposes commands for its worktrees. Nothing from it runs
until you accept it.** **Review** opens the proposal: each field it sets, then
the file itself. If you accepted an earlier version, the file is shown as a
diff against the one you accepted.

- **Accept** uses it. When the accepted file sets the setup command in force
  for that worktree, a second toast offers **Run setup now**, which stops a
  setup still running there and starts the new one. Nothing reruns unless you
  click it.
- **Decline** uses none of it. A declined file never toasts again.

The answer is for that exact content. Worktrees whose file is the same share
one answer, so accepting on one branch covers every other branch with the
same file. When the file changes, on a new branch or in a commit, that
worktree asks again and runs your own commands until you answer.

A file you have not answered, or declined, waits under Project settings >
**Tooling** > **Repo proposals**, one row per worktree with **Review**, and
**Accept** on a declined one.

## Which value wins

Field by field:

1. Your own value in Project settings, when it is not empty.
2. Otherwise the value from the worktree's accepted file.
3. Otherwise nothing, or for ports the full ten, or for checks the built-in
   list.

So to replace one command, type your own. To turn the repository's commands
off without replacing them, decline the file.

Project settings shows what is in force. Under a command you left empty,
each accepted value is listed with a **repo** mark and the worktrees that run
it, since two branches can carry different files. Typing a value hides them.
The same goes for **Ports per worktree** under **Dev servers**, where
**Reset** goes back to the repository's count, and for **Verification
commands** while the project has no list of its own.

## When it is never read

- **An untrusted project.** The file is not read and nothing asks until you
  [trust the project](/docs/reference/security/#project-trust).
- **A fork's pull request.** A worktree made from a fork's pull request never
  runs anything from the file, accepted or not, the same as with your own
  commands.

Acceptance is yours alone to give. It lives in `~/.config/tori/proposals.json`,
outside any repository, so a file cannot ship its own acceptance, and neither
the CLI, the socket nor the MCP server can accept or decline one. An agent
cannot approve a file it wrote.

`tori worktree new` says where the new worktree stands on stderr, as
`proposal accepted`, `proposal unaccepted` or `proposal declined` when it has
a file, `proposal untrusted` in an untrusted project and `proposal fork` for a
fork's pull request. It prints nothing when there is no file, so a script can
tell when the setup that ran was yours alone.
