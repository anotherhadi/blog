// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  image: {
    service: { entrypoint: 'astro/assets/services/noop' }
  },
  site: "https://hadi.icu",
  output: 'static',
  integrations: [mdx(), sitemap(), svelte()],
  vite: {
    plugins: [tailwindcss()]
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'tap'
  },
});