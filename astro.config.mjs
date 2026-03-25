// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  image: {
    service: { entrypoint: 'astro/assets/services/noop' }
  },
  site: "https://hadi.icu",
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()]
  }
});
