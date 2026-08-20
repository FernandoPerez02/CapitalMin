import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],
  css: {
    // Evita que Vite intente resolver postcss.config.mjs (usa el plugin de
    // Tailwind v4, pensado para el pipeline de Next.js, no para Vite/Vitest).
    postcss: { plugins: [] },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: false,
    exclude: ["node_modules", ".next", "e2e"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
