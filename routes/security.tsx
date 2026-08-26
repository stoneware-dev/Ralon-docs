import type { PageProps } from "stoneware";
import Layout from "../lib/Layout.tsx";

const SECTIONS = [
  { id: "model", index: "01", label: "Threat model" },
  { id: "guarantee", index: "02", label: "The guarantee" },
  { id: "why", index: "03", label: "Why it holds" },
  { id: "limits", index: "04", label: "Where it stops" },
  { id: "verify", index: "05", label: "Verify it yourself" },
  { id: "report", index: "06", label: "Reporting" },
];

const ATTEMPTS: [string, boolean][] = [
  ["write, append, truncate, cp over it", false],
  ["delete it, rename it away", false],
  ["replace it by renaming another file over it", false],
  ["delete then recreate", false],
  ["hard link or symlink over it", false],
  ["create anything inside a protected directory", false],
  ["rename or remove a directory on the way to it", false],
  ["chmod, then write", false],
  ["reach the inode through a hard link made inside", false],
  ["escape by umount, bind mount, or a nested namespace", false],
  ["reach it through another process's /proc/<pid>/root", false],
  ["read it", true],
  ["everything else in the project", true],
];

export default function Security(_props: PageProps) {
  return (
    <Layout
      path="/security"
      title="Security model — Ralon"
      description="What Ralon defends against, what it does not, and the limitations that were tested rather than assumed."
    >
      <main class="shell with-rail">
        <aside class="rail">
          <p class="rail__title">Security</p>
          <ol>
            {SECTIONS.map((section) => (
              <li>
                <a href={`#${section.id}`}>
                  <em>{section.index}</em>
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div>
          <section class="section" id="model">
            <div class="section__head">
              <span class="section__index">[01]</span>
              <h2>Threat model</h2>
            </div>
            <p class="prose-lead">
              Ralon makes a narrow promise and tries to make it exactly. A tool
              in this position is only worth as much as the honesty of its
              limitations, so those are on this page too.
            </p>

            <h3>Defends against</h3>
            <p>
              A process running with your privileges, started by you through{" "}
              <code>ralon run</code>, that tries to modify a path the policy
              protects. That covers the ordinary case — an agent editing a file
              it should not have touched — and the adversarial one: a
              prompt-injected agent going deliberately after <code>.env</code>,
              an agent shelling out to <code>sed</code>, <code>python</code> or{" "}
              <code>git checkout</code>, and anything it spawns, including
              processes that outlive it.
            </p>

            <h3>Does not defend against</h3>
            <ul class="plain">
              <li>
                <b>Root.</b> Anything that can become root outside the namespace
                can undo all of it. This is a guardrail for a tool you invited
                in, not a defence against someone who already has your password.
              </li>
              <li>
                <b>Processes you did not start this way.</b> The policy binds
                the tree under <code>ralon run</code>. A daemon that was already
                running — a language server, a file watcher, an editor with a
                remote API — is not restricted, and a sandboxed process that can
                ask one of them to write a file gets the write.
              </li>
              <li>
                <b>Reading.</b> Protected files stay readable, deliberately.{" "}
                <code>agent.lock</code> says what must not <em>change</em>. A
                secret an agent must not read does not belong in the project
                directory.
              </li>
              <li>
                <b>Exfiltration.</b> Nothing here touches the network.
              </li>
            </ul>
          </section>

          <section class="section" id="guarantee">
            <div class="section__head">
              <span class="section__index">[02]</span>
              <h2>The guarantee</h2>
            </div>
            <p>
              Inside <code>ralon run</code>, for every protected path, in that
              process and every descendant:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Attempt</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {ATTEMPTS.map(([attempt, allowed]) => (
                  <tr>
                    <td>{attempt}</td>
                    <td>
                      <span class={allowed ? "chip chip--rw" : "chip chip--deny"}>
                        {allowed ? "allowed" : "denied"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Each row is a test in <code>tests/enforcement.rs</code>. They run
              a real shell inside a real sandbox and then check the file from
              outside it, against every backend the kernel provides — so a
              backend cannot pass by being unavailable.
            </p>
          </section>

          <section class="section" id="why">
            <div class="section__head">
              <span class="section__index">[03]</span>
              <h2>Why it cannot be undone</h2>
            </div>
            <ul class="plain">
              <li>
                A Landlock domain is one-way. There is no syscall to leave one,
                and it survives <code>fork</code> and <code>execve</code>.
              </li>
              <li>
                The mount namespace is locked before your command starts.
                Entering a second user namespace marks every inherited mount{" "}
                <code>MNT_LOCKED</code>, so <code>umount</code> fails and the
                kernel refuses any bind mount that would expose what is beneath.
              </li>
              <li>
                <code>no_new_privs</code> is set, so a setuid binary cannot be
                used to climb out.
              </li>
              <li>
                Nothing supervises the sandbox, so there is nothing to kill.
                Ralon <em>becomes</em> the command.
              </li>
            </ul>
            <p>
              Two properties fall out of the design rather than being checked
              for. <b>Hard links cannot reach a protected file</b>: under the
              mount backend the path is itself a mount point, and{" "}
              <code>link()</code> requires source and target on the same mount,
              so every attempt returns <code>EXDEV</code>. And{" "}
              <b>
                <code>/proc/&lt;pid&gt;/root</code> is not a way out
              </b>
              : following another process's root needs ptrace access, which a
              process in a nested user namespace does not have over processes in
              the parent one, even at the same uid.
            </p>
          </section>

          <section class="section" id="limits">
            <div class="section__head">
              <span class="section__index">[04]</span>
              <h2>Where it stops</h2>
            </div>
            <div class="callout callout--warn">
              <p>
                <b>A second path to the same directory bypasses both backends.</b>{" "}
                This is tested and true. If the project is also visible at
                another mount point — a bind mount made before the sandbox
                started, a volume mounted twice into a container, a share
                exported at two paths — writing through the other path is not
                restricted. Both backends are path-based and neither can protect
                a path it was not told about. The sandboxed process cannot{" "}
                <em>create</em> such a mount, so this requires the second path to
                already exist.
              </p>
            </div>
            <ul class="plain">
              <li>
                <b>Landlock alone can be defeated where user namespaces are
                available.</b> Its rules apply to paths, not inodes, so a process
                that can create its own mount namespace can bind the project
                somewhere the carve-out granted. Automatic selection prefers the
                mount backend, which is available in exactly the environments
                where that attack is; forcing{" "}
                <code>--backend landlock</code> there gives up a real guarantee.
              </li>
              <li>
                <b>Only paths that exist can be protected.</b> A bind mount needs
                something to mount. <code>status</code> and <code>run</code> warn
                about patterns matching nothing. The landlock backend is
                stricter here by accident of its design.
              </li>
              <li>
                <b>The policy is read before the sandbox starts.</b> Nothing
                races it, but a path created afterwards is not protected for the
                life of that run. Restart the agent after adding files that need
                protecting.
              </li>
              <li>
                <b>A supervisor is a process, on Windows.</b> Killing it releases
                the locks. <code>run</code> has nothing to kill, which is why it
                stays the stronger option for an agent you launch yourself. On
                macOS the failure runs the other way: the flag is on the inode
                and survives everything, so a supervisor that is killed leaves
                state behind rather than losing protection —{" "}
                <code>status</code> reports it and{" "}
                <code>ralon guard --stop</code> clears it.
              </li>
              <li>
                <b>The macOS supervisor is a narrowing, not a sandbox.</b> It
                enforces with <code>chflags uchg</code>, which an agent can undo
                with <code>chflags nouchg</code> — one command, no privileges.
                Every ordinary write is refused; an agent that goes looking will
                find a way through. It also does not pin ancestors, so renaming a
                parent directory moves the protected path out from under the
                policy while leaving the file itself immutable.{" "}
                <code>ralon run</code> has neither limitation.
              </li>
              <li>
                <b>A policy outside every scope does nothing.</b> Ralon honours an{" "}
                <code>agent.lock</code> only inside a directory you named with{" "}
                <code>ralon scope add</code> — which is what stops one arriving
                inside a downloaded archive from locking files, and what makes{" "}
                <code>ralon status</code> say{" "}
                <em>policy found, but this project is outside every scope</em>{" "}
                rather than looking protected. Even inside a scope the blast
                radius is small: patterns are relative to the file that declares
                them and <code>..</code>, absolute paths and <code>~</code> are
                rejected, so the most a hostile policy can do is make its own
                directory read-only.
              </li>
            </ul>
          </section>

          <section class="section" id="verify">
            <div class="section__head">
              <span class="section__index">[05]</span>
              <h2>Verify it yourself</h2>
            </div>
            <p>
              Do not take the test suite's word for it either. Two minutes with
              a shell is worth more than any table on this page:
            </p>
            <figure>
              <div class="panel">
                <pre>
                  <span class="p">$ </span>
                  <b>ralon run -- sh</b>
                  {"\n"}
                  <span class="p">$ </span>
                  <b>echo x &gt; .env</b>
                  {"          "}
                  <span class="c"># EROFS or EACCES</span>
                  {"\n"}
                  <span class="p">$ </span>
                  <b>rm .env</b>
                  {"                "}
                  <span class="c"># denied</span>
                  {"\n"}
                  <span class="p">$ </span>
                  <b>echo x &gt; src/App.tsx</b>
                  {"  "}
                  <span class="c"># fine</span>
                </pre>
              </div>
            </figure>
            <p>
              If <code>ralon status</code> reports no available backend,{" "}
              <code>run</code> refuses to start the command rather than running
              it unprotected. A failure to enforce is never silent.
            </p>
          </section>

          <section class="section" id="report">
            <div class="section__head">
              <span class="section__index">[06]</span>
              <h2>Reporting a bypass</h2>
            </div>
            <p>
              A bypass is anything that modifies a protected path from inside{" "}
              <code>ralon run</code> without root, other than the limitations
              above. Report it privately through a{" "}
              <a href="https://github.com/stoneware-dev/Ralon/security/advisories">
                GitHub security advisory
              </a>{" "}
              with the policy, the command, the kernel version and the backend.
              A failing test in the style of{" "}
              <code>tests/enforcement.rs</code> is the most useful report there
              is.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}
