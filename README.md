# Ralon documentation site

The docs for [Ralon](https://github.com/stoneware-dev/Ralon), built with
[stoneware](https://github.com/stoneware-dev/stoneware-core).

    bun install
    bun run dev        # http://localhost:3000
    bun run build      # .stoneware/server.js
    bun run start      # serve the build

## Pages

    /            what it is, the interactive attack demo, install, the
                 per-platform quickstart
    /reference   agent.lock syntax, patterns, every command, scopes, exit
                 codes, the five backends
    /security    threat model, the guarantee, why it holds, where it stops

`/security` is not marketing. It carries the limitations that were tested
rather than assumed — the second-mount bypass, hard links as a second name for
the same bytes, what Landlock alone gives up, that only paths which already
exist can be protected, that the macOS supervisor is a narrowing an agent can
undo rather than a sandbox, and that Ralon's own files are user-writable and
therefore held rather than trusted. If a release changes any of that, this page
changes with it.

## The model the site has to get across

    install once → declare policy → enforcement starts automatically

Three claims, in that order, and the third is the one people disbelieve. A
repository is protected *because it contains an `agent.lock`* — no `ralon init`,
no wrapper around the agent, nothing to redo after a reboot.

Four things the copy must never soften:

- **Where Ralon is installed does not decide what it protects.** A home
  directory on `C:` says nothing about a repository on `D:`. Scopes are how the
  developer says where their code is, and the site should show
  `ralon scope add D:\Projects` rather than implying a single tree.
- **Linux has no supervisor, and macOS's is weaker than `ralon run`.** The
  macOS one enforces with `chflags uchg`, which an agent can undo. Every page
  that mentions automatic enforcement says which platform it means.
- **Machine-wide is a choice, not a requirement.** Some people want one
  repository protected and nothing else touched. `ralon install --here` scopes
  to a single project, and `ralon guard --detach` protects one with no
  installation at all. Both belong next to the machine-wide flow rather than in
  a footnote — presenting `install` as the only route reads as a bigger
  commitment than it is.
- **`ralon uninstall` is a step the user has to take.** It registers a
  background process with the OS and no package manager will deregister it: npm
  stopped running `preuninstall` scripts, and pip and cargo never had the hook.
  Anywhere the site says how to install, it says this too.

## Layout

    routes/      one file per page, server-rendered, no JavaScript
    islands/     InstallTabs and LockDemo — the only client JS on the site
    lib/         Layout.tsx (the document shell), site.ts (absolute URLs)
    public/      styles.css, the mark

`Counter.tsx` is the scaffold's example island. Nothing imports it; delete it
whenever.

## Two things to know before editing

**There is no re-render.** Stoneware binds a signal to the exact text node or
attribute that reads it. An island that reads `signal.value` while rendering
produces correct HTML and then never updates again — which is exactly the bug
this site shipped first. Pass `computed(...)` into JSX instead, and keep the
structure identical across states:

```tsx
// wrong: reads once, never updates
<b>{current.value.command}</b>

// right: the text node subscribes
<b>{computed(() => current.value.command)}</b>
```

**Nothing is loaded from another origin.** No web fonts, no CDN, no analytics.
The stack is a system serif for prose and a system mono for everything the
machine says. That keeps the framework's default `'self'`-only CSP untouched,
which is the right default for a site about not trusting software.

## Versions

`VERSION` in `lib/Layout.tsx` is the released version shown in the masthead and
the install block. `islands/InstallTabs.tsx` repeats it in the sample output.
Both need bumping when Ralon releases — two places, on purpose, rather than a
build step.

`/reference` lists the commands by hand. When Ralon gains or renames one, that
table is the thing that goes stale silently, because nothing here is generated
from the CLI: check it against `ralon --help` at each release.

The command is `ralon` everywhere. The crate is `ralon`; npm and PyPI both use
`ralonlock`, because npm refuses `ralon` as too close to an existing package and
PyPI did not have it free.

## Deploying

`bun run build` emits a server bundle; `bun run start` serves it. Set
`SITE_URL` in the environment so canonical links, `og:` tags and the sitemap are
absolute — `lib/site.ts` reads it and falls back to localhost.
