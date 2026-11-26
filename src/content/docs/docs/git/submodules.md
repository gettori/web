---
title: Submodules
description: How Tori shows, commits, checkpoints and pushes git submodules, and what a chat tells you when it changes one.
---

A submodule is a separate git repository checked out inside your project. The
parent repo records only which commit of it to use, the **pointer**. Tori
treats each initialized submodule as its own repo. It has its own changes, its
own commits, its own branch and its own pull request, and the parent gets a
pointer change once the submodule has moved.

Nested submodules work the same way, at any depth.

## In the file tree

A submodule folder has a small repo badge after its name. Hover it to see
where it stands:

- **Submodule on main** (or whatever branch it is on), or **at 1a2b3c4,
  detached** when it is on no branch, which is how `git submodule update`
  leaves it.
- **, with changes** is added when the parent sees it as changed: edited
  files inside it, or a commit other than the one the parent records. A dot
  at the end of the row marks the same thing.
- **Submodule, not checked out** when the folder is empty because the
  submodule was never initialized. The badge is dimmed.

To fill an empty submodule, right-click it and pick **Initialize Submodule**.
Tori clones it with the project's git account and checks out the commit the
parent records, along with any submodules nested inside it.

Files inside a submodule show their own git status in the tree, from the
submodule's repo, not the parent's.

## In the Changes panel

A submodule with changes gets its own section in Changes, right after the
repo that holds it. The header shows the submodule's path and its branch.
Everything inside the section works the same as for the parent: diffs,
staging single hunks, discarding, and the commit message.

### The pointer row

In the parent's section, a changed submodule is one row, not a list of files.
It shows the move as `old sha -> new sha`. It adds **-dirty** when the
submodule also has uncommitted edits, and says **edited inside** when only
its files changed and its commit did not. Open the row to see the
submodule's commits between the two, with commits the parent records but the
submodule no longer has listed separately.

- **Stage** records the submodule's current commit in the parent, ready to
  commit. **Unstage** takes it back out.
- **Discard** checks the submodule back out at the commit the parent records,
  after a confirm. The submodule's own commits are not deleted: a branch it
  is on keeps them.

### Committing a detached submodule

A submodule left detached by `submodule update` has no branch to commit to.
Its section header shows a branch name field instead, filled in with the
parent's branch name (with `-2`, `-3` and so on added when that name is
already taken at another commit). Committing creates that branch at the
current commit first, so your commit lands on a branch you can push. An
existing branch with the same name somewhere else is never checked out,
since that would move the submodule off the commit under your edits.

A commit with the parent and its submodules selected commits each repo on
its own. A submodule's commit is a commit in the submodule; the parent's
pointer change is a separate change in the parent, which you stage and
commit there.

## In chat

When a chat edits files inside a submodule:

- The tool call's row shows a **submodule: lib** chip, with the submodule's
  path. Hover it for a reminder that the edit needs a commit and pull request
  in that repo.
- The turn's header shows **Changed submodule lib** (or **Changed 2
  submodules**). This also catches changes made through the shell, such as
  `sed` inside the submodule or a commit made there. Click it to see what
  each submodule still needs:
  - **Uncommitted**: commit in the submodule and open its own pull request,
    then commit the new pointer in the parent.
  - **Committed, not pushed**: push it and open its own pull request, then
    commit the new pointer in the parent.
  - **Pushed**: commit the new pointer in the repo that holds it.
  - **Committed and pushed, and the pointer is committed**: nothing left. The
    mark turns grey.

  **Open Changes** in that popover switches the side panel to Changes.

The agent is told about submodules too. When its folder holds initialized
submodules, Tori's instructions to it name them and say that each one is its
own repo, committed, pushed and opened as a pull request separately, before
the parent commits the new pointer.

Both are worked out while the chat runs. A chat you reopen later may not
show them on its earlier turns.

## Checkpoints

Checkpoints cover submodules. At each prompt, every initialized submodule is
snapshotted in its own repo, under the same checkpoint name as the parent's,
so `git gc` inside the submodule keeps it. A turn that only changed
submodule files still gets a checkpoint, and the turn's file list in the
timeline shows those files under their submodule path, with their diffs.

Reverting to a checkpoint, or rewinding a chat, puts submodule files back
along with the parent's, and the backstop it saves first covers both. A
submodule whose commit has changed since the checkpoint (you or the agent
committed in it, or checked out something else) is left alone, so commits
made since are never thrown away. The toast says which ones were skipped.

A few readings still count the parent repo only: the line counts in the
checkpoint list, `checkpoint_diff` across a range of turns, the line counts
`session_check` reports, and [who wrote a hunk](/docs/git/who-wrote-this).

## Worktrees

**Project settings > Commands > Initialize submodules in a new worktree** is
on by default. A worktree Tori creates then clones and checks out its
submodules, nested ones too, before the setup command runs. The clone runs
in the background, so creating the worktree returns at once. The setup
command starts once the clone is done. An agent that waits for setup (**Agents
started over the socket wait for it**) waits for the clone too, and so does
**Start the run command when a worktree is created**. If the clone fails, a
toast says so and the setup still runs; use **Initialize Submodule** in the
file tree to try again. Turn the setting off to leave submodules empty in new
worktrees. Rerunning setup never re-initializes submodules.

Removing a worktree checks its submodules. The removal dialog lists every
submodule with **uncommitted changes** or **unpushed commits**. Tori's kept
copy of a removed worktree does not include submodule work, so the dialog
counts it as lost and the button reads **Remove anyway**. A removal that does
not go through the dialog, such as cleanup, is refused with a message naming
the submodule.

## Pushing and pull requests

A pointer only works if the commit it names is on the submodule's remote:
anyone else who checks out the parent needs to fetch it. So pushing the
parent, from the Changes panel, from **Open PR**, or by an agent through
`pr_create` or `pr_push`, checks every submodule pointer the branch changed
since it left the default branch. Each submodule fetches its remote's
branches and tags first. Its commit must be on one of them: a tag that only
exists on your machine does not count.
Pointers the branch did not change are not checked, so a submodule pinned
to a release tag never blocks anything.

If one is not pushed, the push is refused:

> Submodule lib points at 1a2b3c4d5e, which no branch or tag on its remote
> holds: push the submodule first.

If the submodule's remote could not be fetched, the message adds that it
checked only the branches and tags Tori already knew.

The error toast has a **Push submodule** button. It pushes the submodule
itself, on its current branch, or on a new branch named like the parent's if
it is detached. Then push the parent again. This works even after the
submodule's section has left Changes.

Because the check measures from the default branch, a pointer you already
pushed from the shell is still caught the next time Tori pushes or opens a
pull request.

### Pull requests in a submodule

An agent can open a pull request in a submodule, or push to one, by passing
the submodule's folder as `project` to `pr_create` or `pr_push` (and to
`ask_create` for the approval). It goes through the same approval as any
pull request, and the approval card says **In submodule lib, its own repo**,
so you know which repo it is for. The account is the one Tori resolves for
the submodule's own remote; see [Git accounts](/docs/git/git-accounts).

When the parent's pull request bumps a submodule that has an open pull
request on its current branch, Tori adds a link to it at the end of the
parent's body, under **Submodule pull requests:**. A link already in the body
is not added twice, and nothing is added when there is no open pull request.
