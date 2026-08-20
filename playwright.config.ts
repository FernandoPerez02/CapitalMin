import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  // Márgen generoso: en modo dev, Next compila cada ruta on-demand la
  // primera vez que se visita, y rutas pesadas (home, con los gráficos)
  // pueden tardar más que el timeout por defecto de una aserción.
  expect: { timeout: 10 * 1000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // La mayoría de los specs arrancan ya autenticados (ver global-setup.ts).
    // auth-and-movements.spec.ts prueba el login en sí y lo desactiva.
    storageState: "e2e/.auth/state.json",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // En CI usamos build+start (sin compilación on-demand) para evitar
    // que la primera visita a cada ruta sea lenta y flaky.
    command: process.env.CI ? "npm run build && npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
