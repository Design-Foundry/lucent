import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Self-contained Web Components kit (Lit, Light DOM): `vite` serves the demo;
// `vite build` produces the npm library (ES; lit + floating-ui externalized).
export default defineConfig({
  resolve: {
    alias: { '@design-foundry/lucent-wc': resolve(import.meta.dirname, 'src/index.ts') },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['lit', /^lit\//, '@floating-ui/dom'],
    },
  },
});
