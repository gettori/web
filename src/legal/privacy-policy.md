---
title: Privacy policy
description: What Tori, its phone app, its browser extension and this website collect and send. In short, nothing about you reaches us.
---

Effective October 20, 2026.

Tori is a free, open source desktop app for macOS, with a companion phone
app and a browser extension. This policy covers all three and this website.
The short version: **we collect nothing.** Tori has no accounts, no
analytics, no crash reporting and no server of its own that receives your
data. What you do in Tori stays on your machines, apart from the requests
listed below.

## The desktop app

Tori runs on your Mac and keeps everything it writes in plain files there,
listed in [Files and privacy](/docs/reference/files-and-privacy/). It sends
no telemetry. Its own network requests are only these:

- **GitHub Releases**, at most once a day, to see whether a newer version
  exists. Anonymous. It never downloads or installs anything on its own.
- **`openrouter.ai`**, at most once a day, for published model context window
  sizes. Anonymous.
- **SchemaStore** (`schemastore.org`), at most once a day and only when the
  JSON or YAML language server starts. Anonymous.
- **Installs you accept**, such as a language server, a debugger or an agent.
- **GitHub or GitLab's API**, only after you sign in to that forge, for pull
  requests, issues, checks and reviews, carrying your own token.
- **Anthropic's usage endpoint**, only if you turn on a Claude account's
  weekly quota chip, carrying that account's own token.

The coding agents Tori starts, such as Claude Code or Codex, talk to their own
vendors exactly as they would from a terminal, under those vendors' terms and
privacy policies. Tori adds no endpoint of its own and proxies nothing. Git
pushes and fetches go straight from your `git` to your remote.

## The phone app

The phone app talks only to the Mac you paired it with, over
[Tailscale](https://tailscale.com/). There is no relay or cloud service of
ours in between. Tailscale's own privacy policy covers its network.

## The browser extension

The Tori extension for Chrome, Edge, Brave and Arc connects your browser to
the Tori app on your own Mac. Nothing leaves your browser except to that app:

- It talks only to the Tori app on the same computer, through the browser's
  native messaging, which starts Tori's own command line tool. No server is
  involved, ours or anyone else's.
- It sees every tab's address, which is how it tells the tabs on `localhost`
  and `127.0.0.1` apart. Other tabs' addresses never leave the browser.
- For a tab on `localhost` or `127.0.0.1`, it sends the tab's address to Tori
  to find which worktree serves it. When you pick an element or select text
  and send it, it also sends what you picked: your comment, the element's
  HTML, text, styles and the source location of the component, a screenshot
  when screenshots are on, and the page's console errors and failed requests
  when that option is on.
- Comments waiting to be sent, their screenshots and the extension's options
  stay in the browser's own storage for the extension.
- It reads no site other than `localhost` and `127.0.0.1`, and it does not
  sell, share or use any of this for anything but showing and sending your
  comments to Tori.

## This website

gettori.app sets no cookies and loads no analytics, advertising or tracking
scripts; its fonts are served from the site itself. It is hosted on
Cloudflare, which processes each request, including your IP address, to
deliver and protect the site, under
[Cloudflare's privacy policy](https://www.cloudflare.com/privacypolicy/).
Downloads are served from GitHub, under
[GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## Children

Tori is a developer tool and is not directed at children. We collect no
personal information from anyone, children included.

## Changes

If this policy changes, the new version is published on this page with a new
effective date, and the change is listed in the
[changelog](/changelog/) when it comes with a release.

## Contact

Questions about privacy go to
[GitHub issues](https://github.com/gettori/tori/issues). To report a security
problem privately, use **Security > Report a vulnerability** on
[the repository](https://github.com/gettori/tori).
