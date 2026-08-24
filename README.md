# Ralon documentation site

The docs for [Ralon](https://github.com/stoneware-dev/Ralon), built with
[stoneware](https://github.com/stoneware-dev/stoneware-core).

    bun install
    bun run dev        # http://localhost:3000
    bun run build      # .stoneware/server.js
    bun run start      # serve the build

## Pages

    /            what it is, the interactive attack demo, install, quickstart
    /reference   agent.lock syntax, patterns, commands, exit codes, backends
    /security    threat model, the guarantee, why it holds, where it stops

`/security` is not marketing. It carries the limitations that were tested
rather than assumed — the second-mount bypass, what Landlock alone gives up,
and the fact that only paths that already exist can be protected. If a release
changes any of that, this page changes with it.

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

The command is `ralon` everywhere. The crate is `ralon`; npm and PyPI both use
`ralonlock`, because npm refuses `ralon` as too close to an existing package and
PyPI did not have it free.

## Deploying

`bun run build` emits a server bundle; `bun run start` serves it. Set
`SITE_URL` in the environment so canonical links, `og:` tags and the sitemap are
absolute — `lib/site.ts` reads it and falls back to localhost.
