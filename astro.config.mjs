import { defineConfig } from 'astro/config';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://palapluem.github.io',
  base: isGitHubPages ? '/Wisit-s-Portfolio' : '/',
  trailingSlash: 'always',
  devToolbar: {
    enabled: false,
  },
});
