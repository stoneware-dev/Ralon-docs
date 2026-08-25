import type { PageProps } from "stoneware";
import Layout from "../lib/Layout.tsx";
import InstallTabs from "../islands/InstallTabs.tsx";
import LockDemo from "../islands/LockDemo.tsx";

export default function Home(_props: PageProps) {
  return (
    <Layout
      path="/"
      title="Ralon — a lock file for AI agents"
      description="agent.lock declares what AI agents may not modify. Ralon makes the kernel agree on Linux, macOS and Windows: writes, deletes and renames to protected paths are refused for the agent and every process it spawns."
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
              You write the list. Ralon hands it to the kernel — Linux, macOS
              and Windows — before your agent starts, and from that moment the
              write is refused. Not a matter of the agent's judgement, its
              prompt, or its mood.
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
                <b>ERROR_SHARING_VIOLATION</b> the file is in use
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
              <span>
                <b>ERROR_SHARING_VIOLATION</b> the file is in use
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
              <b>Linux</b> mount namespaces · Landlock
            </span>
            <span>
              <b>macOS</b> the Seatbelt sandbox
            </span>
            <span>
              <b>Windows</b> exclusive file handles
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
            Pick a platform, then pick an attack. Every one of these is a test
            in the repository that runs for real against a live sandbox and
            then checks the file from outside it — because an exit code is not
            evidence. Note what the Windows column is doing: that is an ordinary{" "}
            <code>cmd</code> that Ralon never started.
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
            <code>run</code> enforces on all three platforms.{" "}
            <code>ralon status</code> says which mechanism you are getting and
            why — and if this machine offers none, <code>run</code> refuses to
            start the command rather than running it unprotected.
          </p>
        </section>

        <section class="section" id="quickstart">
          <div class="section__head">
            <span class="section__index">[03]</span>
            <h2>Starting it, on each platform</h2>
          </div>
          <p class="prose-lead">
            <code>ralon init</code> is the same everywhere: it writes a starter{" "}
            <code>agent.lock</code> and wires a refusal into every agent that
            documents a hook. What comes after it is not the same, and the
            difference is the whole design rather than a rough edge —{" "}
            <b>Linux and macOS restrictions are inherited</b> by a process before
            it runs, <b>Windows locks are held</b> by a process and refused to
            everyone else.
          </p>

          <figure>
            <div class="panel">
              <div class="panel__bar">
                <i class="dot" />
                <b>Linux</b>
                <span class="panel__bar-note">
                  mount namespaces, or Landlock
                </span>
              </div>
              <pre>
                <span class="p">$ </span>
                <b>ralon init</b>
                {"\n"}
                <span class="p">$ </span>
                <b>$EDITOR agent.lock</b>
                {"          "}
                <span class="c"># say what must not change</span>
                {"\n\n"}
                <span class="p">$ </span>
                <b>ralon status</b>
                {"\n"}
                backends{"\n"}
                {"  "}mount{"    "}
                <span class="ok">available</span>{" "}
                <span class="c">(read-only bind mounts in a locked namespace)</span>
                {"\n"}
                {"  "}landlock <span class="ok">available</span>{" "}
                <span class="c">(kernel ABI v5)</span>
                {"\n\n"}
                <span class="p">$ </span>
                <b>ralon run -- claude</b>
                {"          "}
                <span class="c"># and everything it spawns</span>
                {"\n"}
                <span class="c">ralon: 4 paths locked via the mount backend</span>
              </pre>
            </div>
            <figcaption>
              Ralon <em>becomes</em> the agent — same terminal, same exit code,
              same signals, no supervisor process to kill. Two backends: the
              default builds read-only bind mounts in a namespace it then locks;
              Landlock takes over where user namespaces are disabled.
            </figcaption>
          </figure>

          <figure>
            <div class="panel">
              <div class="panel__bar">
                <i class="dot" />
                <b>macOS</b>
                <span class="panel__bar-note">the Seatbelt sandbox</span>
              </div>
              <pre>
                <span class="p">$ </span>
                <b>ralon init</b>
                {"\n"}
                <span class="p">$ </span>
                <b>$EDITOR agent.lock</b>
                {"\n\n"}
                <span class="p">$ </span>
                <b>ralon run --dry-run</b>
                {"           "}
                <span class="c"># read the profile before trusting it</span>
                {"\n"}
                <span class="c">(allow default)</span>
                {"\n"}
                <span class="c">(deny file-write*</span>
                {"\n"}
                <span class="c">{"    "}(literal "/project/.env")</span>
                {"\n"}
                <span class="c">{"    "}(subpath "/project/config"))</span>
                {"\n\n"}
                <span class="p">$ </span>
                <b>ralon run -- claude</b>
                {"\n"}
                <span class="c">
                  ralon: 4 paths locked via the seatbelt backend
                </span>
              </pre>
            </div>
            <figcaption>
              The same shape as Linux — <code>run</code>, inherited across{" "}
              <code>exec</code>, impossible to leave. The difference is that
              Seatbelt can say <code>deny</code>, so the profile is the policy as
              you wrote it: a protected directory covers files created in it
              later, and nothing outside the named paths changes behaviour.
            </figcaption>
          </figure>

          <figure>
            <div class="panel">
              <div class="panel__bar">
                <i class="dot" />
                <b>Windows</b>
                <span class="panel__bar-note">exclusive file handles</span>
              </div>
              <pre>
                <span class="p">$ </span>
                <b>ralon init</b>
                {"\n"}
                <span class="p">$ </span>
                <b>notepad agent.lock</b>
                {"\n\n"}
                <span class="p">$ </span>
                <b>ralon guard --detach</b>
                {"         "}
                <span class="c"># no command to wrap</span>
                {"\n"}
                guard running in the background for C:\project{"\n"}
                every process on this machine is now refused those paths{"\n"}
                stop it with: ralon guard --stop{"\n\n"}
                <span class="p">$ </span>
                <b>claude</b>
                {"                       "}
                <span class="c">
                  # start the agent however you like
                </span>
                {"\n\n"}
                <span class="p">$ </span>
                <b>ralon guard --stop</b>
                {"           "}
                <span class="c"># when you want to edit them yourself</span>
                {"\n"}
                guard released — the protected paths are writable again
              </pre>
            </div>
            <figcaption>
              No <code>ralon run</code> in sight. Because the locks are held
              rather than inherited, one background process covers agents Ralon
              never started — from an IDE, an extension, another terminal, or
              installed next month. <code>ralon run -- claude</code> also works
              here and lasts exactly as long as the command.
            </figcaption>
          </figure>

          <div class="callout">
            <p>
              A guard refuses <b>writes to the paths you declared</b> and
              nothing else, so your build, tests, dev server, editor and{" "}
              <code>git</code> carry on normally. It cannot refuse{" "}
              <em>only</em> an LLM agent — a process carries no mark saying what
              it is, and agents write through <code>cmd</code>,{" "}
              <code>python</code>, <code>node</code> and <code>git</code>, the
              same binaries you use. The only person it gets in the way of is
              you, which is what <code>--stop</code> is for.
            </p>
          </div>
        </section>

        <section class="section" id="how">
          <div class="section__head">
            <span class="section__index">[04]</span>
            <h2>How it holds</h2>
          </div>
          <div class="cards">
            <div class="card">
              <h4>Inherited, one-way</h4>
              <p>
                On Linux and macOS the restriction survives fork and exec, and
                there is no syscall to leave it. Every descendant is born inside
                it, including the ones that outlive the agent.
              </p>
            </div>
            <div class="card">
              <h4>Held, machine-wide</h4>
              <p>
                On Windows a handle is refused to every process, not just the
                ones Ralon started. An ACL would not do: the agent runs as the
                same user, so any permission Ralon can set it can unset.
              </p>
            </div>
            <div class="card">
              <h4>Nothing to bypass</h4>
              <p>
                No daemon, no approval workflow, no file descriptor handed to
                the child. Under <code>run</code>, Ralon becomes your command.
              </p>
            </div>
            <div class="card">
              <h4>Honest when it can't</h4>
              <p>
                If no backend is available, <code>run</code> refuses to start
                the command rather than running it unprotected — and says what
                to do instead.
              </p>
            </div>
          </div>
          <p>
            Four backends, picked automatically per platform.{" "}
            <a href="/reference#backends">Read how they differ</a> — the choice
            is visible, and two of them have a cost worth knowing about.
          </p>
        </section>

        <section class="section" id="hook">
          <div class="section__head">
            <span class="section__index">[05]</span>
            <h2>Wire it into an agent</h2>
          </div>
          <p class="prose-lead">
            <code>ralon init</code> already did this; <code>ralon hook install</code>{" "}
            does it on its own, and <code>--no-hooks</code> skips it. It writes a
            refusal into the configuration of every agent that documents a hook
            capable of blocking an edit before it happens — nine of them.
          </p>
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>File</th>
                <th>How it refuses</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Claude Code</td>
                <td>
                  <code>.claude/settings.json</code>
                </td>
                <td>
                  <code>permissionDecision: deny</code>
                </td>
              </tr>
              <tr>
                <td>GitHub Copilot</td>
                <td>
                  <code>.github/hooks/ralon.json</code>
                </td>
                <td>
                  <code>permissionDecision: deny</code>
                </td>
              </tr>
              <tr>
                <td>OpenAI Codex</td>
                <td>
                  <code>.codex/hooks.json</code>
                </td>
                <td>
                  <code>permissionDecision: deny</code>, or exit 2
                </td>
              </tr>
              <tr>
                <td>Cursor</td>
                <td>
                  <code>.cursor/hooks.json</code>
                </td>
                <td>
                  <code>permission: deny</code>
                </td>
              </tr>
              <tr>
                <td>Gemini CLI</td>
                <td>
                  <code>.gemini/settings.json</code>
                </td>
                <td>
                  <code>decision: deny</code>
                </td>
              </tr>
              <tr>
                <td>Google Antigravity</td>
                <td>
                  <code>.agents/hooks.json</code>
                </td>
                <td>
                  <code>decision: deny</code>
                </td>
              </tr>
              <tr>
                <td>Cline</td>
                <td>
                  <code>.clinerules/hooks/PreToolUse</code>
                </td>
                <td>
                  <code>cancel: true</code>
                </td>
              </tr>
              <tr>
                <td>Windsurf / Cascade</td>
                <td>
                  <code>.windsurf/hooks.json</code>
                </td>
                <td>exit 2</td>
              </tr>
              <tr>
                <td>OpenCode</td>
                <td>
                  <code>.opencode/plugins/ralon.js</code>
                </td>
                <td>throws</td>
              </tr>
            </tbody>
          </table>
          <p>
            One <code>ralon hook check</code> serves all nine: the refusal is a
            single JSON document carrying every one of those keys, plus exit code
            2. Emitting a key an agent ignores costs nothing; omitting one it
            needs is an edit waved through. Reads are never refused — some agents
            call the hook for every tool, and an agent should be able to read the
            policy governing it.
          </p>
          <div class="callout">
            <p>
              A courtesy, not a defence. It covers the agent's <em>edit tools</em>{" "}
              and not the shell commands it runs, because a hook cannot tell
              which paths <code>sed -i</code> will touch. Enforcement does not
              care: it restricts the <em>process</em>, which is why{" "}
              <code>run</code> and <code>guard</code> already cover Aider, Amazon
              Q, Junie, Roo Code and whatever ships next year. Agents are listed
              above only because a hook has to speak each one's config format.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
