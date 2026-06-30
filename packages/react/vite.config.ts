import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Self-contained React kit: `vite` serves the demo (index.html → /demo/main.tsx);
// `vite build` produces the npm library (ES, externalized peers). Types via tsc (build script).
export default defineConfig({
  plugins: [react()],
  resolve: {
    // The demo imports the kit by its package name — the dev analog of consuming the npm package.
    alias: { '@design-foundry/lucent-react': resolve(import.meta.dirname, 'src/index.ts') },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@floating-ui/react'],
    },
  },
});
