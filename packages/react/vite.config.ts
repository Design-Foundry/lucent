import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react()],
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: "index" },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom", /^@designfoundry\//],
    },
  },
});
