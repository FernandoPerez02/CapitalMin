import { request } from "@playwright/test";

// Autentica una sola vez para toda la corrida y guarda la sesión en disco.
// El login real ahora pega contra el backend NestJS, que limita
// POST /auth/login a 5 intentos/minuto — loguear por test (como se hacía
// antes) agota ese límite en la mitad de la suite. Los specs que prueban el
// flujo de login en sí (auth-and-movements.spec.ts) optan por no usar este
// estado compartido, ver `test.use({ storageState: ... })` ahí.
const AUTH_FILE = "e2e/.auth/state.json";

export default async function globalSetup() {
  const requestContext = await request.newContext({ baseURL: "http://localhost:3000" });

  const response = await requestContext.post("/api/auth/login", {
    data: { email: "e2e@capitalmin.com", password: "e2eTest1234" },
  });

  if (!response.ok()) {
    throw new Error(
      `No se pudo autenticar el usuario de e2e (status ${response.status()}). ` +
        "¿El backend está corriendo y existe la cuenta e2e@capitalmin.com?",
    );
  }

  await requestContext.storageState({ path: AUTH_FILE });
  await requestContext.dispose();
}
