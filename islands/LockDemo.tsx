import { computed, signal } from "stoneware/signals";

/**
 * Every attack here is a case in tests/enforcement.rs, which runs it against a
 * real sandbox and then checks the file from outside. The output is what the
 * shell actually prints.
 *
 * Structure never changes between states — only text and attributes — because
 * Stoneware updates the exact node a signal is bound to and does not re-render.
 */
const ATTACKS = [
  {
    id: "write",
    label: "overwrite",
    command: "echo hacked > src/index.tsx",
    output: "sh: src/index.tsx: Read-only file system",
  },
  {
    id: "delete",
    label: "delete",
    command: "rm -f src/index.tsx",
    output: "rm: cannot remove 'src/index.tsx': Device or resource busy",
  },
  {
    id: "rename",
    label: "rename away",
    command: "mv src/index.tsx src/moved.tsx",
    output: "mv: cannot move 'src/index.tsx': Device or resource busy",
  },
  {
    id: "swap",
    label: "replace by rename",
    command: "echo hacked > /tmp/x && mv /tmp/x src/index.tsx",
    output: "mv: cannot move '/tmp/x': Device or resource busy",
  },
  {
    id: "parent",
    label: "rename the parent",
    command: "mv src src-gone",
    output: "mv: cannot move 'src': Device or resource busy",
  },
  {
    id: "policy",
    label: "rewrite the policy",
    command: "echo 'version: 1' > agent.lock",
    output: "sh: agent.lock: Read-only file system",
  },
  {
    id: "escape",
    label: "unmount it",
    command: "umount src/index.tsx",
    output: "umount: src/index.tsx: must be superuser to unmount",
  },
  {
    id: "allowed",
    label: "edit an unprotected file",
    command: "echo edited > src/App.tsx",
    output: "",
  },
];

const chosen = signal(ATTACKS[0]!.id);

const attack = computed(
  () => ATTACKS.find((entry) => entry.id === chosen.value) ?? ATTACKS[0]!,
);
const denied = computed(() => attack.value.output !== "");

export default function LockDemo() {
  return (
    <div class="panel">
      <div class="panel__bar">
        <i class="dot" />
        <b>ralon run -- sh</b>
        <span class="panel__bar-note">
          policy: src/index.tsx · .env · config/**
        </span>
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
        <b>{computed(() => attack.value.command)}</b>
        {"\n"}
        <span class={computed(() => (denied.value ? "deny" : "ok"))}>
          {computed(() => attack.value.output || "")}
        </span>
        {"\n"}
        <span class="c">
          {computed(() =>
            denied.value
              ? "# exit 1 — the file on disk is untouched"
              : "# exit 0 — nothing outside the policy changed behaviour",
          )}
        </span>
      </pre>

      <div class="verdict">
        <span class={computed(() => (denied.value ? "chip chip--deny" : "chip chip--rw"))}>
          {computed(() => (denied.value ? "denied by the kernel" : "allowed"))}
        </span>
        <span>
          {computed(() =>
            denied.value
              ? "No prompt, no hook, nothing for an agent to talk past."
              : "Ordinary work is untouched. That half matters too.",
          )}
        </span>
      </div>
    </div>
  );
}
