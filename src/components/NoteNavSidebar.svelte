<script lang="ts">
  import { slide } from "svelte/transition";
  import { untrack } from "svelte";

  interface Note {
    id: string;
    data: { title: string; tags: string[]; category?: string };
    body?: string;
  }

  interface Props {
    notes: Note[];
    currentEntry?: Note;
    currentCategory?: string;
    categories: string[];
  }

  const { notes, currentEntry, currentCategory, categories }: Props = $props();

  let search = $state("");

  function getCategory(n: Note): string {
    if (n.data.category) return n.data.category;
    const parts = n.id.split("/");
    return parts.length > 1 ? parts[0] : "General";
  }

  function extractInlineHashtags(body: string): string[] {
    const re = /#(\w+)/g;
    const tags: string[] = [];
    let m;
    while ((m = re.exec(body)) !== null) tags.push(m[1].toLowerCase());
    return [...new Set(tags)];
  }

  function matchesSearch(note: Note): boolean {
    const raw = search.toLowerCase().trim();
    if (!raw) return true;
    const isTag = raw.startsWith("#");
    const term = isTag ? raw.slice(1) : raw;
    const title = note.data.title.toLowerCase();
    const tags = [
      ...note.data.tags,
      ...extractInlineHashtags(note.body ?? ""),
    ].map((t) => t.toLowerCase());
    return isTag
      ? tags.some((t) => t.includes(term))
      : title.includes(term) || tags.join(",").includes(term);
  }

  const activeCategory = $derived(
    currentCategory ?? (currentEntry ? getCategory(currentEntry) : null),
  );

  let openCategories = $state<string[]>(
    untrack(() => categories.filter((c) => c === activeCategory)),
  );

  function toggle(cat: string) {
    if (openCategories.includes(cat)) {
      openCategories = openCategories.filter((c) => c !== cat);
    } else {
      openCategories = [...openCategories, cat];
    }
  }
</script>

<aside
  class="w-56 shrink-0 flex flex-col border-r border-base-300/60 h-[calc(100vh-3rem)]"
  style="background: oklch(4% 0 0);"
>
  <!-- Mobile close bar -->
  <div class="lg:hidden flex items-center justify-between px-3 py-2 border-b border-base-300/40 shrink-0">
    <span class="font-mono text-[10px] text-base-content/30 uppercase tracking-widest">nav</span>
    <label
      for="nav-drawer"
      class="cursor-pointer text-base-content/30 hover:text-base-content/70 transition-colors p-1"
      aria-label="close sidebar"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </label>
  </div>

  <!-- Search -->
  <div class="px-3 py-3 border-b border-base-300/40 shrink-0">
    <div
      class="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-base-200/50 border border-base-300/40 focus-within:border-base-300/70 transition-colors"
    >
      <span class="text-base-content/30 font-mono text-xs shrink-0">›</span>
      <input
        type="text"
        placeholder="search..."
        bind:value={search}
        class="flex-1 min-w-0 bg-transparent text-xs font-mono text-base-content/70 placeholder:text-base-content/25 outline-none"
      />
    </div>
  </div>

  <!-- Nav -->
  <nav class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-px">
    {#each categories as cat}
      {@const catNotes = notes.filter(
        (n) => getCategory(n) === cat && matchesSearch(n),
      )}
      {#if catNotes.length > 0 || !search}
        {@const isFolder = notes.some((n) => n.id.includes("/") && getCategory(n) === cat)}
        <div>
          <!-- Category header -->
          <div class="flex items-center w-full">
            <button
              onclick={() => toggle(cat)}
              class="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-base-200/40 transition-colors duration-150 shrink-0"
            >
              <svg
                class="w-3 h-3 text-base-content/35 shrink-0 transition-transform duration-200"
                class:rotate-90={openCategories.includes(cat)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span class="text-primary/50 font-mono text-xs shrink-0">/</span>
            </button>
            {#if isFolder}
              <a
                href={`/notes/${cat}`}
                class="flex-1 min-w-0 px-1 py-1 rounded-md hover:bg-base-200/40 transition-colors duration-150 font-bold tracking-tight text-sm truncate text-base-content/80 hover:text-base-content"
              >
                {cat}
              </a>
            {:else}
              <span class="flex-1 min-w-0 px-1 py-1 font-bold tracking-tight text-sm truncate text-base-content/80">
                {cat}
              </span>
            {/if}
          </div>

          <!-- Notes list -->
          {#if openCategories.includes(cat)}
            <ul
              class="ml-4 mt-0.5 pb-1 space-y-px"
              transition:slide={{ duration: 180 }}
            >
              {#each catNotes as note}
                <li>
                  <a
                    href={`/notes/${note.id}`}
                    title={note.data.title}
                    class="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono truncate transition-colors duration-150
                      {currentEntry && note.id === currentEntry.id
                      ? 'text-primary/90 bg-primary/10'
                      : 'text-base-content/45 hover:text-base-content/80 hover:bg-base-200/40'}"
                  >
                    <span class="shrink-0 font-mono text-base-content/20">
                      {currentEntry && note.id === currentEntry.id ? "▸" : "–"}
                    </span>
                    <span class="truncate">{note.data.title}</span>
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/if}
    {/each}
  </nav>
</aside>
