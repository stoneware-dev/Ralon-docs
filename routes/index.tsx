import type { PageProps } from "stoneware";
import Layout from "../lib/Layout.tsx";
import InstallTabs from "../islands/InstallTabs.tsx";
import LockDemo from "../islands/LockDemo.tsx";

export default function Home(_props: PageProps) {
  return (
    <Layout
      path="/"
      title="Ralon — a lock file for AI agents"
      description="agent.lock declares what AI agents may not modify. Ralon makes the kernel agree: writes, deletes and renames to protected paths are denied for the agent and every process it spawns."
    >
      <main class="shell">
        <section class="hero">
          <div class="hero__stage">
            <svg class="ghostlock" viewBox="0 0 200 148" aria-hidden="true">
              <rect class="plate" x="34" y="62" width="132" height="78" rx="14" />
              <path class="shackle" d="M62 64V40a38 26 0 0 1 76 0v24" />
              <rect class="body" x="34" y="62" width="132" height="78" rx="14" />
              <rect class="pulse" x="34" y="62" width="132" height="78" rx="14" />
            </svg>
            <div class="hero__flash" />

            <div class="hero__copy">
              <p class="hero__eyebrow">agent.lock · enforced by the kernel</p>

              <h1 class="redacted">
                <span class="redacted__word">Some</span>
                <span class="redacted__word">files</span>
                <span class="redacted__word">are</span>
                <span class="redacted__word redacted__word--key">not</span>
                <span class="redacted__word">the</span>
                <span class="redacted__word">agent's</span>
                <span class="redacted__word">to</span>
                <span class="redacted__word">edit.</span>
              </h1>
            </div>
          </div>

          <div class="hero__below">
            <p class="hero__lede">
              You write the list. Ralon hands it to the kernel before your agent
              starts, and from that moment the answer is <code>EROFS</code> —
              not a matter of the agent's judgement, its prompt, or its mood.
            </p>

            <div class="button-row">
              <a class="button button--primary" href="#install">
                Install
              </a>
              <a class="button" href="#try">
                Try to break it
              </a>
            </div>
          </div>

          <div class="ticker" aria-hidden="true">
            <div class="ticker__track">
              <span>
                <b>EROFS</b> read-only file system
              </span>
              <span>
                <b>EACCES</b> permission denied
              </span>
              <span>
                <b>EBUSY</b> device or resource busy
              </span>
              <span>
                <b>EXDEV</b> invalid cross-device link
              </span>
              <span>
                <b>EPERM</b> operation not permitted
              </span>
              <span>
                <b>EROFS</b> read-only file system
              </span>
              <span>
                <b>EACCES</b> permission denied
              </span>
              <span>
                <b>EBUSY</b> device or resource busy
              </span>
              <span>
                <b>EXDEV</b> invalid cross-device link
              </span>
              <span>
                <b>EPERM</b> operation not permitted
              </span>
            </div>
          </div>

          <div class="hero__grid">
            <div>
              <figure>
                <div class="panel">
                  <div class="panel__bar">
                    <i class="dot" />
                    <b>agent.lock</b>
                  </div>
                  <pre>
                    <span class="c">version:</span> 1{"\n\n"}
                    <span class="c">protect:</span>
                    {"\n"} - src/index.tsx
                    {"\n"} - src/auth.ts
                    {"\n"} - .env
                    {"\n"} - config/**
                  </pre>
                </div>
                <figcaption>
                  Same idea as .gitignore, different question. .gitignore says
                  what Git must not track; agent.lock says what must not change.
                </figcaption>
              </figure>

            </div>

            <figure>
              <div class="panel">
                <div class="panel__bar">
                  <i class="dot" />
                  <b>my-project/</b>
                </div>
                <ul class="tree">
                  <li class="locked">
                    <span class="name">agent.lock</span>
                    <span class="chip chip--lock">locked</span>
                  </li>
                  <li class="locked">
                    <span class="name">.env</span>
                    <span class="chip chip--lock">locked</span>
                  </li>
                  <li>
                    <span class="name">src/</span>
                  </li>
                  <li class="locked">
                    <span class="name"> index.tsx</span>
                    <span class="chip chip--lock">locked</span>
                  </li>
                  <li class="locked">
                    <span class="name"> auth.ts</span>
                    <span class="chip chip--lock">locked</span>
                  </li>
                  <li>
                    <span class="name"> App.tsx</span>
                    <span class="chip chip--rw">writable</span>
                  </li>
                  <li>
                    <span class="name"> utils.ts</span>
                    <span class="chip chip--rw">writable</span>
                  </li>
                  <li>
                    <span class="name">config/</span>
                    <span class="chip chip--lock">locked</span>
                  </li>
                  <li>
                    <span class="name">tests/</span>
                    <span class="chip chip--rw">writable</span>
                  </li>
                </ul>
              </div>
              <figcaption>
                agent.lock protects itself. An agent that can rewrite the policy
                has no policy.
              </figcaption>
            </figure>
          </div>

          <div class="lede-meta lede-meta--center">
            <span>
              <b>Enforced by</b> Landlock · mount namespaces
            </span>
            <span>
              <b>Runs</b> Linux (check &amp; status everywhere)
            </span>
            <span>
              <b>Depends on</b> nothing
            </span>
          </div>
        </section>

        <section class="section" id="try">
          <div class="section__head">
            <span class="section__index">[01]</span>
            <h2>Try to break it</h2>
          </div>
          <p class="prose-lead">
            Inside <code>ralon run</code>, pick an attack. Every one of these is
            a test in the repository that runs for real against a live sandbox
            and then checks the file from outside it.
          </p>
          <LockDemo />
        </section>

        <section class="section" id="install">
          <div class="section__head">
            <span class="section__index">[02]</span>
            <h2>Install</h2>
          </div>
          <p>
            The command is <code>ralon</code> however you install it. Only the
            crate kept that name: npm refuses it as too similar to an existing
            package, and PyPI did not have it free, so both use{" "}
            <code>ralonlock</code>.
          </p>
          <InstallTabs />
          <p style="margin-top:1.6rem">
            <code>run</code> needs Linux. <code>init</code>, <code>check</code>{" "}
            and <code>status</code> work on macOS and Windows too, which is what
            CI and pre-commit hooks need.
          </p>
        </section>

        <section class="section" id="quickstart">
          <div class="section__head">
            <span class="section__index">[03]</span>
            <h2>Three commands</h2>
          </div>
          <figure>
            <div class="panel">
              <pre>
                <span class="p">$ </span>
                <b>ralon init</b>
                {"\n"}
                <span class="c">
                  # writes a starter agent.lock — edit it, it is yours
                </span>
                {"\n\n"}
                <span class="p">$ </span>
                <b>ralon status</b>
                {"\n"}
                policy
                <span class="c">/project/agent.lock</span>
                {"\n"}
                protected <b>4 paths</b> currently on disk{"\n"}
                backends{"\n"} mount <span class="ok">available</span>{" "}
                <span class="c">(read-only bind mounts in a locked namespace)</span>
                {"\n"} landlock <span class="ok">available</span>{" "}
                <span class="c">(kernel ABI v5)</span>
                {"\n\n"}
                <span class="p">$ </span>
                <b>ralon run -- claude</b>
                {"\n"}
                <span class="c">ralon: 4 paths locked via the mount backend</span>
              </pre>
            </div>
          </figure>
          <p>
            <code>run</code> replaces itself with your command, so the agent
            keeps its terminal, its exit code and its signals. There is no
            supervisor process to kill and nothing running in the background.
          </p>
        </section>

        <section class="section" id="how">
          <div class="section__head">
            <span class="section__index">[04]</span>
            <h2>How it holds</h2>
          </div>
          <div class="cards">
            <div class="card">
              <h4>Inherited</h4>
              <p>
                The restriction survives fork and exec. Every descendant is
                born inside it, including ones that outlive the agent.
              </p>
            </div>
            <div class="card">
              <h4>One-way</h4>
              <p>
                A Landlock domain cannot be left. The mount namespace is locked
                before your command starts, so umount and bind-mount tricks
                fail from inside.
              </p>
            </div>
            <div class="card">
              <h4>Nothing to bypass</h4>
              <p>
                No daemon, no wrapper process, no file descriptor handed to the
                child. Ralon becomes your command.
              </p>
            </div>
            <div class="card">
              <h4>Honest when it can't</h4>
              <p>
                If no backend is available, <code>run</code> refuses to start
                the command rather than running it unprotected.
              </p>
            </div>
          </div>
          <p>
            Two Linux backends, picked automatically.{" "}
            <a href="/reference#backends">Read how they differ</a> — the choice
            is visible, and one of them has a cost worth knowing about.
          </p>
        </section>

        <section class="section" id="hook">
          <div class="section__head">
            <span class="section__index">[05]</span>
            <h2>Wire it into an agent</h2>
          </div>
          <p>
            <code>check</code> exits 1 when a path is protected, which is enough
            for any tool that supports hooks. For Claude Code, in{" "}
            <code>.claude/settings.json</code>:
          </p>
          <figure>
            <div class="panel">
              <pre>
                {`{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "ralon check \\"$CLAUDE_FILE_PATH\\" >/dev/null || exit 2"
      }]
    }]
  }
}`}
              </pre>
            </div>
          </figure>
          <div class="callout">
            <p>
              A courtesy, not a defence. It turns a confusing <code>EACCES</code>{" "}
              into a clear message. The kernel is what actually stops the write —
              and it stops <code>sed -i</code>, <code>python</code> and{" "}
              <code>git checkout</code> just the same.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
