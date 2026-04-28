<script lang="ts">
  import { onMount } from "svelte";

  interface NoteItem {
    id: string;
    title: string;
    description: string;
    tags: string[];
    category: string;
    searchText: string;
  }

  interface Props {
    notes: NoteItem[];
  }

  const { notes }: Props = $props();

  let inputValue = $state("");
  const query = $derived(inputValue.toLowerCase().trim());

  const categories = $derived([
    ...new Set(notes.map((n) => n.category)),
  ].sort());

  const filtered = $derived.by(() => {
    if (!query) return notes;
    const isTag = query.startsWith("#");
    const q = isTag ? query.slice(1) : query;
    return notes.filter((n) =>
      isTag
        ? n.tags.some((t) => t.includes(q)) || n.searchText.includes(`#${q}`)
        : n.searchText.includes(q),
    );
  });

  const visibleCount = $derived(filtered.length);

  onMount(() => {
    const urlTag = new URLSearchParams(window.location.search).get("tag");
    if (urlTag) inputValue = `#${urlTag}`;
  });

  $effect(() => {
    const url = new URL(window.location.href);
    if (query.startsWith("#") && query.length > 1) {
      url.searchParams.set("tag", query.slice(1));
    } else {
      url.searchParams.delete("tag");
    }
    history.replaceState(null, "", url.toString());
  });

  function filteredByCategory(cat: string) {
    return filtered.filter((n) => n.category === cat);
  }
</script>

<div class="mb-12 max-w-sm mx-auto">
  <label class="input w-full">
    <span class="text-base-content/25">›</span>
    <input
      type="text"
      placeholder="search or #tag..."
      bind:value={inputValue}
    />
  </label>
  <p class="font-mono text-[10px] text-base-content/20 mt-1.5 text-center">
    use #tag to filter by tag
  </p>
</div>

<div class="space-y-12">
  {#each categories as cat}
    {@const catNotes = filteredByCategory(cat)}
    {#if catNotes.length > 0}
      <section>
        <div class="flex items-baseline gap-3 mb-4">
          <h2 class="text-xl font-bold tracking-tight">
            <span class="text-primary/50 font-mono mr-1">/</span>{cat}
          </h2>
          <span class="font-mono text-xs text-base-content/25">
            {catNotes.length} note{catNotes.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div class="border-t border-base-300/40 mb-1"></div>
        <ul class="divide-y divide-base-300/20">
          {#each catNotes as n}
            <li>
              <a
                href={`/notes/${n.id}`}
                class="group flex items-center gap-4 py-3 hover:bg-base-200/30 px-2 -mx-2 transition-colors"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col mb-0.5">
                    <span
                      class="font-semibold text-sm group-hover:text-primary transition-colors"
                    >
                      {n.title}
                    </span>
                    {#if n.description}
                      <span class="text-xs text-base-content/35 truncate">
                        {n.description}
                      </span>
                    {/if}
                  </div>
                  {#if n.tags.length > 0}
                    <div class="flex flex-wrap gap-1 mt-1">
                      {#each n.tags as tag}
                        <span
                          class="badge badge-ghost badge-xs font-mono text-base-content/30"
                        >
                          {tag}
                        </span>
                      {/each}
                    </div>
                  {/if}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-base-content/20 group-hover:text-primary/50 shrink-0 transition-colors"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/each}
</div>

{#if visibleCount === 0}
  <div class="text-center py-20 font-mono text-sm text-base-content/25">
    no results.
  </div>
{/if}

<p class="text-center font-mono text-xs text-base-content/20 mt-16">
  {visibleCount} note{visibleCount !== 1 ? "s" : ""} total
</p>
