import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://withso.com',
  output: 'static',
  // Static hosts publish `out/`, which keeps the existing deployment settings valid.
  outDir: './out',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    format: 'directory',
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [react()],
  vite: {
    plugins: [
      {
        // `astro check` and `astro build` pre-bundle dependencies in production mode. Sharing one cache with a
        // running dev server swaps in production React, whose jsx-dev-runtime has no jsxDEV, and islands go blank.
        name: 'withso:mode-cache-dir',
        config: (_config, { mode }) => ({ cacheDir: `node_modules/.vite/${mode}` }),
      },
    ],
  },
});
