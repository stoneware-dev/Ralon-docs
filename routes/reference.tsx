import type { PageProps } from "stoneware";
import Layout from "../lib/Layout.tsx";

const SECTIONS = [
  { id: "policy", index: "01", label: "The policy file" },
  { id: "patterns", index: "02", label: "Patterns" },
  { id: "commands", index: "03", label: "Commands" },
  { id: "exit-codes", index: "04", label: "Exit codes" },
  { id: "backends", index: "05", label: "Backends" },
];

export default function Reference(_props: PageProps) {
  return (
    <Layout
      path="/reference"
      title="Reference — Ralon"
      description="agent.lock syntax, pattern semantics, the four commands, exit codes, and how the mount and landlock backends differ."
    >
      <main class="shell with-rail">
        <aside class="rail">
          <p class="rail__title">Reference</p>
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
          <section class="section" id="policy">
            <div class="section__head">
              <span class="section__index">[01]</span>
              <h2>The policy file</h2>
            </div>
            <p class="prose-lead">
              One file at the project root. Every command finds it by walking up
              from the working directory, the same way <code>git</code> finds{" "}
              <code>.git</code>.
            </p>
            <figure>
              <div class="panel">
                <div class="panel__bar">
                  <i class="dot" />
                  <b>agent.lock</b>
                </div>
                <pre>
                  <span class="c">version:</span> 1{"  "}
                  <span class="c"># required, must be 1</span>
                  {"\n\n"}
                  <span class="c">protect:</span>{"  "}
                  <span class="c"># paths relative to this file</span>
                  {"\n"} - .env{"            "}
                  <span class="c"># a file</span>
                  {"\n"} - config{"          "}
                  <span class="c"># a directory, and everything under it</span>
                  {"\n"} - config/**{"       "}
                  <span class="c"># the same thing, spelled out</span>
                  {"\n"} - src/*.ts{"        "}
                  <span class="c"># * stops at /</span>
                  {"\n"} - "**/secrets.json" <span class="c"># ** does not</span>
                </pre>
              </div>
            </figure>
            <ul class="plain">
              <li>
                <code>agent.lock</code> always protects itself, whether or not
                you list it.
              </li>
              <li>
                <code>..</code>, absolute paths, <code>~</code> and{" "}
                <code>!</code> negation are rejected at parse time rather than
                quietly reinterpreted. A policy that does not mean what it says
                is worse than no policy.
              </li>
              <li>
                Unknown keys and unknown versions are errors, so a file written
                for a later Ralon fails loudly instead of being half-applied.
              </li>
            </ul>
          </section>

          <section class="section" id="patterns">
            <div class="section__head">
              <span class="section__index">[02]</span>
              <h2>Patterns</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Pattern</th>
                  <th>Matches</th>
                  <th>Does not match</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>.env</code>
                  </td>
                  <td>that exact file</td>
                  <td>
                    <code>src/.env</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>config</code>
                  </td>
                  <td>
                    the directory and everything beneath it, at any depth
                  </td>
                  <td>
                    <code>configuration</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>config/**</code>
                  </td>
                  <td>
                    identical to the above — the directory itself is included,
                    so it cannot be renamed out from under the policy
                  </td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>
                    <code>src/*.ts</code>
                  </td>
                  <td>
                    <code>src/auth.ts</code>
                  </td>
                  <td>
                    <code>src/deep/auth.ts</code> — <code>*</code> stops at a
                    separator
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>**/secrets.json</code>
                  </td>
                  <td>the file at any depth, including the root</td>
                  <td>
                    <code>secrets.json.bak</code>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Matching is case-sensitive on Linux and case-insensitive on
              Windows and macOS. On a case-insensitive filesystem, a deny list
              that matched fewer paths than the filesystem does would be wrong
              in the dangerous direction.
            </p>
          </section>

          <section class="section" id="commands">
            <div class="section__head">
              <span class="section__index">[03]</span>
              <h2>Commands</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Command</th>
                  <th>Does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>ralon init</code>
                  </td>
                  <td>
                    Writes a starter <code>agent.lock</code>. Refuses to
                    overwrite one without <code>--force</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>ralon check [paths...]</code>
                  </td>
                  <td>
                    Reports whether the given paths are protected, exiting 1 if
                    any are. With no arguments, lists everything the policy
                    protects right now.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>ralon status</code>
                  </td>
                  <td>
                    The policy, the count of protected paths on disk, and which
                    backends this kernel actually offers.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>ralon run -- &lt;cmd&gt;</code>
                  </td>
                  <td>
                    Restricts the current process and replaces it with the
                    command. <code>--dry-run</code> prints the plan without
                    enforcing it; <code>--backend</code> pins the choice;{" "}
                    <code>--quiet</code> drops the summary line.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Every command takes <code>--dir</code> to point at a project other
              than the working directory.
            </p>
          </section>

          <section class="section" id="exit-codes">
            <div class="section__head">
              <span class="section__index">[04]</span>
              <h2>Exit codes</h2>
            </div>
            <p>
              These are the interface. A wrapper that swallows them reports
              every policy as satisfied.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>0</code>
                  </td>
                  <td>Fine.</td>
                </tr>
                <tr>
                  <td>
                    <code>1</code>
                  </td>
                  <td>
                    A path is protected (<code>check</code>), or the plan cannot
                    be enforced here (<code>--dry-run</code>).
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>2</code>
                  </td>
                  <td>
                    Error: no policy, a bad policy, no usable backend, or the
                    command failed to start.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Otherwise <code>run</code> exits with your command's own status,
              because it <em>is</em> your command by then.
            </p>
          </section>

          <section class="section" id="backends">
            <div class="section__head">
              <span class="section__index">[05]</span>
              <h2>Backends</h2>
            </div>
            <p class="prose-lead">
              <code>run</code> picks the strongest backend the kernel offers.{" "}
              <code>ralon status</code> shows what is available and{" "}
              <code>--backend</code> pins it.
            </p>

            <h3>mount — the default</h3>
            <p>
              Read-only bind mounts inside a user and mount namespace, locked by
              entering a second namespace so they cannot be undone. Every parent
              directory of a protected path becomes a mount point too, so no
              directory on the way to it can be renamed or removed. Precise:
              nothing outside the protected paths behaves differently. Needs
              unprivileged user namespaces, which some hardened distributions
              and container runtimes disable.
            </p>

            <h3>landlock — the fallback</h3>
            <p>
              The kernel LSM, Linux 5.13+. Needs no namespaces, so it works
              exactly where the mount backend cannot. Landlock rules are{" "}
              <em>additive</em> — a rule may grant more access than its parents,
              never less — so "everything except this file" has to be expressed
              by granting every sibling along the way instead.
            </p>
            <div class="callout callout--warn">
              <p>
                The consequence is visible and worth knowing: directories
                leading to a protected path stop accepting <em>new</em> entries.
                With <code>src/index.tsx</code> protected, everything in{" "}
                <code>src/</code> and the project root stays writable, but new
                files cannot be created directly in either — inside{" "}
                <code>tests/</code> or any other subtree they are fine.{" "}
                <code>ralon run --dry-run --backend landlock</code> lists exactly
                which directories are affected.
              </p>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
