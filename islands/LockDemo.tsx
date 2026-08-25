import { computed, signal } from "stoneware/signals";

/**
 * Every attack here is a case in tests/enforcement.rs, which runs it against a
 * real sandbox and then checks the file from outside. The output is what the
 * shell actually prints.
 *
 * Three platforms, three mechanisms, one policy — and the Windows column is a
 * plain `cmd` that was never started by Ralon, because there the locks are held
 * rather than inherited. Keeping all three here is the point: a reader deciding
 * whether this is worth installing needs to see what their own machine does.
 *
 * Structure never changes between states — only text and attributes — because
 * Stoneware updates the exact node a signal is bound to and does not re-render.
 * That is why every platform carries the same eight attacks: a differing count
 * would mean adding or removing buttons, and there is no re-render to do it.
 */
type Shell = "linux" | "macos" | "windows";

interface Attempt {
  command: string;
  output: string;
}

interface Platform {
  id: Shell;
  label: string;
  /** What the panel bar says you typed to get this shell. */
  shell: string;
  backend: string;
  /** The comment under a refused command. */
  refused: string;
}

const PLATFORMS: Platform[] = [
  {
    id: "linux",
    label: "Linux",
    shell: "ralon run -- sh",
    backend: "mount backend · read-only bind mounts in a locked namespace",
    refused: "# exit 1 — the file on disk is untouched",
  },
  {
    id: "macos",
    label: "macOS",
    shell: "ralon run -- sh",
    backend: "seatbelt backend · the policy compiled to a sandbox profile",
    refused: "# exit 1 — the file on disk is untouched",
  },
  {
    id: "windows",
    label: "Windows",
    shell: "ralon guard --detach   →   cmd.exe",
    backend: "locks backend · a guard holds them; this shell never heard of ralon",
    refused: "# the file is untouched — some tools still exit 0, so check the file",
  },
];

const ATTACKS: { id: string; label: string; on: Record<Shell, Attempt> }[] = [
  {
    id: "write",
    label: "overwrite",
    on: {
      linux: {
        command: "echo hacked > src/index.tsx",
        output: "sh: src/index.tsx: Read-only file system",
      },
      macos: {
        command: "echo hacked > src/index.tsx",
        output: "sh: src/index.tsx: Operation not permitted",
      },
      windows: {
        command: "echo hacked > src\\index.tsx",
        output:
          "The process cannot access the file because it is being used by another process.",
      },
    },
  },
  {
    id: "delete",
    label: "delete",
    on: {
      linux: {
        command: "rm -f src/index.tsx",
        output: "rm: cannot remove 'src/index.tsx': Device or resource busy",
      },
      macos: {
        command: "rm -f src/index.tsx",
        output: "rm: src/index.tsx: Operation not permitted",
      },
      windows: {
        command: "del src\\index.tsx",
        output:
          "The process cannot access the file because it is being used by another process.",
      },
    },
  },
  {
    id: "rename",
    label: "rename away",
    on: {
      linux: {
        command: "mv src/index.tsx src/moved.tsx",
        output: "mv: cannot move 'src/index.tsx': Device or resource busy",
      },
      macos: {
        command: "mv src/index.tsx src/moved.tsx",
        output: "mv: rename src/index.tsx to src/moved.tsx: Operation not permitted",
      },
      windows: {
        command: "ren src\\index.tsx moved.tsx",
        output:
          "The process cannot access the file because it is being used by another process.",
      },
    },
  },
  {
    id: "swap",
    label: "replace by rename",
    on: {
      linux: {
        command: "echo hacked > /tmp/x && mv /tmp/x src/index.tsx",
        output: "mv: cannot move '/tmp/x': Device or resource busy",
      },
      macos: {
        command: "echo hacked > /tmp/x && mv /tmp/x src/index.tsx",
        output: "mv: rename /tmp/x to src/index.tsx: Operation not permitted",
      },
      windows: {
        command: "move /y %TEMP%\\x src\\index.tsx",
        output:
          "The process cannot access the file because it is being used by another process.",
      },
    },
  },
  {
    id: "parent",
    label: "rename the parent",
    on: {
      linux: {
        command: "mv src src-gone",
        output: "mv: cannot move 'src': Device or resource busy",
      },
      macos: {
        command: "mv src src-gone",
        output: "mv: rename src to src-gone: Operation not permitted",
      },
      windows: {
        command: "ren src src-gone",
        output:
          "The process cannot access the file because it is being used by another process.",
      },
    },
  },
  {
    id: "create",
    label: "add a file to config/",
    on: {
      linux: {
        command: "echo x > config/new.yaml",
        output: "sh: config/new.yaml: Read-only file system",
      },
      macos: {
        command: "echo x > config/new.yaml",
        output: "sh: config/new.yaml: Operation not permitted",
      },
      windows: {
        command: "echo x > config\\new.yaml",
        output: "Access is denied.",
      },
    },
  },
  {
    id: "policy",
    label: "rewrite the policy",
    on: {
      linux: {
        command: "echo 'version: 1' > agent.lock",
        output: "sh: agent.lock: Read-only file system",
      },
      macos: {
        command: "echo 'version: 1' > agent.lock",
        output: "sh: agent.lock: Operation not permitted",
      },
      windows: {
        command: "echo version: 1 > agent.lock",
        output:
          "The process cannot access the file because it is being used by another process.",
      },
    },
  },
  {
    id: "allowed",
    label: "edit an unprotected file",
    on: {
      linux: { command: "echo edited > src/App.tsx", output: "" },
      macos: { command: "echo edited > src/App.tsx", output: "" },
      windows: { command: "echo edited > src\\App.tsx", output: "" },
    },
  },
];

const where = signal<Shell>("linux");
const chosen = signal(ATTACKS[0]!.id);

const platform = computed(
  () => PLATFORMS.find((entry) => entry.id === where.value) ?? PLATFORMS[0]!,
);
const attack = computed(
  () => ATTACKS.find((entry) => entry.id === chosen.value) ?? ATTACKS[0]!,
);
const attempt = computed(() => attack.value.on[where.value]);
const denied = computed(() => attempt.value.output !== "");

export default function LockDemo() {
  return (
    <div class="panel">
      <div class="panel__bar">
        <i class="dot" />
        <b>{computed(() => platform.value.shell)}</b>
        <span class="panel__bar-note">
          policy: src/index.tsx · .env · config/**
        </span>
      </div>

      <div class="tabs" role="tablist" aria-label="Platform">
        {PLATFORMS.map((entry) => (
          <button
            type="button"
            role="tab"
            aria-selected={computed(() =>
              where.value === entry.id ? "true" : "false",
            )}
            onClick={() => {
              where.value = entry.id;
            }}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div class="attacks">
        {ATTACKS.map((entry) => (
          <button
            type="button"
            aria-pressed={computed(() =>
              chosen.value === entry.id ? "true" : "false",
            )}
            onClick={() => {
              chosen.value = entry.id;
            }}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <pre>
        <span class="p">$ </span>
        <b>{computed(() => attempt.value.command)}</b>
        {"\n"}
        <span class={computed(() => (denied.value ? "deny" : "ok"))}>
          {computed(() => attempt.value.output || "")}
        </span>
        {"\n"}
        <span class="c">
          {computed(() =>
            denied.value
              ? platform.value.refused
              : "# exit 0 — nothing outside the policy changed behaviour",
          )}
        </span>
      </pre>

      <div class="verdict">
        <span class={computed(() => (denied.value ? "chip chip--deny" : "chip chip--rw"))}>
          {computed(() => (denied.value ? "refused" : "allowed"))}
        </span>
        <span>
          {computed(() =>
            denied.value
              ? platform.value.backend
              : "Ordinary work is untouched. That half matters too.",
          )}
        </span>
      </div>
    </div>
  );
}
