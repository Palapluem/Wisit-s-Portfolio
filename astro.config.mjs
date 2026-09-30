import { defineConfig } from 'astro/config';

// Served from the root of the custom domain, locally and on GitHub Pages alike.
export default defineConfig({
  site: 'https://palapluem.dev',
  base: '/',
  trailingSlash: 'always',
  devToolbar: {
    enabled: false,
  },
});
