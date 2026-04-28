<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    vars: string[];
  }

  const { vars }: Props = $props();

  let values = $state<Record<string, string>>(
    Object.fromEntries(vars.map((v) => [v, ""])),
  );
  let open = $state(false);
  let applied = $state(false);

  const originals = new Map<Text, string>();

  onMount(() => {
    const content = document.querySelector(".note-content");
    if (!content) return;
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      if (/\$[a-zA-Z_][a-zA-Z0-9_]*/.test(node.nodeValue ?? "")) {
        originals.set(node, node.nodeValue!);
      }
    }
  });

  function applyVars() {
    const sorted = [...vars].sort((a, b) => b.length - a.length);
    for (const [node, original] of originals) {
      let text = original;
      for (const name of sorted) {
        const val = values[name];
        if (val) {
          text = text.replace(
            new RegExp(`\\$${name}(?![a-zA-Z0-9_])`, "g"),
            val,
          );
        }
      }
      node.nodeValue = text;
    }
    applied = true;
    setTimeout(() => (applied = false), 1800);
  }
</script>

{#if vars.length > 0}
  <button
    onclick={() => (open = true)}
    class="btn btn-ghost btn-xs font-mono text-base-content/40 hover:text-base-content/70 border border-base-300/50"
  >
    <span class="font-mono text-[10px] leading-none">$</span>
    vars
  </button>

  {#if open}
    <dialog class="modal modal-open">
      <div
        class="modal-box max-w-sm"
        style="background: oklch(10% 0 0); border: 1px solid oklch(71% 0.0863 296.59 / 0.5);"
      >
        <h3
          class="font-mono text-[10px] text-base-content/40 uppercase tracking-widest mb-4"
        >
          variables
        </h3>
        <div class="space-y-2.5">
          {#each vars as v}
            <div class="flex items-center gap-3">
              <label
                class="font-mono text-xs text-primary/70 w-36 shrink-0 truncate"
                title={`$${v}`}
              >
                ${v}
              </label>
              <input
                type="text"
                bind:value={values[v]}
                placeholder={`$${v}`}
                class="input input-sm flex-1 min-w-0 font-mono text-xs bg-base-300/20 border-base-300/60 text-base-content/80 placeholder:text-base-content/25 focus:border-primary/60"
              />
            </div>
          {/each}
        </div>
        <div class="mt-5 flex items-center justify-between">
          <span
            class="font-mono text-[10px] text-primary/60 transition-opacity duration-300"
            class:opacity-0={!applied}
          >
            ✓ applied
          </span>
          <div class="flex gap-2">
            <button
              onclick={applyVars}
              class="btn btn-ghost btn-xs font-mono text-primary/60 hover:text-primary border border-primary/30"
            >
              apply
            </button>
            <button
              onclick={() => (open = false)}
              class="btn btn-ghost btn-xs font-mono text-base-content/40 hover:text-base-content/70 border border-base-300/50"
            >
              close
            </button>
          </div>
        </div>
      </div>
      <button
        onclick={() => (open = false)}
        class="modal-backdrop"
        aria-label="close"
      ></button>
    </dialog>
  {/if}
{/if}
