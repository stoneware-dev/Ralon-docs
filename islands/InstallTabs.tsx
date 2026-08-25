import { computed, signal } from "stoneware/signals";

/**
 * Three registries, three names, one command.
 *
 * There is no re-render to hook into — Stoneware binds signals to the exact
 * text node or attribute that reads them — so every dynamic value here is a
 * computed passed into JSX, never a `.value` read during render.
 */
const CHANNELS = [
  {
    id: "npm",
    label: "npm",
    command: "npm install -g ralonlock",
    note: "# prebuilt binary; npm refuses the name `ralon`",
  },
  {
    id: "pip",
    label: "pip",
    command: "pip install ralonlock",
    note: "# the same binary, delivered as a wheel",
  },
  {
    id: "cargo",
    label: "cargo",
    command: "cargo install ralon",
    note: "# compiles from source; the crate kept the name",
  },
  {
    id: "binary",
    label: "binary",
    command: "curl -LO github.com/stoneware-dev/Ralon/releases/latest",
    note: "# static musl builds; check the .sha256 beside it",
  },
];

const active = signal(CHANNELS[0]!.id);

const current = computed(
  () => CHANNELS.find((entry) => entry.id === active.value) ?? CHANNELS[0]!,
);

export default function InstallTabs() {
  return (
    <div class="panel">
      <div class="tabs" role="tablist" aria-label="Install method">
        {CHANNELS.map((entry) => (
          <button
            type="button"
            role="tab"
            aria-selected={computed(() =>
              active.value === entry.id ? "true" : "false",
            )}
            onClick={() => {
              active.value = entry.id;
            }}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <pre>
        <span class="p">$ </span>
        <b>{computed(() => current.value.command)}</b>
        {"\n"}
        <span class="c">{computed(() => current.value.note)}</span>
        {"\n\n"}
        <span class="p">$ </span>
        <b>ralon --version</b>
        {"\n"}
        ralon 0.1.5
      </pre>
    </div>
  );
}
